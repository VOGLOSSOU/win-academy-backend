import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FormationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.formation.create({ data });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.formation.findMany({
        skip,
        take: limit,
        include: { category: true, modules: true, _count: { select: { enrollments: true } } },
      }),
      this.prisma.formation.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const formation = await this.prisma.formation.findUnique({
      where: { id },
      include: {
        category: true,
        modules: {
          orderBy: { order: 'asc' },
          include: {
            contents: { select: { id: true, type: true, title: true, order: true, moduleId: true, createdAt: true } },
          },
        },
        evaluation: true,
      },
    });
    if (!formation) throw new NotFoundException(`Formation ${id} not found`);
    return formation;
  }

  async update(id: string, data: any) {
    const formation = await this.findOne(id);

    // RÈGLE MÉTIER: Modification restreinte si des utilisateurs sont déjà inscrits
    const enrollmentCount = await this.prisma.enrollment.count({
      where: { formationId: id },
    });

    if (enrollmentCount > 0) {
      // On autorise uniquement certains champs (ex: image, description courte)
      const allowedFields = ['shortDescription', 'image', 'price'];
      const requestedFields = Object.keys(data);
      const restrictedFields = requestedFields.filter(f => !allowedFields.includes(f));

      if (restrictedFields.length > 0) {
        throw new ConflictException(
          `Impossible de modifier les champs [${restrictedFields.join(', ')}]: ${enrollmentCount} utilisateur(s) déjà inscrit(s). ` +
          `Seuls les champs [${allowedFields.join(', ')}] peuvent être modifiés.`,
        );
      }
    }

    return this.prisma.formation.update({ where: { id }, data });
  }

  async findModules(id: string) {
    const formation = await this.prisma.formation.findUnique({ where: { id } });
    if (!formation) throw new NotFoundException(`Formation ${id} not found`);
    return this.prisma.module.findMany({
      where: { formationId: id },
      include: {
        contents: { select: { id: true, type: true, title: true, order: true, moduleId: true, createdAt: true } },
      },
      orderBy: { order: 'asc' },
    });
  }

  async remove(id: string) {
    // Récupérer la formation avec ses relations
    const formation = await this.prisma.formation.findUnique({
      where: { id },
      include: { 
        modules: { include: { contents: true } },
        evaluation: { include: { questions: { include: { answers: true } }, attempts: true } },
        enrollments: true,
        certificates: true
      }
    });

    if (!formation) {
      throw new NotFoundException(`Formation ${id} non trouvée`);
    }

    // SUPPRESSION EN CASCADE : Supprimer toutes les données liées
    
    // 1. Supprimer les enrollments
    if (formation.enrollments.length > 0) {
      await this.prisma.enrollment.deleteMany({ where: { formationId: id } });
    }

    // 2. Supprimer les certificates
    if (formation.certificates.length > 0) {
      await this.prisma.certificate.deleteMany({ where: { formationId: id } });
    }

    // 3. Supprimer les attempts liés à l'évaluation
    if (formation.evaluation) {
      await this.prisma.attempt.deleteMany({ where: { evaluationId: formation.evaluation.id } });
      // Supprimer les questions et leurs réponses
      await this.prisma.answer.deleteMany({
        where: { question: { evaluationId: formation.evaluation.id } }
      });
      await this.prisma.question.deleteMany({ where: { evaluationId: formation.evaluation.id } });
      // Supprimer l'évaluation
      await this.prisma.evaluation.delete({ where: { id: formation.evaluation.id } });
    }

    // 4. Supprimer les contenus et modules
    for (const module of formation.modules) {
      await this.prisma.content.deleteMany({ where: { moduleId: module.id } });
    }
    await this.prisma.module.deleteMany({ where: { formationId: id } });

    // 5. Supprimer la formation
    await this.prisma.formation.delete({ where: { id } });
    
    return { message: 'Formation et toutes ses données associées supprimées avec succès' };
  }
}

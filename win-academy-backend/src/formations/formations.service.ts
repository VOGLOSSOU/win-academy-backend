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
      include: { category: true, modules: { include: { contents: true } }, evaluation: true },
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
      const allowedFields = ['shortDescription', 'image'];
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

  async remove(id: string) {
    const formation = await this.findOne(id);

    // RÈGLE MÉTIER: Impossible de supprimer une formation si des utilisateurs sont inscrits
    const enrollmentCount = await this.prisma.enrollment.count({
      where: { formationId: id },
    });

    if (enrollmentCount > 0) {
      throw new ConflictException(
        `Impossible de supprimer la formation: ${enrollmentCount} utilisateur(s) déjà inscrit(s). ` +
        `Veuillez d'abord désinscrire les utilisateurs ou archiver la formation.`,
      );
    }

    await this.prisma.formation.delete({ where: { id } });
    return { message: 'Formation supprimée avec succès' };
  }
}

import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { userId: string; formationId: string }) {
    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_formationId: { userId: data.userId, formationId: data.formationId } },
    });
    if (existing) throw new ConflictException('Déjà inscrit à cette formation');
    
    // Créer l'inscription avec progression à 0
    return this.prisma.enrollment.create({ 
      data: {
        userId: data.userId,
        formationId: data.formationId,
        progressPercentage: 0,
        status: 'IN_PROGRESS',
      },
      include: { user: true, formation: true },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.enrollment.findMany({ 
        skip, 
        take: limit, 
        include: { user: true, formation: true } 
      }),
      this.prisma.enrollment.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({ 
      where: { id }, 
      include: { user: true, formation: { include: { modules: { include: { contents: true } } } } } 
    });
    if (!enrollment) throw new NotFoundException(`Inscription ${id} non trouvée`);
    return enrollment;
  }

  /**
   * Met à jour manuellement la progression
   */
  async updateProgress(id: string, progressPercentage: number) {
    await this.findOne(id);
    
    // RÈGLE: La progression doit être entre 0 et 100
    if (progressPercentage < 0 || progressPercentage > 100) {
      throw new BadRequestException('La progression doit être entre 0 et 100');
    }
    
    // RÈGLE: Status = COMPLETED automatiquement si progression = 100%
    const status = progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS';
    
    return this.prisma.enrollment.update({ 
      where: { id }, 
      data: { 
        progressPercentage, 
        status: status as 'IN_PROGRESS' | 'COMPLETED',
      },
    });
  }

  /**
   * Calcule automatiquement la progression basée sur les contenus
   * RÈGLE: Progression calculée automatiquement
   */
  async calculateProgress(enrollmentId: string, completedContentIds: string[]) {
    const enrollment = await this.findOne(enrollmentId);
    
    // Récupérer tous les contenus de la formation
    const formation = await this.prisma.formation.findUnique({
      where: { id: enrollment.formationId },
      include: {
        modules: {
          include: { contents: true },
        },
      },
    });

    if (!formation) {
      throw new NotFoundException('Formation non trouvée');
    }

    // Compter le total des contenus
    const totalContents = formation.modules.reduce(
      (sum, module) => sum + module.contents.length, 
      0
    );

    if (totalContents === 0) {
      throw new BadRequestException('Cette formation n\'a pas encore de contenus');
    }

    // Calculer le pourcentage
    const completedCount = completedContentIds.length;
    const progressPercentage = Math.round((completedCount / totalContents) * 100);

    // RÈGLE: Status = COMPLETED automatiquement si progression = 100%
    const status = progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS';

    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progressPercentage,
        status: status as 'IN_PROGRESS' | 'COMPLETED',
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.enrollment.delete({ where: { id } });
    return { message: 'Inscription supprimée' };
  }
}

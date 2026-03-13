import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.content.create({ data });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.content.findMany({ skip, take: limit, include: { module: true } }),
      this.prisma.content.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, userId: string, userRole: string) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: { module: true },
    });
    if (!content) throw new NotFoundException(`Content ${id} not found`);

    // ADMIN et SUPER_ADMIN ont accès sans vérification d'inscription
    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') return content;

    // Pour les LEARNER : vérifier l'inscription à la formation
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_formationId: {
          userId,
          formationId: content.module.formationId,
        },
      },
    });
    if (!enrollment) {
      throw new ForbiddenException('Vous devez être inscrit à cette formation pour accéder à ce contenu');
    }

    return content;
  }

  async update(id: string, data: any) {
    await this.findOne(id, '', 'ADMIN');
    return this.prisma.content.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id, '', 'ADMIN');
    await this.prisma.content.delete({ where: { id } });
    return { message: 'Content deleted' };
  }
}

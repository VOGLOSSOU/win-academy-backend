import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { userId: string; formationId: string }) {
    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_formationId: { userId: data.userId, formationId: data.formationId } },
    });
    if (existing) throw new ConflictException('Already enrolled');
    return this.prisma.enrollment.create({ data });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.enrollment.findMany({ skip, take: limit, include: { user: true, formation: true } }),
      this.prisma.enrollment.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({ where: { id }, include: { user: true, formation: true } });
    if (!enrollment) throw new NotFoundException(`Enrollment ${id} not found`);
    return enrollment;
  }

  async updateProgress(id: string, progressPercentage: number) {
    await this.findOne(id);
    const status = progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS';
    return this.prisma.enrollment.update({ where: { id }, data: { progressPercentage, status } });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.enrollment.delete({ where: { id } });
    return { message: 'Enrollment deleted' };
  }
}

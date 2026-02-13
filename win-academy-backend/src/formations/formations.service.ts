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
    await this.findOne(id);
    return this.prisma.formation.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.formation.delete({ where: { id } });
    return { message: 'Formation deleted' };
  }
}

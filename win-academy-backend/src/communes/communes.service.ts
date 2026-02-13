import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; departmentId: string }) {
    const existing = await this.prisma.commune.findFirst({
      where: { name: data.name, departmentId: data.departmentId },
    });

    if (existing) {
      throw new ConflictException('Commune already exists in this department');
    }

    return this.prisma.commune.create({ data });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.commune.findMany({
        skip,
        take: limit,
        include: { department: true, users: true },
      }),
      this.prisma.commune.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const commune = await this.prisma.commune.findUnique({
      where: { id },
      include: { department: true, users: true },
    });
    if (!commune) throw new NotFoundException(`Commune ${id} not found`);
    return commune;
  }

  async update(id: string, data: { name?: string; departmentId?: string }) {
    await this.findOne(id);
    return this.prisma.commune.update({ where: { id }, data });
  }

  async remove(id: string) {
    const commune = await this.findOne(id);
    if (commune.users.length > 0) {
      throw new ConflictException('Cannot delete commune with users');
    }
    await this.prisma.commune.delete({ where: { id } });
    return { message: 'Commune deleted' };
  }
}

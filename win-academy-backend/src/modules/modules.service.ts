import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; description?: string; order: number; formationId: string }) {
    return this.prisma.module.create({ data });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.module.findMany({ skip, take: limit, include: { formation: true, contents: true } }),
      this.prisma.module.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const module = await this.prisma.module.findUnique({ where: { id }, include: { contents: true, formation: true } });
    if (!module) throw new NotFoundException(`Module ${id} not found`);
    return module;
  }

  async update(id: string, data: Partial<{ title: string; description: string; order: number }>) {
    await this.findOne(id);
    return this.prisma.module.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.module.delete({ where: { id } });
    return { message: 'Module deleted' };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: string) {
    const content = await this.prisma.content.findUnique({ where: { id }, include: { module: true } });
    if (!content) throw new NotFoundException(`Content ${id} not found`);
    return content;
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.content.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.content.delete({ where: { id } });
    return { message: 'Content deleted' };
  }
}

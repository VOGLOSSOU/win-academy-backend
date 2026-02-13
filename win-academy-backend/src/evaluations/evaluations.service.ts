import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EvaluationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.evaluation.create({ data });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.evaluation.findMany({ skip, take: limit, include: { formation: true, questions: true } }),
      this.prisma.evaluation.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id },
      include: { formation: true, questions: { include: { answers: true } } },
    });
    if (!evaluation) throw new NotFoundException(`Evaluation ${id} not found`);
    return evaluation;
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.evaluation.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.evaluation.delete({ where: { id } });
    return { message: 'Evaluation deleted' };
  }
}

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { userId: string; formationId: string }) {
    const existing = await this.prisma.certificate.findUnique({
      where: { userId_formationId: { userId: data.userId, formationId: data.formationId } },
    });
    if (existing) throw new ConflictException('Certificate already exists');

    // Verify user passed the evaluation
    const evaluation = await this.prisma.evaluation.findFirst({
      where: { formationId: data.formationId },
    });
    if (!evaluation) throw new NotFoundException('Evaluation not found');

    const lastAttempt = await this.prisma.attempt.findFirst({
      where: { userId: data.userId, evaluationId: evaluation.id },
      orderBy: { createdAt: 'desc' },
    });
    if (!lastAttempt || !lastAttempt.passed) {
      throw new ConflictException('User must pass the evaluation first');
    }

    const uniqueCode = crypto.randomUUID();

    return this.prisma.certificate.create({
      data: {
        userId: data.userId,
        formationId: data.formationId,
        uniqueCode,
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.certificate.findMany({
        skip,
        take: limit,
        include: { user: true, formation: true },
      }),
      this.prisma.certificate.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
      include: { user: true, formation: true },
    });
    if (!certificate) throw new NotFoundException(`Certificate ${id} not found`);
    return certificate;
  }

  async verify(uniqueCode: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { uniqueCode },
      include: { user: true, formation: true },
    });
    if (!certificate) throw new NotFoundException('Certificate not found');
    return certificate;
  }
}

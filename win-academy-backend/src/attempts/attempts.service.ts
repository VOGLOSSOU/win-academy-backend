import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttemptsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { userId: string; evaluationId: string; answers: Record<string, string> }) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id: data.evaluationId },
      include: { questions: { include: { answers: true } } },
    });

    if (!evaluation) throw new NotFoundException('Evaluation not found');

    // Check max attempts
    const previousAttempts = await this.prisma.attempt.count({
      where: { userId: data.userId, evaluationId: data.evaluationId },
    });

    if (previousAttempts >= evaluation.maxAttempts) {
      throw new ForbiddenException('Maximum attempts reached');
    }

    // Calculate score
    let score = 0;
    for (const question of evaluation.questions) {
      const correctAnswer = question.answers.find((a) => a.isCorrect);
      if (correctAnswer && data.answers[question.id] === correctAnswer.id) {
        score++;
      }
    }

    const passed = score >= evaluation.passingScore;
    const attemptNumber = previousAttempts + 1;

    return this.prisma.attempt.create({
      data: {
        userId: data.userId,
        evaluationId: data.evaluationId,
        score,
        passed,
        attemptNumber,
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.attempt.findMany({ skip, take: limit, include: { user: true, evaluation: true } }),
      this.prisma.attempt.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id },
      include: { user: true, evaluation: true },
    });
    if (!attempt) throw new NotFoundException(`Attempt ${id} not found`);
    return attempt;
  }
}

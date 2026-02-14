import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { UpdateAnswerDto } from './dto/answer.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new question with its answers
   */
  async create(data: CreateQuestionDto) {
    // Verify evaluation exists
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id: data.evaluationId },
    });
    if (!evaluation) {
      throw new NotFoundException(`Evaluation ${data.evaluationId} not found`);
    }

    // Verify at least one answer is marked as correct
    const hasCorrectAnswer = data.answers.some((answer) => answer.isCorrect);
    if (!hasCorrectAnswer) {
      throw new BadRequestException('At least one answer must be marked as correct');
    }

    return this.prisma.question.create({
      data: {
        questionText: data.questionText,
        evaluationId: data.evaluationId,
        answers: {
          create: data.answers.map((answer) => ({
            answerText: answer.answerText,
            isCorrect: answer.isCorrect,
          })),
        },
      },
      include: {
        answers: true,
        evaluation: true,
      },
    });
  }

  /**
   * Get all questions (with pagination)
   */
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.question.findMany({
        skip,
        take: limit,
        include: {
          evaluation: { include: { formation: true } },
          answers: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.question.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  /**
   * Get all questions for a specific evaluation
   */
  async findByEvaluation(evaluationId: string) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id: evaluationId },
    });
    if (!evaluation) {
      throw new NotFoundException(`Evaluation ${evaluationId} not found`);
    }

    return this.prisma.question.findMany({
      where: { evaluationId },
      include: {
        answers: {
          select: {
            id: true,
            answerText: true,
            // Don't expose isCorrect to regular users in production
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Get a single question by ID
   */
  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        evaluation: { include: { formation: true } },
        answers: true,
      },
    });
    if (!question) {
      throw new NotFoundException(`Question ${id} not found`);
    }
    return question;
  }

  /**
   * Update a question
   */
  async update(id: string, data: UpdateQuestionDto) {
    await this.findOne(id);
    return this.prisma.question.update({
      where: { id },
      data: {
        questionText: data.questionText,
      },
      include: {
        answers: true,
        evaluation: true,
      },
    });
  }

  /**
   * Delete a question (and its answers)
   */
  async remove(id: string) {
    await this.findOne(id);
    // Answers will be deleted automatically due to cascade
    await this.prisma.question.delete({ where: { id } });
    return { message: 'Question deleted successfully' };
  }

  /**
   * Add an answer to a question
   */
  async addAnswer(questionId: string, answerText: string, isCorrect: boolean) {
    const question = await this.findOne(questionId);
    
    // If setting this answer as correct, verify no other answer is correct (optional rule)
    // For now, we allow multiple correct answers
    
    return this.prisma.answer.create({
      data: {
        questionId,
        answerText,
        isCorrect,
      },
    });
  }

  /**
   * Update an answer
   */
  async updateAnswer(answerId: string, data: UpdateAnswerDto) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    });
    if (!answer) {
      throw new NotFoundException(`Answer ${answerId} not found`);
    }

    // If setting isCorrect to false, verify there's at least one other correct answer
    if (data.isCorrect === false && answer.isCorrect === true) {
      const otherCorrectAnswers = await this.prisma.answer.findMany({
        where: {
          questionId: answer.questionId,
          id: { not: answerId },
          isCorrect: true,
        },
      });
      if (otherCorrectAnswers.length === 0) {
        throw new BadRequestException('At least one answer must remain correct');
      }
    }

    return this.prisma.answer.update({
      where: { id: answerId },
      data,
    });
  }

  /**
   * Delete an answer
   */
  async removeAnswer(answerId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    });
    if (!answer) {
      throw new NotFoundException(`Answer ${answerId} not found`);
    }

    // If this is the only correct answer, prevent deletion
    if (answer.isCorrect) {
      const otherCorrectAnswers = await this.prisma.answer.findMany({
        where: {
          questionId: answer.questionId,
          id: { not: answerId },
          isCorrect: true,
        },
      });
      if (otherCorrectAnswers.length === 0) {
        throw new BadRequestException('Cannot delete the only correct answer');
      }
    }

    await this.prisma.answer.delete({ where: { id: answerId } });
    return { message: 'Answer deleted successfully' };
  }
}

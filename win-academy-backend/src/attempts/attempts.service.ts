import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface SubmitAnswerDto {
  questionId: string;
  answerId: string;
}

@Injectable()
export class AttemptsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Soumet une tentative d'évaluation
   * RÈGLE: Score calculé côté serveur uniquement - le client ne peut pas envoyer le score
   */
  async create(data: { userId: string; evaluationId: string; answers: SubmitAnswerDto[] }) {
    // 1. Récupérer l'évaluation avec ses questions et réponses
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id: data.evaluationId },
      include: { 
        questions: { 
          include: { answers: true } 
        } 
      },
    });

    if (!evaluation) {
      throw new NotFoundException('Évaluation non trouvée');
    }

    // 2. Vérifier le nombre de tentatives existantes
    const previousAttempts = await this.prisma.attempt.count({
      where: { userId: data.userId, evaluationId: data.evaluationId },
    });

    if (previousAttempts >= evaluation.maxAttempts) {
      throw new ForbiddenException(
        `Nombre maximum de tentatives atteint (${evaluation.maxAttempts})`
      );
    }

    // 3. RÈGLE: Score calculé côté serveur UNIQUEMENT
    // On ignore tout score envoyé par le client et on recalcule
    let correctCount = 0;
    const totalQuestions = evaluation.questions.length;

    for (const question of evaluation.questions) {
      // Trouver la réponse de l'utilisateur pour cette question
      const userAnswer = data.answers.find(a => a.questionId === question.id);
      
      if (userAnswer) {
        // Vérifier si la réponse est correcte
        const isCorrect = question.answers.some(
          answer => answer.id === userAnswer.answerId && answer.isCorrect
        );
        
        if (isCorrect) {
          correctCount++;
        }
      }
    }

    // Calculer le score en pourcentage
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    // Déterminer si l'utilisateur a réussi
    const passed = score >= evaluation.passingScore;
    const attemptNumber = previousAttempts + 1;

    // Créer la tentative avec le score calculé côté serveur
    const attempt = await this.prisma.attempt.create({
      data: {
        userId: data.userId,
        evaluationId: data.evaluationId,
        score,
        passed,
        attemptNumber,
      },
      include: {
        evaluation: true,
        user: true,
      },
    });

    // Si réussi, générer le certificat automatiquement
    if (passed) {
      await this.generateCertificateIfPassed(data.userId, evaluation.formationId);
    }

    return attempt;
  }

  /**
   * Génère un certificat si c'est la première tentative réussie
   */
  private async generateCertificateIfPassed(userId: string, formationId: string) {
    // Vérifier si un certificat existe déjà
    const existingCertificate = await this.prisma.certificate.findUnique({
      where: {
        userId_formationId: { userId, formationId },
      },
    });

    if (!existingCertificate) {
      // Générer un code unique
      const uniqueCode = `WA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      await this.prisma.certificate.create({
        data: {
          userId,
          formationId,
          uniqueCode,
        },
      });
    }
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.attempt.findMany({ 
        skip, 
        take: limit, 
        include: { user: true, evaluation: true } 
      }),
      this.prisma.attempt.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id },
      include: { user: true, evaluation: true },
    });
    if (!attempt) throw new NotFoundException(`Tentative ${id} non trouvée`);
    return attempt;
  }

  /**
   * Obtenir les tentatives d'un utilisateur pour une évaluation
   */
  async findByUserAndEvaluation(userId: string, evaluationId: string) {
    return this.prisma.attempt.findMany({
      where: { userId, evaluationId },
      orderBy: { attemptNumber: 'desc' },
    });
  }
}

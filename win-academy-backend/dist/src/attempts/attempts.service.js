"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttemptsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AttemptsService = class AttemptsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const evaluation = await this.prisma.evaluation.findUnique({
            where: { id: data.evaluationId },
            include: { questions: { include: { answers: true } } },
        });
        if (!evaluation)
            throw new common_1.NotFoundException('Evaluation not found');
        const previousAttempts = await this.prisma.attempt.count({
            where: { userId: data.userId, evaluationId: data.evaluationId },
        });
        if (previousAttempts >= evaluation.maxAttempts) {
            throw new common_1.ForbiddenException('Maximum attempts reached');
        }
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
    async findOne(id) {
        const attempt = await this.prisma.attempt.findUnique({
            where: { id },
            include: { user: true, evaluation: true },
        });
        if (!attempt)
            throw new common_1.NotFoundException(`Attempt ${id} not found`);
        return attempt;
    }
};
exports.AttemptsService = AttemptsService;
exports.AttemptsService = AttemptsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttemptsService);
//# sourceMappingURL=attempts.service.js.map
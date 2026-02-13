"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
let CertificatesService = class CertificatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.certificate.findUnique({
            where: { userId_formationId: { userId: data.userId, formationId: data.formationId } },
        });
        if (existing)
            throw new common_1.ConflictException('Certificate already exists');
        const evaluation = await this.prisma.evaluation.findFirst({
            where: { formationId: data.formationId },
        });
        if (!evaluation)
            throw new common_1.NotFoundException('Evaluation not found');
        const lastAttempt = await this.prisma.attempt.findFirst({
            where: { userId: data.userId, evaluationId: evaluation.id },
            orderBy: { createdAt: 'desc' },
        });
        if (!lastAttempt || !lastAttempt.passed) {
            throw new common_1.ConflictException('User must pass the evaluation first');
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
    async findOne(id) {
        const certificate = await this.prisma.certificate.findUnique({
            where: { id },
            include: { user: true, formation: true },
        });
        if (!certificate)
            throw new common_1.NotFoundException(`Certificate ${id} not found`);
        return certificate;
    }
    async verify(uniqueCode) {
        const certificate = await this.prisma.certificate.findUnique({
            where: { uniqueCode },
            include: { user: true, formation: true },
        });
        if (!certificate)
            throw new common_1.NotFoundException('Certificate not found');
        return certificate;
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map
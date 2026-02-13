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
exports.FormationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FormationsService = class FormationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.formation.create({ data });
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.formation.findMany({
                skip,
                take: limit,
                include: { category: true, modules: true, _count: { select: { enrollments: true } } },
            }),
            this.prisma.formation.count(),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const formation = await this.prisma.formation.findUnique({
            where: { id },
            include: { category: true, modules: { include: { contents: true } }, evaluation: true },
        });
        if (!formation)
            throw new common_1.NotFoundException(`Formation ${id} not found`);
        return formation;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.formation.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.formation.delete({ where: { id } });
        return { message: 'Formation deleted' };
    }
};
exports.FormationsService = FormationsService;
exports.FormationsService = FormationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FormationsService);
//# sourceMappingURL=formations.service.js.map
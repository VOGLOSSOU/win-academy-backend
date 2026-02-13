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
exports.CommunesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CommunesService = class CommunesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.commune.findFirst({
            where: { name: data.name, departmentId: data.departmentId },
        });
        if (existing) {
            throw new common_1.ConflictException('Commune already exists in this department');
        }
        return this.prisma.commune.create({ data });
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.commune.findMany({
                skip,
                take: limit,
                include: { department: true, users: true },
            }),
            this.prisma.commune.count(),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const commune = await this.prisma.commune.findUnique({
            where: { id },
            include: { department: true, users: true },
        });
        if (!commune)
            throw new common_1.NotFoundException(`Commune ${id} not found`);
        return commune;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.commune.update({ where: { id }, data });
    }
    async remove(id) {
        const commune = await this.findOne(id);
        if (commune.users.length > 0) {
            throw new common_1.ConflictException('Cannot delete commune with users');
        }
        await this.prisma.commune.delete({ where: { id } });
        return { message: 'Commune deleted' };
    }
};
exports.CommunesService = CommunesService;
exports.CommunesService = CommunesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommunesService);
//# sourceMappingURL=communes.service.js.map
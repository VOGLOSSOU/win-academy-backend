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
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DepartmentsService = class DepartmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDepartmentDto) {
        const existing = await this.prisma.department.findFirst({
            where: {
                OR: [
                    { name: createDepartmentDto.name },
                    ...(createDepartmentDto.code ? [{ code: createDepartmentDto.code }] : []),
                ],
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Department with this name or code already exists');
        }
        return this.prisma.department.create({
            data: createDepartmentDto,
        });
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.department.findMany({
                skip,
                take: limit,
                orderBy: { name: 'asc' },
                include: { communes: true },
            }),
            this.prisma.department.count(),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const department = await this.prisma.department.findUnique({
            where: { id },
            include: { communes: true },
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID ${id} not found`);
        }
        return department;
    }
    async update(id, updateDepartmentDto) {
        await this.findOne(id);
        return this.prisma.department.update({
            where: { id },
            data: updateDepartmentDto,
        });
    }
    async remove(id) {
        const department = await this.findOne(id);
        if (department.communes.length > 0) {
            throw new common_1.ConflictException('Cannot delete department with existing communes');
        }
        await this.prisma.department.delete({ where: { id } });
        return { message: 'Department deleted successfully' };
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map
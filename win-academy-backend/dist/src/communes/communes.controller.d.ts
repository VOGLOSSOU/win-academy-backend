import { CommunesService } from './communes.service';
export declare class CommunesController {
    private readonly communesService;
    constructor(communesService: CommunesService);
    create(data: {
        name: string;
        departmentId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        departmentId: string;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: ({
            department: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
            };
            users: {
                firstName: string;
                lastName: string;
                dateOfBirth: Date | null;
                sex: import("@prisma/client").$Enums.Sex | null;
                communeId: string | null;
                email: string;
                id: string;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                status: import("@prisma/client").$Enums.UserStatus;
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            departmentId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        department: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
        };
        users: {
            firstName: string;
            lastName: string;
            dateOfBirth: Date | null;
            sex: import("@prisma/client").$Enums.Sex | null;
            communeId: string | null;
            email: string;
            id: string;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        departmentId: string;
    }>;
    update(id: string, data: {
        name?: string;
        departmentId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        departmentId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

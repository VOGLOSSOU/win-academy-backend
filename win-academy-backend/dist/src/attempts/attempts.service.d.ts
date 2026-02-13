import { PrismaService } from '../prisma/prisma.service';
export declare class AttemptsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        userId: string;
        evaluationId: string;
        answers: Record<string, string>;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        evaluationId: string;
        score: number;
        passed: boolean;
        attemptNumber: number;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: ({
            user: {
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
            };
            evaluation: {
                id: string;
                formationId: string;
                passingScore: number;
                maxAttempts: number;
                timeLimit: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            evaluationId: string;
            score: number;
            passed: boolean;
            attemptNumber: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
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
        };
        evaluation: {
            id: string;
            formationId: string;
            passingScore: number;
            maxAttempts: number;
            timeLimit: number | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        evaluationId: string;
        score: number;
        passed: boolean;
        attemptNumber: number;
    }>;
}

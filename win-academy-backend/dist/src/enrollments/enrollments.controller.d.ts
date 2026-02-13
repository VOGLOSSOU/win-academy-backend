import { EnrollmentsService } from './enrollments.service';
export declare class EnrollmentsController {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    create(data: any, userId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        userId: string;
        formationId: string;
        progressPercentage: number;
        enrolledAt: Date;
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
            formation: {
                title: string;
                id: string;
                createdAt: Date;
                shortDescription: string | null;
                fullDescription: string | null;
                level: string | null;
                duration: number | null;
                image: string | null;
                categoryId: string | null;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.EnrollmentStatus;
            userId: string;
            formationId: string;
            progressPercentage: number;
            enrolledAt: Date;
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
        formation: {
            title: string;
            id: string;
            createdAt: Date;
            shortDescription: string | null;
            fullDescription: string | null;
            level: string | null;
            duration: number | null;
            image: string | null;
            categoryId: string | null;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        userId: string;
        formationId: string;
        progressPercentage: number;
        enrolledAt: Date;
    }>;
    updateProgress(id: string, body: {
        progressPercentage: number;
    }): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        userId: string;
        formationId: string;
        progressPercentage: number;
        enrolledAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

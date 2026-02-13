import { PrismaService } from '../prisma/prisma.service';
export declare class CertificatesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        userId: string;
        formationId: string;
    }): Promise<{
        id: string;
        userId: string;
        formationId: string;
        uniqueCode: string;
        issuedAt: Date;
        qrCodeUrl: string | null;
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
            userId: string;
            formationId: string;
            uniqueCode: string;
            issuedAt: Date;
            qrCodeUrl: string | null;
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
        userId: string;
        formationId: string;
        uniqueCode: string;
        issuedAt: Date;
        qrCodeUrl: string | null;
    }>;
    verify(uniqueCode: string): Promise<{
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
        userId: string;
        formationId: string;
        uniqueCode: string;
        issuedAt: Date;
        qrCodeUrl: string | null;
    }>;
}

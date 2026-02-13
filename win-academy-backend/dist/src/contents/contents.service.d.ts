import { PrismaService } from '../prisma/prisma.service';
export declare class ContentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        url: string | null;
        type: import("@prisma/client").$Enums.ContentType;
        title: string;
        id: string;
        createdAt: Date;
        order: number;
        body: string | null;
        moduleId: string;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: ({
            module: {
                description: string | null;
                title: string;
                id: string;
                createdAt: Date;
                formationId: string;
                order: number;
            };
        } & {
            url: string | null;
            type: import("@prisma/client").$Enums.ContentType;
            title: string;
            id: string;
            createdAt: Date;
            order: number;
            body: string | null;
            moduleId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        module: {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            formationId: string;
            order: number;
        };
    } & {
        url: string | null;
        type: import("@prisma/client").$Enums.ContentType;
        title: string;
        id: string;
        createdAt: Date;
        order: number;
        body: string | null;
        moduleId: string;
    }>;
    update(id: string, data: any): Promise<{
        url: string | null;
        type: import("@prisma/client").$Enums.ContentType;
        title: string;
        id: string;
        createdAt: Date;
        order: number;
        body: string | null;
        moduleId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

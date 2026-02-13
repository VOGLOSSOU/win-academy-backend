import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        description?: string;
        image?: string;
        ageMin?: number;
        ageMax?: number;
    }): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        name: string;
        image: string | null;
        ageMin: number;
        ageMax: number;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: ({
            formations: {
                title: string;
                id: string;
                createdAt: Date;
                shortDescription: string | null;
                fullDescription: string | null;
                level: string | null;
                duration: number | null;
                image: string | null;
                categoryId: string | null;
            }[];
        } & {
            description: string | null;
            id: string;
            createdAt: Date;
            name: string;
            image: string | null;
            ageMin: number;
            ageMax: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        formations: {
            title: string;
            id: string;
            createdAt: Date;
            shortDescription: string | null;
            fullDescription: string | null;
            level: string | null;
            duration: number | null;
            image: string | null;
            categoryId: string | null;
        }[];
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        name: string;
        image: string | null;
        ageMin: number;
        ageMax: number;
    }>;
    update(id: string, data: Partial<{
        name: string;
        description: string;
        image: string;
        ageMin: number;
        ageMax: number;
    }>): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        name: string;
        image: string | null;
        ageMin: number;
        ageMax: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

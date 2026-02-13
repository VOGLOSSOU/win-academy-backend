import { FormationsService } from './formations.service';
export declare class FormationsController {
    private readonly formationsService;
    constructor(formationsService: FormationsService);
    create(data: any): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        shortDescription: string | null;
        fullDescription: string | null;
        level: string | null;
        duration: number | null;
        image: string | null;
        categoryId: string | null;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: ({
            category: {
                description: string | null;
                id: string;
                createdAt: Date;
                name: string;
                image: string | null;
                ageMin: number;
                ageMax: number;
            } | null;
            _count: {
                enrollments: number;
            };
            modules: {
                description: string | null;
                title: string;
                id: string;
                createdAt: Date;
                formationId: string;
                order: number;
            }[];
        } & {
            title: string;
            id: string;
            createdAt: Date;
            shortDescription: string | null;
            fullDescription: string | null;
            level: string | null;
            duration: number | null;
            image: string | null;
            categoryId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        category: {
            description: string | null;
            id: string;
            createdAt: Date;
            name: string;
            image: string | null;
            ageMin: number;
            ageMax: number;
        } | null;
        evaluation: {
            id: string;
            formationId: string;
            passingScore: number;
            maxAttempts: number;
            timeLimit: number | null;
        } | null;
        modules: ({
            contents: {
                url: string | null;
                type: import("@prisma/client").$Enums.ContentType;
                title: string;
                id: string;
                createdAt: Date;
                order: number;
                body: string | null;
                moduleId: string;
            }[];
        } & {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            formationId: string;
            order: number;
        })[];
    } & {
        title: string;
        id: string;
        createdAt: Date;
        shortDescription: string | null;
        fullDescription: string | null;
        level: string | null;
        duration: number | null;
        image: string | null;
        categoryId: string | null;
    }>;
    update(id: string, data: any): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        shortDescription: string | null;
        fullDescription: string | null;
        level: string | null;
        duration: number | null;
        image: string | null;
        categoryId: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

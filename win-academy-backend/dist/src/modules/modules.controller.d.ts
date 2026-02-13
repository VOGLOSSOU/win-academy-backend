import { ModulesService } from './modules.service';
export declare class ModulesController {
    private readonly modulesService;
    constructor(modulesService: ModulesService);
    create(data: any): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        formationId: string;
        order: number;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: ({
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, data: any): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        formationId: string;
        order: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

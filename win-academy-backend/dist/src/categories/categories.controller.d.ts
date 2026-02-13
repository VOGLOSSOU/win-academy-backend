import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(data: any): Promise<{
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
    update(id: string, data: any): Promise<{
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

import { EvaluationsService } from './evaluations.service';
export declare class EvaluationsController {
    private readonly evaluationsService;
    constructor(evaluationsService: EvaluationsService);
    create(data: any): Promise<{
        id: string;
        formationId: string;
        passingScore: number;
        maxAttempts: number;
        timeLimit: number | null;
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
            questions: {
                id: string;
                createdAt: Date;
                evaluationId: string;
                questionText: string;
            }[];
        } & {
            id: string;
            formationId: string;
            passingScore: number;
            maxAttempts: number;
            timeLimit: number | null;
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
        questions: ({
            answers: {
                id: string;
                createdAt: Date;
                questionId: string;
                answerText: string;
                isCorrect: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            evaluationId: string;
            questionText: string;
        })[];
    } & {
        id: string;
        formationId: string;
        passingScore: number;
        maxAttempts: number;
        timeLimit: number | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        formationId: string;
        passingScore: number;
        maxAttempts: number;
        timeLimit: number | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

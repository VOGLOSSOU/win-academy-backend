import { Sex } from '@prisma/client';
export declare class RegisterDto {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    sex?: Sex;
    communeId?: string;
    email: string;
    password: string;
}

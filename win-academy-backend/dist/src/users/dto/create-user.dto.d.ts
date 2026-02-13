import { Sex, UserRole, UserStatus } from '@prisma/client';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    sex?: Sex;
    communeId?: string;
    email: string;
    password: string;
    role?: UserRole;
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    sex?: Sex;
    communeId?: string;
    status?: UserStatus;
}

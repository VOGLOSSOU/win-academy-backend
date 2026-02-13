import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        sex: import("@prisma/client").$Enums.Sex | null;
        communeId: string | null;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: {
            commune: ({
                department: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    code: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                departmentId: string;
            }) | null;
            firstName: string;
            lastName: string;
            dateOfBirth: Date | null;
            sex: import("@prisma/client").$Enums.Sex | null;
            communeId: string | null;
            email: string;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getProfile(userId: string): Promise<{
        commune: ({
            department: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            departmentId: string;
        }) | null;
        enrollments: ({
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
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        sex: import("@prisma/client").$Enums.Sex | null;
        communeId: string | null;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
        commune: ({
            department: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            departmentId: string;
        }) | null;
        enrollments: ({
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
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        sex: import("@prisma/client").$Enums.Sex | null;
        communeId: string | null;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        sex: import("@prisma/client").$Enums.Sex | null;
        communeId: string | null;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    suspend(id: string): Promise<{
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        sex: import("@prisma/client").$Enums.Sex | null;
        communeId: string | null;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    activate(id: string): Promise<{
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        sex: import("@prisma/client").$Enums.Sex | null;
        communeId: string | null;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}

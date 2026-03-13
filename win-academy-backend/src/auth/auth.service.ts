import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        passwordHash: hashedPassword,
        dateOfBirth: new Date(registerDto.dateOfBirth),
        sex: registerDto.sex,
        communeId: registerDto.communeId,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Account is suspended');
    }

    if (user.status === 'DELETED') {
      throw new UnauthorizedException('Account has been deleted');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return tokens;
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = {
      sub: userId,
      email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRATION || '3600',
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return this.sanitizeUser(user);
  }

  async getDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        dateOfBirth: true,
        sex: true,
        role: true,
        status: true,
        createdAt: true,
        enrollments: {
          orderBy: { enrolledAt: 'desc' },
          include: {
            formation: {
              include: {
                category: { select: { id: true, name: true } },
                modules: {
                  orderBy: { order: 'asc' },
                  select: { id: true, title: true, order: true },
                },
                evaluation: { select: { id: true, passingScore: true, maxAttempts: true, timeLimit: true } },
                _count: { select: { enrollments: true } },
              },
            },
          },
        },
        certificates: {
          orderBy: { issuedAt: 'desc' },
          include: {
            formation: { select: { id: true, title: true, level: true, price: true } },
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

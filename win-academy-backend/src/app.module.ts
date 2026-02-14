import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER } from '@nestjs/core';

// Modules
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { CommunesModule } from './communes/communes.module';
import { CategoriesModule } from './categories/categories.module';
import { FormationsModule } from './formations/formations.module';
import { ModulesModule } from './modules/modules.module';
import { ContentsModule } from './contents/contents.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { QuestionsModule } from './questions/questions.module';
import { AttemptsModule } from './attempts/attempts.module';
import { CertificatesModule } from './certificates/certificates.module';

// Filters
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    DepartmentsModule,
    CommunesModule,
    CategoriesModule,
    FormationsModule,
    ModulesModule,
    ContentsModule,
    EnrollmentsModule,
    EvaluationsModule,
    QuestionsModule,
    AttemptsModule,
    CertificatesModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Helmet - Sécurité des headers HTTP
  app.use(helmet());

  // 2. CORS - Autoriser les requêtes cross-origin
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // 3. Validation Pipe globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non définies dans le DTO
      forbidNonWhitelisted: true, // Lance une erreur si des propriétés non autorisées
      transform: true, // Transforme les payloads en instances DTO
      transformOptions: {
        enableImplicitConversion: true, // Convertit automatiquement les types
      },
    }),
  );

  // 4. Swagger - Documentation API
  const config = new DocumentBuilder()
    .setTitle('Win Academy API')
    .setDescription('API REST pour la plateforme de formation Win Academy')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Endpoints d\'authentification')
    .addTag('Users', 'Gestion des utilisateurs')
    .addTag('Departments', 'Départements administratifs')
    .addTag('Communes', 'Communes')
    .addTag('Categories', 'Catégories de formations')
    .addTag('Formations', 'Parcours pédagogiques')
    .addTag('Modules', 'Modules de formation')
    .addTag('Contents', 'Contenus pédagogiques')
    .addTag('Enrollments', 'Inscriptions aux formations')
    .addTag('Evaluations', 'Évaluations')
    .addTag('Questions', 'Questions d\'évaluation')
    .addTag('Attempts', 'Tentatives d\'évaluation')
    .addTag('Certificates', 'Certificats')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`
  🚀 Win Academy API démarrée sur http://localhost:${port}
  📚 Documentation Swagger: http://localhost:${port}/api/docs
  `);
}

bootstrap();

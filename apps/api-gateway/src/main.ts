import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // All routes are prefixed with /api (e.g. GET /api/health)
  app.setGlobalPrefix('api');

  // CORS — in production, replace with explicit Supabase + frontend origins
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') ?? [
      'http://localhost:3000', // Next.js frontend
      'http://localhost:3001', // Admin (future)
    ],
    credentials: true,
  });

  // Automatically validate and strip unknown fields on all incoming request bodies
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // strip fields not in the DTO
      forbidNonWhitelisted: true,
      transform: true,       // auto-cast query params to their declared types
    }),
  );

  // Swagger — accessible at /api/docs
  const config = new DocumentBuilder()
    .setTitle('Bellat API')
    .setDescription('Bellat Digital Ordering Platform — API Gateway')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`API Gateway running on http://localhost:${port}/api`);
  console.log(`Swagger docs at  http://localhost:${port}/api/docs`);
}

bootstrap();

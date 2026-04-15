import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sync DB schema after app is created so failures don't crash the server.
  // Controlled by TYPEORM_SYNCHRONIZE env var (set true in dev and prod init).
  if (process.env.TYPEORM_SYNCHRONIZE === 'true') {
    try {
      const dataSource = app.get(DataSource);
      await dataSource.synchronize();
      console.log('[TypeORM] Schema synchronized');
    } catch (err) {
      console.error('[TypeORM] Schema sync failed (app will continue):', err);
    }
  }

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import cookieParser from 'cookie-parser';
import { createValidationPipe } from '@as/base';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app setup
  app.use(cookieParser());
  app.useGlobalPipes(createValidationPipe());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cookies & cors
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

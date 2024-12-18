import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

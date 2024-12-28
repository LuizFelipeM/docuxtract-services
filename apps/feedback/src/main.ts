import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FeedbackModule } from './feedback.module';

async function bootstrap() {
  const app = await NestFactory.create(FeedbackModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

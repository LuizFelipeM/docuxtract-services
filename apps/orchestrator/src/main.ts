import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { OrchestratorModule } from './orchestrator.module';

async function bootstrap() {
  const app = await NestFactory.create(OrchestratorModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

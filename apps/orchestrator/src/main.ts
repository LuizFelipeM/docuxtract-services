import { NestFactory } from '@nestjs/core';
import { OrchestratorModule } from './orchestrator.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(OrchestratorModule);
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

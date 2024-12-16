import { NestFactory } from '@nestjs/core';
import { PmIntModule } from './pm-int.module';

async function bootstrap() {
  const app = await NestFactory.create(PmIntModule);
  await app.listen(process.env.port ?? 3000, '0.0.0.0');
}
bootstrap();

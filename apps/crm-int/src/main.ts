import { NestFactory } from '@nestjs/core';
import { CrmIntModule } from './crm-int.module';

async function bootstrap() {
  const app = await NestFactory.create(CrmIntModule);
  await app.listen(process.env.port ?? 3000, '0.0.0.0');
}
bootstrap();

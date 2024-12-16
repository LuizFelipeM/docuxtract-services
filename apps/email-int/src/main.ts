import { NestFactory } from '@nestjs/core';
import { EmailIntModule } from './email-int.module';

async function bootstrap() {
  const app = await NestFactory.create(EmailIntModule);
  await app.listen(process.env.port ?? 3000, '0.0.0.0');
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule, { rawBody: true });
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

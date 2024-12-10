import { NestFactory } from '@nestjs/core';
import { EmailIntModule } from './email-int.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(EmailIntModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBIT_MQ_URL')],
      queue: configService.get<string>('RABBIT_MQ_EMAIL_INT_QUEUE'),
      persistent: true,
      noAck: false,
    },
  });

  await app.startAllMicroservices();
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { EmailIntModule } from './email-int.module';
import { RmqService } from '@libs/common';

async function bootstrap() {
  const app = await NestFactory.create(EmailIntModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('EMAIL_INT'));
  await app.startAllMicroservices();
}
bootstrap();

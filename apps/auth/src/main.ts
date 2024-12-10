import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import * as cookieParser from 'cookie-parser';
import { RmqService } from '@libs/common';
import { ValidationPipe } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configService = app.get<ConfigService>(ConfigService);
  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBIT_MQ_URL')],
      queue: configService.get<string>('RABBIT_MQ_AUTH_QUEUE'),
      persistent: true,
    },
  });

  // app.useGlobalPipes(new ValidationPipe());
  // app.use(cookieParser());
  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

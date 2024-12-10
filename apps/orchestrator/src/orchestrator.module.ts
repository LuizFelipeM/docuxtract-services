import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorService } from './orchestrator.service';
import { AuthModule, RmqModule } from '@libs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Services } from '@libs/contracts';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // AuthModule,
    RmqModule.register({ name: Services.EmailInt }),
    ClientsModule.registerAsync([
      {
        name: Services.Auth,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get<string>('RABBIT_MQ_URL')}`],
            queue: configService.get<string>(
              `RABBIT_MQ_${Services.Auth}_QUEUE`,
            ),
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/orchestrator/.env',
      validationSchema: Joi.object({
        DB_CONNECTION_STRING: Joi.string().required(),
        RABBIT_MQ_URL: Joi.string().required(),
        RABBIT_MQ_EMAIL_INT_QUEUE: Joi.string().required(),
      }),
    }),
  ],
  controllers: [OrchestratorController],
  providers: [OrchestratorService],
})
export class OrchestratorModule {}

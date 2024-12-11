import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorService } from './orchestrator.service';
import { AuthModule, RmqModule } from '@libs/common';
import { ConfigModule } from '@nestjs/config';
import { Exchanges } from '@libs/contracts';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    // AuthModule,
    // RmqModule.register([{ name: Services.EmailInt }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/orchestrator/.env',
      validationSchema: Joi.object({
        DB_CONNECTION_STRING: Joi.string().required(),
        RABBIT_MQ_URL: Joi.string().required(),
      }),
    }),

    // RabbitMQModule.forRoot(RabbitMQModule, {
    //   uri: 'amqp://admin:password@rabbitmq:5672/',
    //   exchanges: [
    //     {
    //       name: 'commands',
    //       type: 'topic',
    //     },
    //     {
    //       name: 'events',
    //       type: 'topic',
    //     },
    //   ],
    // }),

    RmqModule.forRoot({ exchanges: [Exchanges.commands, Exchanges.events] }),
  ],
  controllers: [OrchestratorController],
  providers: [OrchestratorService],
})
export class OrchestratorModule {}

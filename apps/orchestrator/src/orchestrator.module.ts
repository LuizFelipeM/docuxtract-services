import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorService } from './orchestrator.service';
import { RmqModule } from '@libs/common';
import { ConfigModule } from '@nestjs/config';
import { EMAIL_INT_SERVICE } from './constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/orchestrator/.env',
      validationSchema: Joi.object({
        DB_CONNECTION_STRING: Joi.string().required(),
        RABBIT_MQ_URL: Joi.string().required(),
        RABBIT_MQ_EMAIL_INT_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule.register({
      name: EMAIL_INT_SERVICE,
    }),
  ],
  controllers: [OrchestratorController],
  providers: [OrchestratorService],
})
export class OrchestratorModule {}

import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorService } from './orchestrator.service';
import { AuthModule, RmqModule } from '@libs/common';
import { ConfigModule } from '@nestjs/config';
import { Services } from '@libs/contracts';

@Module({
  imports: [
    AuthModule,
    RmqModule.register([{ name: Services.EmailInt }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/orchestrator/.env',
      validationSchema: Joi.object({
        DB_CONNECTION_STRING: Joi.string().required(),
        RABBIT_MQ_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [OrchestratorController],
  providers: [OrchestratorService],
})
export class OrchestratorModule {}

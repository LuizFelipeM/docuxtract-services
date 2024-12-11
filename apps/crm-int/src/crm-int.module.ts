import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { CrmIntController } from './crm-int.controller';
import { CrmIntService } from './crm-int.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@libs/common';
import { Exchange } from '@libs/contracts';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/crm-int/.env',
      validationSchema: Joi.object({
        RABBIT_MQ_URL: Joi.string().required(),
      }),
    }),
    RmqModule.forRoot({ exchanges: [Exchange.Commands, Exchange.Events] }),
  ],
  controllers: [CrmIntController],
  providers: [CrmIntController, CrmIntService],
})
export class CrmIntModule {}

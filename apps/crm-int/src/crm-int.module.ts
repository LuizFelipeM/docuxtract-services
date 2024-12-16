import { Exchanges, RmqModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CrmIntController } from './crm-int.controller';
import { CrmIntService } from './crm-int.service';
import { CrudController } from './crud/crud.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/crm-int/.env',
      validationSchema: Joi.object({
        RABBIT_MQ_URL: Joi.string().required(),
      }),
    }),
    RmqModule.forRoot({ exchanges: [Exchanges.commands, Exchanges.events] }),
  ],
  controllers: [CrmIntController, CrudController],
  providers: [CrmIntController, CrmIntService],
})
export class CrmIntModule {}

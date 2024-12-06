import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { EmailIntController } from './email-int.controller';
import { EmailIntService } from './email-int.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, RmqModule } from '@libs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inbox } from './entitties/inbox.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/email-int/.env',
      validationSchema: Joi.object({
        DB_CONNECTION_STRING: Joi.string().required(),
        RABBIT_MQ_URL: Joi.string().required(),
        RABBIT_MQ_EMAIL_INT_QUEUE: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Inbox]),
    RmqModule,
  ],
  controllers: [EmailIntController],
  providers: [EmailIntService],
})
export class EmailIntModule {}

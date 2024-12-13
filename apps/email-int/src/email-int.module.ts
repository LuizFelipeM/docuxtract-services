import { AuthModule, DatabaseModule, Exchanges, RmqModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { EmailIntController } from './email-int.controller';
import { EmailIntService } from './email-int.service';
import { Inbox } from './entities/inbox.entity';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Inbox]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/email-int/.env',
      validationSchema: Joi.object({
        DB_CONNECTION_STRING: Joi.string().required(),
        RABBIT_MQ_URL: Joi.string().required(),
      }),
    }),
    RmqModule.forRoot({ exchanges: [Exchanges.commands, Exchanges.events] }),
  ],
  controllers: [EmailIntController],
  providers: [EmailIntController, EmailIntService],
})
export class EmailIntModule {}

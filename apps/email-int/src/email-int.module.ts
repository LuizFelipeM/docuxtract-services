import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { EmailIntController } from './email-int.controller';
import { EmailIntService } from './email-int.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, DatabaseModule, RmqModule } from '@libs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inbox } from './entities/inbox.entity';
import { Exchange } from '@libs/contracts';

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
    RmqModule.forRoot({ exchanges: [Exchange.Commands, Exchange.Events] }),
  ],
  controllers: [EmailIntController],
  providers: [EmailIntService],
})
export class EmailIntModule {}

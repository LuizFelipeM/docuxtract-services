import { AuthModule, DatabaseModule, Exchanges, RmqModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EmailIntController } from './email-int.controller';
import { EmailIntService } from './email-int.service';
import { Inbox } from './entities/inbox.entity';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { InboxRepository } from './repositories/inbox.repository';

@Module({
  imports: [
    AuthModule,
    DatabaseModule.forRoot({
      entities: [Inbox],
    }),
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
  controllers: [HealthcheckController, EmailIntController],
  providers: [EmailIntController, EmailIntService, InboxRepository],
})
export class EmailIntModule {}

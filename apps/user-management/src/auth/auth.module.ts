import { Exchanges, RmqModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
      validationSchema: Joi.object({
        CLERK_SECRET_KEY: Joi.string().required(),
        CLERK_PUBLISHABLE_KEY: Joi.string().required(),
        CLERK_AUTHORIZED_PARTIES: Joi.array(),
        CLERK_SIGNING_SECRET: Joi.string().required(),
        RABBIT_MQ_URL: Joi.string().required(),
      }),
    }),
    RmqModule.forRoot({ exchanges: [Exchanges.commands] }),
  ],
  controllers: [AuthController],
  providers: [AuthController, AuthService],
})
export class AuthModule {}

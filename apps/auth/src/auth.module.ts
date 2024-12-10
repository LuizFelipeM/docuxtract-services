import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@libs/common';

@Module({
  imports: [
    RmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
      validationSchema: Joi.object({
        CLERK_SECRET_KEY: Joi.string().required(),
        CLERK_PUBLISHABLE_KEY: Joi.string().required(),
        CLERK_AUTHORIZED_PARTIES: Joi.array(),
        RABBIT_MQ_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

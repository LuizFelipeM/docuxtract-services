import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { PermissionModule } from './permission/permission.module';
import { WebhooksController } from './webhooks/webhooks.controller';

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
        PERMIT_SECRET_KEY: Joi.string().required(),
        RABBIT_MQ_URL: Joi.string().required(),
      }),
    }),
    AuthModule,
    PermissionModule,
  ],
  controllers: [HealthcheckController, WebhooksController],
  providers: [],
})
export class UserManagementModule {}

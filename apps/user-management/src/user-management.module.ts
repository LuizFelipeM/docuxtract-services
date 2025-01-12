import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { OrganizationsModule } from './organizations/organizations.module';
import { PermissionsModule } from './permissions/permissions.module';
import { WebhooksController } from './webhooks/webhooks.controller';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

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
    PermissionsModule,
    OrganizationsModule,
    SubscriptionsModule,
  ],
  controllers: [HealthcheckController, WebhooksController],
  providers: [],
})
export class UserManagementModule {}

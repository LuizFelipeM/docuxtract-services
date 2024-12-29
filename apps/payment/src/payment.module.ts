import { AuthModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/orchestrator/.env',
      validationSchema: Joi.object({
        DOMAIN: Joi.string().required(),
        DB_CONNECTION_STRING: Joi.string().required(),
        RABBIT_MQ_URL: Joi.string().required(),
        STRIPE_PUBLISHABLE_KEY: Joi.string().required(),
        STRIPE_ENDPOINT_SECRET: Joi.string().required(),
      }),
    }),
    AuthModule,
  ],
  controllers: [HealthcheckController, PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
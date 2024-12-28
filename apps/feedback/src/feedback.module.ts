import { AuthModule, DatabaseModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { Survey } from './entities/survey.entity';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { SurveyRepository } from './repositories/survey.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/feedback/.env',
      validationSchema: Joi.object({
        DB_CONNECTION_STRING: Joi.string().required(),
        RABBIT_MQ_URL: Joi.string().required(),
      }),
    }),
    AuthModule,
    DatabaseModule.forRoot({
      entities: [Survey],
    }),
  ],
  controllers: [HealthcheckController, FeedbackController],
  providers: [FeedbackService, SurveyRepository],
})
export class FeedbackModule {}

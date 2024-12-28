import { User } from '@clerk/backend';
import { CurrentUser, JwtAuthGuard } from '@libs/common';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AnswerSurveyDto } from './dtos/answer-survey.dto';
import { FeedbackService } from './feedback.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('answer')
  @HttpCode(HttpStatus.NO_CONTENT)
  async answer(
    @CurrentUser() currentUser: User,
    @Body() answerSurvey: AnswerSurveyDto,
  ): Promise<void> {
    await this.feedbackService.answer(currentUser.id, answerSurvey);
  }
}

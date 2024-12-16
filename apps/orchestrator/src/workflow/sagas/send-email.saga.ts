import { Injectable } from '@nestjs/common';
import { SendEmailWf } from '../../dtos/send-email-wf.dto';
import { Saga } from '../saga';
import { SaveInboxStep } from '../steps/save-inbox.step';
import { SendEmaiStep } from '../steps/send-email.step';

@Injectable()
export class SendEmailSaga extends Saga<SendEmailWf, void> {
  constructor(saveInboxStep: SaveInboxStep, sendEmailStep: SendEmaiStep) {
    super([saveInboxStep, sendEmailStep]);
  }
}

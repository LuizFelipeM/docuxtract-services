import { RmqService, RoutingKeys } from '@libs/common';
import { SendEmailDto } from '@libs/contracts/email-int';
import { Injectable } from '@nestjs/common';
import { SendEmailWf } from '../../dtos/send-email-wf.dto';
import { Step } from '../step';

@Injectable()
export class SendEmaiStep extends Step<SendEmailWf, void> {
  name: string = SendEmaiStep.name;

  constructor(private readonly rmqService: RmqService) {
    super();
  }

  async invoke(params: SendEmailWf): Promise<void> {
    try {
      const payload = new SendEmailDto();
      payload.attachments = params.attachments;
      payload.body = params.body;
      payload.receipient = params.receipient;
      payload.subject = params.subject;

      await this.rmqService.publish(RoutingKeys.emailInt.send, payload);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  withCompensation(params: SendEmailWf): Promise<void> {
    return;
  }
}

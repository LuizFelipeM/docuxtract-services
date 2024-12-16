import { RmqService, RoutingKeys } from '@libs/common';
import { SaveInboxDto } from '@libs/contracts/email-int';
import { Injectable } from '@nestjs/common';
import { SendEmailWf } from '../../dtos/send-email-wf.dto';
import { Step } from '../step';

@Injectable()
export class SaveInboxStep extends Step<SendEmailWf, void> {
  name: string = SaveInboxStep.name;

  constructor(private readonly rmqService: RmqService) {
    super();
  }

  async invoke(params: SendEmailWf): Promise<void> {
    try {
      const payload = new SaveInboxDto();
      payload.attachments = params.attachments;
      payload.body = params.body;
      payload.receivedDate = new Date();
      payload.sender = params.sender;
      payload.subject = params.subject;

      await this.rmqService.rpc<boolean>(RoutingKeys.emailInt.save, payload);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  withCompensation(params: SendEmailWf): Promise<void> {
    return;
  }
}

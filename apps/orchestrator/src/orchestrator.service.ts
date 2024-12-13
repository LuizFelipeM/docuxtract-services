import { RmqService, RoutingKeys } from '@libs/common';
import { SaveInboxDto, SendEmailDto } from '@libs/contracts/email-int';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrchestratorService {
  constructor(private readonly rmqService: RmqService) {}

  async sendEmail(request: SendEmailDto): Promise<void> {
    try {
      await this.rmqService.publish(RoutingKeys.emailInt.send, request);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async saveInbox(request: SaveInboxDto): Promise<boolean> {
    try {
      return await this.rmqService.publish(RoutingKeys.emailInt.save, request);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

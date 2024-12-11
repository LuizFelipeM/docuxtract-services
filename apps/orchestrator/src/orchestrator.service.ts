import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '../../../libs/contracts/src/dtos/send-email.dto';
import { Exchanges, RoutingKeys } from '@libs/contracts';
import { RmqService } from '@libs/common';

@Injectable()
export class OrchestratorService {
  constructor(private readonly rmqService: RmqService) {}

  async sendEmail(request: SendEmailDto): Promise<void> {
    try {
      await this.rmqService.publish(
        Exchanges.commands,
        RoutingKeys.emailInt.send,
        request,
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

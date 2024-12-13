import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/common';
import { SendEmailDto } from '@libs/contracts/email-int';
import { Controller, Logger } from '@nestjs/common';
import { EmailIntService } from './email-int.service';

@Controller()
export class EmailIntController {
  private readonly logger = new Logger(EmailIntController.name);

  constructor(private readonly emailIntService: EmailIntService) {}

  @RabbitSubscribe({
    exchange: Exchanges.events.name,
    routingKey: RoutingKeys.emailInt.send.value,
    queue: 'email-int.envents',
  })
  async handleSendEmail(data: SendEmailDto) {
    this.logger.log(data);
    this.emailIntService.sendEmail(data);
  }
}

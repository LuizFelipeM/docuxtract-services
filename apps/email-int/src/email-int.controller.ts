import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/common';
import { SaveInboxDto, SendEmailDto } from '@libs/contracts/email-int';
import { Controller, Logger } from '@nestjs/common';
import { EmailIntService } from './email-int.service';

@Controller()
export class EmailIntController {
  private readonly logger = new Logger(EmailIntController.name);

  constructor(private readonly emailIntService: EmailIntService) {}

  @RabbitSubscribe({
    exchange: Exchanges.events.name,
    routingKey: RoutingKeys.emailInt.send.value,
    queue: 'email-int.events',
  })
  async handleSendEmail(data: SendEmailDto) {
    this.logger.log(data);
    this.emailIntService.sendEmail(data);
  }

  @RabbitRPC({
    exchange: Exchanges.commands.name,
    routingKey: RoutingKeys.emailInt.save.value,
    queue: 'email-int.save',
  })
  async handleSaveInbox(data: SaveInboxDto) {
    this.logger.log(data);
    this.emailIntService.saveInbox(data);
  }
}

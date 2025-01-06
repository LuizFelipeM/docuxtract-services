import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/common';
import { SaveInboxDto, SendEmailDto } from '@libs/contracts/email-int';
import { Event } from '@libs/contracts/message-broker';
import { Controller, Logger } from '@nestjs/common';
import { EmailIntService } from './email-int.service';

@Controller()
export class EmailIntController {
  private readonly logger = new Logger(EmailIntController.name);

  constructor(private readonly emailIntService: EmailIntService) {}

  @RabbitSubscribe({
    exchange: Exchanges.events.name,
    routingKey: RoutingKeys.emailInt.send.all,
    queue: 'email-int.events',
  })
  async handleSendEmail(event: Event<SendEmailDto>) {
    this.logger.log(event);
    this.emailIntService.sendEmail(event.data);
  }

  @RabbitSubscribe({
    exchange: Exchanges.commands.name,
    routingKey: RoutingKeys.emailInt.save.all,
    queue: 'email-int.save',
  })
  async handleSaveInbox(event: Event<SaveInboxDto>) {
    this.logger.log(event);
    this.emailIntService.saveInbox(event.data);
  }
}

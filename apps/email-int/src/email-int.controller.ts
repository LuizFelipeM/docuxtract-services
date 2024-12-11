import { Controller, Get, Logger } from '@nestjs/common';
import { EmailIntService } from './email-int.service';
import { SendEmailDto } from '@libs/contracts/dtos/send-email.dto';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RoutingKeys, Exchanges } from '@libs/contracts';

@Controller()
export class EmailIntController {
  private readonly logger = new Logger(EmailIntController.name);

  constructor(private readonly emailIntService: EmailIntService) {}

  @Get()
  getHello(): string {
    return this.emailIntService.getHello();
  }

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

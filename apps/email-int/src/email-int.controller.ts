import { Controller, Get } from '@nestjs/common';
import { EmailIntService } from './email-int.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@libs/common';

@Controller()
export class EmailIntController {
  constructor(
    private readonly emailIntService: EmailIntService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  getHello(): string {
    return this.emailIntService.getHello();
  }

  @EventPattern('send_email')
  async handleSendEmail(@Payload() data: any, @Ctx() ctx: RmqContext) {
    this.emailIntService.sendEmail(data);
    this.rmqService.ack(ctx);
  }
}

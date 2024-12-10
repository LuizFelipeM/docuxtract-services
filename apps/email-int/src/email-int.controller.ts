import { Controller, Get, UseGuards } from '@nestjs/common';
import { EmailIntService } from './email-int.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { JwtAuthGuard, RmqService } from '@libs/common';
import { SendEmailDto } from '@libs/contracts/dtos/send-email.dto';

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

  @EventPattern('email.send')
  // @UseGuards(JwtAuthGuard)
  async handleSendEmail(@Payload() data: SendEmailDto, @Ctx() ctx: RmqContext) {
    console.log(data);
    this.emailIntService.sendEmail(data);
    this.rmqService.ack(ctx);
  }
}

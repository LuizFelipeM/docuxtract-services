import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { EmailIntService } from './email-int.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { JwtAuthGuard, RmqService } from '@libs/common';

@Controller()
export class EmailIntController {
  private readonly logger = new Logger(EmailIntController.name);

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
  async handleSendEmail(@Payload() data: any, @Ctx() ctx: RmqContext) {
    console.log('data', data);
    this.emailIntService.sendEmail(data);
    this.rmqService.ack(ctx);
  }

  @MessagePattern({ cmd: 'email.test' })
  async test(@Payload() data: any, @Ctx() ctx: RmqContext): Promise<string> {
    console.log('data', data);
    this.rmqService.ack(ctx);
    return JSON.stringify(data);
  }
}

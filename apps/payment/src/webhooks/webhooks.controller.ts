import {
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from '../payment.service';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('stripe')
  @HttpCode(HttpStatus.NO_CONTENT)
  async stripe(@Req() req: RawBodyRequest<Request>) {
    const signature = req.header('stripe-signature');
    this.paymentService.processEvent(signature, req.body);
  }
}

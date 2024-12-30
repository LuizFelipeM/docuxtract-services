import { JwtAuthGuard } from '@libs/common';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto';
import { PaymentService } from './payment.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  @Redirect(undefined, HttpStatus.SEE_OTHER)
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ): Promise<{ url: string }> {
    const session = await this.paymentService.createCheckoutSession(
      createCheckoutSessionDto.lookupKey,
    );
    return { url: session.url };
  }

  @Get('list-price')
  async listPrice(
    @Query('lookupKey') lookupKey: string[],
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.Price>>> {
    const session = await this.paymentService.listPrice(lookupKey);
    return session;
  }

  @Post('customer')
  @Redirect(undefined, HttpStatus.SEE_OTHER)
  async createCustomerPortalSession(): Promise<{ url: string }> {
    // Pending session management
    const sessionId = '';
    const session =
      await this.paymentService.createCustomerPortalSession(sessionId);
    return { url: session.url };
  }
}

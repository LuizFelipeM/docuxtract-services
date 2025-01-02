import { JwtAuthGuard } from '@libs/common';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @Redirect(undefined, HttpStatus.SEE_OTHER)
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ): Promise<{ url: string }> {
    const session = await this.paymentService.createCheckoutSession(
      createCheckoutSessionDto.lookupKey,
    );
    this.logger.log(session.url);
    return { url: session.url };
  }

  @Get('list-price')
  @UseGuards(JwtAuthGuard)
  async listPrice(
    @Query('lookupKey') lookupKey: string[],
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.Price>>> {
    const session = await this.paymentService.listPrice(lookupKey);
    return session;
  }

  @Post('customer')
  @UseGuards(JwtAuthGuard)
  @Redirect(undefined, HttpStatus.SEE_OTHER)
  async createCustomerPortalSession(): Promise<{ url: string }> {
    // Pending session management
    const sessionId = '';
    const session =
      await this.paymentService.createCustomerPortalSession(sessionId);
    return { url: session.url };
  }

  @Get(':status')
  checkoutSessionStatus(
    @Param() status: string,
    @Query('session_id') sessionId: string,
  ) {
    this.logger.log(`Checkout session ${status} with session ID ${sessionId}`);
  }
}

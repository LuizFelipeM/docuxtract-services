import { WebhookEvent as ClerkWebhookEvent } from '@clerk/backend';
import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Webhook as SvixWebhook } from 'svix';
import { UsersService } from '../users/users.service';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);
  private readonly clerkWebhook: SvixWebhook;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.clerkWebhook = new SvixWebhook(
      this.configService.get<string>('CLERK_SIGNING_SECRET'),
    );
  }

  @Post('clerk')
  async clerk(@Req() req: RawBodyRequest<Request>) {
    const body = req.rawBody.toString('utf8');
    const headers = req.headers as Record<string, string>;

    let event: ClerkWebhookEvent;
    try {
      event = this.clerkWebhook.verify(body, headers) as ClerkWebhookEvent;
    } catch (err) {
      this.logger.error(
        `Error: Could not verify webhook: ${JSON.stringify(err)}`,
      );
      throw new BadRequestException('Error: Verification error');
    }

    // Do something with payload
    const { type } = event;

    let userId: string;
    let customerId: string;
    switch (type) {
      case 'user.created':
        userId = event.data.id;
        customerId = String(event.data.public_metadata.customer_id);
        // this.permissionService.syncUser(
        //   userId,
        //   customerId,
        //   event.data.primary_email_address_id,
        // );
        break;

      case 'user.updated':
      case 'user.deleted':
        // this.userRepository.delete({ id: event.data.id });
        return;
    }
    this.logger.log(
      `Received webhook with User ID ${userId} Customer ID ${customerId} and event type of ${type}`,
    );
  }
}

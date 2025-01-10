import {
  ClerkClient,
  createClerkClient,
  User,
  verifyToken,
} from '@clerk/backend';
import type { JwtPayload } from '@clerk/types';
import {
  CustomerSubscriptionCreatedDto,
  CustomerSubscriptionDeletedDto,
  CustomerSubscriptionUpdatedDto,
} from '@libs/contracts/payment';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly clerkClient: ClerkClient;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
    const publishableKey = this.configService.get<string>(
      'CLERK_PUBLISHABLE_KEY',
    );

    this.clerkClient = createClerkClient({
      secretKey,
      publishableKey,
    });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return (
      await this.clerkClient.users.getUserList({
        emailAddress: [email],
      })
    ).data[0];
  }

  async updateUserSubscription(
    subscription:
      | CustomerSubscriptionCreatedDto
      | CustomerSubscriptionUpdatedDto,
  ): Promise<void> {
    await this.clerkClient.users.updateUserMetadata(subscription.user.id, {
      privateMetadata: {
        subs: {
          cid: subscription.customer.id,
          sts: subscription.status,
          exp: new Date(subscription.expiresAt).getTime(),
        },
      },
    });
  }

  async clearUserSubscription(
    subscription: CustomerSubscriptionDeletedDto,
  ): Promise<void> {
    await this.clerkClient.users.updateUserMetadata(subscription.user.id, {
      privateMetadata: { subs: { cid: null, sts: null, exp: null } },
    });
  }

  async verify(token: string): Promise<JwtPayload> {
    try {
      return await verifyToken(token, {
        secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
        authorizedParties: this.configService.get<string[]>(
          'CLERK_AUTHORIZED_PARTIES',
        ),
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      return await this.clerkClient.users.getUser(userId);
    } catch (error) {
      throw new UnauthorizedException('User not found');
    }
  }
}

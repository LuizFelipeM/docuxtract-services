import {
  ClerkClient,
  createClerkClient,
  User,
  verifyToken,
} from '@clerk/backend';
import type { JwtPayload } from '@clerk/types';
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

  async updateUserPublicMetadata(
    userId: string,
    publicMetadata: Record<string, unknown>,
  ): Promise<User> {
    return await this.clerkClient.users.updateUserMetadata(userId, {
      publicMetadata,
    });
  }

  async verify(token: string): Promise<JwtPayload> {
    try {
      const jwt = await verifyToken(token, {
        secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
        authorizedParties: this.configService.get<string[]>(
          'CLERK_AUTHORIZED_PARTIES',
        ),
      });
      return jwt;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getUser(userId: string): Promise<User> {
    try {
      return await this.clerkClient.users.getUser(userId);
    } catch (error) {
      throw new UnauthorizedException('User not found');
    }
  }
}

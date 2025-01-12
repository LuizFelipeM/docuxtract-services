import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IResource, IUser, Permit } from 'permitio';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);
  private readonly permit: Permit;

  constructor(private readonly configService: ConfigService) {
    this.permit = new Permit({
      pdp: 'https://cloudpdp.api.permit.io',
      token: this.configService.get<string>('PERMIT_SECRET_KEY'),
    });
  }

  async check(
    user: string | IUser,
    action: string,
    resource: string | IResource,
  ): Promise<boolean> {
    const permitted = await this.permit.check(user, action, resource);
    return permitted;
  }

  async syncUser(
    userId: string,
    email: string,
    attributes?: Record<string, any>,
  ): Promise<void> {
    await this.permit.api.users.sync({
      key: userId,
      email,
      attributes,
    });
  }

  async revokeUserPermissions(userId: string): Promise<void> {
    try {
      await this.permit.api.deleteUser(userId);
    } catch (error) {
      this.logger.error(error);
    }
  }
}

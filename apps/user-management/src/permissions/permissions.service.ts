import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IResource, IUser, Permit } from 'permitio';
import { Role } from '../role';

interface SyncUserParams {
  id: string;
  email: string;
  roles?: Role[];
  attributes?: Record<string, any>;
}

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);
  private readonly permit: Permit;

  constructor(private readonly configService: ConfigService) {
    this.permit = new Permit({
      pdp: this.configService.get<string>('PERMITIO_PDP'),
      token: this.configService.get<string>('PERMITIO_SECRET_KEY'),
    });
  }

  async check(
    user: string | IUser,
    action: string,
    resource: string | IResource,
  ): Promise<boolean> {
    return await this.permit.check(user, action, resource);
  }

  async createOrganization(
    organizationId: string,
    name: string,
    attributes: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.permit.api.tenants.get(organizationId);
    } catch (error) {
      await this.permit.api.tenants.create({
        key: organizationId,
        name,
        attributes,
      });
    }
  }

  async syncUser(
    organizationId: string,
    { id, email, attributes, roles = [Role.member] }: SyncUserParams,
  ): Promise<void> {
    try {
      await this.permit.api.users.sync({
        key: id,
        email: email,
        attributes,
        role_assignments: roles.map((role) => ({
          role,
          tenant: organizationId,
        })),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async revokeUserPermissions(userId: string): Promise<void> {
    try {
      await this.permit.api.deleteUser(userId);
    } catch (error) {
      this.logger.error(error);
    }
  }
}

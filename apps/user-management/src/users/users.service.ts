import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Permit, RoleAssignmentRead, RoleAssignmentRemove } from 'permitio';
import { Role } from '../role';
import { SyncUserDto } from './dtos/sync-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly permit: Permit;

  constructor(private readonly configService: ConfigService) {
    this.permit = new Permit({
      pdp: this.configService.get<string>('PERMITIO_PDP'),
      token: this.configService.get<string>('PERMITIO_SECRET_KEY'),
    });
  }

  async sync({
    userId,
    organizationId,
    email,
    attributes,
    roles = [Role.member],
  }: SyncUserDto): Promise<void> {
    try {
      await this.permit.api.users.sync({
        key: userId,
        email: email,
        attributes: { ...attributes, organizationId },
        role_assignments: roles.map((role) => ({
          role,
          tenant: organizationId,
        })),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async revokePermissions(
    userId: string,
    organizationId: string,
    roles: Role[] = [],
  ): Promise<void> {
    try {
      if (roles.length === 0) {
        const perPage = 50;
        let data: RoleAssignmentRead[] = [];
        let total_count = 1,
          page_count = 0,
          removed_roles_count = 0;
        while (total_count > removed_roles_count) {
          ({ data, total_count, page_count } =
            await this.permit.api.users.getAssignedRoles({
              user: userId,
              tenant: organizationId,
              includeTotalCount: true,
              perPage,
              page: page_count + 1,
            }));

          await this.permit.api.roleAssignments.bulkUnassign(
            data.map<RoleAssignmentRemove>(({ role, tenant_id }) => ({
              role,
              user: userId,
              tenant: tenant_id,
            })),
          );

          removed_roles_count += perPage;
        }
      } else {
        await this.permit.api.roleAssignments.bulkUnassign(
          roles.map<RoleAssignmentRemove>((role) => ({
            role,
            user: userId,
            tenant: organizationId,
          })),
        );
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}

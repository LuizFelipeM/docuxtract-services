import {
  ClerkClient,
  createClerkClient,
  Organization,
  OrganizationInvitation,
} from '@clerk/backend';
import { OrganizationInvitationStatus } from '@clerk/types';
import { PaginatedResource } from '@libs/contracts/paginated-resource';
import { PaginationParams } from '@libs/contracts/pagination-params';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Permit } from 'permitio';
import { Role } from '../role';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';

interface CreateOrganizationParams {
  slug?: string;
  attributes?: Record<string, unknown>;
}

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);
  private readonly clerkClient: ClerkClient;
  private readonly permit: Permit;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
    const publishableKey = this.configService.get<string>(
      'CLERK_PUBLISHABLE_KEY',
    );

    this.clerkClient = createClerkClient({
      secretKey,
      publishableKey,
    });

    this.permit = new Permit({
      pdp: this.configService.get<string>('PERMITIO_PDP'),
      token: this.configService.get<string>('PERMITIO_SECRET_KEY'),
    });
  }

  async create(
    userId: string,
    name: string,
    maxUsers: number,
    params?: CreateOrganizationParams,
  ): Promise<Organization> {
    try {
      const organization =
        await this.clerkClient.organizations.createOrganization({
          name,
          createdBy: userId,
          maxAllowedMemberships: maxUsers,
          slug: params.slug,
        });

      await this.createPermitTenant(organization.id, name, {
        ...params.attributes,
        maxUserLicensesCount: maxUsers,
      });
      return organization;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async createPermitTenant(
    organizationId: string,
    name: string,
    attributes?: Record<string, unknown>,
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

  async update({
    id,
    name,
    maxUsers,
    slug,
  }: UpdateOrganizationDto): Promise<Organization> {
    try {
      return await this.clerkClient.organizations.updateOrganization(id, {
        name,
        maxAllowedMemberships: maxUsers,
        slug,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async get(organizationId: string): Promise<Organization> {
    try {
      return await this.clerkClient.organizations.getOrganization({
        organizationId,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getUserOrganization(userId: string): Promise<Organization | undefined> {
    try {
      const { data } =
        await this.clerkClient.users.getOrganizationMembershipList({ userId });
      return data[0]?.organization;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getOrganizationUserIds(
    organizationId: string,
    pagination?: PaginationParams,
  ): Promise<PaginatedResource<string>> {
    try {
      const { data, totalCount } =
        await this.clerkClient.organizations.getOrganizationMembershipList({
          organizationId,
          limit: pagination.limit,
          offset: pagination.offset,
        });
      return new PaginatedResource(
        data.map((d) => d.publicUserData.userId),
        totalCount,
        pagination.offset,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getInvitationList(
    organizationId: string,
    status?: OrganizationInvitationStatus[],
    pagination?: PaginationParams,
  ): Promise<PaginatedResource<OrganizationInvitation>> {
    try {
      const { data, totalCount } =
        await this.clerkClient.organizations.getOrganizationInvitationList({
          organizationId,
          status,
          limit: pagination.limit,
          offset: pagination.offset,
        });
      return new PaginatedResource(data, totalCount, pagination.offset);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async inviteUser(
    inviterUserId: string,
    email: string,
    organizationId: string,
    role = Role.member,
  ): Promise<OrganizationInvitation> {
    try {
      return await this.clerkClient.organizations.createOrganizationInvitation({
        emailAddress: email,
        inviterUserId,
        organizationId,
        role,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async revokeInvitation(
    invitationId: string,
    organizationId: string,
    userId: string,
  ): Promise<OrganizationInvitation> {
    try {
      return await this.clerkClient.organizations.revokeOrganizationInvitation({
        invitationId,
        organizationId,
        requestingUserId: userId,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}

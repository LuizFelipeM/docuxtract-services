import { Organization } from '@clerk/backend';
import { PaginationParams } from '@libs/contracts/pagination-params';
import {
  SubscriptionCreatedDto,
  SubscriptionDeletedDto,
  SubscriptionUpdatedDto,
} from '@libs/contracts/payment';
import { Injectable, Logger } from '@nestjs/common';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { OrganizationsService } from '../organizations/organizations.service';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async handleCreatedSubscription(
    subscription: SubscriptionCreatedDto,
  ): Promise<void> {
    // const attributes = subscription.entitlements.reduce((prev, curr) => {
    //   if (curr.name === 'user_licenses') return prev;
    //   return { ...prev, [curr.name]: curr.attributes };
    // }, {});

    const organization = await this.createOrganization(subscription);

    await this.permissionsService.syncUser(organization.id, {
      id: subscription.user.id,
      email: subscription.user.email,
      attributes: { organization_id: organization.id },
    });
  }

  private async createOrganization(
    subscription: SubscriptionCreatedDto,
  ): Promise<Organization> {
    let organization = await this.organizationsService.getUserOrganization(
      subscription.user.id,
    );
    if (organization) return organization;

    const userLicensesEntitlement = subscription.entitlements.find(
      (e) => e.name === 'user_licenses',
    );
    if (!userLicensesEntitlement)
      throw new Error('No user licenses entitlement found');

    organization = await this.organizationsService.create(
      subscription.user.id,
      uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        length: 3,
        separator: ' ',
        style: 'capital',
      }),
      Number(userLicensesEntitlement.attributes.quantity),
    );

    this.logger.log(`Organization ${organization.id} created`);
    return organization;
  }

  async handleUpdatedSubscription(
    subscription: SubscriptionUpdatedDto,
  ): Promise<void> {
    this.logger.log(`Updated subscription`);
  }

  async handleDeletedSubscription(
    subscription: SubscriptionDeletedDto,
  ): Promise<void> {
    const organization = await this.organizationsService.getUserOrganization(
      subscription.user.id,
    );

    const limit = 25;
    let hasMore = false;
    let page = 1;
    let data: string[] = [];
    do {
      ({ data, hasMore } =
        await this.organizationsService.getOrganizationUserIds(
          organization.id,
          new PaginationParams({ limit, page }),
        ));

      data.forEach((userId) => {
        this.permissionsService.revokeUserPermissions(userId);
      });

      if (hasMore) page++;
    } while (hasMore);

    this.logger.log(`Deleted organization ${organization.id}`);
  }
}

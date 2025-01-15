import { PaginationParams } from '@libs/contracts/pagination-params';
import {
  SubscriptionCreatedDto,
  SubscriptionDeletedDto,
  SubscriptionUpdatedDto,
} from '@libs/contracts/payment';
import { SubscriptionStatus } from '@libs/contracts/payment/customer-subscription/subscription-status';
import { Injectable, Logger } from '@nestjs/common';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { CreateOrganizationDto } from '../organizations/dtos/create-organization.dto';
import { OrganizationsService } from '../organizations/organizations.service';
import { Role } from '../role';
import { UsersService } from '../users/users.service';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly usersService: UsersService,
  ) {}

  async handleCreatedSubscription(
    subscription: SubscriptionCreatedDto,
  ): Promise<void> {
    this.logger.log(`Created subscription`);
  }

  async handleUpdatedSubscription(
    subscription: SubscriptionUpdatedDto,
  ): Promise<void> {
    if (subscription.status !== SubscriptionStatus.active) return;

    const userLicensesEntitlement = subscription.entitlements.find(
      (e) => e.name === 'userLicenses',
    );
    if (!userLicensesEntitlement)
      throw new Error('No user licenses entitlement found');

    const createOrganization = new CreateOrganizationDto();

    createOrganization.userId = subscription.user.id;
    createOrganization.maxUsers = Number(
      userLicensesEntitlement.attributes.quantity,
    );
    createOrganization.name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      length: 3,
      separator: ' ',
      style: 'capital',
    });
    createOrganization.attributes = subscription.entitlements.reduce(
      (prev, curr) =>
        curr.name === 'userLicenses'
          ? prev
          : { ...prev, [curr.name]: curr.attributes },
      {},
    );

    const organization =
      await this.organizationsService.create(createOrganization);
    await this.usersService.sync({
      userId: subscription.user.id,
      organizationId: organization.id,
      email: subscription.user.email,
      roles: [Role.owner],
    });
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

      await Promise.all(
        data.map((userId) => {
          this.usersService.revokePermissions(userId, organization.id);
        }),
      );

      if (hasMore) page++;
    } while (hasMore);

    this.logger.log(`Deleted organization ${organization.id}`);
  }
}

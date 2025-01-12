import {
  Nack,
  RabbitPayload,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/common';
import {
  CustomerSubscriptionEvent,
  CustomerSubscriptionEvents,
} from '@libs/contracts/payment';
import { Controller, Logger } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller()
export class SubscriptionsController {
  private readonly logger = new Logger(SubscriptionsController.name);

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @RabbitSubscribe({
    exchange: Exchanges.events.name,
    routingKey: RoutingKeys.payment.customerSubscription.all,
    queue: 'user-management.subscriptions.events.customer.subscription',
  })
  async customerSubscriptionHandler(
    @RabbitPayload() { type, data }: CustomerSubscriptionEvent,
  ): Promise<void | Nack> {
    try {
      switch (type) {
        case CustomerSubscriptionEvents.created:
          return await this.subscriptionsService.handleCreatedSubscription(
            data,
          );
        case CustomerSubscriptionEvents.updated:
          return await this.subscriptionsService.handleUpdatedSubscription(
            data,
          );
        case CustomerSubscriptionEvents.deleted:
          return await this.subscriptionsService.handleDeletedSubscription(
            data,
          );
      }
    } catch (err) {
      this.logger.error(err);
      return new Nack();
    }
  }
}

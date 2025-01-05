import { Event } from '../../message-broker/event';
import { CustomerSubscriptionCreatedDto } from './customer-subscription-created.dto';

export * from './customer-subscription-created.dto';

export enum CustomerSubscriptionEvents {
  created = 'created',
  deleted = 'deleted',
  updated = 'updated',
}

export type CreatedCustomerSubscriptionEvent = Event<
  CustomerSubscriptionCreatedDto,
  CustomerSubscriptionEvents
>;

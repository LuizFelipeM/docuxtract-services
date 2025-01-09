import { Event } from '../../message-broker/event';
import { CustomerSubscriptionCreatedDto } from './customer-subscription-created.dto';
import { CustomerSubscriptionDeletedDto } from './customer-subscription-deleted.dto';
import { CustomerSubscriptionUpdatedDto } from './customer-subscription-updated.dto';

export * from './customer-subscription-created.dto';
export * from './customer-subscription-deleted.dto';
export * from './customer-subscription-updated.dto';

export enum CustomerSubscriptionEvents {
  created = 'created',
  deleted = 'deleted',
  updated = 'updated',
}

export type CreatedCustomerSubscriptionEvent = Event<
  CustomerSubscriptionCreatedDto,
  CustomerSubscriptionEvents.created
>;
export type DeletedCustomerSubscriptionEvent = Event<
  CustomerSubscriptionDeletedDto,
  CustomerSubscriptionEvents.deleted
>;
export type UpdatedCustomerSubscriptionEvent = Event<
  CustomerSubscriptionUpdatedDto,
  CustomerSubscriptionEvents.updated
>;

export type CustomerSubscriptionEvent =
  | CreatedCustomerSubscriptionEvent
  | DeletedCustomerSubscriptionEvent
  | UpdatedCustomerSubscriptionEvent;

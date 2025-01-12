import { Event } from '../../message-broker/event';
import { SubscriptionCreatedDto } from './subscription-created.dto';
import { SubscriptionDeletedDto } from './subscription-deleted.dto';
import { SubscriptionUpdatedDto } from './subscription-updated.dto';

export * from './subscription-created.dto';
export * from './subscription-deleted.dto';
export * from './subscription-updated.dto';

export enum CustomerSubscriptionEvents {
  created = 'created',
  deleted = 'deleted',
  updated = 'updated',
}

export type CreatedCustomerSubscriptionEvent = Event<
  SubscriptionCreatedDto,
  CustomerSubscriptionEvents.created
>;
export type DeletedCustomerSubscriptionEvent = Event<
  SubscriptionDeletedDto,
  CustomerSubscriptionEvents.deleted
>;
export type UpdatedCustomerSubscriptionEvent = Event<
  SubscriptionUpdatedDto,
  CustomerSubscriptionEvents.updated
>;

export type CustomerSubscriptionEvent =
  | CreatedCustomerSubscriptionEvent
  | DeletedCustomerSubscriptionEvent
  | UpdatedCustomerSubscriptionEvent;

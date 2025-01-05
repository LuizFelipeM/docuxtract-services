import { Event } from '../../message-broker/event';
import { CustomerSubscriptionCreatedDto } from './customer-subscription-created.dto';

export * from './customer-subscription-created.dto';

export enum CustomerSubscriptionEvents {
  created = 'created',
  deleted = 'deleted',
  updated = 'updated',
  paused = 'paused',
  resumed = 'resumed',
  trialWillEnd = 'trial_will_end',
  pendingUpdateApplied = 'pending_update_applied',
  pendingUpdateExpired = 'pending_update_expired',
}

export type CreatedCustomerSubscriptionEvent = Event<
  CustomerSubscriptionCreatedDto,
  CustomerSubscriptionEvents
>;

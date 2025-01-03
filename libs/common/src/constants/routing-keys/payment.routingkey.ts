import { RoutingKey } from '../routing-key';

export const paymentRtks = {
  customerSubscriptionCreated: new RoutingKey('customer.subscription.created'),
};

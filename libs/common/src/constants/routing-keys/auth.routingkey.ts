import { RoutingKey } from '../routing-key';

export enum AuthRoutingKey {
  Verify = 'auth.verify',
}

export const authRtks = {
  verify: new RoutingKey('auth.verify'),
};

import { RoutingKey } from '../routing-key';

export enum EmailIntRoutingKey {
  Send = 'email.send',
}

export const emailIntRtks = {
  send: new RoutingKey('email.send'),
  save: new RoutingKey('email.save'),
};

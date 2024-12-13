import { RoutingKey } from '../routing-key';

export enum CrmIntRoutingKey {
  Rpc = 'crm-int.rpc',
  Sub = 'crm-int.sub',
}

export const crmIntRtks = {
  rpc: new RoutingKey('crm-int.rpc'),
  sub: new RoutingKey('crm-int.sub'),
};

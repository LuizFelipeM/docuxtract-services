import { authRtks } from './auth.routingkey';
import { crmIntRtks } from './crm-int.routingkey';
import { emailIntRtks } from './email-int.routingkey';
import { paymentRtks } from './payment.routingkey';

export const RoutingKeys = {
  auth: authRtks,
  payment: paymentRtks,
  crmInt: crmIntRtks,
  emailInt: emailIntRtks,
};

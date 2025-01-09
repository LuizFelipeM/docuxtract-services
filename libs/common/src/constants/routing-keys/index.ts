import { authRtks } from './auth.routingkey';
import { crmIntRtks } from './crm-int.routingkey';
import { emailIntRtks } from './email-int.routingkey';
import { paymentRtks } from './payment.routingkey';
import { permissionRtks } from './permission.routingkey';

export const RoutingKeys = {
  auth: authRtks,
  permission: permissionRtks,
  payment: paymentRtks,
  crmInt: crmIntRtks,
  emailInt: emailIntRtks,
};

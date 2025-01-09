import {
  Nack,
  RabbitPayload,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/common';
import { CustomerSubscriptionEvent } from '@libs/contracts/payment';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get(':userId')
  async check(
    @Param('userId') userId: string,
    @Query('action') action: string,
    @Query('resource') resource: string,
  ) {
    return this.permissionService.check(userId, action, resource);
  }

  @RabbitSubscribe({
    exchange: Exchanges.events.name,
    routingKey: RoutingKeys.payment.customerSubscription.all,
    queue: 'permission.events.customer.subscription',
  })
  async customerSubscriptionHandler(
    @RabbitPayload() { type, data }: CustomerSubscriptionEvent,
  ): Promise<void | Nack> {}
}

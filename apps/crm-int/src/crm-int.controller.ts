import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/contracts';
import { Controller } from '@nestjs/common';
import { CrmIntService } from './crm-int.service';

@Controller()
export class CrmIntController {
  constructor(private readonly crmIntService: CrmIntService) {}

  @RabbitRPC({
    exchange: Exchanges.commands.name,
    routingKey: RoutingKeys.crmInt.rpc.value,
    queue: 'crm.rpc.queue',
  })
  // @UseGuards(JwtAuthGuard)
  async rpcHandler(msg: unknown): Promise<unknown> {
    this.crmIntService.log(msg);
    return msg;
  }

  @RabbitSubscribe({
    exchange: Exchanges.events.name,
    routingKey: RoutingKeys.crmInt.sub.value,
    queue: 'crm.sub.queue',
  })
  async subHandler(msg: unknown): Promise<void> {
    this.crmIntService.log(msg);
  }
}

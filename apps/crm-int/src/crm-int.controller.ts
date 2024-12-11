import { Controller, UseGuards } from '@nestjs/common';
import { CrmIntService } from './crm-int.service';
import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { CrmIntRoutingKey, Exchange } from '@libs/contracts';
import { JwtAuthGuard } from '@libs/common';

@Controller()
export class CrmIntController {
  constructor(private readonly crmIntService: CrmIntService) {}

  @RabbitRPC({
    exchange: Exchange.Commands.name,
    routingKey: CrmIntRoutingKey.Rpc,
    queue: 'crm.rpc.queue',
  })
  @UseGuards(JwtAuthGuard)
  async rpcHandler(msg: unknown): Promise<unknown> {
    this.crmIntService.log(msg);
    return msg;
  }

  @RabbitSubscribe({
    exchange: Exchange.Events.name,
    routingKey: CrmIntRoutingKey.Sub,
    queue: 'crm.sub.queue',
  })
  async subHandler(msg: unknown): Promise<void> {
    this.crmIntService.log(msg);
  }
}

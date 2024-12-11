import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { SendEmailDto } from '../../../libs/contracts/src/dtos/send-email.dto';
import { JwtAuthGuard } from '@libs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/contracts';

@Controller('orchestrator')
export class OrchestratorController {
  constructor(
    private readonly orchestratorService: OrchestratorService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  // @Post()
  // @UseGuards(JwtAuthGuard)
  // async sendEmail(@Body() request: SendEmailDto): Promise<void> {
  //   await this.orchestratorService.sendEmail(request);
  // }

  @Post('rpc')
  @UseGuards(JwtAuthGuard)
  async sendRpc(@Body() payload: unknown): Promise<unknown> {
    return await this.amqpConnection.request<unknown>({
      exchange: Exchanges.commands.name,
      routingKey: RoutingKeys.crmInt.rpc.value,
      payload,
      timeout: 10000,
    });
  }

  @Post('publish')
  async publish(@Body() payload: unknown) {
    this.amqpConnection.publish(
      Exchanges.events.name,
      RoutingKeys.crmInt.sub.value,
      payload,
    );
  }
}

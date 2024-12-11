import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { SendEmailDto } from '../../../libs/contracts/src/dtos/send-email.dto';
import { JwtAuthGuard } from '@libs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CrmIntRoutingKey, Exchange } from '@libs/contracts';

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
      exchange: Exchange.Commands.name,
      routingKey: CrmIntRoutingKey.Rpc,
      payload,
      timeout: 10000,
    });
  }

  @Post('publish')
  async publish(@Body() payload: unknown) {
    this.amqpConnection.publish(
      Exchange.Events.name,
      CrmIntRoutingKey.Sub,
      payload,
    );
  }
}

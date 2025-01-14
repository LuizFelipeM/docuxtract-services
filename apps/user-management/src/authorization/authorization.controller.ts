import { Nack, RabbitPayload, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/common';
import { AuthorizationCheckDto } from '@libs/contracts/authorization';
import {
  CommandRequest,
  CommandResponse,
} from '@libs/contracts/message-broker';
import { Controller, Logger } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';

@Controller()
export class AuthorizationController {
  private readonly logger = new Logger(AuthorizationController.name);

  constructor(private readonly authorizationService: AuthorizationService) {}

  @RabbitRPC({
    exchange: Exchanges.commands.name,
    routingKey: RoutingKeys.authorization.check.all,
    queue: 'authorization.commands.check',
  })
  async check(
    @RabbitPayload() command: CommandRequest<AuthorizationCheckDto>,
  ): Promise<CommandResponse<boolean> | Nack> {
    try {
      return command.response(
        await this.authorizationService.check(
          command.data.userId,
          command.data.action,
          command.data.resource,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      return new Nack();
    }
  }
}

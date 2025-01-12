import { User } from '@clerk/backend';
import { JwtPayload } from '@clerk/types';
import { RabbitPayload, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/common';
import { AuthVerifyDto, GetUserDto } from '@libs/contracts/auth';
import {
  CommandRequest,
  CommandResponse,
} from '@libs/contracts/message-broker';
import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @RabbitRPC({
    exchange: Exchanges.commands.name,
    routingKey: RoutingKeys.auth.getUser.all,
    queue: 'auth.commands.user',
  })
  async getUser(
    @RabbitPayload() command: CommandRequest<GetUserDto>,
  ): Promise<CommandResponse<User>> {
    try {
      const user = await this.authService.getUserById(command.data.userId);
      return command.response(user);
    } catch (err) {
      this.logger.error(err);
      return command.response(err);
    }
  }

  @RabbitRPC({
    exchange: Exchanges.commands.name,
    routingKey: RoutingKeys.auth.verify.all,
    queue: 'auth.commands.verify',
  })
  async verify(
    @RabbitPayload() command: CommandRequest<AuthVerifyDto>,
  ): Promise<CommandResponse<JwtPayload>> {
    try {
      const jwt = await this.authService.verify(command.data.authorization);
      return command.response(jwt);
    } catch (err) {
      this.logger.error(err);
      return command.response(err);
    }
  }
}

import { User } from '@clerk/backend';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/common';
import { AuthVerifyDto } from '@libs/contracts/auth';
import { RPCMessage } from '@libs/contracts/rpc';
import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @RabbitRPC({
    exchange: Exchanges.commands.name,
    routingKey: RoutingKeys.auth.verify.value,
    queue: 'auth.commands',
  })
  async verifyToken(data: AuthVerifyDto): Promise<RPCMessage<User>> {
    try {
      const jwt = await this.authService.verify(data.authorization);
      const user = await this.authService.getUser(jwt.sub);
      return RPCMessage.build(user);
    } catch (err) {
      this.logger.error(err);
      return RPCMessage.build(err);
    }
  }
}

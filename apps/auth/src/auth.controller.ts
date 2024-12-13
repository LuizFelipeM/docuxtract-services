import { User } from '@clerk/backend';
import { Nack, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/common';
import { AuthVerifyDto } from '@libs/contracts/auth';
import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @RabbitRPC({
    exchange: Exchanges.commands.name,
    routingKey: RoutingKeys.auth.verify.value,
    queue: 'auth.commands',
  })
  async verifyToken(data: AuthVerifyDto): Promise<User | Nack> {
    try {
      const jwt = await this.authService.verify(data.authorization);
      const user = await this.authService.getUser(jwt.sub);
      return user;
    } catch (err) {
      this.logger.error(err);
      return new Nack();
    }
  }
}

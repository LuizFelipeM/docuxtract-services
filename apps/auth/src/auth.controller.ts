import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { AuthRoutingKey, Exchange } from '@libs/contracts';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @RabbitRPC({
    exchange: Exchange.Commands.name,
    routingKey: AuthRoutingKey.Verify,
    queue: 'auth.commands',
  })
  async verifyToken(data: any): Promise<any> {
    this.logger.log(data);
    const jwt = await this.authService.verify(data.authorization);
    this.logger.log(jwt);
    const user = await this.authService.getUser(jwt.sub);
    this.logger.log(user);
    return user;
  }
}

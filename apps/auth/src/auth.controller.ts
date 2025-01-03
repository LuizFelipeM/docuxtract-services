import { User } from '@clerk/backend';
import { Nack, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/common';
import { AuthVerifyDto } from '@libs/contracts/auth';
import {
  CommandRequest,
  CommandResponse,
  Event,
} from '@libs/contracts/message-broker';
import { CustomerSubscriptionCreatedDto } from '@libs/contracts/payment';
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
  async verifyToken(
    command: CommandRequest<AuthVerifyDto>,
  ): Promise<CommandResponse<User>> {
    try {
      const jwt = await this.authService.verify(command.data.authorization);
      const user = await this.authService.getUserById(jwt.sub);
      return command.response(user);
    } catch (err) {
      this.logger.error(err);
      return command.response(err);
    }
  }

  @RabbitSubscribe({
    exchange: Exchanges.events.name,
    routingKey: RoutingKeys.payment.customerSubscriptionCreated.value,
    queue: 'auth.events.customer',
  })
  async customerSubscriptionUpdate(
    event: Event<CustomerSubscriptionCreatedDto>,
  ): Promise<void | Nack> {
    try {
      const { data } = event;
      const user = await this.authService.getUserByEmail(data.customer.email);
      if (!user)
        throw new Error(`User with e-mail ${data.customer.email} not found!`);

      await this.authService.updateUserPublicMetadata(user.id, {
        subscription: {
          cId: data.customer.id,
          clm: data.claims,
          sts: data.status,
          exp: new Date(data.expiresAt).getTime(),
        },
      });
    } catch (err) {
      this.logger.error(err);
      return new Nack();
    }
  }
}

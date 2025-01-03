import { User } from '@clerk/backend';
import { Nack, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/common';
import { AuthVerifyDto } from '@libs/contracts/auth';
import { CustomerSubscriptionCreatedDto } from '@libs/contracts/payment';
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
      const user = await this.authService.getUserById(jwt.sub);
      return RPCMessage.build(user);
    } catch (err) {
      this.logger.error(err);
      return RPCMessage.build(err);
    }
  }

  @RabbitSubscribe({
    exchange: Exchanges.events.name,
    routingKey: RoutingKeys.payment.customerSubscriptionCreated.value,
    queue: 'auth.events.customer',
  })
  async customerSubscriptionUpdate(
    data: CustomerSubscriptionCreatedDto,
  ): Promise<void | Nack> {
    try {
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

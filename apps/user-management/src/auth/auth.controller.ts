import { User } from '@clerk/backend';
import { JwtPayload } from '@clerk/types';
import {
  Nack,
  RabbitPayload,
  RabbitRPC,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Exchanges, RoutingKeys } from '@libs/common';
import { AuthVerifyDto, GetUserDto } from '@libs/contracts/auth';
import {
  CommandRequest,
  CommandResponse,
} from '@libs/contracts/message-broker';
import {
  CustomerSubscriptionCreatedDto,
  CustomerSubscriptionEvent,
  CustomerSubscriptionEvents,
} from '@libs/contracts/payment';
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

  @RabbitSubscribe({
    exchange: Exchanges.events.name,
    routingKey: RoutingKeys.payment.customerSubscription.all,
    queue: 'auth.events.customer.subscription',
  })
  async customerSubscriptionHandler(
    @RabbitPayload() { type, data }: CustomerSubscriptionEvent,
  ): Promise<void | Nack> {
    try {
      switch (type) {
        case CustomerSubscriptionEvents.created:
          return await this.newCustomerSubscription(data);
        case CustomerSubscriptionEvents.deleted:
          break;
        case CustomerSubscriptionEvents.updated:
          break;
      }
    } catch (err) {
      this.logger.error(err);
      return new Nack();
    }
  }

  private async newCustomerSubscription(
    subscription: CustomerSubscriptionCreatedDto,
  ): Promise<void> {
    await this.authService.updateUserPublicMetadata(subscription.user.id, {
      subs: {
        cid: subscription.customer.id,
        sts: subscription.status,
        exp: new Date(subscription.expiresAt).getTime(),
      },
    });
  }
}

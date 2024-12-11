import { User } from '@clerk/backend';
import { AmqpConnection, isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import { RoutingKeys, Exchanges } from '@libs/contracts';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    try {
      let user = this.getUser(ctx);
      if (user) return true;

      const authorization = this.getAuthorization(ctx);
      user = await this.amqpConnection.request<any>({
        exchange: Exchanges.commands.name,
        routingKey: RoutingKeys.auth.verify.value,
        payload: { authorization },
        timeout: 5000,
      });
      this.addUser(ctx, user);
      return true;
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException();
    }
  }

  private getUser(ctx: ExecutionContext): User | undefined {
    if (isRabbitContext(ctx)) {
      return ctx.getArgByIndex(0).user;
    }
  }

  private getAuthorization(ctx: ExecutionContext): string {
    switch (ctx.getType<'http' | 'rmq'>()) {
      case 'http':
        const req = ctx.switchToHttp().getRequest();
        this.logger.log(req.headers);
        return (
          req.headers['authorization']?.split(' ')[1] ??
          req.headers['Authorization']?.split(' ')[1] ??
          req.cookie?.__session
        );
      case 'rmq':
        return ctx.getArgByIndex(0).authorization;
      default:
        throw new Error(`Unsupported ${ctx.getType()} request type`);
    }
  }

  private addUser(ctx: ExecutionContext, user) {
    switch (ctx.getType<'http' | 'rmq'>()) {
      case 'http':
        ctx.switchToHttp().getRequest().user = user;
        break;

      case 'rmq':
        // Using reference to add content to the payload
        const payload = ctx.getArgByIndex(0);
        payload.user = user;
        ctx.getArgByIndex(1).content = Buffer.from(JSON.stringify(payload));
        break;

      default:
        throw new Error(`Unsupported ${ctx.getType()} request type`);
    }
  }
}

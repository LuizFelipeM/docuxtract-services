import { User } from '@clerk/backend';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RoutingKeys } from '../../constants/routing-keys';
import { RmqService } from '../../rmq/rmq.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly rmqService: RmqService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    try {
      const authorization = this.getAuthorization(ctx);
      const user = await this.rmqService.rpc<User>({
        routingKey: RoutingKeys.auth.verify,
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

  private getAuthorization(ctx: ExecutionContext): string {
    if (ctx.getType() === 'http') {
      const req = ctx.switchToHttp().getRequest();
      return (
        req.headers['authorization']?.split(' ')[1] ??
        req.headers['Authorization']?.split(' ')[1] ??
        req.cookie?.__session
      );
    }

    throw new Error(`Unsupported ${ctx.getType()} request type`);
  }

  private addUser(ctx: ExecutionContext, user: User) {
    if (ctx.getType() === 'http') {
      ctx.switchToHttp().getRequest().user = user;
      return;
    }

    throw new Error(`Unsupported ${ctx.getType()} request type`);
  }
}

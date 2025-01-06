import { JwtPayload } from '@clerk/types';
import { AuthVerifyDto } from '@libs/contracts/auth';
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
      const payload = new AuthVerifyDto();
      payload.authorization = this.getAuthorization(ctx);

      const { success, error, data } = await this.rmqService.request<
        AuthVerifyDto,
        JwtPayload,
        string
      >({
        routingKey: RoutingKeys.auth.verify,
        payload,
        type: 'abacate',
        timeout: 5000,
      });

      if (!success) throw error;

      this.addJWT(ctx, data);
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

  private addJWT(ctx: ExecutionContext, jwt: JwtPayload): void {
    if (ctx.getType() === 'http') {
      ctx.switchToHttp().getRequest().jwt = jwt;
      return;
    }

    throw new Error(`Unsupported ${ctx.getType()} request type`);
  }
}

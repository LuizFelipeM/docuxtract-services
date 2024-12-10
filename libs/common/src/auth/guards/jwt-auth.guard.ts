import { Services } from '@libs/contracts';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject(Services.Auth) private readonly authClient: ClientProxy,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const authorization = this.getAuthorization(ctx);
    try {
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'auth.verify' }, { authorization }),
      );
      this.addUser(ctx, user);
      return true;
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException();
    }
  }

  private getAuthorization(ctx: ExecutionContext): string {
    switch (ctx.getType()) {
      case 'http':
        const req = ctx.switchToHttp().getRequest();
        return (
          req.headers['authorization']?.split(' ')[1] ??
          req.headers['Authorization']?.split(' ')[1] ??
          req.cookie?.__session
        );
      case 'rpc':
        return ctx.switchToRpc().getData().authorization;
      default:
        throw new Error(`Unsupported ${ctx.getType()} request type`);
    }
  }

  private addUser(ctx: ExecutionContext, user) {
    switch (ctx.getType()) {
      case 'http':
        ctx.switchToHttp().getRequest().user = user;
        break;

      case 'rpc':
        ctx.switchToRpc().getData().user = user;
        break;

      default:
        throw new Error(`Unsupported ${ctx.getType()} request type`);
    }
  }
}

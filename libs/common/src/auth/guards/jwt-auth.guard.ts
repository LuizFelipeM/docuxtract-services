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
import { tap, catchError } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject(Services.Auth) private readonly authClient: ClientProxy,
  ) {}

  canActivate(ctx: ExecutionContext) {
    const authorization = this.getAuthorization(ctx);
    return this.authClient.send('verify', { authorization }).pipe(
      tap(this.addUser(ctx)),
      catchError((err) => {
        console.log(err);
        this.logger.error(err);
        throw new UnauthorizedException();
      }),
    );
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

  private addUser(ctx: ExecutionContext) {
    return (user) => {
      console.log(user);
      switch (ctx.getType()) {
        case 'http':
          ctx.switchToHttp().getRequest().user = user;
          return;

        case 'rpc':
          ctx.switchToRpc().getData().user = user;
          return;

        default:
          throw new Error(`Unsupported ${ctx.getType()} request type`);
      }
    };
  }
}

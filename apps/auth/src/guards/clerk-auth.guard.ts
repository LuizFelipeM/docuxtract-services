import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    try {
      const request = ctx.switchToHttp().getRequest();
      const token =
        request.headers['authorization']?.split(' ')[1] ??
        request.headers['Authorization']?.split(' ')[1] ??
        request.cookie?.__session;

      const jwt = await this.authService.verify(token);
      return !!jwt;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }
}

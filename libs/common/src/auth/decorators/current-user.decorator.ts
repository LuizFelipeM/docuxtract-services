import { User } from '@clerk/backend';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator<User>(
  (_: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      return ctx.switchToHttp().getRequest().user;
    }

    throw new Error(`Unsupported ${ctx.getType()} request type`);
  },
);

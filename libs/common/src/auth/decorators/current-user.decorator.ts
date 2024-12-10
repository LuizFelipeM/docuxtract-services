import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    switch (ctx.getType()) {
      case 'http':
        return ctx.switchToHttp().getRequest().user;
      case 'rpc':
        return ctx.switchToRpc().getData().user;
      default:
        throw new Error(`Unsupported ${ctx.getType()} request type`);
    }
  },
);

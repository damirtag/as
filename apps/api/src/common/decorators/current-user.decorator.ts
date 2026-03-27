import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@as/contracts';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const type = context.getType<string>();

    if (type === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext<{ req: { user: User } }>().req.user;
    }

    return context.switchToHttp().getRequest<{ user: User }>().user;
  },
);

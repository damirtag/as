import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const ctxType = context.getType<'graphql' | 'http'>();

    if (ctxType === 'http') {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (isPublic) return true;
    }

    if (ctxType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const resolver = gqlCtx.getHandler();
      const resolverClass = gqlCtx.getClass();

      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [resolver, resolverClass],
      );

      if (isPublic) return true;
    }

    return super.canActivate(context);
  }

  override getRequest(context: ExecutionContext) {
    const ctxType = context.getType<'graphql' | 'http'>();
    if (ctxType === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext<{ req: any }>().req;
    }
    return context.switchToHttp().getRequest();
  }
}

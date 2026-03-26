import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Allow GraphQL requests through by extracting req from GQL context
  override getRequest(context: ExecutionContext) {
    const type = context.getType<string>();
    if (type === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext<{ req: unknown }>().req;
    }
    return context.switchToHttp().getRequest();
  }
}

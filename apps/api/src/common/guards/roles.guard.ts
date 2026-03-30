import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';

import { Role } from '@as/contracts';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctxType = context.getType<'graphql' | 'http'>();

    if (ctxType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const resolver = gqlCtx.getHandler();
      const resolverClass = gqlCtx.getClass();

      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [resolver, resolverClass],
      );
      if (isPublic) return true;

      const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        resolver,
        resolverClass,
      ]);

      // No RBAC metadata -> allow.
      if (!roles || roles.length === 0) return true;

      const req = gqlCtx.getContext<{ req: any }>().req;
      const user = req?.user as { role?: Role } | undefined;
      const role = user?.role;

      if (!role) throw new UnauthorizedException('Unauthorized');
      if (!roles.includes(role)) throw new ForbiddenException('Forbidden');
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No RBAC metadata -> allow.
    if (!roles || roles.length === 0) return true;

    const req = context.switchToHttp().getRequest<{ user?: { role?: Role } }>();
    const role = req.user?.role;

    if (!role) throw new UnauthorizedException('Unauthorized');
    if (!roles.includes(role)) throw new ForbiddenException('Forbidden');
    return true;
  }
}

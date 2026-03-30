import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { Role } from '@as/contracts';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { OWNER_KEY, type OwnerMetadata } from '../decorators/owner.decorator';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctxType = context.getType<'graphql' | 'http'>();
    if (ctxType !== 'graphql') return true;

    const gqlCtx = GqlExecutionContext.create(context);
    const resolver = gqlCtx.getHandler();
    const resolverClass = gqlCtx.getClass();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      resolver,
      resolverClass,
    ]);
    if (isPublic) return true;

    const meta = this.reflector.getAllAndOverride<OwnerMetadata>(OWNER_KEY, [
      resolver,
      resolverClass,
    ]);
    if (!meta) return true;

    const fieldName = gqlCtx.getInfo().fieldName;
    // Protect only base CRUD mutations (pattern-based).
    if (!fieldName.startsWith('update') && !fieldName.startsWith('delete')) {
      return true;
    }

    const { id } = gqlCtx.getArgs<{ id?: string }>();
    if (!id) return true;

    const req = gqlCtx.getContext<{ req: any }>().req;
    const user = req?.user as { id?: string; role?: Role } | undefined;
    if (!user?.id) throw new UnauthorizedException('Unauthorized');
    if (user.role === Role.ADMIN) return true;

    const repo = this.dataSource.getRepository(meta.entity as any);
    const entity = await repo.findOne({ where: { id } as any });
    if (!entity) return true;

    const ownerId = (entity as any)[meta.ownerField] as string | undefined;
    if (!ownerId) return true;

    if (ownerId !== user.id) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}


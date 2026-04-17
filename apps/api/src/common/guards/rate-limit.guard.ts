import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { CacheClientService } from '@as/cache-client';
import {
  RATE_LIMIT_KEY,
  RateLimitRule,
} from '../decorators/rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly cache: CacheClientService,
    private readonly reflector: Reflector,
  ) {}

  private async limitOrThrow(key: string, limit: number, windowSec: number) {
    const count = await this.cache.incr(key);

    if (count === 1) {
      await this.cache.expire(key, windowSec);
    }

    if (count > limit) {
      throw new BadRequestException('Too many requests');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RateLimitRule[]>(
        RATE_LIMIT_KEY,
        context.getHandler(),
      ) || [];

    if (!rules.length) return true;

    const gql = GqlExecutionContext.create(context);
    const { req } = gql.getContext();

    const ctx = {
      user: req.user,
      ip:
        req.headers['x-forwarded-for'] ??
        req.socket?.remoteAddress ??
        'unknown',
    };

    for (const rule of rules) {
      const key = rule.key(ctx);

      await this.limitOrThrow(key, rule.limit, rule.windowSec);
    }

    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
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
  private readonly logger = new Logger(RateLimitGuard.name);

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
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return count;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RateLimitRule[]>(
        RATE_LIMIT_KEY,
        context.getHandler(),
      ) || [];

    if (!rules.length) return true;

    const req =
      context.getType<'graphql' | 'http'>() === 'graphql'
        ? GqlExecutionContext.create(context).getContext<{ req: any }>().req
        : context.switchToHttp().getRequest();

    const forwardedFor = req.headers?.['x-forwarded-for'];
    const ip = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        'unknown';
    const operation =
      context.getType<'graphql' | 'http'>() === 'graphql'
        ? context.getHandler().name
        : `${req.method} ${req.originalUrl ?? req.url}`;

      this.logger.log(`Rate limit check: ip=${ip} operation=${operation}`);

    const ctx = {
      user: req.user,
      ip,
    };

    for (const rule of rules) {
      const key = rule.key(ctx);

      const count = await this.limitOrThrow(key, rule.limit, rule.windowSec);
      this.logger.log(
        `Rate limit request: ip=${ip} operation=${operation} count=${count}/${rule.limit}`,
      );
    }

    return true;
  }
}

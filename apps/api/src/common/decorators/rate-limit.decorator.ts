import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rate_limit_rules';

export type RateLimitRule = {
  key: (ctx: any) => string;
  limit: number;
  windowSec: number;
};

export const RateLimit = (...rules: RateLimitRule[]) =>
  SetMetadata(RATE_LIMIT_KEY, rules);

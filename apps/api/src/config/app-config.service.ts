import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get port(): number {
    return this.config.get<number>('PORT', 4000);
  }

  get nodeEnv(): string {
    return this.config.get<string>('NODE_ENV', 'development');
  }

  get isDev(): boolean {
    return this.nodeEnv === 'development';
  }

  get dbHost(): string {
    return this.config.getOrThrow<string>('DB_HOST');
  }

  get dbPort(): number {
    return this.config.get<number>('DB_PORT', 5432);
  }

  get dbUser(): string {
    return this.config.getOrThrow<string>('DB_USER');
  }

  get dbPassword(): string {
    return this.config.getOrThrow<string>('DB_PASS');
  }

  get dbName(): string {
    return this.config.getOrThrow<string>('DB_NAME');
  }

  get redisHost(): string {
    return this.config.get<string>('REDIS_HOST', 'localhost');
  }

  get redisPort(): number {
    return this.config.get<number>('REDIS_PORT', 6379);
  }

  get redisPassword(): string | undefined {
    return this.config.get<string>('REDIS_PASS');
  }

  get redisDb(): number {
    return this.config.get<number>('REDIS_DB', 0);
  }

  get redisKeyPrefix(): string {
    return this.config.get<string>('REDIS_KEY_PREFIX', 'quoting:');
  }

  get redisTtl(): number {
    return this.config.get<number>('REDIS_TTL', 3600);
  }

  get jwtSecret(): string {
    return this.config.getOrThrow<string>('JWT_SECRET');
  }

  get jwtAccessTtl(): string {
    return this.config.get<string>('JWT_ACCESS_TTL', '30m');
  }

  get jwtRefreshTtl(): string {
    return this.config.get<string>('JWT_REFRESH_TTL', '30d');
  }
}

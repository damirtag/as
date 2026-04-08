import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from "@nestjs/common";
import Redis from "ioredis";
import type { CacheClientOptions } from "./cache-client.options";

@Injectable()
export class CacheClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheClientService.name);
  private client!: Redis;

  constructor(private readonly options: CacheClientOptions) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.options.host,
      port: this.options.port,
      password: this.options.password,
      db: this.options.db ?? 0,
      keyPrefix: this.options.keyPrefix ?? "quoting:",
      lazyConnect: true,
    });

    this.client.on("connect", () => this.logger.log("Redis connected"));
    this.client.on("error", (err) => this.logger.error("Redis error", err));
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  // ─── Core helpers ──────────────────────────────────────────────────────────

  async get<T = string>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const serialized =
      typeof value === "string" ? value : JSON.stringify(value);
    const effectiveTtl = ttl ?? this.options.ttl;
    if (effectiveTtl) {
      await this.client.set(key, serialized, "EX", effectiveTtl);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async delByPattern(pattern: string): Promise<void> {
    // Use SCAN instead of KEYS to avoid blocking
    const stream = this.client.scanStream({ match: pattern, count: 100 });
    const pipeline = this.client.pipeline();
    stream.on("data", (keys: string[]) => {
      for (const key of keys) pipeline.del(key);
    });
    await new Promise<void>((resolve, reject) => {
      stream.on("end", () =>
        pipeline
          .exec()
          .then(() => resolve())
          .catch(reject),
      );
      stream.on("error", reject);
    });
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  // ─── Hash helpers ──────────────────────────────────────────────────────────

  async hset(key: string, field: string, value: unknown): Promise<void> {
    await this.client.hset(key, field, JSON.stringify(value));
  }

  async hget<T = unknown>(key: string, field: string): Promise<T | null> {
    const raw = await this.client.hget(key, field);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  async hdel(key: string, field: string): Promise<void> {
    await this.client.hdel(key, field);
  }
}

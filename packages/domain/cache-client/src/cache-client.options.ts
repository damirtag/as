export interface CacheClientOptions {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  ttl?: number; // default TTL in seconds
}

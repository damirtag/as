import { Injectable } from '@nestjs/common';
import { CacheClientService } from '@as/cache-client';
import { UserService } from '../users/users.service';

export const PRESENCE_TTL_SECONDS = 70;

@Injectable()
export class PresenceService {
  constructor(
    private readonly cacheClient: CacheClientService,
    private readonly userService: UserService,
  ) {}

  async connect(userId: string, socketId: string): Promise<void> {
    const client = this.cacheClient.getClient();
    await client.set(this.socketKey(socketId), userId, 'EX', PRESENCE_TTL_SECONDS);
    await client.sadd(this.userSocketsKey(userId), socketId);
  }

  async heartbeat(userId: string, socketId: string): Promise<boolean> {
    const client = this.cacheClient.getClient();
    const key = this.socketKey(socketId);
    const owner = await client.get(key);
    if (owner !== userId) return false;

    await client.expire(key, PRESENCE_TTL_SECONDS);
    return true;
  }

  async disconnect(
    userId: string,
    socketId: string,
  ): Promise<{ isOnline: boolean; lastSeenAt: Date | null }> {
    const client = this.cacheClient.getClient();
    await client.del(this.socketKey(socketId));
    await client.srem(this.userSocketsKey(userId), socketId);

    const isOnline = await this.hasActiveSocket(userId);
    if (isOnline) return { isOnline: true, lastSeenAt: null };

    const lastSeenAt = new Date();
    await this.userService.markLastSeen(userId, lastSeenAt);
    await client.del(this.userSocketsKey(userId));
    return { isOnline: false, lastSeenAt };
  }

  async getStatus(userId: string): Promise<{
    isOnline: boolean;
    lastSeenAt: Date | null;
  }> {
    const isOnline = await this.hasActiveSocket(userId);
    if (isOnline) return { isOnline: true, lastSeenAt: null };

    const user = await this.userService.findByIdOrFail(userId);
    return { isOnline: false, lastSeenAt: user.lastSeenAt ?? null };
  }

  private async hasActiveSocket(userId: string): Promise<boolean> {
    const client = this.cacheClient.getClient();
    const setKey = this.userSocketsKey(userId);
    const socketIds = await client.smembers(setKey);
    if (!socketIds.length) return false;

    const socketKeys = socketIds.map((socketId) => this.socketKey(socketId));
    const activeOwners = await client.mget(...socketKeys);
    const activeSocketIds = socketIds.filter(
      (_, index) => activeOwners[index] === userId,
    );
    const staleSocketIds = socketIds.filter(
      (_, index) => activeOwners[index] !== userId,
    );

    if (staleSocketIds.length) {
      await client.srem(setKey, ...staleSocketIds);
    }
    return activeSocketIds.length > 0;
  }

  private socketKey(socketId: string): string {
    return `presence:socket:${socketId}`;
  }

  private userSocketsKey(userId: string): string {
    return `presence:user:${userId}:sockets`;
  }
}
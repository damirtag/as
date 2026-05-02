import { Injectable } from '@nestjs/common';
import { User } from '@as/contracts';
import { BaseService } from '@as/base';
import { UserRepository } from './users.repository';
import { CacheClientService } from '@as/cache-client';
import { reviveDates } from '@/utils';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cacheClient: CacheClientService,
  ) {
    super(userRepository);
  }

  async findByUsername(username: string): Promise<User | null> {
    const cacheKey = `user:username:${username}`;
    const cached: User | null = await this.cacheClient.get(cacheKey);
    if (cached) {
      console.log('Cache hit for user by username');
      return reviveDates(cached);
    }
    const user = await this.userRepository.findByUsername(username);
    await this.cacheClient.set(cacheKey, user);
    return user;
  }
}

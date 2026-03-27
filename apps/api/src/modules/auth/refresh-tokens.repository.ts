import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RefreshTokens } from '@as/contracts';
import { BaseRepository } from '@as/base';

@Injectable()
export class RefreshTokensRepository extends BaseRepository<RefreshTokens> {
  constructor(repo: Repository<RefreshTokens>) {
    super(repo);
  }

  async revoke(token: string): Promise<void> {
    await this.repo.update({ token }, { revoked: true });
  }

  async revokeAllForUser(userId: string) {
    await this.repo.update({ user: { id: userId } } as any, { revoked: true });
  }
}

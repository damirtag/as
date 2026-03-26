import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokens } from '@as/contracts';
import { BaseRepository } from '@as/base';

@Injectable()
export class RefreshTokensRepository extends BaseRepository<RefreshTokens> {
  constructor(
    @InjectRepository(RefreshTokens)
    repo: Repository<RefreshTokens>,
  ) {
    super(repo);
  }

  async revokeAllForUser(userId: string) {
    await this.repo.update({ user: { id: userId } } as any, { revoked: true });
  }
}

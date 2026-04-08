import { Injectable } from '@nestjs/common';
import {
  Comment,
  IPaginationInput,
  Quote,
  Reaction,
  User,
} from '@as/contracts';
import { BaseService } from '@as/base';
import { CacheClientService } from '@as/cache-client';
import { ReactionRepository } from './reactions.repository';

@Injectable()
export class ReactionService extends BaseService<Reaction> {
  constructor(
    private readonly reactionRepository: ReactionRepository,
    private readonly cacheClient: CacheClientService,
  ) {
    super(reactionRepository);
  }

  async getQuoteReactionsSummary(quoteId: string) {
    const cacheKey = `quote:reactions:summary:${quoteId}`;
    const cached = await this.cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }
    const summary =
      await this.reactionRepository.getQuoteReactionsSummary(quoteId);
    await this.cacheClient.set(cacheKey, summary);
    return summary;
  }

  async findQuoteReactionsPaginated(
    quoteId: string,
    pagination: IPaginationInput,
  ) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const cacheKey = `quote:reactions:paginated:${quoteId}:${page}:${limit}`;
    const cached = await this.cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }
    const result = await this.reactionRepository.findQuoteReactionsPaginated(
      quoteId,
      pagination,
    );
    await this.cacheClient.set(cacheKey, result);
    return result;
  }

  override async create(
    data: Partial<Reaction> & {
      userId?: string;
      quoteId?: string;
      commentId?: string;
    },
  ): Promise<Reaction> {
    const { userId, quoteId, commentId, ...rest } = data;

    const reaction = await this.reactionRepository.create({
      ...rest,
      ...(userId ? ({ userId, user: { id: userId } as User } as never) : {}),
      ...(quoteId
        ? ({ quoteId, quote: { id: quoteId } as Quote } as never)
        : {}),
      ...(commentId
        ? ({ commentId, comment: { id: commentId } as Comment } as never)
        : {}),
    });

    // Invalidate cache for the quote
    if (quoteId) {
      await this.invalidateQuoteReactionCache(quoteId);
    }

    return reaction;
  }

  override async updateOrFail(
    id: string,
    data: Partial<Reaction>,
  ): Promise<Reaction> {
    const reaction = await this.findByIdOrFail(id);
    const updated = await super.updateOrFail(id, data);
    if (reaction.quoteId) {
      await this.invalidateQuoteReactionCache(reaction.quoteId);
    }
    return updated;
  }

  override async deleteOrFail(id: string): Promise<void> {
    const reaction = await this.findByIdOrFail(id);
    await super.deleteOrFail(id);
    if (reaction.quoteId) {
      await this.invalidateQuoteReactionCache(reaction.quoteId);
    }
  }

  private async invalidateQuoteReactionCache(quoteId: string): Promise<void> {
    const summaryKey = `quote:reactions:summary:${quoteId}`;
    const paginatedPattern = `quote:reactions:paginated:${quoteId}:*`;
    await Promise.all([
      this.cacheClient.del(summaryKey),
      this.cacheClient.delByPattern(paginatedPattern),
    ]);
  }
}

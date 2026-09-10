import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  IPaginationInput,
  IPaginatedResult,
  Reaction,
  ReactionType,
} from '@as/contracts';
import { BaseRepository } from '@as/base';

@Injectable()
export class ReactionRepository extends BaseRepository<Reaction> {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {
    super(reactionRepository);
  }

  async findQuoteReactionByUserAndType(
    userId: string,
    quoteId: string,
    type: ReactionType,
  ): Promise<Reaction | null> {
    return this.repo.findOne({
      where: { userId, quoteId, type, commentId: IsNull() },
    });
  }

  async getQuoteReactionsSummary(quoteId: string): Promise<{
    totalCount: number;
    counts: Array<{ type: ReactionType; count: number }>;
  }> {
    const rows = await this.repo
      .createQueryBuilder('reaction')
      .select('reaction.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('reaction.quoteId = :quoteId', { quoteId })
      .andWhere('reaction.commentId IS NULL')
      .groupBy('reaction.type')
      .getRawMany<{ type: ReactionType; count: string }>();

    const counts = rows.map((row) => ({
      type: row.type,
      count: Number(row.count),
    }));

    const totalCount = counts.reduce((sum, c) => sum + c.count, 0);

    return { totalCount, counts };
  }

  async getQuoteReactionsSummaries(quoteIds: string[]) {
    const rows = await this.repo
      .createQueryBuilder('reaction')
      .select('reaction.quoteId', 'quoteId')
      .addSelect('reaction.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('reaction.quoteId IN (:...quoteIds)', { quoteIds })
      .andWhere('reaction.commentId IS NULL')
      .groupBy('reaction.quoteId')
      .addGroupBy('reaction.type')
      .getRawMany<{ quoteId: string; type: ReactionType; count: string }>();
    return quoteIds.map((quoteId) => {
      const counts = rows
        .filter((row) => row.quoteId === quoteId)
        .map((row) => ({ type: row.type, count: Number(row.count) }));
      return {
        totalCount: counts.reduce((sum, row) => sum + row.count, 0),
        counts,
      };
    });
  }

  async findQuoteReactionsPaginated(
    quoteId: string,
    pagination: IPaginationInput,
  ): Promise<IPaginatedResult<Reaction>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const [items, total] = await this.repo
      .createQueryBuilder('reaction')
      .where('reaction.quoteId = :quoteId', { quoteId })
      .andWhere('reaction.commentId IS NULL')
      .orderBy('reaction.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findQuoteReactionsPaginatedByQuoteIds(
    keys: Array<{ id: string; pagination: IPaginationInput }>,
  ) {
    const ids = keys.map(({ id }) => id);
    const rows = await this.repo
      .createQueryBuilder('reaction')
      .where('reaction.quoteId IN (:...ids)', { ids })
      .andWhere('reaction.commentId IS NULL')
      .orderBy('reaction.createdAt', 'DESC')
      .getMany();
    const byQuote = new Map<string, Reaction[]>();
    rows.forEach((reaction) => {
      const reactions = byQuote.get(reaction.quoteId) ?? [];
      reactions.push(reaction);
      byQuote.set(reaction.quoteId, reactions);
    });
    return keys.map(({ id, pagination }) => {
      const page = pagination.page ?? 1;
      const limit = pagination.limit ?? 20;
      const items = byQuote.get(id) ?? [];
      const total = items.length;
      return {
        items: items.slice((page - 1) * limit, page * limit),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    });
  }
}

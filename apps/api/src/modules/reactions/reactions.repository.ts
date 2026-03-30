import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginationInput, IPaginatedResult, Reaction, ReactionType } from '@as/contracts';
import { BaseRepository } from '@as/base';

@Injectable()
export class ReactionRepository extends BaseRepository<Reaction> {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {
    super(reactionRepository);
  }

  async getQuoteReactionsSummary(quoteId: string): Promise<{
    totalCount: number;
    counts: Array<{ type: ReactionType; count: number }>;
  }> {
    const rows = await this.repo
      .createQueryBuilder("reaction")
      .select("reaction.type", "type")
      .addSelect("COUNT(*)", "count")
      .where("reaction.quoteId = :quoteId", { quoteId })
      .andWhere("reaction.commentId IS NULL")
      .groupBy("reaction.type")
      .getRawMany<{ type: ReactionType; count: string }>();

    const counts = rows.map((row) => ({
      type: row.type,
      count: Number(row.count),
    }));

    const totalCount = counts.reduce((sum, c) => sum + c.count, 0);

    return { totalCount, counts };
  }

  async findQuoteReactionsPaginated(
    quoteId: string,
    pagination: IPaginationInput,
  ): Promise<IPaginatedResult<Reaction>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const [items, total] = await this.repo
      .createQueryBuilder("reaction")
      .where("reaction.quoteId = :quoteId", { quoteId })
      .andWhere("reaction.commentId IS NULL")
      .orderBy("reaction.createdAt", "DESC")
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
}

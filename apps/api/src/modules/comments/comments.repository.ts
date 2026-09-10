import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, IPaginationInput, IPaginatedResult } from '@as/contracts';
import { BaseRepository } from '@as/base';

@Injectable()
export class CommentRepository extends BaseRepository<Comment> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {
    super(commentRepository);
  }

  async getQuoteCommentsSummary(quoteId: string) {
    const total = await this.commentRepository.count({ where: { quoteId } });
    return { totalCount: total };
  }

  async getQuoteCommentsSummaries(quoteIds: string[]) {
    const rows = await this.repo
      .createQueryBuilder('comment')
      .select('comment.quoteId', 'quoteId')
      .addSelect('COUNT(*)', 'count')
      .where('comment.quoteId IN (:...quoteIds)', { quoteIds })
      .groupBy('comment.quoteId')
      .getRawMany<{ quoteId: string; count: string }>();
    const counts = new Map(rows.map((row) => [row.quoteId, Number(row.count)]));
    return quoteIds.map((quoteId) => ({
      totalCount: counts.get(quoteId) ?? 0,
    }));
  }

  async findCommentsPaginatedByQuoteId(
    quoteId: string,
    pagination: IPaginationInput,
  ): Promise<IPaginatedResult<Comment>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const [items, total] = await this.repo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.quoteId = :quoteId', { quoteId })
      .orderBy('comment.createdAt', 'DESC')
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

  async findCommentsPaginatedByQuoteIds(
    keys: Array<{ id: string; pagination: IPaginationInput }>,
  ) {
    const ids = keys.map(({ id }) => id);
    const rows = await this.repo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.quoteId IN (:...ids)', { ids })
      .orderBy('comment.createdAt', 'DESC')
      .getMany();
    const byQuote = new Map<string, Comment[]>();
    rows.forEach((comment) => {
      const comments = byQuote.get(comment.quoteId) ?? [];
      comments.push(comment);
      byQuote.set(comment.quoteId, comments);
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

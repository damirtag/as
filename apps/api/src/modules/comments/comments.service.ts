import { Injectable } from '@nestjs/common';
import { Comment, IPaginationInput, Quote, User } from '@as/contracts';
import { BaseService } from '@as/base';
import { CacheClientService } from '@as/cache-client';
import { CommentRepository } from './comments.repository';
import { reviveDates } from '@/utils';

@Injectable()
export class CommentService extends BaseService<Comment> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly cacheClient: CacheClientService
  ) {
    super(commentRepository);
  }

  async getQuoteCommentsSummary(quoteId: string) {
    const cacheKey = `quote:comments:summary:${quoteId}`;
    const cached = await this.cacheClient.get(cacheKey);
    if (cached) {
      console.log('Cache hit for quote comments summary');
      return reviveDates(cached);
    }
    const summary = await this.commentRepository.getQuoteCommentsSummary(quoteId);
    await this.cacheClient.set(cacheKey, summary);

    return summary;
  }

  async findCommentsPaginatedByQuoteId(
    quoteId: string,
    pagination: IPaginationInput,
  ) {
    const cacheKey = `quote:comments:paginated:${quoteId}:${pagination.page ?? 1}:${pagination.limit ?? 20}`;
    const cached = await this.cacheClient.get(cacheKey);
    if (cached) {
      console.log('Cache hit for quote comments paginated');
      return reviveDates(cached);
    }
    const result = await this.commentRepository.findCommentsPaginatedByQuoteId(
      quoteId,
      pagination,
    );
    await this.cacheClient.set(cacheKey, result);
    return result;
  }

  override async create(
    data: Partial<Comment> & { userId?: string; quoteId?: string },
  ): Promise<Comment> {
    const { userId, quoteId, ...rest } = data;

    return this.commentRepository.create({
      ...rest,
      ...(userId ? ({ userId, user: { id: userId } as User } as never) : {}),
      ...(quoteId
        ? ({ quoteId, quote: { id: quoteId } as Quote } as never)
        : {}),
    });
  }

  async findByUserId(userId: string, pagination: IPaginationInput) {
    return this.commentRepository.findPaginated(pagination, {
      where: { userId },
    });
  }
}

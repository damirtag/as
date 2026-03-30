import { Injectable } from '@nestjs/common';
import { Comment, IPaginationInput, Quote, User } from '@as/contracts';
import { BaseService } from '@as/base';
import { CommentRepository } from './comments.repository';

@Injectable()
export class CommentService extends BaseService<Comment> {
  constructor(private readonly commentRepository: CommentRepository) {
    super(commentRepository);
  }

  async findCommentsPaginatedByQuoteId(
    quoteId: string,
    pagination: IPaginationInput,
  ) {
    return this.commentRepository.findCommentsPaginatedByQuoteId(
      quoteId,
      pagination,
    );
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

import { Injectable } from '@nestjs/common';
import { Comment, Quote, User } from '@as/contracts';
import { BaseService } from '@as/base';
import { CommentRepository } from './comments.repository';

@Injectable()
export class CommentService extends BaseService<Comment> {
  constructor(private readonly commentRepository: CommentRepository) {
    super(commentRepository);
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
}

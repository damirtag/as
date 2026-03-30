import { Injectable } from '@nestjs/common';
import { Comment, IPaginationInput, Quote, Reaction, User } from '@as/contracts';
import { BaseService } from '@as/base';
import { ReactionRepository } from './reactions.repository';

@Injectable()
export class ReactionService extends BaseService<Reaction> {
  constructor(private readonly reactionRepository: ReactionRepository) {
    super(reactionRepository);
  }

  async getQuoteReactionsSummary(quoteId: string) {
    return this.reactionRepository.getQuoteReactionsSummary(quoteId);
  }

  async findQuoteReactionsPaginated(
    quoteId: string,
    pagination: IPaginationInput,
  ) {
    return this.reactionRepository.findQuoteReactionsPaginated(
      quoteId,
      pagination,
    );
  }

  override async create(
    data: Partial<Reaction> & {
      userId?: string;
      quoteId?: string;
      commentId?: string;
    },
  ): Promise<Reaction> {
    const { userId, quoteId, commentId, ...rest } = data;

    return this.reactionRepository.create({
      ...rest,
      ...(userId ? ({ userId, user: { id: userId } as User } as never) : {}),
      ...(quoteId
        ? ({ quoteId, quote: { id: quoteId } as Quote } as never)
        : {}),
      ...(commentId
        ? ({ commentId, comment: { id: commentId } as Comment } as never)
        : {}),
    });
  }
}

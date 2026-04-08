import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  CreateQuoteInput,
  PaginatedQuotes,
  PaginatedComments,
  PaginatedReactions,
  PaginationInput,
  QuoteReactionsSummaryGql,
  QuoteType,
  UpdateQuoteInput,
} from '@as/base';
import { BaseResolver } from '@as/base';
import { Quote } from '@as/contracts';
import { CommentService } from '../comments/comments.service';
import { ReactionService } from '../reactions/reactions.service';
import { QuoteService } from './quotes.service';
import { Owner } from '../../common/decorators/owner.decorator';

@Resolver(() => QuoteType)
@Owner(Quote, 'userId')
export class QuotesResolver extends BaseResolver(
  QuoteType,
  CreateQuoteInput,
  UpdateQuoteInput,
) {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly reactionService: ReactionService,
    private readonly commentService: CommentService,
  ) {
    super(quoteService);
  }

  @ResolveField(() => QuoteReactionsSummaryGql)
  async reactionsSummary(@Parent() quote: Quote) {
    return this.reactionService.getQuoteReactionsSummary(quote.id);
  }

  @ResolveField(() => PaginatedReactions, { nullable: true })
  async reactionsPaginated(
    @Parent() quote: Quote,
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput | undefined,
    @Args('includeUsers', { type: () => Boolean, defaultValue: false })
    includeUsers: boolean,
  ) {
    if (!includeUsers) {
      return null;
    }

    return this.reactionService.findQuoteReactionsPaginated(
      quote.id,
      pagination ?? {},
    );
  }

  @ResolveField(() => PaginatedComments)
  async commentsPaginated(
    @Parent() quote: Quote,
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput | undefined,
  ) {
    return this.commentService.findCommentsPaginatedByQuoteId(
      quote.id,
      pagination ?? {},
    );
  }

  @Query(() => PaginatedQuotes, { name: 'findQuotesByUserId' })
  findByUserId(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput | undefined,
  ) {
    return this.quoteService.findByUserId(userId, pagination ?? {});
  }

  @Query(() => PaginatedQuotes, { name: 'findQuotesByUsername' })
  findByUsername(
    @Args('username') username: string,
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput | undefined,
  ) {
    return this.quoteService.findByUsername(username, pagination ?? {});
  }
}

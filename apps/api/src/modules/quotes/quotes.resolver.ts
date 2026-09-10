import {
  Args,
  Context,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import type { GraphQLContext } from '../../common/graphql/request-loaders';
import {
  CreateQuoteInput,
  PaginatedQuotes,
  PaginatedComments,
  PaginatedReactions,
  PaginationInput,
  QuoteReactionsSummaryGql,
  QuoteCommentsSummaryGql,
  QuoteType,
  UpdateQuoteInput,
  UserType,
} from '@as/base';
import { BaseResolver } from '@as/base';
import { Quote } from '@as/contracts';
import { QuoteService } from './quotes.service';
import { Owner } from '../../common/decorators/owner.decorator';

@Resolver(() => QuoteType)
@Owner(Quote, 'userId')
export class QuotesResolver extends BaseResolver(
  QuoteType,
  CreateQuoteInput,
  UpdateQuoteInput,
) {
  constructor(private readonly quoteService: QuoteService) {
    super(quoteService);
  }

  @ResolveField(() => UserType, { nullable: true })
  user(@Parent() quote: Quote) {
    return quote.user || null;
  }

  @ResolveField(() => QuoteCommentsSummaryGql)
  async commentsSummary(
    @Parent() quote: Quote,
    @Context() ctx: GraphQLContext,
  ) {
    return ctx.loaders.commentsSummary.load(quote.id);
  }

  @ResolveField(() => QuoteReactionsSummaryGql)
  async reactionsSummary(
    @Parent() quote: Quote,
    @Context() ctx: GraphQLContext,
  ) {
    return ctx.loaders.reactionsSummary.load(quote.id);
  }

  @ResolveField(() => PaginatedReactions, { nullable: true })
  async reactionsPaginated(
    @Parent() quote: Quote,
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput | undefined,
    @Args('includeUsers', { type: () => Boolean, defaultValue: false })
    includeUsers: boolean,
    @Context() ctx: GraphQLContext,
  ) {
    if (!includeUsers) {
      return null;
    }

    return ctx.loaders.reactionsPaginated.load({
      id: quote.id,
      pagination: pagination ?? {},
    });
  }

  @ResolveField(() => PaginatedComments)
  async commentsPaginated(
    @Parent() quote: Quote,
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput | undefined,
    @Context() ctx: GraphQLContext,
  ) {
    return ctx.loaders.commentsPaginated.load({
      id: quote.id,
      pagination: pagination ?? {},
    });
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

  @Query(() => QuoteType, { name: 'findOneQuoteType' })
  override findOne(@Args('id', { type: () => ID }) id: string): Promise<Quote> {
    return this.quoteService.findByIdWithUser(id);
  }
}

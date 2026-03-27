import { Resolver } from '@nestjs/graphql';
import { QuoteType, CreateQuoteInput, UpdateQuoteInput } from '@as/base';
import { BaseResolver } from '@as/base';
import { QuoteService } from './quotes.service';

@Resolver(() => QuoteType)
export class QuotesResolver extends BaseResolver(
  QuoteType,
  CreateQuoteInput,
  UpdateQuoteInput,
) {
  constructor(private readonly quoteService: QuoteService) {
    super(quoteService);
  }
}

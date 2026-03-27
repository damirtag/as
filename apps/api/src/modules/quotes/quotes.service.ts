import { Injectable } from '@nestjs/common';
import { Quote, User } from '@as/contracts';
import { BaseService } from '@as/base';
import { QuoteRepository } from './quotes.repository';

@Injectable()
export class QuoteService extends BaseService<Quote> {
  constructor(private readonly quoteRepository: QuoteRepository) {
    super(quoteRepository);
  }

  override async create(
    data: Partial<Quote> & { userId?: string },
  ): Promise<Quote> {
    const { userId, ...rest } = data;

    return this.quoteRepository.create({
      ...rest,
      ...(userId ? ({ userId, user: { id: userId } as User } as never) : {}),
    });
  }
}

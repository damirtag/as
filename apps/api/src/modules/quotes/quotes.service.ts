import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationInput, Quote, User } from '@as/contracts';
import { BaseService } from '@as/base';
import { QuoteRepository } from './quotes.repository';
import { CacheClientService } from '@as/cache-client';
import { reviveDates } from '@/utils';


@Injectable()
export class QuoteService extends BaseService<Quote> {
  constructor(private readonly quoteRepository: QuoteRepository, private readonly cacheClient: CacheClientService ) {
    super(quoteRepository);
  }

  override async findPaginated(pagination: IPaginationInput) {
    // todo: cache this
    return this.quoteRepository.findPaginated(pagination, {
      relations: ['user'],
    });
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

  async findByUserId(userId: string, pagination: IPaginationInput) {
    return this.quoteRepository.findPaginated(pagination, {
      where: { userId },
      relations: ['user'],
    });
  }

  async findByUsername(username: string, pagination: IPaginationInput) {
    return this.quoteRepository.findPaginated(pagination, {
      where: { user: { username } },
      relations: ['user'],
    });
  }

  async findByIdWithUser(id: string): Promise<Quote> {
    const quote = await this.quoteRepository.findOneWithOptions({
      where: { id },
      relations: { user: true },
    });

    if (!quote) throw new NotFoundException(`Quote ${id} not found`);
    
    return quote;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from '@as/contracts';
import { BaseRepository } from '@as/base';

@Injectable()
export class QuoteRepository extends BaseRepository<Quote> {
  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
  ) {
    super(quoteRepository);
  }
}

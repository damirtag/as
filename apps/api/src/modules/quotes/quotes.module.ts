import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '@as/contracts';
import { QuoteService } from './quotes.service';
import { QuoteRepository } from './quotes.repository';
import { QuotesResolver } from './quotes.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Quote])],
  providers: [QuoteService, QuoteRepository, QuotesResolver],
  exports: [QuoteService],
})
export class QuoteModule {}

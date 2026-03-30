import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '@as/contracts';
import { ReactionModule } from '../reactions/reactions.module';
import { CommentModule } from '../comments/comments.module';
import { QuoteService } from './quotes.service';
import { QuoteRepository } from './quotes.repository';
import { QuotesResolver } from './quotes.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Quote]), ReactionModule, CommentModule],
  providers: [QuoteService, QuoteRepository, QuotesResolver],
  exports: [QuoteService],
})
export class QuoteModule {}

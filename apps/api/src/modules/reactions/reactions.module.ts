import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from '@as/contracts';
import { ReactionService } from './reactions.service';
import { ReactionRepository } from './reactions.repository';
import { ReactionResolver } from './reactions.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction])],
  providers: [ReactionService, ReactionRepository, ReactionResolver],
  exports: [ReactionService],
})
export class ReactionModule {}

import { Resolver } from '@nestjs/graphql';
import {
  ReactionTypeGql,
  CreateReactionInput,
  UpdateReactionInput,
} from '@as/base';
import { BaseResolver } from '@as/base';
import { ReactionService } from './reactions.service';

@Resolver(() => ReactionTypeGql)
export class ReactionResolver extends BaseResolver(
  ReactionTypeGql,
  CreateReactionInput,
  UpdateReactionInput,
) {
  constructor(private readonly reactionService: ReactionService) {
    super(reactionService);
  }
}

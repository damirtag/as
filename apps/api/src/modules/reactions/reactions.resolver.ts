import { Resolver } from '@nestjs/graphql';
import {
  ReactionTypeGql,
  CreateReactionInput,
  UpdateReactionInput,
} from '@as/base';
import { BaseResolver } from '@as/base';
import { ReactionService } from './reactions.service';
import { Reaction } from '@as/contracts';
import { Owner } from '../../common/decorators/owner.decorator';

@Resolver(() => ReactionTypeGql)
@Owner(Reaction, 'userId')
export class ReactionResolver extends BaseResolver(
  ReactionTypeGql,
  CreateReactionInput,
  UpdateReactionInput,
) {
  constructor(private readonly reactionService: ReactionService) {
    super(reactionService);
  }
}

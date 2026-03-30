import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import {
  CommentType,
  CreateCommentInput,
  PaginationInput,
  UpdateCommentInput,
  PaginatedComments,
} from '@as/base';
import { BaseResolver } from '@as/base';
import { CommentService } from './comments.service';
import { Comment } from '@as/contracts';
import { Owner } from '../../common/decorators/owner.decorator';

@Resolver(() => CommentType)
@Owner(Comment, 'userId')
export class CommentsResolver extends BaseResolver(
  CommentType,
  CreateCommentInput,
  UpdateCommentInput,
) {
  constructor(private readonly commentService: CommentService) {
    super(commentService);
  }

  @Query(() => PaginatedComments, { name: 'findCommentsByUserId' })
  findByUserId(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput | undefined,
  ) {
    return this.commentService.findByUserId(userId, pagination ?? {});
  }
}

import { Resolver } from '@nestjs/graphql';
import { CommentType, CreateCommentInput, UpdateCommentInput } from '@as/base';
import { BaseResolver } from '@as/base';
import { CommentService } from './comments.service';

@Resolver(() => CommentType)
export class CommentsResolver extends BaseResolver(
  CommentType,
  CreateCommentInput,
  UpdateCommentInput,
) {
  constructor(private readonly commentService: CommentService) {
    super(commentService);
  }
}

import {
  ObjectType,
  InputType,
  Field,
  ID,
  Int,
  registerEnumType,
} from "@nestjs/graphql";
import { ReactionType, Role } from "@as/contracts";
import { Paginated } from "../paginated.type";

registerEnumType(Role, {
  name: "Role",
});

@ObjectType()
export class UserType {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  username!: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Role)
  role!: Role;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class RegisterInput {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  username!: string;
}

@InputType()
export class LoginInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;
}

@InputType()
export class CreateQuoteInput {
  @Field()
  text!: string;

  @Field(() => ID)
  userId!: string;
}

@InputType()
export class UpdateQuoteInput {
  @Field({ nullable: true })
  text?: string;
}

@InputType()
export class CreateCommentInput {
  @Field()
  text!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  quoteId!: string;
}

@InputType()
export class UpdateCommentInput {
  @Field({ nullable: true })
  text?: string;
}

@ObjectType()
export class CommentType {
  @Field(() => ID)
  id!: string;

  @Field()
  text!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  quoteId!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

registerEnumType(ReactionType, {
  name: "ReactionType",
});

@InputType()
export class CreateReactionInput {
  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  quoteId!: string;

  @Field(() => ID, { nullable: true })
  commentId?: string;

  @Field(() => ReactionType)
  type!: ReactionType;
}

@InputType()
export class UpdateReactionInput {
  @Field(() => ReactionType)
  type!: ReactionType;
}

@ObjectType()
export class ReactionTypeGql {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  quoteId!: string;

  @Field(() => ID, { nullable: true })
  commentId?: string;

  @Field(() => ReactionType)
  type!: ReactionType;

  @Field()
  createdAt!: Date;
}

@ObjectType()
export class ReactionCountByTypeGql {
  @Field(() => ReactionType)
  type!: ReactionType;

  @Field(() => Int)
  count!: number;
}

@ObjectType()
export class QuoteReactionsSummaryGql {
  @Field(() => Int)
  totalCount!: number;

  @Field(() => [ReactionCountByTypeGql])
  counts!: ReactionCountByTypeGql[];
}

@ObjectType()
export class QuoteType {
  @Field(() => ID)
  id!: string;

  @Field()
  text!: string;

  @Field(() => ID)
  userId!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  /**
   * Агрегированные реакции на цитату (реакции к comment не включаем).
   * Считается через GROUP BY по `Reaction.type`.
   */
  @Field(() => QuoteReactionsSummaryGql)
  reactionsSummary!: QuoteReactionsSummaryGql;

  /**
   * Опционально: детальные реакции (с `userId`).
   * Если `includeUsers=false`, то сервер может вернуть `null`.
   */
  @Field(() => PaginatedReactions, { nullable: true })
  reactionsPaginated?: unknown;

  /**
   * Пагинированные комментарии к цитате.
   * В `total` лежит общее количество комментариев.
   */
  @Field(() => PaginatedComments)
  commentsPaginated!: unknown;
}

export const PaginatedComments = Paginated(CommentType, "PaginatedComments");

export const PaginatedReactions = Paginated(
  ReactionTypeGql,
  "PaginatedReactions",
);

export const PaginatedQuotes = Paginated(QuoteType, "PaginatedQuotes");

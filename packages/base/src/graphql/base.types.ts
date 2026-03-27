import {
  ObjectType,
  InputType,
  Field,
  ID,
  Int,
  registerEnumType,
} from "@nestjs/graphql";
import { ReactionType } from "@as/contracts";

@InputType()
export class CreateUserInput {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field({ nullable: true })
  username?: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  username?: string;
}

@ObjectType()
export class UserType {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  username?: string;

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
  username?: string;
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

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  limit?: number;
}

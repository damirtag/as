import { IsUUID, IsEnum, IsOptional } from "class-validator";
import { ReactionType } from "../enum";

export class CreateReactionDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  quoteId!: string;

  @IsOptional()
  @IsUUID()
  commentId?: string;

  @IsEnum(ReactionType)
  type!: ReactionType;
}

export class UpdateReactionDto {
  @IsEnum(ReactionType)
  type!: ReactionType;
}

export class ReactionResponseDto {
  id!: string;
  userId!: string;
  quoteId!: string;
  commentId?: string;
  type!: ReactionType;
  createdAt!: Date;
}

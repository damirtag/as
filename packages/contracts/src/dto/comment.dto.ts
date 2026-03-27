import {
  IsUUID,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text!: string;

  @IsUUID()
  userId!: string;

  @IsUUID()
  quoteId!: string;
}

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text?: string;
}

export class CommentResponseDto {
  id!: string;
  text!: string;
  userId!: string;
  quoteId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

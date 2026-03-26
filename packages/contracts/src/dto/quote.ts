import {
  IsUUID,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateQuoteDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  text!: string;

  @IsUUID()
  userId!: string;
}

export class UpdateQuoteDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  text?: string;
}

export class QuoteResponseDto {
  id!: string;
  text!: string;
  userId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

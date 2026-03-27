import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Type } from "@nestjs/common";

/**
 * Factory that creates a typed paginated result ObjectType.
 *
 * Usage:
 *   @ObjectType()
 *   export class PaginatedQuotes extends Paginated(QuoteType) {}
 */
export function Paginated<T>(
  classRef: Type<T>,
  name?: string,
): Type<{
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const typeName = name ?? `Paginated${classRef.name}`; // <- уникальное имя

  @ObjectType(typeName, { isAbstract: true })
  class PaginatedType {
    @Field(() => [classRef])
    items!: T[];

    @Field(() => Int)
    total!: number;

    @Field(() => Int)
    page!: number;

    @Field(() => Int)
    limit!: number;

    @Field(() => Int)
    totalPages!: number;
  }

  return PaginatedType as never;
}

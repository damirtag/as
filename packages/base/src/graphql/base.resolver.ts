import { Query, Mutation, Args, ID, Resolver } from "@nestjs/graphql";
import { Type } from "@nestjs/common";
import { BaseService } from "../base.service";
import { ObjectLiteral } from "typeorm";
import { PaginationInput } from "../pagination.input";
import { Paginated } from "../paginated.type";

/**
 * Creates a fully typed base resolver class for an entity.
 * Each entity resolver just extends this and gets CRUD for free.
 *
 * Usage:
 *   @Resolver(() => UserType)
 *   export class UsersResolver extends BaseReadResolver(UserType) {}
 */
export function BaseResolver<
  TEntity extends ObjectLiteral,
  TType extends object,
  TCreateInput extends object,
  TUpdateInput extends object,
>(
  EntityType: Type<TType>,
  CreateInput: Type<TCreateInput>,
  UpdateInput: Type<TUpdateInput>,
) {
  const PaginatedEntity = Paginated(EntityType);
  // abstract so nest doesnt try to register it directly
  @Resolver(() => EntityType, { isAbstract: true })
  abstract class BaseResolverHost {
    constructor(public readonly service: BaseService<TEntity>) {}

    @Query(() => EntityType, { name: `findOne${EntityType.name}` })
    findOne(@Args("id", { type: () => ID }) id: string) {
      return this.service.findByIdOrFail(id);
    }

    @Query(() => PaginatedEntity, {
      name: `findPaginated${EntityType.name}`,
    })
    findPaginated(@Args("pagination") pagination: PaginationInput) {
      return this.service.findPaginated(pagination);
    }

    @Mutation(() => EntityType, { name: `create${EntityType.name}` })
    create(@Args("input", { type: () => CreateInput }) input: TCreateInput) {
      return this.service.create(input as never);
    }

    @Mutation(() => EntityType, { name: `update${EntityType.name}` })
    update(
      @Args("id", { type: () => ID }) id: string,
      @Args("input", { type: () => UpdateInput }) input: TUpdateInput,
    ) {
      return this.service.updateOrFail(id, input as never);
    }

    @Mutation(() => Boolean, { name: `delete${EntityType.name}` })
    async delete(@Args("id", { type: () => ID }) id: string) {
      await this.service.deleteOrFail(id);
      return true;
    }
  }

  return BaseResolverHost;
}

/**
 * Read-only resolver factory (queries only).
 *
 * Useful for entities where you don't want to expose create/update/delete.
 */
export function BaseReadResolver<
  TEntity extends ObjectLiteral,
  TType extends object,
>(EntityType: Type<TType>) {
  const PaginatedEntity = Paginated(EntityType);

  @Resolver(() => EntityType, { isAbstract: true })
  abstract class BaseReadResolverHost {
    constructor(public readonly service: BaseService<TEntity>) {}

    @Query(() => EntityType, { name: `findOne${EntityType.name}` })
    findOne(@Args("id", { type: () => ID }) id: string) {
      return this.service.findByIdOrFail(id);
    }

    @Query(() => PaginatedEntity, {
      name: `findPaginated${EntityType.name}`,
    })
    findPaginated(@Args("pagination") pagination: PaginationInput) {
      return this.service.findPaginated(pagination);
    }
  }

  return BaseReadResolverHost;
}

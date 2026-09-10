import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserType } from '@as/base';
import { User } from '@as/contracts';
import type { GraphQLContext } from '../../common/graphql/request-loaders';

@Resolver(() => UserType)
export class PresenceResolver {
  @ResolveField(() => Boolean)
  isOnline(
    @Parent() user: User,
    @Context() ctx: GraphQLContext,
  ): Promise<boolean> {
    return ctx.loaders.presence.load(user.id).then((status) => status.isOnline);
  }

  @ResolveField(() => Date, { nullable: true })
  lastSeenAt(@Parent() user: User): Date | null {
    return user.lastSeenAt ?? null;
  }
}

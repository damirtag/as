import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserType } from '@as/base';
import { User } from '@as/contracts';
import { PresenceService } from './presence.service';

@Resolver(() => UserType)
export class PresenceResolver {
  constructor(private readonly presenceService: PresenceService) {}

  @ResolveField(() => Boolean)
  isOnline(@Parent() user: User): Promise<boolean> {
    return this.presenceService.getStatus(user.id).then((status) => status.isOnline);
  }

  @ResolveField(() => Date, { nullable: true })
  lastSeenAt(@Parent() user: User): Date | null {
    return user.lastSeenAt ?? null;
  }
}
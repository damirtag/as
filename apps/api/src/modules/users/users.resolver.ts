import { Resolver } from '@nestjs/graphql';
import { UserType, BaseReadResolver } from '@as/base';
import { UserService } from './users.service';

@Resolver(() => UserType)
export class UsersResolver extends BaseReadResolver(UserType) {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}

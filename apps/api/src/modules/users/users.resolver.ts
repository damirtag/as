import { Resolver } from '@nestjs/graphql';
import { UserType, CreateUserInput, UpdateUserInput } from '@as/base';
import { BaseResolver } from '@as/base';
import { UserService } from './users.service';

@Resolver(() => UserType)
export class UsersResolver extends BaseResolver(
  UserType,
  CreateUserInput,
  UpdateUserInput,
) {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}

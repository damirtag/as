import { Injectable } from '@nestjs/common';
import { User } from '@as/contracts';
import { BaseService } from '@as/base';
import { UserRepository } from './users.repository';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }
}

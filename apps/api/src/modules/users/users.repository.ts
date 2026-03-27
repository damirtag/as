import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '@as/contracts';
import { BaseRepository } from '@as/base';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly userRepository: Repository<User>) {
    super(userRepository);
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }
}

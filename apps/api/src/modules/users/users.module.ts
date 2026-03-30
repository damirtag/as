// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@as/contracts';
import { UserRepository } from './users.repository';
import { UserService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    UsersResolver,
    {
      provide: UserRepository,
      useFactory: (repo: Repository<User>) => new UserRepository(repo),
      inject: [getRepositoryToken(User)], // ✅ вот здесь правильный токен
    },
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}

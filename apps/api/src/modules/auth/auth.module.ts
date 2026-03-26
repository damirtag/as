import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokensRepository } from './refresh-tokens.repository';

import { UserModule } from '../users/users.module';
import { RefreshTokens } from '@as/contracts';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([RefreshTokens]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'SUPER_SECRET',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokensRepository],
  exports: [AuthService],
})
export class AuthModule {}

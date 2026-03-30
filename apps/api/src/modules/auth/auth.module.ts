import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { AppConfigService, ConfigModule } from '../../config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { UserModule } from '../users/users.module';
import { RefreshTokens } from '@as/contracts';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    TypeOrmModule.forFeature([RefreshTokens]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.jwtSecret,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: RefreshTokensRepository,
      useFactory: (repo: Repository<RefreshTokens>) =>
        new RefreshTokensRepository(repo),
      inject: [getRepositoryToken(RefreshTokens)],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}

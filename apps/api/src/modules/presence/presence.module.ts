import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/users.module';
import { ConfigModule, AppConfigService } from '../../config';
import { PresenceGateway } from './presence.gateway';
import { PresenceResolver } from './presence.resolver';
import { PresenceService } from './presence.service';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({ secret: config.jwtSecret }),
    }),
  ],
  providers: [PresenceService, PresenceGateway, PresenceResolver],
  exports: [PresenceService],
})
export class PresenceModule {}
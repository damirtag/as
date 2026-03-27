import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [NestConfigModule.forRoot({ isGlobal: true })],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class ConfigModule {}

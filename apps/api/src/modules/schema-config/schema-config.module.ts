import { Module } from '@nestjs/common';
import { AppSchemaConfigService } from './schema-config.service';
import { AppConfigService } from '../../config/app-config.service';

@Module({
  providers: [AppConfigService, AppSchemaConfigService],
  exports: [AppSchemaConfigService],
})
export class SchemaConfigModule {}

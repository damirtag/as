import { Module } from '@nestjs/common';
import { AppSchemaConfigService } from './schema-config.service';
import { AppConfigService } from '../../config/app-config.service';
import { CommentModule } from '../comments/comments.module';
import { ReactionModule } from '../reactions/reactions.module';
import { PresenceModule } from '../presence/presence.module';
import { RequestLoadersFactory } from '../../common/graphql/request-loaders';

@Module({
  imports: [CommentModule, ReactionModule, PresenceModule],
  providers: [AppConfigService, RequestLoadersFactory, AppSchemaConfigService],
  exports: [AppSchemaConfigService],
})
export class SchemaConfigModule {}

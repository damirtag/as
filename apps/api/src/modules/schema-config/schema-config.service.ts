import { Injectable } from '@nestjs/common';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { BaseGraphQLSchemaConfigService } from '@as/base';
import { AppConfigService } from '../../config/app-config.service';
import * as path from 'path';
import { RequestLoadersFactory } from '../../common/graphql/request-loaders';

/**
 * AppSchemaConfigService
 *
 * Extends the shared base config with app-specific overrides:
 * - resolves schema output path relative to the app root
 * - reads playground / introspection flags from AppConfigService
 * - injects the authenticated user from the JWT guard into GQL context
 */
@Injectable()
export class AppSchemaConfigService extends BaseGraphQLSchemaConfigService {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly requestLoaders: RequestLoadersFactory,
  ) {
    super({
      schemaOutputPath: path.join(__dirname, '../../../schema.gql'),
      playground: appConfig.isDev,
      introspection: appConfig.isDev,
      debug: appConfig.isDev,
      contextFactory: ({ req }) => ({
        // req.user is populated by JwtAuthGuard / @CurrentUser()
        currentUser: (req as { user?: unknown }).user ?? null,
        loaders: this.requestLoaders.create(),
      }),
    });
  }

  /**
   * Override to inject additional app-level Apollo options
   * (e.g. persisted queries, APQ, custom plugins).
   */
  override createGqlOptions(): ApolloDriverConfig {
    const base = super.createGqlOptions();
    return {
      ...base,
      // Example: add request-level cache hints, query complexity limits, etc.
      // plugins: [...(base.plugins ?? []), myCustomPlugin],
    };
  }
}

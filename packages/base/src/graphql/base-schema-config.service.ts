import { Injectable, Logger } from "@nestjs/common";
import { GqlModuleOptions, GqlOptionsFactory } from "@nestjs/graphql";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { GraphQLFormattedError } from "graphql";
import * as path from "path";

export interface BaseGraphQLSchemaConfigOptions {
  /**
   * Absolute path where the generated schema.gql will be written.
   * Defaults to <cwd>/schema.gql
   */
  schemaOutputPath?: string;

  /**
   * Enable the Apollo Sandbox landing page (development only).
   */
  playground?: boolean;

  /**
   * Enable introspection. Should be false in production.
   */
  introspection?: boolean;

  /**
   * Additional context factory merged with the default one.
   */
  contextFactory?: (ctx: {
    req: unknown;
    res: unknown;
  }) => Record<string, unknown>;

  /**
   * Enable query depth limiting. Defaults to 10.
   */
  maxDepth?: number;

  /**
   * Pass true to include stack traces in errors (dev only).
   */
  debug?: boolean;
}

/**
 * BaseGraphQLSchemaConfigService
 *
 * Implements GqlOptionsFactory so it can be consumed directly by
 * GraphQLModule.forRootAsync({ useClass: ... }).
 *
 * Extend this in your app by providing a custom sub-class and overriding
 * createGqlOptions() — call super.createGqlOptions() and spread/merge the result.
 */
@Injectable()
export class BaseGraphQLSchemaConfigService implements GqlOptionsFactory<ApolloDriverConfig> {
  protected readonly logger = new Logger(BaseGraphQLSchemaConfigService.name);

  constructor(
    protected readonly options: BaseGraphQLSchemaConfigOptions = {},
  ) {}

  createGqlOptions(): ApolloDriverConfig {
    const {
      schemaOutputPath = path.join(process.cwd(), "schema.gql"),
      playground = process.env.NODE_ENV !== "production",
      introspection = process.env.NODE_ENV !== "production",
      debug = process.env.NODE_ENV !== "production",
      contextFactory,
    } = this.options;

    return {
      // Code-first: NestJS generates schema from decorators
      autoSchemaFile: schemaOutputPath,
      sortSchema: true,

      // Apollo Server options
      playground: false, // replaced by the plugin below
      introspection,
      debug,

      plugins: playground
        ? [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
        : [],

      // Merge request/response into GQL context
      context: ({ req, res }: { req: unknown; res: unknown }) => ({
        req,
        res,
        ...(contextFactory ? contextFactory({ req, res }) : {}),
      }),

      // Consistent error formatting — never leak stack traces in prod
      formatError: (error: GraphQLFormattedError) => {
        this.logger.error(
          `[GraphQL] ${error.message}`,
          (error.extensions?.["stacktrace"] as string[] | undefined)?.join(
            "\n",
          ),
        );

        if (!debug) {
          // Strip internal details in production
          return {
            message: error.message,
            locations: error.locations,
            path: error.path,
            extensions: {
              code: error.extensions?.["code"] ?? "INTERNAL_SERVER_ERROR",
            },
          };
        }

        return error;
      },

      // Allow subscriptions to be added later via plugins
      subscriptions: {
        "graphql-ws": true,
      },
    };
  }
}

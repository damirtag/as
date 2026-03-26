import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
} from "@nestjs/common";
import { CacheClientService } from "./cache-client.service";
import { CacheClientOptions } from "./cache-client.options";

export const CACHE_CLIENT_OPTIONS = "CACHE_CLIENT_OPTIONS";

export interface CacheClientAsyncOptions extends Pick<
  ModuleMetadata,
  "imports"
> {
  useFactory: (
    ...args: unknown[]
  ) => CacheClientOptions | Promise<CacheClientOptions>;
  inject?: unknown[];
}

@Module({})
export class CacheClientModule {
  static forRoot(options: CacheClientOptions): DynamicModule {
    return {
      module: CacheClientModule,
      global: true,
      providers: [
        { provide: CACHE_CLIENT_OPTIONS, useValue: options },
        {
          provide: CacheClientService,
          useFactory: (opts: CacheClientOptions) =>
            new CacheClientService(opts),
          inject: [CACHE_CLIENT_OPTIONS],
        },
      ],
      exports: [CacheClientService],
    };
  }

  static forRootAsync(asyncOptions: CacheClientAsyncOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: CACHE_CLIENT_OPTIONS,
      useFactory: asyncOptions.useFactory as (
        ...args: unknown[]
      ) => CacheClientOptions,
      inject: (asyncOptions.inject ?? []) as never[],
    };

    return {
      module: CacheClientModule,
      global: true,
      imports: asyncOptions.imports ?? [],
      providers: [
        optionsProvider,
        {
          provide: CacheClientService,
          useFactory: (opts: CacheClientOptions) =>
            new CacheClientService(opts),
          inject: [CACHE_CLIENT_OPTIONS],
        },
      ],
      exports: [CacheClientService],
    };
  }
}

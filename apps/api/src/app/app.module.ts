import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { typeOrmConfig } from '@as/database';
import { AllExceptionsFilter, LoggingInterceptor } from '@as/base';
import { CacheClientModule } from '@as/cache-client';

import {
  AuthModule,
  UserModule,
  QuoteModule,
  CommentModule,
  ReactionModule,
} from '../modules';
import { SchemaConfigModule } from '../modules/schema-config/schema-config.module';
import { AppSchemaConfigService } from '../modules/schema-config/schema-config.service';
import { AppConfigService } from '../config/app-config.service';
import { JwtAuthGuard, OwnerGuard, RolesGuard } from '../common/guards';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig()),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [SchemaConfigModule],
      useExisting: AppSchemaConfigService,
    }),

    CacheClientModule.forRoot({
      host: process.env.REDIS_HOST!,
      port: parseInt(process.env.REDIS_PORT!),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB ?? '0'),
      keyPrefix: process.env.REDIS_KEY_PREFIX!,
      ttl: parseInt(process.env.REDIS_TTL!),
    }),

    AuthModule,
    UserModule,
    QuoteModule,
    CommentModule,
    ReactionModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: OwnerGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}

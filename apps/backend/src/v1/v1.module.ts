import type { NestModule, MiddlewareConsumer } from "@nestjs/common";

import { Module } from "@nestjs/common";
import { DocumentBuilder } from "@nestjs/swagger";

import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  RouterModule,
} from "@nestjs/core";
import { CacheModule, CacheInterceptor } from "@nestjs/cache-manager";
import {
  SentryGlobalFilter,
  SentryModule as Sentry,
} from "@sentry/nestjs/setup";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { LoggerMiddleware } from "./middlewares";

import { HashService, StrategiesService } from "./services";
import { LoggerService, env } from "@/services";
import { createSwaggerConfig } from "@/utils";
import { PrismaService } from "@/database";

import { AuthStrategy } from "./strategies";

import { GuardsModule } from "./guards";
import {
  AuthModule,
  CreateUserDto,
  CreateUserCredentials,
  SentryModule,
  TestModule,
} from "./routes";
import { AuthEntity, UserEntity } from "./entities";

export const v1Modules = [AuthModule, SentryModule, TestModule];
export const v1Swagger = createSwaggerConfig({
  version: "v1",
  document: new DocumentBuilder().setTitle("OPEN API v1 documentation"),
  documentOptions: {
    extraModels: [CreateUserDto, CreateUserCredentials, UserEntity, AuthEntity],
  },
});

@Module({
  imports: [
    ...v1Modules.flatMap((module) => [
      module,
      RouterModule.register([{ path: "v1", module }]),
    ]),
    ThrottlerModule.forRoot([
      {
        ttl: +env.THROLLER_TIME_TO_LIVE_IN_MILLISECONDS,
        limit: +env.THROLLER_LIMIT,
      },
    ]),
    CacheModule.register({
      ttl: +env.CACHE_TIME_TO_LIVE_IN_MILLISECONDS,
      isGlobal: true,
    }),
    Sentry.forRoot(),
    GuardsModule,
  ],
  providers: [
    StrategiesService,
    AuthStrategy,
    PrismaService,
    LoggerService,
    HashService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class v1Module implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("/");
  }
}

export default v1Module;

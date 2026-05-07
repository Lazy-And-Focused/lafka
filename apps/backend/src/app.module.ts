import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from "@nestjs/common";

import { APP_PIPE, RouterModule } from "@nestjs/core";

import { v1Module, v1Modules } from "./v1/v1.module";

import { PrismaService } from "./database";
import { LoggerService } from "./services";
import { HashService } from "./v1/services";

type RegisterModule = {
  module: new () => NestModule;
  children: (new () => unknown)[];
  path: string;
};

const modules: RegisterModule[] = [
  {
    module: v1Module,
    children: v1Modules,
    path: "v1",
  },
];

@Module({
  imports: [
    ...modules.flatMap(({ module, children, path }) => [
      module,
      RouterModule.register([
        {
          path: "api",
          module,
          children: children.map((module) => ({ path, module })),
        },
      ]),
    ]),
  ],
  providers: [
    PrismaService,
    LoggerService,
    HashService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes("/");
  }
}

export default AppModule;

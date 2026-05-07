import { PROGRAM_MODE } from "./services";

import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

import { AppModule } from "./app.module";
import { v1Swagger } from "./v1/v1.module";

const swaggers = [v1Swagger];

export const swagger = async (app?: INestApplication) => {
  if (PROGRAM_MODE === "swagger") {
    if (app) {
      throw new Error("app can not be defined with mode " + PROGRAM_MODE);
    }

    const nestFactory = await NestFactory.create(AppModule);

    for (const createSwagger of swaggers) {
      const { factory, app, options, pathname, version } = createSwagger({
        app: nestFactory,
      });

      const folderPath = join(process.cwd(), "swagger");
      const filePath = join(folderPath, `${version}.json`);

      await mkdir(folderPath, { recursive: true });
      await writeFile(filePath, JSON.stringify(factory));

      SwaggerModule.setup(pathname, app, factory, options);
    }

    await nestFactory.close();
    return process.exit(0);
  }

  if (!app) {
    throw new Error("app is undefined");
  }

  return () => {
    for (const createSwagger of swaggers) {
      const {
        factory,
        app: currentApp,
        options,
        pathname,
      } = createSwagger({ app });
      SwaggerModule.setup(pathname, currentApp, factory, options);
    }
  };
};

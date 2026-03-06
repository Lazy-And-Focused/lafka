import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from "@nestjs/core";

import { json, urlencoded } from "express";

import cookieParser = require("cookie-parser");

import connect from "lafka/database/database/index.database";

import Api from "api/index.api";
import Session from "./app/session.app";
import Passport from "./strategies";
import { AppModule } from "./app.module";

const passport = new Passport();
const api = new Api();

async function bootstrap() {
  await connect(api.env.MONGO_URL);

  const app = await NestFactory.create(AppModule, {
    cors: { origin: [api.env.CLIENT_URL], credentials: true }
  });

  new Session(api.env.SESSION_SECRET, app).create();

  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded());

  app.use(passport.session());
  app.use(passport.initialize());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('LAFka API documentation')
    .setDescription('LAFka API documentation')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(api.env.PORT);
}

bootstrap();

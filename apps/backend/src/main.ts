import connect from "lafka/database/database/index.database";

import { json, urlencoded } from "express";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import cookieParser = require("cookie-parser");

import Passport from "./strategies";

import Session from "./app/session.app";
import Api from "api/index.api";

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

  await app.listen(3001);
}

bootstrap();

import { env, PROGRAM_MODE } from "@/services";

import { init as initSentry, consoleLoggingIntegration } from "@sentry/nestjs";
import { NestFactory } from "@nestjs/core";

import { json, urlencoded } from "express";

import cookieParser from "cookie-parser";

import { Session } from "./app.session";
import { AppModule } from "./app.module";

import { swagger } from "./swagger";

initSentry({
  dsn: env.SENTRY_URL,
  tracesSampleRate: 1.0,
  integrations: [
    consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  enableLogs: true,
});

(async () => {
  if (PROGRAM_MODE === "swagger") {
    return swagger();
  }

  const app = await NestFactory.create(AppModule, {
    cors: { origin: [env.CLIENT_URL], credentials: true },
  });

  new Session(env.SESSION_SECRET, app).create();

  app.use(cookieParser());
  app.use(urlencoded());
  app.use(json());

  swagger(app);

  await app.listen(env.PORT);
})();

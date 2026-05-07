import type { INestApplication } from "@nestjs/common";
import type { Express } from "express";

import session from "express-session";

export const ONE_WEEK = 60000 * 60 * 24 * 7;

export class Session<T extends INestApplication<unknown> | Express> {
  private readonly _secret: string;
  private readonly _app: T;

  private readonly _resave: boolean = false;
  private readonly _save_uninitialized: boolean = false;

  private readonly _cookie: { maxAge: number } = {
    maxAge: ONE_WEEK,
  };

  public constructor(
    secret: string,
    app: T,
    data?: {
      resave?: boolean;
      saveUninitialized?: boolean;
      cookie?: { maxAge: number };
      mongoUrl?: string;
    },
  ) {
    this._secret = secret;
    this._app = app;

    this._resave = data?.resave || this._resave;
    this._save_uninitialized =
      data?.saveUninitialized || this._save_uninitialized;
    this._cookie = data?.cookie || this._cookie;
  }

  public create() {
    return this._app.use(
      session({
        secret: this._secret,
        resave: this._resave,
        saveUninitialized: this._save_uninitialized,
        cookie: this._cookie,
      }),
    );
  }
}

export default Session;

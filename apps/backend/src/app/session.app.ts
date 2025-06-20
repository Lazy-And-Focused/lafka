import { INestApplication } from "@nestjs/common";
import { Express } from "express";

import { MongoClient } from "mongodb";

import Api from "api/index.api";

const api = new Api();

class Session {
  private readonly _secret: string;
  private readonly _app: INestApplication<unknown> | Express;

  private readonly _resave: boolean = false;
  private readonly _save_uninitialized: boolean = false;

  private readonly _cookie: { maxAge: number } = {
    maxAge: 60000 * 60 * 24 * 7
  };
  private readonly _mongo_url: string = api.env.MONGO_URL;

  constructor(
    secret: string,
    app: INestApplication<unknown> | Express,
    data?: {
      resave?: boolean;
      saveUninitialized?: boolean;
      cookie?: { maxAge: number };
      mongoUrl?: string;
    }
  ) {
    this._secret = secret;
    this._app = app;

    this._resave = data?.resave || this._resave;
    this._save_uninitialized = data?.saveUninitialized || this._save_uninitialized;
    this._cookie = data?.cookie || this._cookie;
    this._mongo_url = data?.mongoUrl || this._mongo_url;
  }

  public create() {
    const client = new MongoClient(this._mongo_url);

    this._app.use(
      require("express-session")({
        secret: this._secret,
        resave: this._resave,
        saveUninitialized: this._save_uninitialized,
        cookie: this._cookie,
        store: require("connect-mongo").create({ client })
      })
    );
  }
}

export default Session;

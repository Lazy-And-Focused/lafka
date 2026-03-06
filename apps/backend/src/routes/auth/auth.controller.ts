import { Controller, Get, Injectable, Next, Req, Res } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import Hash from "api/hash.api";
import AuthApi from "api/auth.api";
import Api from "api/index.api";

import { ROUTE, ROUTES } from "./auth.routes";

const api = new Api();

@Injectable()
@Controller(ROUTE)
export class AuthController {
  @Get()
  public printMethods() {
    const { abbreviations, methods } = AuthApi.methods;
    const toStr = (str: unknown) => JSON.stringify(str, undefined, 4);

    return {
      message: `Sorry, but you can't auth without method, try next methods:\n${toStr(methods)}\nAnd this abbreviations:\n${toStr(abbreviations)}`,
      abbreviations,
      methods
    };
  }

  @Get(ROUTES.GET)
  public auth(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    new AuthApi(req.params.method).auth(req, res, next);

    return;
  }

  @Get(ROUTES.GET_CALLBACK)
  public callback(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    new AuthApi(req.params.method).callback(req, res, next, (...args) => {
      const user = args[1];

      if (!user) return;

      res.cookie(
        "id-token",
        `${user.id}-${user.profile_id}-${new Hash().execute(user.access_token)}`
      );
      res.redirect(api.env.CLIENT_URL);
    });
  }
}

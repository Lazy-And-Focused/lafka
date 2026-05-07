import type { NextFunction, Request, Response } from "express";

import type { Auth, User } from "@1/entities";
import { AuthTypes } from "@1/types";

import {
  HttpException,
  HttpStatus,
  Injectable,
  Next,
  Req,
  Res,
} from "@nestjs/common";
import { StrategiesService } from "../services";

import passport from "passport";

const abbreviations: Map<string, AuthTypes> = new Map([]);

@Injectable()
export class PassportStrategy {
  public constructor() {}

  public static get methods(): Record<
    "abbreviations" | "methods",
    readonly string[]
  > {
    return {
      abbreviations: Array.from(abbreviations.keys()),
      methods: Object.keys(AuthTypes),
    };
  }

  public auth(
    method: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ): unknown {
    this.validateMethod(method);
    this.validateStrategyByMethod(method);
    return passport.authenticate(method)(req, res, next);
  }

  public callback(
    method: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    callback: (
      ...args: [undefined, { auth: Auth; user: User } | null]
    ) => unknown,
  ): unknown {
    this.validateMethod(method);
    return passport.authenticate(method, callback)(req, res, next);
  }

  private validateMethod(method: string): true {
    const exists = method in AuthTypes;
    if (exists) {
      return true;
    }

    const abbreviation = abbreviations.get(method);
    if (abbreviation) {
      return true;
    }

    throw new HttpException(
      `Method ${method} not found. Try next: ${Object.keys(AuthTypes)}`,
      HttpStatus.BAD_REQUEST,
    );
  }

  private validateStrategyByMethod(method: string) {
    return StrategiesService.getStrategy(method);
  }
}

export default PassportStrategy;

import type { NextFunction, Request, Response } from "express";

import {
  Controller,
  Get,
  HttpStatus,
  Injectable,
  Next,
  Req,
  Res,
  Post,
  Body,
  Headers,
  Param,
} from "@nestjs/common";

import { ROUTE, ROUTES, OPERATIONS } from "./auth.routes";
import { AuthService } from "./auth.service";

import { CreateUserDto, CreateUserCredentials } from "./dto/create-user.dto";

import { Headers as HeadersEnum } from "@/enums";
import { Params } from "@1/enums";

import { PassportStrategy } from "@1/strategies";
import { HashService } from "@1/services";

import { ApiOperation } from "@nestjs/swagger";
import { UseHeadersValidation } from "@/decorators/use-headers-validation.decorator";

@Injectable()
@Controller(ROUTE)
export class AuthController {
  public constructor(
    private readonly service: AuthService,
    private readonly hash: HashService,
    private readonly passport: PassportStrategy,
  ) {}

  @Get(ROUTES.GET)
  @ApiOperation(OPERATIONS.GET)
  public get() {
    const methods = this.service.getAllMethods();

    return {
      message: `Sorry, but you can't auth without method, try methods below by path: ${ROUTE}${ROUTES.OAUTH2_GET}`,
      abbreviations: methods.abbreviations,
      methods: methods.methods,
    };
  }

  @Post(ROUTES.POST)
  @ApiOperation(OPERATIONS.POST)
  public post(
    @Body() body: CreateUserDto,
    @UseHeadersValidation(CreateUserCredentials)
    credential: CreateUserCredentials,
  ) {
    return this.service.createUser({
      ...credential,
      ...body,
    });
  }

  @Get(ROUTES.GET_ME)
  @ApiOperation(OPERATIONS.GET_ME)
  public getMe(@Headers(HeadersEnum.authorization) authorization?: string) {
    const { authId, userId } =
      this.hash.resolveHeaderAuthorizationOrThrow(authorization);
    return this.service.getMe(authId, userId);
  }

  @Get(ROUTES.OAUTH2_GET)
  @ApiOperation(OPERATIONS.OAUTH2_GET)
  public auth(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param(Params.method) method: string,
  ) {
    return this.passport.auth(method, req, res, next);
  }

  @Get(ROUTES.OAUTH2_GET_CALLBACK)
  @ApiOperation(OPERATIONS.OAUTH2_GET_CALLBACK)
  public callback(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param(Params.method) method: string,
  ) {
    return this.passport.callback(method, req, res, next, (error, data) => {
      if (error || !data) {
        return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const redirectUrl = this.service.getRedirectUrl(data.auth);
      res.redirect(redirectUrl);
    });
  }
}

export default AuthController;

import { Controller, Get, Injectable, Next, Req, Res } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import AuthApi from "api/auth.api";

@Injectable()
@Controller("auth")
export class AuthController {
	@Get()
	public printMethods() {
		const { abbreviations, methods } = AuthApi.methods;
		const toStr = (str: unknown) => JSON.stringify(str, undefined, 4);

		return {
			message: `Sorry, but you can't auth without method, try next methods:\n${toStr(methods)}\nAnd this abbreviations:\n${toStr(abbreviations)}`,
			abbreviations, methods
		};
	}

	@Get(":method")
	public auth(
		@Req() req: Request,
		@Res() res: Response,
		@Next() next: NextFunction
	): unknown {
		return new AuthApi(req.params.method).auth(req, res, next);
	}

	@Get(":method/callback")
	public callback(
		@Req() req: Request,
		@Res() res: Response,
		@Next() next: NextFunction
	): unknown {
		return new AuthApi(req.params.method).callback(req, res, next);
	}
}

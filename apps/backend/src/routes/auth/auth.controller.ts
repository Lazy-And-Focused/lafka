import { Controller, Get, Injectable, Next, Req, Res } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
@Controller("auth")
export class AuthController {
	@Get("google")
	public googleAuth(
		@Req() req: Request,
		@Res() res: Response,
		@Next() next: NextFunction
	): void {
		return require("passport").authenticate("google")(req, res, next);
	}

	@Get("google/callback")
	public googleRedirect(
		@Req() req: Request,
		@Res() res: Response,
		@Next() next: NextFunction
	): string {
		require("passport").authenticate("google")(req, res, next);
		return "Hello! You are authenticated!";
	}
}

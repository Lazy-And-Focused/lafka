import { Next, Req, Res } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import { AuthTypes, authTypes } from "lafka/types/auth/auth-user.types";

const abbreviations: Map<string, AuthTypes> = new Map([
	["ya", "yandex"]
]);

class AuthApi {
	private readonly _method: string;

	public constructor(method: string) {
		this._method = method;
	}

	static get methods(): Record<"abbreviations"|"methods", readonly string[]> {
		return {
			abbreviations: Array.from(abbreviations.keys()),
			methods: authTypes
		};
	}

	private getMethod(): [
		boolean,
		{ [key: string]: unknown; method: string; body: any }
	] {
		if (!authTypes.includes(this._method as any)) {
			if (abbreviations.get(this._method))
				return [true, { body: null, method: abbreviations.get(this._method) }];

			return [
				false,
				{
					body: {
						msg:
							"Sorry, but method " + this._method + " not found. Try next:",
						methods: authTypes
					},
					method: this._method
				}
			];
		}

		return [true, { body: null, method: this._method }];
	}

	public auth(
		@Req() req: Request,
		@Res() res: Response,
		@Next() next: NextFunction
	): unknown {
		const [successed, { method, body }] = this.getMethod();

		if (!successed) return res.send(body);

		return require("passport").authenticate(method)(req, res, next);
	}

	public callback(
		@Req() req: Request,
		@Res() res: Response,
		@Next() next: NextFunction
	): unknown {
		const [successed, { method, body }] = this.getMethod();

		if (!successed) return res.send(body);

		require("passport").authenticate(method)(req, res, next);

		return "Hi!";
	}
}

export default AuthApi;

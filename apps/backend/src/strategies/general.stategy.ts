import AuthUser from "database/classes/default/auth-user.class";
import User from "database/classes/default/user.class";
import Database from "database/database/models.database";

const { auth_users: AuthUsers } = Database;

import passport, { Profile } from "passport";
import { Strategy, VerifyCallback, VerifyFunction } from "passport-oauth2";
import { AuthTypes } from "types/auth/auth-user.types";

import Api from "api/index.api";

const api = new Api();

const defaultPassports: [AuthTypes, string][] = [
	["google", "passport-google-oauth20"],
	["yandex", "passport-yandex"]
];

class GeneralStrategy {
	protected readonly _passport: passport.PassportStatic = require("passport");

	public constructor() {
		this.serializer();
	}

	protected defaultInitialize = () => {
		for (const passport of defaultPassports) {
			const strategy = require(passport[1]).Strategy;
			this.strategy(strategy, {
				...api.getApi(passport[0].toUpperCase() as Uppercase<AuthTypes>),
				type: passport[0]
			});
		}
	};

	protected verify<Done extends (...data: any) => void = VerifyCallback>(
		type: AuthTypes
	) {
		return async (
			access_token: string,
			refresh_token: string,
			profile: Profile,
			done: Done
		) => {
			try {
				const { id } = profile;

				const user = await new User({
					username: profile.name.givenName || profile.displayName
				}).init();

				const authUser = await new AuthUser({
					access_token,
					refresh_token,
					service_id: id,
					type: type,
					profile_id: user.id
				}).init();

				return done(null, authUser);
			} catch (error) {
				console.log(error);

				return done(error, null);
			}
		};
	}

	protected strategy(
		strategy: new (
			options: {
				clientID: string;
				clientSecret: string;
				callbackURL: string;
				scope?: string[];
			},
			verify: VerifyFunction
		) => Strategy,
		api: {
			id: string;
			secret: string;
			callback: string;
			scopes?: string[];
			type: AuthTypes;
			authURL?: string;
			tokenURL?: string;
		}
	) {
		this._passport.use(
			new strategy(
				{
					clientID: api.id,
					clientSecret: api.secret,
					callbackURL: api.callback,
					scope: api.scopes
				},
				this.verify(api.type)
			)
		);
	}

	private serializer() {
		this._passport.serializeUser((user: any, done) => {
			return done(null, user);
		});

		this._passport.deserializeUser(async (id: string, done) => {
			try {
				const user = await AuthUsers.model.findOne({ service_id: id });

				return user ? done(null, user) : done(null, null);
			} catch (err) {
				console.error(err);

				return done(err, null);
			}
		});
	}

	public readonly initialize = () => {
		return this._passport.initialize();
	};

	public readonly session = () => {
		return this._passport.session();
	};

	public get passport() {
		return this._passport;
	}
}

export default GeneralStrategy;

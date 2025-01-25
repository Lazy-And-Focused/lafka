import Database from "database/database/models.database";

const { auth_users: AuthUsers } = Database;

class GeneralStrategy {
	protected readonly _passport = require("passport");

	public constructor() {
		this.serializer();
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

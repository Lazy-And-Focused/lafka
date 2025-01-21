import passport from "passport";

import Database from "database/database/models.database";

const { auth_users: AuthUsers } = Database;

class GeneralStrategy {
    protected readonly _passport = passport;

    public constructor() {
        this.serializer();
    }

    private serializer() {
        this._passport.serializeUser((user: any, done) => {
			return done(null, user.id);
		});

		this._passport.deserializeUser(async (id: string, done) => {
			try {
				const user = await AuthUsers.model.findById(id);

				return user
                    ? done(null, user)
                    : done(null, null);
			} catch (err) {
				console.error(err);

				return done(err, null);
			}
		});
    }
}

export default GeneralStrategy;

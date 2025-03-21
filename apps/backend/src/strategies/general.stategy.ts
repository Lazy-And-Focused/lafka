import { Models } from "lafka/database";

const { auth_users: AuthUsers } = new Models();

import passport = require("passport");

import Authenticator from "./authenticator";
import { AuthUser } from "lafka/types/auth/auth-user.types";

class GeneralStrategy {
  protected readonly _passport: passport.PassportStatic = passport;
  private readonly _authenticator: Authenticator;

  public constructor() {
    this.serializer();

    this._authenticator = new Authenticator(this._passport);
  }

  public get auth(): Authenticator {
    return this._authenticator;
  }

  private serializer() {
    this._passport.serializeUser((user: AuthUser, done) => {
      return done(null, {
        id: user.id,
        profile_id: user.profile_id,
        service_id: user.service_id,

        access_token: user.access_token,
        refresh_token: user.refresh_token,

        created_at: user.created_at,
        type: user.type
      });
    });

    this._passport.deserializeUser(async (u: string, done) => {
      try {
        const user = await AuthUsers.model.findOne({
          id: u
        });

        return user
          ? done(null, {
              id: user.id,
              profile_id: user.profile_id,
              service_id: user.service_id,

              access_token: user.access_token,
              refresh_token: user.refresh_token,

              created_at: user.created_at,
              type: user.type
            } as AuthUser)
          : done(null, null);
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

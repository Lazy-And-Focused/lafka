import Database, { Models } from "lafka/database";

import passport = require("passport");
import { Profile } from "passport";

import { Strategy, VerifyCallback, VerifyFunction } from "passport-oauth2";

import Api from "api/index.api";
import { AuthTypes } from "lafka/types";
import { Model } from "mongoose";

const api = new Api();

const CreateOrUpdate = async <T>({
  model,
  findData,
  data
}: {
  model: Model<T>;
  findData: Partial<T>;
  data: Partial<T>;
}) => {
  const finded = await model.findOne(findData);

  if (!finded) {
    // ВЫНЕСТИ В static
    return model.create({ ...findData, ...data, id: Database.generateId(), created_at: new Date().toISOString() });
  }

  return model.findOneAndUpdate(findData, data, {
    returnDocument: "after"
  });
};
/**
 * @types [AuthTypes, string, string[]?] (first, second, third)
 * @first the method of authentication
 * @second the module in passport
 * @third a scopes
 */
const defaultPassports: [AuthTypes, string, string[]?][] = [
  ["google", "passport-google-oauth20", ["profile"]],
  ["yandex", "passport-yandex"]
];

class Authenticator {
  private readonly _passport: passport.PassportStatic;

  public constructor(passport: passport.PassportStatic) {
    this._passport = passport;
  }

  public init = () => {
    for (const passport of defaultPassports) {
      const strategy = require(passport[1]).Strategy;
      this.strategy(strategy, {
        ...api.getApi(passport[0].toUpperCase() as Uppercase<AuthTypes>),
        type: passport[0],
        scopes: passport[2]
      });
    }
  };

  protected verify<Done extends (...data: unknown[]) => void = VerifyCallback>(type: AuthTypes) {
    return async (access_token: string, refresh_token: string, profile: Profile, done: Done) => {
      try {
        const { id } = profile;

        const user = (await CreateOrUpdate({
          model: new Models().users.model,
          findData: {
            username: profile.displayName || profile.name.givenName
          },
          data: {}
        })).toObject();

        const auth = (await CreateOrUpdate({
          model: new Models().auth.model,
          findData: { profile_id: user.id },
          data: {
            access_token,
            refresh_token,
            service_id: id,
            type: type,            
          }
        })).toObject();

        return done(null, auth);
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
}

export default Authenticator;

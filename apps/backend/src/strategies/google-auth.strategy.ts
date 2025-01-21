import passport from "passport";

import { Strategy, VerifyCallback } from "passport-google-oauth2";

import GoogleApi from "api/google.api";
import Api from "api";

import GeneralStrategy from "./general.stategy";

import AuthUser from "database/classes/default/auth-user.class";
import User from "database/classes/default/user.class";

const googleApi = new GoogleApi();
const api = new Api();

class GooglePassport extends GeneralStrategy {
    public constructor() {
        super();

        this.init();
    }

    private init() {
        this._passport.use(
            new Strategy(
                {
                    clientID: api.googleApi.id,
                    clientSecret: api.googleApi.secret,
                    callbackURL: api.googleApi.callback,
                },
                async (
                    access_token: string,
					refresh_token: string,
					profile: passport.Profile,
					done: VerifyCallback
                ) => {
                    const { id } = profile;

                    const authUser = await new AuthUser({
                        _id: id,
                        access_token,
                        refresh_token,
                        type: "google",
                        profile_id: ""
                    }).init();

                    console.log(profile);
                    console.log(await googleApi.getUser(access_token));

/*                     const user = new User({
                        username: (await googleApi.getUser(access_token)).data.displayName                      
                    }); */
                }
            )
        )
    };
}

export default GooglePassport;

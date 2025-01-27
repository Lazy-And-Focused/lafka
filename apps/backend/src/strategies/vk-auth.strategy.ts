import {
    Strategy,
    VerifyCallback,
    Profile
} from "passport-vkontakte";

import Api from "api/index.api";

import GeneralStrategy from "./general.stategy";

import AuthUser from "database/classes/default/auth-user.class";
import User from "database/classes/default/user.class";
import Database from "database/database/models.database";

const api = new Api();

class VkStrategy extends GeneralStrategy {
    public constructor() {
		super();

		this.init();
	}

    private init() {
        this._passport.use(
            new Strategy(
            {
                clientID: api.vkApi.id,
                clientSecret: api.vkApi.secret,
                callbackURL: api.vkApi.callback
            },
            async (
                access_token: string,
                refresh_token: string,
                profile: Profile,
                done: VerifyCallback
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
                        type: "vk",
                        profile_id: user.id
                    }).init();

                    return done(null, authUser);
                } catch (error) {
                    console.log(error);

                    return done(error, null);
                };
            })
        );
    }
};

export default VkStrategy;

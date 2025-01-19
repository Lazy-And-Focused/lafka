import passport from "passport";

import { Strategy } from "passport-google-oauth2";

class GooglePassport {
    private readonly _passport = passport;
    
    public constructor() {
        this.init();
    }

    private init() {

    };
}
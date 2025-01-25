import GeneralStrategy from "./general.stategy";
import GooglePassport from "./google-auth.strategy";

class Passport extends GeneralStrategy {
    public constructor() {
        super();

        new GooglePassport();
    }
}

export default Passport;
import GeneralStrategy from "./general.stategy";
import GooglePassport from "./google-auth.strategy";
import VkStrategy from "./vk-auth.strategy";

class Passport extends GeneralStrategy {
	public constructor() {
		super();

		new GooglePassport();
		new VkStrategy();
	}
}

export default Passport;

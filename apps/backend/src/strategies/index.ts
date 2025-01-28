import GeneralStrategy from "./general.stategy";
// import GooglePassport from "./google-auth.strategy";
// import YandexPassport from "./yandex-auth.strategy";

class Passport extends GeneralStrategy {
	public constructor() {
		super();

		this.defaultInitialize();

		// new GooglePassport();
		// new YandexPassport();
	}
}

export default Passport;

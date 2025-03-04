import { config } from 'dotenv';
import { LAFka } from "lafka/types";

config();

class Api {
  public readonly env = process.env;

	public getApi(type: Uppercase<LAFka.AuthTypes>) {
		return {
			id: this.env[type + "_CLIENT_ID"],
			secret: this.env[type + "_CLIENT_SECRET"],
			callback: this.env[type + "_CALLBACK_URL"],
			api: this.env[type + "_API_URL"]
		};
	}
}

export default Api;

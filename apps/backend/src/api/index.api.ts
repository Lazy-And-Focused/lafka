import { config } from "dotenv";

import type { AuthTypes } from "types/auth/auth-user.types";

config();

class Api {
	public readonly env = process.env;

	public getApi(type: Uppercase<AuthTypes>) {
		return {
			id: this.env[type + "_CLIENT_ID"],
			secret: this.env[type + "_CLIENT_SECRET"],
			callback: this.env[type + "_CALLBACK_URL"],
			api: this.env[type + "_API_URL"]
		};
	}

	get googleApi() {
		return {
			id: this.env.GOOGLE_CLIENT_ID,
			secret: this.env.GOOGLE_CLIENT_SECRET,
			callback: this.env.GOOGLE_CALLBACK_URL,
			api: this.env.GOOGLE_API_URL
		};
	}

	get vkApi() {
		return {
			id: this.env.VK_CLIENT_ID,
			secret: this.env.VK_CLIENT_SECRET,
			callback: this.env.VK_CALLBACK_URL,
			api: this.env.VK_API_URL
		};
	}
}

export default Api;

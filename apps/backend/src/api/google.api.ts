import axios from "axios";
import Api from "api/index.api";

const api = new Api();

class GoogleApi {
	private readonly _api = api.getApi("GOOGLE").api;

	public async getUser(access_token: string) {
		return await axios.get(this._api + "/people/me", {
			headers: { Authorization: access_token }
		});
	}
}

export default GoogleApi;

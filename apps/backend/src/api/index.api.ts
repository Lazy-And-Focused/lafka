import { config } from "dotenv";
import { LAFka } from "lafka/types";
import { Cache } from "cache-manager";

config();

class Api {
  public readonly env = process.env;

  public async getCache<T>(key: string, cacheManager: Cache, cache?: string) {
    if ((!!cache && Boolean(cache) && cache !== "false") || typeof cache === "undefined") {
      return (await cacheManager.get<T>(key)) || false;
    }

    return false;
  }

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

import { env } from "services/env.service";
import { Cache } from "cache-manager";
import { AuthTypes, Response } from "lafka/types";

class Api {
  public readonly env = env;

  public createError(error: string): { successed: false, data: null, error: string } {
    return {
      successed: false,
      error: error,
      data: null,
    };
  };

  public useCache<T>(cacheManager: Cache, cache: string) {
    const cacheEnabled = (!!cache && Boolean(cache) && cache !== "false") || typeof cache === "undefined";
      
    return (async <K extends any[] = any[]>({
      getFunction,
      key,
      data
    }: {
      key: string,
      getFunction: (...data: K) => Promise<Response<T>>,
      data: K
    }): Promise<Response<T>> => {
      if (cacheEnabled) {
        const valueFromCache = (await cacheManager.get<T>(key)) || false;
        
        const value = valueFromCache
          ? <Response<T>>{ data: valueFromCache, error: null, successed: true }
          : <Response<T>>{ ...await getFunction(...data) };
  
        if (!value.successed) return value;
        if (!valueFromCache) cacheManager.set(key, value.data);
  
        return value;
      };
  
      const value = await getFunction(...data);
      
      if (!value.successed) return value;

      cacheManager.set(key, value.data);
  
      return value;
    });
  }

  public getApi(type: Uppercase<AuthTypes>) {
    return {
      id: this.env[type + "_CLIENT_ID"],
      secret: this.env[type + "_CLIENT_SECRET"],
      callback: this.env[type + "_CALLBACK_URL"],
      api: this.env[type + "_API_URL"]
    };
  }
}

export default Api;

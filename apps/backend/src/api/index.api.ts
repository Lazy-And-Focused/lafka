import { env } from "services/env.service";
import { LAFka } from "lafka/types";
import { Cache } from "cache-manager";

import { ServiceResponse } from "lafka/types/service.types";
import { GetData } from "lafka/types/backend/data.types";

class Api {
  public readonly env = env;

  public createError(error: string): { successed: false, error: string, resource: null, created_resource: null, changed_resource: null, deleted_resource: null } {
    return {
      successed: false,
      error: error,
      resource: null,
      created_resource: null,
      changed_resource: null,
      deleted_resource: null
    };
  };

  public useCache<T>(cacheManager: Cache, cache: string, type: GetData<T>["type"]) {
    const cacheEnabled = (!!cache && Boolean(cache) && cache !== "false") || typeof cache === "undefined";
    
    return async <K extends any[] = any[]>({
      getFunction,
      key,
      data
    }: {
      key: string,
      getFunction: (...data: K) => Promise<ServiceResponse<T>>,
      data: K
    }): Promise<GetData<T>> => {
      if (cacheEnabled) {
        const valueFromCache = (await cacheManager.get<T>(key)) || false;
        
        const value = valueFromCache
          ? <GetData<T>>{ resource: valueFromCache, error: null, successed: true, type }
          : <GetData<T>>{ ...await getFunction(...data), type };
  
        if (!value.successed) return { ...value, type };
        if (!valueFromCache) cacheManager.set(key, value.resource);
  
        return value;
      };
  
      const value = await getFunction(...data);
      
      if (!value.successed) return { ...value, type };

      cacheManager.set(key, value.resource);
  
      return { ...value, type };
    };
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

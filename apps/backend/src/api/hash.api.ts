import crypto from "crypto";

import Api from "api/index.api";
import { Request } from "express";

const { HASH_KEY: key }= new Api().env;

class Hash {
  private readonly _hmac: crypto.Hmac;

  public constructor() {
    this._hmac = crypto.createHmac("sha512", key);
  };

  public execute(data: string) {
    this._hmac.update(data);
    return this._hmac.digest('hex');
  }

  public static parse(token: string|Request): {
    successed: boolean,
    id?: string,
    profile_id?: string,
    token?: string
  } {
    const [ id, profile_id, hash ] = typeof token === "string"
      ? token.split("-")
      : token.headers.token.toString().split("-");

    if (!id || !hash || !profile_id) return { successed: false };

    return { successed: true, id, profile_id, token: hash } as const;
  }
}

export default Hash;
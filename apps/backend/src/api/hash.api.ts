import crypto from "crypto";

import Api from "api/index.api";
import { Request } from "express";

const { HASH_KEY: key } = new Api().env;

const PARSE_ERROR = {
  successed: false,
  id: false,
  profile_id: false,
  token: false
} as const;
type ParseReturnType = Readonly<{
  successed: true;
  id: string;
  profile_id: string;
  token: string;
}> | typeof PARSE_ERROR;

class Hash {
  private readonly _hmac: crypto.Hmac;

  public constructor() {
    this._hmac = crypto.createHmac("sha512", key);
  }

  public execute(data: string) {
    this._hmac.update(data);
    return this._hmac.digest("hex");
  }

  public static parse(token: string | Request): ParseReturnType {
    if (typeof token !== "string" && !!token.headers.token)
      return PARSE_ERROR;
 
    const [id, profile_id, hash] =
      typeof token === "string" ? token.split("-") : token.headers.token.toString().split("-");

    if (!id || !hash || !profile_id)
      return PARSE_ERROR;

    return { successed: true, id, profile_id, token: hash } as const;
  }
}

export default Hash;

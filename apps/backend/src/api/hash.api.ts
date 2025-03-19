import crypto from "crypto";

import Api from "api/index.api";

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
}

export default Hash;
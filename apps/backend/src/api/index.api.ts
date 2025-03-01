import { config } from 'dotenv';

import type { AuthTypes } from 'types/auth/auth-user.types';

config();

class Api {
  public readonly env = process.env;

  public getApi(type: Uppercase<AuthTypes>) {
    return {
      id: this.env[type + '_CLIENT_ID'],
      secret: this.env[type + '_CLIENT_SECRET'],
      callback: this.env[type + '_CALLBACK_URL'],
      api: this.env[type + '_API_URL'],
    };
  }
}

export default Api;

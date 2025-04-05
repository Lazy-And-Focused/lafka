import { config } from "dotenv";
config();

export const LAZY_ENV: {
  PORT: string|undefined;
  CLIENT_URL: string|undefined;
  
  GOOGLE_CLIENT_ID: string|undefined;
  GOOGLE_CLIENT_SECRET: string|undefined;
  GOOGLE_CALLBACK_URL: string|undefined;
  GOOGLE_API_URL: string|undefined;
  
  YANDEX_CLIENT_ID: string|undefined;
  YANDEX_CLIENT_SECRET: string|undefined;
  YANDEX_CALLBACK_URL: string|undefined;
  
  MONGO_URL: string|undefined;
  
  HASH_KEY: string|undefined;
  ENCODING_TYPE: string|undefined;
} = {
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  GOOGLE_API_URL: process.env.GOOGLE_API_URL,
  
  YANDEX_CLIENT_ID: process.env.YANDEX_CLIENT_ID,
  YANDEX_CLIENT_SECRET: process.env.YANDEX_CLIENT_SECRET,
  YANDEX_CALLBACK_URL: process.env.YANDEX_CALLBACK_URL,
  
  MONGO_URL: process.env.MONGO_URL,
  
  HASH_KEY: process.env.HASH_KEY,
  ENCODING_TYPE: process.env.ENCODING_TYPE
} as const;

type RequiredEnvType = {
  CLIENT_URL: string;
  
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  GOOGLE_API_URL: string;
  
  YANDEX_CLIENT_ID: string;
  YANDEX_CLIENT_SECRET: string;
  YANDEX_CALLBACK_URL: string;

  MONGO_URL: string;

  HASH_KEY: string;
};

type LazyEnvType = typeof LAZY_ENV;
type EnvKeys = keyof LazyEnvType;
type RequiredEnvKeys = keyof RequiredEnvType;

type NonRequiredEnvType = {
  [P in Exclude<EnvKeys, RequiredEnvKeys>]?: string
};

type NonRequiredEnvKeys = keyof NonRequiredEnvType;

export const REQUIRED_ENV_KEYS: RequiredEnvKeys[] = [
  "CLIENT_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "GOOGLE_API_URL",
  "YANDEX_CLIENT_ID",
  "YANDEX_CLIENT_SECRET",
  "YANDEX_CALLBACK_URL",
  "MONGO_URL",
  "HASH_KEY",
] as const;

export const NON_REQUIRED_ENV_KEYS: NonRequiredEnvKeys[] = [
  "ENCODING_TYPE",
  "PORT"
];

type UniversalEnv<
  R extends boolean = true,
  K extends boolean = true,
> = K extends true
  ? R extends true
    ? RequiredEnvKeys
    : NonRequiredEnvKeys
  : R extends true
    ? RequiredEnvType
    : NonRequiredEnvType;

export type EnvType = Required<RequiredEnvType & NonRequiredEnvType>;

const NON_REQUIRED_ENV_DEFAULT: NonRequiredEnvType = {
  ENCODING_TYPE: "hex",
  PORT: "3001"
}

const ENV: EnvType = (() => {
  return Object.fromEntries(
    Object.keys(LAZY_ENV).map((key) => {
      if (!LAZY_ENV[key] && (REQUIRED_ENV_KEYS as string[]).includes(key))
        throw new Error(`key: ${key} in .env is undefined, but must be define`);
  
      return [key, LAZY_ENV[key] || NON_REQUIRED_ENV_DEFAULT[key]];
    })
  ) as EnvType;
})();

export class Env {
  public readonly env = ENV;

  public get<R extends boolean = true>(key: UniversalEnv<R, true>): string {
    return ENV[key];
  };
};
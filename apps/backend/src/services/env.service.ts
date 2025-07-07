import { config } from "dotenv";
config();

export const REQUIRED = [
  "CLIENT_URL",
  
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "GOOGLE_API_URL",
  
  "YANDEX_CLIENT_ID",
  "YANDEX_CLIENT_SECRET",
  "YANDEX_CALLBACK_URL",
  
  "MONGO_URL",
  "SESSION_SECRET",
  "HASH_KEY",
] as const;

export const ALL = [
  ...REQUIRED,
  "ENCODING_TYPE",
  "PORT"
] as const; 

export type Required = (typeof REQUIRED)[number];
export type All = (typeof ALL)[number];
export type Partial = Exclude<All, Required>;

const DEFAULT: Record<Partial, string> = {
  ENCODING_TYPE: "hex",
  PORT: "3001"
};

(() => {
  let isError = false;

  REQUIRED.forEach((key) => {
    if (process.env[key]) return;

    isError = true;
    console.log("Key " + key + " is not defined in env");
  });

  if (isError) return process.exit();
})();

export const env: Record<All, string> = {
  ...DEFAULT,
  ...process.env as Record<All, string>,
};

export default env;
import type { Models } from "../schemas";
import { keys as databaseKeys } from "../schemas";

export const parse = <T>(data: T, type: Models): T => {
  const output: { [key: string]: unknown } = {};
  const keys = databaseKeys[type];
  keys.forEach((k: string) => {
    if (!(data as { [key: string]: unknown })[k]) return;

    output[k] = (data as { [key: string]: unknown })[k];
  });
  return output as T;
};

export default parse;
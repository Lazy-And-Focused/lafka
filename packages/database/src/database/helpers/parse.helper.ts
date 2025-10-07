import type { Models } from "../schemas";
import { schemas } from "../schemas";

export const parse = <T>(data: T, type: Models): T => {
  return Object.fromEntries(
    schemas[type].keys.map((key: string) => [key, data[key]]),
  ) as T;
};

export default parse;

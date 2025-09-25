import type { Models } from "../schemas";
import { keys as databaseKeys } from "../schemas";

export const parse = <T>(data: T, type: Models): T => {
  return Object.fromEntries(
    databaseKeys[type].map((key: string) => [key, data[key]]),
  );
};

export default parse;

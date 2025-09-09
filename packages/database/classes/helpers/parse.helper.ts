import { Schemas } from "database/schemas";
import { LAFka } from "lafka/types";

const parse = <T extends { id: string }>(data: T, type: Schemas.Models): T => {
  const output: { [key: string]: unknown } = {};
  const keys = LAFka.Database.KEYS[type];
  keys.forEach((k: string) => {
    output[k] = (data as { [key: string]: unknown })[k];
  });
  return output as T;
};

export default parse;
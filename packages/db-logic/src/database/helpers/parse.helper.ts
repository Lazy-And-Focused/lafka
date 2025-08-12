import { Schemas } from "database/schemas";

const parse = <T>(data: T, type: Schemas.Models): T => {
  const output: { [key: string]: unknown } = {};
  const keys = Schemas.keys[type];
  keys.forEach((k: string) => {
    if (!(data as { [key: string]: unknown })[k]) return;

    output[k] = (data as { [key: string]: unknown })[k];
  });
  return output as T;
};

export default parse;
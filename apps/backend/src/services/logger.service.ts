import { Injectable } from "@nestjs/common";

import { Configurator } from "fock-logger/config";
import FockLogger, { Colors } from "fock-logger";

new Configurator({
  create_file: true,
  overwrite_file: true,
  logging: false,
  date: true,
  dir: "./",
  colors: [Colors.green, Colors.green],
});

export const logger = new FockLogger("[BAD]", {
  colors: [Colors.green, Colors.green],
  logging: false,
});

type Logger = FockLogger<string, string>;
type LoggerParameters<Key extends keyof Pick<Logger, "execute" | "error">> =
  Parameters<Logger[Key]>;

@Injectable()
export class LoggerService {
  public constructor() {}

  public execute(...[text, data]: LoggerParameters<"execute">) {
    return logger.execute(text, {
      ...data,
      write: false,
    });
  }

  public error(...parameters: LoggerParameters<"error">) {
    return logger.error(...parameters);
  }
}

import type { Alias, ProgramMode } from "./program-mode.types";
import {
  ALIASES,
  ALIASES_KEYS,
  DEFAULT_MODE,
  MODES,
} from "./program-mode.constants";

const isAlias = (value: string): boolean => {
  return ALIASES_KEYS.includes(value);
};

const isMode = (value: string): boolean => {
  return (MODES as readonly string[]).includes(value);
};

export { ProgramMode };

export const normalizeProgramMode = (mode?: string): ProgramMode => {
  if (!mode) {
    return DEFAULT_MODE;
  }

  if (!isMode(mode)) {
    throw new Error(`unknown program mode in .env: ${mode}`);
  }

  if (isAlias(mode)) {
    return ALIASES[mode as Alias];
  }

  return mode as ProgramMode;
};

export const getEnvFileName = () => {
  const mode = normalizeProgramMode(process.env.PROGRAM_MODE);
  if (mode === "production") {
    return ".env" as const;
  }

  return `.env.${mode}` as const;
};

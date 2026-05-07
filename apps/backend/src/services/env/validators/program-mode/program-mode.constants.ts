export const MODES = [
  "dev",
  "development",

  "prod",
  "production",

  "swagger",

  "test",
  "testing",
] as const;

export const ALIASES = {
  dev: "development",
  prod: "production",
  test: "testing",
} as const;

export const DEFAULT_MODE = "production" as const;

export const ALIASES_KEYS = Object.keys(ALIASES);

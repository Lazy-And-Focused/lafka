import type { ALIASES, MODES } from "./program-mode.constants";

export type Alias = keyof typeof ALIASES;
export type Mode = (typeof MODES)[number];

export type ProgramMode = Exclude<Mode, Alias>;

export const MODELS = ["auth", "posts", "comments", "users"] as const;
export type Models = (typeof MODELS)[number];

export const AUTH_TYPES = ["google", "yandex"] as const;
export type AuthTypes = (typeof AUTH_TYPES)[number];
export const AUTH_TYPES = ["google", "yandex"] as const;

export type AuthTypes = (typeof AUTH_TYPES)[number];

export const AU_KEYS = [
  "id",
  "profile_id",
  "service_id",
  "access_token",
  "refresh_token",
  "created_at",
  "type"
] as const;

export interface AuthUser {
  id: string;
  profile_id: string;
  service_id: string;
  access_token: string;
  refresh_token?: string;
  created_at: Date;
  type: AuthTypes;
}

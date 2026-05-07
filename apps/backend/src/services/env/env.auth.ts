import { AuthTypes } from "@1/types";

export type AuthData = (typeof AUTH_DATA)[number];
export type AuthProperty = `${Uppercase<AuthTypes>}_${AuthData}`;

export const AUTH_TYPES = Object.keys(AuthTypes).map(
  (key) => key.toUpperCase() as Uppercase<AuthTypes>,
);

export const AUTH_DATA = [
  "CLIENT_ID",
  "CLIENT_SECRET",
  "CALLBACK_URL",
] as const;

export const GROUPED_AUTH_PROPERTIES = Object.fromEntries(
  AUTH_TYPES.map((type) => {
    const map = AUTH_DATA.map(
      (data) => [data, `${type}_${data}`] as [AuthData, AuthProperty],
    );
    const data = Object.fromEntries(map) as Record<AuthData, AuthProperty>;

    return [type, data] as const;
  }),
) as Record<Uppercase<AuthTypes>, Record<AuthData, AuthProperty>>;

export const AUTH_PROPERTIES = Object.keys(GROUPED_AUTH_PROPERTIES).flatMap(
  (key) => {
    const properties = GROUPED_AUTH_PROPERTIES[key as Uppercase<AuthTypes>];
    return Object.keys(properties).map(
      (property) => properties[property as AuthData],
    );
  },
);

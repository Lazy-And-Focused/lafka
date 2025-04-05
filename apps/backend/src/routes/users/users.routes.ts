export const USERS_CONTROLLER = ["users", "u"];

export const USERS_ROUTES = {
  GET_ME: "",
  GET: ":identifier",
  POST: ":identifier",
  DELETE: ":identifier",
  PUT: ":identifier"
} as const;

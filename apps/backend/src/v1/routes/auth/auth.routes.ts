import { Routes } from "@/utils";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "auth",

  routes: {
    GET: ["/", "/oauth2"],
    GET_ME: "/@me",
    OAUTH2_GET: "/oauth2/:method",
    OAUTH2_GET_CALLBACK: "/oauth2/:method/callback",
    POST: "/",
  },

  operations: {
    GET: {
      summary: "getting all authenticate methods",
    },
    GET_ME: {
      summary: "getting a self user",
    },
    OAUTH2_GET: {
      summary: "redirecting to authentication system",
    },
    OAUTH2_GET_CALLBACK: {
      summary: "callback from authentication system",
    },
    POST: {
      summary: "creating a user by password",
    },
  },
}).execute();

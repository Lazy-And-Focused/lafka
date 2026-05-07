import { Routes } from "@/utils";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "test",

  routes: {
    GET: "/",
    GET_PUBLIC: "/public",
    GET_TOO_MANY_REQUESTS_NON_PROTECTED: "/too-many-requests",
  },

  operations: {
    GET: {
      summary: "Protected route",
    },

    GET_PUBLIC: {
      summary: "Public protected route",
    },

    GET_TOO_MANY_REQUESTS_NON_PROTECTED: {
      summary: "Public non protected route",
    },
  },
}).execute();

import { Routes } from "@/utils/routes.utils";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "sentry",

  routes: {
    GET: "/",
    GET_ERROR: "/error",
    GET_HTTP: "/http",
  },

  operations: {
    GET: {
      summary: "Using a `logger.info` from `@sentry/nestjs`",
    },
    GET_ERROR: {
      summary: "Testing an error for sentry",
    },
    GET_HTTP: {
      summary: "Testing an `HttpExсeption` from sentry",
    },
  },
}).execute();

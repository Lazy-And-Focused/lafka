export const RIGHTS_CONTROLLER = ["rights", "r"] as const;

export const RIGHTS_ROUTES = {
  GET_MY: "",
  GET: ":method/:id",
  PUT: ":method/:id",
  DELETE: ":method/:id",
} as const;
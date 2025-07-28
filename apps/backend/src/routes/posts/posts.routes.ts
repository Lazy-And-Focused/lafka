export const ROUTE = ["posts", "p"];

export const ROUTES = {
  GET: "/",
  GET_ONE: "/:id",
  POST: "/",
  PUT: "/:id",

  PATCH_BLOCK: "/:id/block",
  PATCH_FOLLOW: "/:id/follow",

  DELETE: "/:id",

  GET_COMMENTS: "/:id/comments",
  POST_COMMENT: "/:id/comments",
} as const;

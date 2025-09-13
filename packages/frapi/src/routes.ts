import type { Post, Response, User, CreatePost } from "@lafka/types";

// FOUTER__COMPILED__OVERWRITE_THIS \\

type Routes = {
  "GET users/": {
    method: "GET",
    path: "/",
    parent: "users",
    return: Response<User>,
    arguments: {
      query: {},

      body: {}
    }
  },

  "GET users/:slug": {
    method: "GET",
    path: "/:slug",
    parent: "users",
    return: Response<User>,
    arguments: {
      query: {},

      body: {}
    }
  },

  "PUT users/:slug": {
    method: "PUT",
    path: "/:slug",
    parent: "users",
    return: Response<User>,
    arguments: {
      body: {},

      headers: {
        token: string
      },

      query: {
        cache: boolean
      }
    }
  },

  "DELETE users/:slug": {
    method: "DELETE",
    path: "/:slug",
    parent: "users",
    return: Response<User>,
    arguments: {
      headers: {
        token: string
      },

      body: {},

      query: {}
    }
  }
}

// FOUTER__COMPILED__OVERWRITE_THIS \\
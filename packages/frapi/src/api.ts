import type {
  Response,

  CreateComment,
  CreatePost,

  Comment,
  Post,
  User
} from "@lafka/types";

export namespace Api {
  export const METHOD_REGEXP = /GET|POST|PUT|DELETE|PAST/;
  
  export type Routes = {
    users: {
      "GET /:id": {
        return: Response<User>,
        path: "/:id",
        
        body?: null,
        headers?: null,
        query?: { cache?: boolean }
      },

      "PUT /:id": {
        return: Response<unknown>,
        path: "/:id",

        body: Partial<User>,
        headers: { token: string },

        query?: { cache?: boolean }
      },

      "PATCH /:id/follow": {
        return: Response<unknown>,
        path: "/:id/follow",

        body?: null,
        query?: null,

        headers: { token: string },
      },

      "DELETE /:id": {
        return: Response<unknown>,
        path: "/:id",

        headers: { token: string }

        body?: null,
        query?: null,
      }
    },

    posts: {
      "GET /": {
        return: Response<Post>,
        path: "/",

        body?: null,
        headers?: null,

        query?: {
          offset?: number,
          count?: number,
          sortBy?: "likes" | "dislikes" | "followers" | "created_at",
          sortType?: "asc" | "desc" | 1 | -1 | true | false,
        }
      },

      "GET /:id": {
        return: Response<Post>,
        path: "/:id",
        
        body?: null,
        headers?: null,
        query?: null
      },

      "POST /": {
        return: Response<Post>,
        path: "/",

        body: CreatePost,
        headers: { token: string },

        query?: null
      },

      "PUT /:id": {
        return: Response<unknown>,
        path: "/:id",

        body: Partial<Post>,
        headers: { token: string },
        
        query?: null
      },

      "PATCH /:id/block": {
        return: Response<unknown>,
        path: "/:id/block",

        body?: null,
        headers: { token: string },

        query?: null
      },

      "PATCH /:id/follow": {
        return: Response<unknown>,
        path: "/:id/follow",

        body?: null,
        headers: { token: string },

        query?: null
      },

      "DELETE /:id": {
        return: Response<unknown>,
        path: "/:id",

        headers: { token: string },
        
        body?: null,
        query?: null
      },

      "GET /:id/comments": {
        return: Response<string[]>,
        path: "/:id/comments",

        body?: null,
        headers?: null,
        query?: {
          cache?: boolean,
          length?: number,
          offset?: number
        }
      },

      "POST /:id/comments": {
        return: Response<Comment>,
        path: "/:id/comments",

        body: CreateComment,
        headers: { token: string },
        query?: null
      }
    },

    comments: {
      "GET /": {
        return: Response<Comment>,
        path: "/",

        body?: null,
        headers?: null
        query: {
          cache?: boolean,
          ids?: string[]
        },
      },

      "PUT /:id": {
        return: Response<unknown>,
        path: "/:id",

        body?: Partial<Comment>,
        headers: { token: string },
        query?: null
      },

      "DELETE /:id": {
        return: Response<unknown>,
        path: "/:id",

        body?: null,
        headers: { token: string },
        query?: null
      }
    },
    
    /** @template */
    organizations: {
      "GET /": {
        return: undefined,
        path: undefined,

        body: undefined,
        headers: undefined,
        query: undefined,
      }
    }
  }

  export type Path<
    Root extends keyof Routes,
  > = keyof Routes[Root];

  export type ParseRoute<
    Root extends keyof Routes,
    P extends Path<Root>
  > = {
    //@ts-ignore
    return: Routes[Root][P]["return"],
    //@ts-ignore
    path: `${Routes[Root][P]["path"]}`,
    init: {
      //@ts-ignore
      body: Routes[Root][P]["body"],
      //@ts-ignore
      headers: Routes[Root][P]["headers"],
      //@ts-ignore
      query: Routes[Root][P]["query"],
    }
  };

  export type RequestInitialize<
    Root extends keyof Api.Routes,
    URL extends Api.Path<Root>,
    OmitData extends string = "query"
  > = Omit<Partial<RequestInit>, "body"|"headers">
    & Omit<Api.ParseRoute<Root, URL>["init"], OmitData>
};
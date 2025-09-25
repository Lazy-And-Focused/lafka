import type { Post, Response, User, CreatePost } from "@lafka/types";

export namespace Api {
  export const METHOD_REGEXP = /GET|POST|PUT|DELETE|PAST/;

  export type Routes = {
    users: {
      "GET /": {
        return: Response<User>;
        path: "/";

        headers: { token: string };

        body?: null;
        query?: { cache?: boolean };
      };

      "GET /:identifier": {
        return: Response<User>;
        path: "/:identifier";

        body?: null;
        headers?: null;
        query?: { cache?: boolean };
      };

      "PUT /:identifier": {
        return: Response<User>;
        path: "/:identifier";

        body: Partial<User>;
        headers: { token: string };

        query?: { cache?: boolean; returnUser?: boolean };
      };

      "DELETE /:identifier": {
        return: Response<User>;
        path: "/:identifier";

        headers: { token: string };

        body?: null;
        query?: { returnUser?: boolean };
      };
    };

    posts: {
      "GET /": {
        return: Response<Post>;
        path: "/";

        query?: {
          offset?: number;
          count?: number;
          sortBy?:
            | "likes"
            | "dislikes"
            | "followers"
            | "created_at"
            | "changed_at";
          sortType?: "asc" | "desc" | 1 | -1 | true | false;
        };

        body?: null;
        headers?: null;
      };

      "GET /:id": {
        return: Response<Post>;
        path: "/:id";

        body?: null;
        headers?: null;
        query?: null;
      };

      "POST /": {
        return: Response<Post>;
        path: "/";

        headers: { token: string };
        body: CreatePost;

        query?: null;
      };

      "PUT /:id": {
        return: Response<Post>;
        path: "/:id";

        body: Partial<Post>;
        headers: { token: string };

        query?: null;
      };

      "DELETE /:id": {
        return: Response<Post>;
        path: "/:id";

        headers: { token: string };

        body?: null;
        query?: null;
      };
    };

    /** @template */
    comments: {
      "GET /": {
        return: undefined;
        path: undefined;

        body: undefined;
        headers: undefined;
        query: undefined;
      };
    };

    /** @template */
    organizations: {
      "GET /": {
        return: undefined;
        path: undefined;

        body: undefined;
        headers: undefined;
        query: undefined;
      };
    };
  };

  export type Path<Root extends keyof Routes> = keyof Routes[Root];

  export type ParseRoute<Root extends keyof Routes, P extends Path<Root>> = {
    //@ts-ignore
    return: Routes[Root][P]["return"];
    //@ts-ignore
    path: `${Routes[Root][P]["path"]}`;
    init: {
      //@ts-ignore
      body: Routes[Root][P]["body"];
      //@ts-ignore
      headers: Routes[Root][P]["headers"];
      //@ts-ignore
      query: Routes[Root][P]["query"];
    };
  };

  export type RequestInitialize<
    Root extends keyof Api.Routes,
    URL extends Api.Path<Root>,
    OmitData extends string = "query",
  > = Omit<Partial<RequestInit>, "body" | "headers"> &
    Omit<Api.ParseRoute<Root, URL>["init"], OmitData>;
}

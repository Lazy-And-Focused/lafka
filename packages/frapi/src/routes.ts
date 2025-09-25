import type { Post, Response, User, CreatePost } from "@lafka/types";

type SortBy = "likes" | "dislikes" | "followers" | "created_at" | "changed_at";
type SortTypes = "asc" | "desc" | 1 | -1 | true | false;

// FOUTER__COMPILED__OVERWRITE_THIS \\

export type Routes = {
  posts: {
    "GET /": {
      method: "GET";
      path: "/";
      parent: "posts";
      return: Response<Post>;
      arguments: {
        query: {
          offset?: number;
          count?: number;
          sortBy?: SortBy;
          sortType?: SortTypes;
        };

        body?: { [key: string]: string } | undefined | null;
        headers?: { [key: string]: string } | undefined | null;
      };
    };

    "GET /:id": {
      method: "GET";
      path: "/:id";
      parent: "posts";
      return: Response<Post>;
      arguments: {
        query?: undefined;
        body?: { [key: string]: string } | undefined | null;
        headers?: { [key: string]: string } | undefined | null;
      };
    };

    "POST /": {
      method: "POST";
      path: "/";
      parent: "posts";
      return: Response<Post>;
      arguments: {
        headers: string;
        body: CreatePost;
        query?: { [key: string]: string } | undefined | null;
      };
    };

    "PUT /:id": {
      method: "PUT";
      path: "/:id";
      parent: "posts";
      return: Response<Post>;
      arguments: {
        headers: string;
        body: Partial<Post>;
        query?: { [key: string]: string } | undefined | null;
      };
    };

    "DELETE /:id": {
      method: "DELETE";
      path: "/:id";
      parent: "posts";
      return: Response<string>;
      arguments: {
        headers: string;
        query?: { [key: string]: string } | undefined | null;
        body?: { [key: string]: string } | undefined | null;
      };
    };
  };

  users: {
    "GET /": {
      method: "GET";
      path: "/";
      parent: "users";
      return: Response<User>;
      arguments: {
        query: boolean;
        body?: { [key: string]: string } | undefined | null;
        headers?: { [key: string]: string } | undefined | null;
      };
    };

    "GET /:slug": {
      method: "GET";
      path: "/:slug";
      parent: "users";
      return: Response<User>;
      arguments: {
        query: boolean;
        body?: { [key: string]: string } | undefined | null;
        headers?: { [key: string]: string } | undefined | null;
      };
    };

    "PUT /:slug": {
      method: "PUT";
      path: "/:slug";
      parent: "users";
      return: Response<User>;
      arguments: {
        body: Partial<User>;
        headers: string;
        query?: { [key: string]: string } | undefined | null;
      };
    };

    "DELETE /:slug": {
      method: "DELETE";
      path: "/:slug";
      parent: "users";
      return: Response<User>;
      arguments: {
        headers: string;
        query?: { [key: string]: string } | undefined | null;
        body?: { [key: string]: string } | undefined | null;
      };
    };
  };
};

// FOUTER__COMPILED__OVERWRITE_THIS \\

export type Path<Root extends keyof Routes> = keyof Routes[Root];

export type ParseRoute<Root extends keyof Routes, P extends Path<Root>> = {
  //@ts-ignore
  return: Routes[Root][P]["return"];
  //@ts-ignore
  path: `${Root}${Routes[Root][P]["path"]}`;
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
  Root extends keyof Routes,
  URL extends Path<Root>,
  OmitData extends string = "query",
> = Omit<Partial<RequestInit>, "body" | "headers"> &
  Omit<ParseRoute<Root, URL>["init"], OmitData>;

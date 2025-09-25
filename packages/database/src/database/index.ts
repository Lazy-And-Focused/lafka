import type { PickCreateData, ModelData } from "@lafka/types/mongodb.types";
import type { Auth, Comment, LazyPost, User } from "@lafka/types";

import { keys, databases } from "./schemas";
import Model from "./model";

import { Helpers } from "./helpers";

export namespace Constructors {
  export type auth_users = ModelData<Omit<Auth, "created_at">> & {
    profile_id?: string;
  };
  export type comments = PickCreateData<
    Comment,
    "author_id" | "post_id" | "content"
  > & {
    id?: string;
  };

  export type posts = PickCreateData<
    LazyPost,
    "content" | "creator_id" | "name" | "type"
  > & { _id?: string };

  export type users_data = PickCreateData<User, "username" | "created_at"> & {
    id?: string;
  };

  export type users<T> = T extends true
    ? Partial<User> & { id: string }
    : PickCreateData<User, "username"> & { id?: string };
}

class Database {
  private readonly _auth: Model<Auth, Partial<Auth>>;
  private readonly _comments: Model<Comment>;

  private readonly _posts: Model<
    LazyPost,
    Pick<LazyPost, "content" | "creator_id" | "name" | "type">
  >;

  private readonly _users: Model<User, Pick<User, "username">>;
  private readonly _keys = keys;
  private readonly _model = Model;

  public readonly helpers = Helpers;

  public static readonly parse = Helpers.parse;

  public constructor() {
    this._auth = new Model<Auth>(databases.auth);
    this._comments = new Model<Comment>(databases.comments);
    this._posts = new Model<LazyPost>(databases.posts);
    this._users = new Model<User>(databases.users);
  }

  public get model() {
    return this._model;
  }

  public get keys() {
    return this._keys;
  }

  public get auth() {
    return this._auth;
  }

  public get comments() {
    return this._comments;
  }

  public get posts() {
    return this._posts;
  }

  public get users() {
    return this._users;
  }
}

export { Database };

export default Database;

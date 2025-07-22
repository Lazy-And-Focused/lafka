import { Schemas } from "./schemas";
import Model from "./model";

import type { PickCreateData, ModelData } from "lafka/types/mongodb.types";
import { Helpers } from "./helpers";
import { Auth, Comment, LazyPost, User } from "lafka/types";

export namespace Constructors {
  export type auth_users = ModelData<Omit<Auth, "created_at">> & { profile_id?: string };
  export type comments = PickCreateData<Comment, "author_id" | "post_id" | "content"> & {
    id?: string;
  };

  export type posts = PickCreateData<
    LazyPost,
    "content" | "creator_id" | "name" | "type"
  > & { _id?: string };

  export type users_data = PickCreateData<User, "username" | "created_at"> & { id?: string };

  export type users<T> = T extends true
    ? Partial<User> & { id: string }
    : PickCreateData<User, "username"> & { id?: string };
}

class Database {
  private readonly _auth_users: Model<Auth, Partial<Auth>>;
  private readonly _comments: Model<Comment>;

  private readonly _posts: Model<
    LazyPost,
    Pick<LazyPost, "content" | "creator_id" | "name" | "type">
  >;

  private readonly _users: Model<User, Pick<User, "username">>;
  private readonly _keys = Schemas.keys;
  private readonly _model = Model;

  public readonly helpers = Helpers;

  public static readonly parse = Helpers.parse;

  public constructor() {
    this._auth_users = new Model<Auth>(Schemas.databases.auth);
    this._comments = new Model<Comment>(Schemas.databases.comments);
    this._posts = new Model<LazyPost>(Schemas.databases.posts);
    this._users = new Model<User>(Schemas.databases.users);
  }

  public get model() {
    return this._model;
  }

  public get keys() {
    return this._keys;
  }

  public get auth_users() {
    return this._auth_users;
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

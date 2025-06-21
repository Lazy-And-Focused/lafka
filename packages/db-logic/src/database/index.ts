import { Schemas } from "./schemas";
import Model from "./model";

import type { PickCreateData, ModelData } from "lafka/types/mongodb.types";
import { LAFka } from "lafka/types";

type AuthUser = LAFka.AuthUser;
type Comment = LAFka.Comment;
type User = LAFka.User;

export namespace Constructors {
  export type auth_users = ModelData<Omit<AuthUser, "created_at">> & { profile_id?: string };
  export type comments = PickCreateData<Comment, "author_id" | "post_id" | "content"> & {
    id?: string;
  };

  export type posts = PickCreateData<
    LAFka.LazyPost,
    "content" | "creator_id" | "name" | "type"
  > & { _id?: string };

  export type users_data = PickCreateData<User, "username" | "created_at"> & { id?: string };

  export type users<T> = T extends true
    ? Partial<User> & { id: string }
    : PickCreateData<User, "username"> & { id?: string };
}

class Database {
  private readonly _auth_users: Model<AuthUser, Partial<AuthUser>>;
  private readonly _comments: Model<Comment>;

  private readonly _posts: Model<
    LAFka.LazyPost,
    Pick<LAFka.LazyPost, "content" | "creator_id" | "name" | "type">
  >;

  private readonly _users: Model<User, Pick<User, "username">>;
  private readonly _keys = Schemas.keys;
  private readonly _model = Model;

  public constructor() {
    this._auth_users = new Model<AuthUser>(Schemas.databases.auth_users);
    this._comments = new Model<Comment>(Schemas.databases.comments);
    this._posts = new Model<LAFka.LazyPost>(Schemas.databases.posts);
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

export default Database;

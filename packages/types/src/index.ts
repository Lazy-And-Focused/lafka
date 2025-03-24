/* 
  I{name} - interface {name}
  T{name} - type {name}
  C{name} - const {name}
*/

import {
  AUTH_TYPES as CAUTH_TYPES,
  AuthTypes as TAuthTypes,
  AuthUser as IAuthUser
} from "./auth/auth-user.types";

import { BlogPost as IBlogPost } from "./posts/blog-post.types";
import { Comment as IComment } from "./content/comment.types";
import { ForumPost as IForumPost } from "./posts/forum-post.types";
import { Post as IPost } from "./posts/post.types";
import { User as IUser } from "./authors/user.types";

import {
  Link as TLink,
  PostStatus as TPostStatus,
  Tag as TTag,
  Tags as TTags
} from "./utility/utility.types";

import { KEYS as CKEYS, MODELS as CMODELS, Models as TModels } from "./database/models.types";

import {
  GetData as IGetData,
  CreateData as ICreateData,
  ChangeData as IChangeData,
  DeleteData as IDeleteData,
  DataType as TDataType
} from "./backend/data.types";

export { Rights } from "./authors/rights.types";

export namespace LAFka.Response {
  export type GetData<T> = IGetData<T>;
  export type CreateData<T> = ICreateData<T>;
  export type ChangeData<T> = IChangeData<T>;
  export type DeleteData<T> = IDeleteData<T>;
  export type DataType = TDataType;
}

export namespace LAFka {
  export const MODELS = CMODELS;
  export const AUTH_TYPES = CAUTH_TYPES;
  export const KEYS = CKEYS;

  export type Models = TModels;

  export type AuthTypes = TAuthTypes;
  export type AuthUser = IAuthUser;

  export type User = IUser;

  export type Comment = IComment;

  export type BlogPost = IBlogPost;
  export type ForumPost = IForumPost;
  export type Post = IPost;
  export type BlogAndForumPost = IBlogPost & IForumPost;

  export type Link = TLink;
  export type PostStatus = TPostStatus;
  export type Tag = TTag;
  export type Tags = TTags;
}
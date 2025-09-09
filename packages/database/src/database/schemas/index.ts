import { Link } from "./link.utility-schema";
import { Tag } from "./tag.utility-schema";

import ADB, { AuthUsersSchema, AuthUsersKeys } from "./auth.schema";
import CDB, { CommentsSchema, CommentsKeys } from "./comments.schema";
import PDB, { PostsSchema, PostsKeys } from "./posts.schema";
import UDB, { UserSchema, UserKeys } from "./user.schema";

export * from "./auth.schema";
export * from "./comments.schema";
export * from "./posts.schema";
export * from "./user.schema";

export const models = ["auth", "posts", "comments", "users"] as const;

export type Models = (typeof models)[number];

export const databases = {
  auth: ADB,
  comments: CDB,
  posts: PDB,
  users: UDB
} as const;

export const utility = {
  link: Link,
  tag: Tag
} as const;

export const keys = {
  auth: AuthUsersKeys,
  comments: CommentsKeys,
  posts: PostsKeys,
  users: UserKeys
} as const;

export const schemas = {
  auth: AuthUsersSchema,
  comments: CommentsSchema,
  posts: PostsSchema,
  users: UserSchema
} as const;

export default databases;

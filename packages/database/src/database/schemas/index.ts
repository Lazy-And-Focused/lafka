import { Link } from "./link.utility-schema";
import { Tag } from "./tag.utility-schema";

import Schema from "./schema";

import auth from "./auth.schema";
import comments from "./comments.schema";
import posts from "./posts.schema";
import users from "./users.schema";

export const models = Schema.modelsArray;
export type Models = (typeof models)[number];

export const utility = {
  link: Link,
  tag: Tag,
} as const;

export const schemas = {
  auth,
  comments,
  posts,
  users,
} as const;

export type Schemas = typeof schemas;

export default schemas;

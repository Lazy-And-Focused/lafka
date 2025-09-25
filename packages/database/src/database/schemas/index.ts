import { Link } from "./link.utility-schema";
import { Tag } from "./tag.utility-schema";

import Schema from "./schema";

import auth from "./auth.schema";
import comment from "./comment.schema";
import post from "./post.schema";
import user from "./user.schema";

export const models = Schema.modelsArray;
export type Models = (typeof models)[number];

export const utility = {
  link: Link,
  tag: Tag,
} as const;

export const schemas = {
  auth,
  comment,
  post,
  user,
} as const;

export default schemas;

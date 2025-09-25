import type { User } from "@lafka/types";

import { Rights } from "@lafka/types";

import Schema, { SchemaTypes } from "./schema";
import { Link } from "./link.utility-schema";

export const schema = new Schema<User>(Schema.models.users, {
  id: {
    type: SchemaTypes.String,
    required: true,
    unique: true
  },
  
  username: { type: SchemaTypes.String, required: true, unique: true },
  nickname: { type: SchemaTypes.String, required: false, unique: false, default: undefined },
  
  avatar: { type: SchemaTypes.String, required: false, unique: false, default: "" },
  biography: { type: SchemaTypes.String, required: false, unique: false, default: "" },
  
  created_at: { type: SchemaTypes.String, required: true, unique: false },
  
  blocked_posts: { type: [SchemaTypes.String], ref: Schema.models.posts, default: [] },
  
  blog_posts: { type: [SchemaTypes.String], ref: Schema.models.posts, default: [] },
  forum_posts: { type: [SchemaTypes.String], ref: Schema.models.posts, default: [] },
  
  followed_blog_posts: { type: [SchemaTypes.String], ref: Schema.models.posts, default: [] },
  followed_forum_posts: { type: [SchemaTypes.String], ref: Schema.models.posts, default: [] },
  
  followers: { type: [SchemaTypes.String], ref: Schema.models.users, default: [] },
  following: { type: [SchemaTypes.String], ref: Schema.models.users, default: [] },
  
  links: {
    type: [Link],
    unique: false,
    default: []
  },
  
  rights: {
    type: SchemaTypes.String,
    unique: false,
    default: Rights.CONSTANTS.raw.default.my.toString()
  }
});

export default schema;

import mongoose, { Schema, SchemaTypes } from "mongoose";

import type { LAFka } from "lafka/types";
import { Rights } from "lafka/types";
import { Link } from "./link.utility-schema";
import { SchemaParameters } from "lafka/types/mongodb.types";

const data: SchemaParameters<LAFka.User> = {
  id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  
  username: { type: SchemaTypes.String, required: true, unique: true },
  nickname: { type: SchemaTypes.String, required: false, unique: false, default: undefined },
  
  avatar: { type: SchemaTypes.String, required: false, unique: false, default: "" },
  biography: { type: SchemaTypes.String, required: false, unique: false, default: "" },
  
  created_at: { type: SchemaTypes.String, required: true, unique: false },
  
  blocked_posts: { type: [SchemaTypes.String], ref: "posts", default: [] },
  
  blog_posts: { type: [SchemaTypes.String], ref: "posts", default: [] },
  forum_posts: { type: [SchemaTypes.String], ref: "posts", default: [] },
  
  followed_blog_posts: { type: [SchemaTypes.String], ref: "posts", default: [] },
  followed_forum_posts: { type: [SchemaTypes.String], ref: "posts", default: [] },
  
  followers: { type: [SchemaTypes.String], ref: "users", default: [] },
  following: { type: [SchemaTypes.String], ref: "users", default: [] },
  
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
} as const;
const schema = new Schema<LAFka.User>(data);
const keys = Object.keys(data) as unknown as (keyof LAFka.User)[];

const database = mongoose.model("users", schema);

export { schema as UserSchema, keys as UserKeys };

export default database;

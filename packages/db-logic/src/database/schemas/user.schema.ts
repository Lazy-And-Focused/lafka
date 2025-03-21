import mongoose, { Schema, SchemaTypes } from "mongoose";

import type { LAFka } from "lafka/types";
import { Link } from "./link.utility-schema";

const schema = new Schema<LAFka.User>({
  id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },

  username: { type: SchemaTypes.String, required: true, unique: true },
  nickname: { type: SchemaTypes.String, required: false, unique: false },

  avatar: { type: SchemaTypes.String, required: false, unique: false },
  biography: { type: SchemaTypes.String, required: false, unique: false },

  created_at: { type: SchemaTypes.Date, required: true, unique: false },

  blocked_posts: [{ type: SchemaTypes.String, ref: "posts" }],

  blog_posts: [{ type: SchemaTypes.String, ref: "posts" }],
  forum_posts: [{ type: SchemaTypes.String, ref: "posts" }],

  followed_blog_posts: [{ type: SchemaTypes.String, ref: "posts" }],
  followed_forum_posts: [{ type: SchemaTypes.String, ref: "posts" }],

  followers: [{ type: SchemaTypes.String, ref: "users" }],

  links: [Link]
});

const database = mongoose.model("users", schema);

export { schema as UserSchema };

export default database;

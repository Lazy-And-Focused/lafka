import mongoose, { Schema, SchemaTypes } from "mongoose";

import type { User } from "types/authors/user.types";
import { Link } from "./link.utility-schema";

const schema = new Schema<User>({
	username: { type: SchemaTypes.String, required: true, unique: true },
	nickname: { type: SchemaTypes.String, required: false, unique: false },

	avatar: { type: SchemaTypes.String, required: false, unique: false },
	biography: { type: SchemaTypes.String, required: false, unique: false },

	created_at: { type: SchemaTypes.Date, required: true, unique: false },

	blocked_posts: [{ type: SchemaTypes.ObjectId, ref: "posts" }],

	blog_posts: [{ type: SchemaTypes.ObjectId, ref: "posts" }],
	forum_posts: [{ type: SchemaTypes.ObjectId, ref: "posts" }],

	followed_blog_posts: [{ type: SchemaTypes.ObjectId, ref: "posts" }],
	followed_forum_posts: [{ type: SchemaTypes.ObjectId, ref: "posts" }],

	followers: [{ type: SchemaTypes.ObjectId, ref: "users" }],

	links: [Link]
});

const database = mongoose.model("users", schema);

export { schema as UserSchema };

export default database;

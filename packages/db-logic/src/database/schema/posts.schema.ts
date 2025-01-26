import mongoose, { Schema, SchemaTypes } from "mongoose";

import type { ForumPost } from "types/posts/forum-post.types";
import type { BlogPost } from "types/posts/blog-post.types";

import { Tag } from "./tag.utility-schema";

const schema = new Schema<ForumPost & BlogPost>({
	id: {
		type: mongoose.SchemaTypes.String,
		required: true,
		unique: true
	},

	name: { type: SchemaTypes.String, required: true, unique: false },
	content: { type: SchemaTypes.String, required: true, unique: false },
	description: { type: SchemaTypes.String, required: false, unique: false },

	comments: [{ type: SchemaTypes.String, ref: "comments" }],
	followers: { type: SchemaTypes.Number, required: true, unique: false },

	created_at: { type: SchemaTypes.Date, required: true, unique: false },
	changed_at: { type: SchemaTypes.Date, required: false, unique: false },

	creator_id: { type: SchemaTypes.String, required: true, unique: false },

	type: { type: SchemaTypes.String, required: true, unique: false },
	view_status: { type: SchemaTypes.Number, required: true, unique: false },

	likes: { type: SchemaTypes.Number, required: true, unique: false },
	dislikes: { type: SchemaTypes.Number, required: true, unique: false },
	reposts: { type: SchemaTypes.Number, required: true, unique: false },

	tags: [Tag],
	status: { type: SchemaTypes.String, required: false, unique: false }
});

const database = mongoose.model("posts", schema);

export { schema as PostsSchema };

export default database;

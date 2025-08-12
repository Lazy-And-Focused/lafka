import mongoose, { Schema, SchemaTypes } from "mongoose";

import type { SchemaParameters } from "lafka/types/mongodb.types";
import type { Comment } from "lafka/types";

const data: SchemaParameters<Comment> = {
  id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  
  content: { type: SchemaTypes.String, required: true },
  
  created_at: { type: SchemaTypes.String, required: true },
  changed_at: { type: SchemaTypes.String, required: false },
  
  author_id: { type: SchemaTypes.String, required: true },
  post_id: { type: SchemaTypes.String, required: true },
  
  reply: { type: SchemaTypes.String, ref: "comments", required: false }
};
const schema = new Schema<Comment>(data);
const keys = Object.keys(data) as unknown as (keyof Comment)[];

const database = mongoose.model("comments", schema);

export { schema as CommentsSchema, keys as CommentsKeys };

export default database;

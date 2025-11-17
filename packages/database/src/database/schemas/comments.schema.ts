import Schema, { SchemaTypes } from "./schema";
import type { Comment } from "@lafka/types";

export const schema = new Schema<Comment>(Schema.models.comments, {
  id: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
  },

  content: { type: SchemaTypes.String, required: true },

  created_at: { type: SchemaTypes.String, required: true },
  changed_at: { type: SchemaTypes.String, required: false },

  author_id: { type: SchemaTypes.String, required: true },
  post_id: { type: SchemaTypes.String, required: true },

  reply: {
    type: SchemaTypes.String,
    ref: Schema.models.comments,
    required: false,
  },
});

export default schema;

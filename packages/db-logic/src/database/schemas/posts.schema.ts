import mongoose, { Schema, SchemaTypes } from "mongoose";

import { LAFka } from "lafka/types";
import { Tag } from "./tag.utility-schema";

const schema = new Schema<LAFka.LazyPost>({
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

  created_at: { type: SchemaTypes.String, required: true, unique: false },
  changed_at: { type: SchemaTypes.String, required: false, unique: false },

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

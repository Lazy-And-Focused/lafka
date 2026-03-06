import mongoose, { Schema, SchemaTypes } from "mongoose";

import { Tag } from "./tag.utility-schema";

import type { SchemaParameters } from "lafka/types/mongodb.types";
import type { LazyPost } from "lafka/types";

const data: SchemaParameters<LazyPost> = {
  id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  
  name: { type: SchemaTypes.String, required: true, unique: false },
  content: { type: SchemaTypes.String, required: true, unique: false },
  description: { type: SchemaTypes.String, unique: false, default: "" },
  
  comments: { type: [SchemaTypes.String], ref: "comments" },
  followers: { type: SchemaTypes.Number, required: true, unique: false },
  
  created_at: { type: SchemaTypes.String, required: true, unique: false },
  changed_at: { type: SchemaTypes.String, required: false, unique: false },
  
  creator_id: { type: SchemaTypes.String, required: true, unique: false },
  
  type: { type: SchemaTypes.String, required: true, unique: false },
  status: { type: SchemaTypes.String, unique: false, default: "open" },
  
  likes: { type: SchemaTypes.Number, unique: false, default: 0, min: 0 },
  dislikes: { type: SchemaTypes.Number, unique: false, default: 0, min: 0 },
  reposts: { type: SchemaTypes.Number, unique: false, default: 0, min: 0 },
  
  tags: {
    type: [Tag],
    default: []
  },
  
  rights: {
    type: SchemaTypes.Map,
    unique: false,
    default: new Map()
  }
};

const schema = new Schema<LazyPost>(data);
const keys = Object.keys(data) as unknown as (keyof LazyPost)[];

const database = mongoose.model("posts", schema);

export { schema as PostsSchema, keys as PostsKeys };

export default database;

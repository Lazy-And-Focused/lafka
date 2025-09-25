import type { LazyPost } from "@lafka/types";

import Schema, { SchemaTypes } from "./schema";

import { Tag } from "./tag.utility-schema";

export const schema = new Schema<LazyPost>(Schema.models.posts, {
  id: {
    type: SchemaTypes.String,
    required: true,
    unique: true
  },
  
  name: { type: SchemaTypes.String, required: true, unique: false },
  content: { type: SchemaTypes.String, required: true, unique: false },
  description: { type: SchemaTypes.String, unique: false, default: "" },
  
  comments: { type: [SchemaTypes.String], ref: Schema.models.comments },
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
})

export default schema;

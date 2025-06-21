import mongoose, { Schema, SchemaTypes } from "mongoose";
import { LAFka } from "lafka/types";
import { SchemaParameters } from "lafka/types/mongodb.types";

const data: SchemaParameters<LAFka.Comment> = {
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
const schema = new Schema<LAFka.Comment>(data);
const keys = Object.keys(data) as unknown as (keyof LAFka.Comment)[];

const database = mongoose.model("comments", schema);

export { schema as CommentsSchema, keys as CommentsKeys };

export default database;

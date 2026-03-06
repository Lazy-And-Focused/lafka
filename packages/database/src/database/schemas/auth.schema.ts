import mongoose, { Schema } from "mongoose";

import type { SchemaParameters } from "lafka/types/mongodb.types";
import type { Auth } from "lafka/types";

const data: SchemaParameters<Auth> = {
  id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  
  service_id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  
  created_at: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: false
  },
  
  profile_id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: false
  },
  
  access_token: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  
  refresh_token: {
    type: mongoose.SchemaTypes.String,
    required: false
  },
  
  type: {
    type: mongoose.SchemaTypes.String,
    required: true
  }
};
const schema = new Schema<Auth>(data);
const keys = Object.keys(data) as unknown as (keyof Auth)[];

const database = mongoose.model("auth", schema);

export { schema as AuthUsersSchema, keys as AuthUsersKeys };

export default database;

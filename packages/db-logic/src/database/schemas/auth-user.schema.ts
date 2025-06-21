import mongoose, { Schema } from "mongoose";
import { LAFka } from "lafka/types";
import { SchemaParameters } from "lafka/types/mongodb.types";

const data: SchemaParameters<LAFka.AuthUser> = {
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
const schema = new Schema<LAFka.AuthUser>(data);
const keys = Object.keys(data) as unknown as (keyof LAFka.AuthUser)[];

const database = mongoose.model("auth-users", schema);

export { schema as AuthUsersSchema, keys as AuthUsersKeys };

export default database;

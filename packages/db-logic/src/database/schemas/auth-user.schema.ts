import mongoose, { Schema } from "mongoose";
import { LAFka } from "lafka/types";

const schema = new Schema<LAFka.AuthUser>({
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
    type: mongoose.SchemaTypes.Date,
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
});

const database = mongoose.model("auth-users", schema);

export { schema as AuthUsersSchema };

export default database;

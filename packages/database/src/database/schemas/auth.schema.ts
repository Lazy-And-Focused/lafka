import type { Auth } from "@lafka/types";

import Schema, { SchemaTypes } from "./schema";

export const schema = new Schema<Auth>(Schema.models.auth, {
  id: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
  },

  service_id: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
  },

  created_at: {
    type: SchemaTypes.String,
    required: true,
    unique: false,
  },

  profile_id: {
    type: SchemaTypes.String,
    required: true,
    unique: false,
  },

  access_token: {
    type: SchemaTypes.String,
    required: true,
  },

  refresh_token: {
    type: SchemaTypes.String,
    required: false,
  },

  type: {
    type: SchemaTypes.String,
    required: true,
  },
});

export default schema;

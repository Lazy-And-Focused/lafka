import mongoose, { Schema } from "mongoose";

import { AuthUser } from "types/auth/auth-user.types";

const schema = new Schema<AuthUser>({
	service_id: {
		type: mongoose.SchemaTypes.String,
		required: true,
		unique: true
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

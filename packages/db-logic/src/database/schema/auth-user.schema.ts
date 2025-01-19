import mongoose, { Schema } from "mongoose";

import AuthUser from "types/auth/auth-user.types";

const schema = new Schema<AuthUser>({
	profile_id: {
		type: mongoose.SchemaTypes.String,
		required: true,
		unique: true
	},

	access_token: {
		type: mongoose.SchemaTypes.String,
		required: true
	},

	refresh_token: {
		type: mongoose.SchemaTypes.String,
		required: true
	},

    type: {
        type: mongoose.SchemaTypes.String,
        required: true
    }
});

const database = mongoose.model("auth-users", schema);

export { schema as AuthUsersSchema };

export default database;

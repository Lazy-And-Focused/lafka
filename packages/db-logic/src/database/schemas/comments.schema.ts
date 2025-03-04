import mongoose, { Schema, SchemaTypes } from "mongoose";
import { LAFka } from "lafka/types";

const schema = new Schema<LAFka.Comment>({
	id: {
		type: mongoose.SchemaTypes.String,
		required: true,
		unique: true
	},

	content: { type: SchemaTypes.String, required: true },

	created_at: { type: SchemaTypes.Date, required: true },
	changed_at: { type: SchemaTypes.Date, required: false },

	author_id: { type: SchemaTypes.String, required: true },
	post_id: { type: SchemaTypes.String, required: true },

	reply: { type: SchemaTypes.String, ref: "comments", required: false }
});

const database = mongoose.model("comments", schema);

export { schema as CommentsSchema };

export default database;

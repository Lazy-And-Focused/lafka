import { SchemaTypes } from "mongoose";

export const Tag = {
	id: { type: SchemaTypes.String, required: true, unique: false },
	name: { type: SchemaTypes.String, required: true, unique: false }
};

import { SchemaTypes } from "mongoose";

export const Link = {
	name: { type: SchemaTypes.String, required: true, unique: false },
	link: { type: SchemaTypes.String, required: true, unique: false }
};

import mongoose from "mongoose";

import type { Status as DatabaseStatus } from "types/schema/mongodb.types";
import { Error } from "types/schema/status.classes";

const deleteModel = async (name: string): Promise<DatabaseStatus> => {
	try {
		const data = mongoose.deleteModel(name);

		return {
			text: `Успешно удалена модель ${name}`,
			type: 1,
			data: data
		};
	} catch (err) {
		console.log(err);

		return new Error(`${err}`);
	}
};

export default deleteModel;

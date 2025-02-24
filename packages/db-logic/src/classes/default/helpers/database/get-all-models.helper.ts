import mongoose from "mongoose";

import type { Status as DatabaseStatus } from "lafka/types/schema/mongodb.types";
import { Error } from "lafka/types/schema/status.classes";

const getAllModels = async (): Promise<DatabaseStatus> => {
	try {
		const models: string[] = mongoose.modelNames();

		if (!models)
			return {
				text: "Произошла какая-то ошибка, возможно, таблиц не существует",
				type: 0
			};

		return {
			text: "Успешно найдены таблицы",
			type: 1,
			data: models
		};
	} catch (err) {
		console.error(err);

		return new Error(`${err}`);
	}
};

export default getAllModels;

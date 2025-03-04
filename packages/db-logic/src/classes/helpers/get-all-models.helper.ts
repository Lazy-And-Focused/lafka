import mongoose from "mongoose";

import type { Status as DatabaseStatus, Models } from "lafka/types/mongodb.types";
import { Error } from "lafka/types/status.classes";

const getAllModels = async (): Promise<DatabaseStatus<Models[]>> => {
	try {
		const models = mongoose.modelNames() as Models[];

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

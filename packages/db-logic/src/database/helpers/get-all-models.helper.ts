import mongoose from "mongoose";

import type { Status as DatabaseStatus, Models } from "lafka/types/mongodb.types";
import { Error } from "lafka/types/status.classes";

const getAllModels = async (): Promise<DatabaseStatus<Models[], any, boolean>> => {
  try {
    const models = mongoose.modelNames() as Models[];

    if (!models)
      return new Error("Возможно таблиц не существует", {data: []});

    return {
      text: "Успешно найдены таблицы",
      successed: true,
      error: undefined,
      data: models
    };
  } catch (err) {
    console.error(err);

    return new Error(`${err}`, {data: []});
  }
};

export default getAllModels;

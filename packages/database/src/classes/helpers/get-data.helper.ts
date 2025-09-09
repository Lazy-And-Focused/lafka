import type { Model as ModelType } from "mongoose";

import { Error, Status } from "lafka/types/status.classes";
import type { FindOptions, Status as DatabaseStatus } from "lafka/types/mongodb.types";

const getData = async <T>(
  Model: ModelType<T>,
  options: FindOptions<T>
): Promise<DatabaseStatus<T[], any, boolean>> => {
  try {
    const data = await Model.find(options.filter, options.projection, options.options);

    if (!data || data.length === 0) return new Error("Возможно, таблиц не существует", { data });

    return new Status({
      text: "Таблицы были найдены",
      successed: true,
      error: undefined,
      data
    });
  } catch (err) {
    console.error(err);

    return new Error(`${err}`);
  }
};

export default getData;

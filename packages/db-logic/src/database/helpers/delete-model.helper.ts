import mongoose from "mongoose";

import type { Status as DatabaseStatus } from "lafka/types/mongodb.types";
import { Error } from "lafka/types/status.classes";

const deleteModel = async (name: string): Promise<DatabaseStatus<mongoose.Mongoose, any, boolean>> => {
  try {
    const data = mongoose.deleteModel(name);

    return {
      text: `Успешно удалена модель ${name}`,
      successed: true,
      error: undefined,
      data: data
    };
  } catch (err) {
    console.log(err);

    return new Error(`${err}`);
  }
};

export default deleteModel;

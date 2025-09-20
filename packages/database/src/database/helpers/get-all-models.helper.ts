import type { Response } from "@lafka/types";
import type { Models } from "@lafka/types/mongodb.types";

import mongoose from "mongoose";

export const getAllModels = async (): Promise<Response<Models[]>> => {
  try {
    const models = mongoose.modelNames() as Models[];

    if (!models) {
      return {
        successed: false,
        error: "Возможно таблиц не существует",
        data: null
      }
    };

    return {
      successed: true,
      data: models,
      error: null
    };
  } catch (err) {
    console.error(err);

    return {
      successed: false,
      error: "unknown error",
      data: null
    };
  }
};

export default getAllModels;

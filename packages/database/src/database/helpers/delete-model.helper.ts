import type { Response } from "@lafka/types";

import { deleteModel as deleteMongooseModel } from "mongoose";

export const deleteModel = async (name: string): Promise<Response<string>> => {
  try {
    deleteMongooseModel(name);

    return {
      successed: true,
      error: undefined,
      data: "deleted"
    };
  } catch (err) {
    console.log(err);

    return {
      successed: false,
      data: null,
      error: "unknown error"
    };
  }
};

export default deleteModel;

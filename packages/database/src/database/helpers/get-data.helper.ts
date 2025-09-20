import type { Response } from "@lafka/types";
import type { FindOptions, GetData } from "@lafka/types/mongodb.types";
import type { Model as ModelType } from "mongoose";

export const getData = async <T>(
  Model: ModelType<T>,
  options: FindOptions<T>
): Promise<Response<GetData<T>>> => {
  try {
    const data = await Model.find(options.filter, options.projection, options.options);

    if (!data || data.length === 0) {
      return {
        successed: false,
        data: null,
        error: "Not founbd"
      }
    };

    return {
      successed: true,
      data,
      error: null
    }
  } catch (err) {
    console.error(err);

    return {
      successed: false,
      data: null,
      error: "unknown error"
    }
  }
};

export default getData;

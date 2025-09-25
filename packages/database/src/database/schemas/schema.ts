import type {
  DatabaseModel,
  SchemaParameters,
} from "@lafka/types/mongodb.types";

import { MODELS, Models } from "@lafka/types/src/database.types";
import { model, Schema as MongoSchema, SchemaTypes } from "mongoose";

export const createLazySchema = <T>(parametrs: SchemaParameters<T>) =>
  parametrs;

export class Schema<T> {
  public static readonly models = Object.fromEntries(
    MODELS.map((k) => [k, k]),
  ) as {
    [P in Models]: P;
  };

  public static readonly modelsArray = Object.values(Schema.models);

  public readonly schema: MongoSchema<T>;
  public readonly keys: (keyof T)[];
  public readonly database: DatabaseModel<MongoSchema<T>>;

  public constructor(
    public readonly name: keyof typeof Schema.models,
    public readonly parametrs: SchemaParameters<T>,
  ) {
    this.schema = new MongoSchema<T>(parametrs);
    this.keys = Object.keys(parametrs) as (keyof T)[];
    this.database = model(Schema.models[this.name], this.schema);
  }
}

export { SchemaTypes };

export default Schema;

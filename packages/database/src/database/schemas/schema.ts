import type { DatabaseModel, SchemaParameters } from "@lafka/types/mongodb.types";

import { model, Schema as MongoSchema, SchemaTypes } from "mongoose";

export const createLazySchema = <T>(parametrs: SchemaParameters<T>) => parametrs;

export class Schema<T> {
  public static readonly models = {
    auth: "auth",
    posts: "posts",
    comments: "comments",
    users: "users"
  } as const;

  public static readonly modelsArray = Object.values(Schema.models);

  public readonly schema: MongoSchema<T>;
  public readonly keys: (keyof T)[];
  public readonly database: DatabaseModel<MongoSchema<T>>;

  public constructor(
    public readonly name: string,
    public readonly parametrs: SchemaParameters<T>
  ) {
    this.schema = new MongoSchema<T>(parametrs);
    this.keys = Object.keys(parametrs) as (keyof T)[];
    this.database = model(this.name, this.schema);
  }
}

export {
  SchemaTypes
}

export default Schema;

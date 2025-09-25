import type { Model } from "mongoose";

import type {
  CreateData,
  Filter,
  FindOptions,
  UpdateOptions,
  Models,
  PickTypeInObject,
  GetData,
  DeleteData,
} from "@lafka/types/mongodb.types";

import type { Models as SchemaModels } from "./schemas/index";

import { Helpers } from "./helpers";
import { Response } from "@lafka/types";

export class Database<T, K = Partial<T>> {
  private readonly _model: Model<T>;

  public constructor(model: Model<T>) {
    this._model = model;
  }

  public get name(): Models {
    return this._model.modelName as Models;
  }

  public get model() {
    return this._model;
  }

  public static parse = <K>(data: K, type: SchemaModels): K =>
    Helpers.parse<K>(data, type);

  public static generateId(): string {
    return `${new Date().getTime()}`;
  }

  public create(doc: CreateData<T> & K) {
    return this._model.create({
      ...doc,
      created_at: new Date().toISOString(),
      id: Database.generateId(),
    });
  }

  public update(options: UpdateOptions<T>) {
    return this._model.updateOne(options.filter, options.update || {});
  }

  public push(options: {
    filter: Filter<T>;
    update: Partial<PickTypeInObject<T, any[]>>;
  }) {
    return this._model.updateOne(options.filter, {
      $push: {
        ...(options.update as any),
      },
    });
  }

  public delete(filter: Filter<T>): DeleteData<T> {
    return this._model.deleteOne({ ...filter });
  }

  public getData(options: FindOptions<T>): Promise<Response<GetData<T>>> {
    return Helpers.getData<T>(this._model, options);
  }

  public deleteModel(): Promise<Response<string>> {
    return Helpers.deleteModel(this._model.name);
  }

  public static getAllModels(): Promise<Response<Models[]>> {
    return Helpers.getAllModels();
  }

  public static deleteModel(name: string): Promise<Response<string>> {
    return Helpers.deleteModel(name);
  }
}

export default Database;

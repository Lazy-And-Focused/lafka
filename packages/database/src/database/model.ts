import type { Model } from "mongoose";

import type {
  CreateData,
  Filter,
  FindOptions,
  UpdateOptions,
  Status as DatabaseStatus,
  Models,
  PickTypeInObject,
  GetData,
  DeleteResult,
  DeleteData
} from "@lafka/types/mongodb.types";

import { Schemas } from "./schemas/index";

import { Helpers } from "./helpers";

class Database<T extends { id: string }, K = Partial<T>> {
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

  public static parse = <K>(data: K, type: Schemas.Models): K => Helpers.parse<K>(data, type);

  public static generateId(): string {
    return `${new Date().getTime()}`
  };

  public create(doc: CreateData<T> & K) {
    return this._model.create({
      ...doc,
      created_at: new Date().toISOString(),
      id: Database.generateId()
    });
  };

  public update(options: UpdateOptions<T>) {
    return this._model.updateOne(options.filter, options.update || {});
  };

  public push(options: {
    filter: Filter<T>;
    update: Partial<PickTypeInObject<T, any[]>>;
  }) {
    return this._model.updateOne(options.filter, {
      $push: {
        ...(options.update as any)
      }
    });
  };

  public delete(filter: Filter<T>): DeleteData<T> {
    return this._model.deleteOne({ ...filter });
  };

  public getData(options: FindOptions<T>): Promise<DatabaseStatus<GetData<T>>> {
    return Helpers.getData<T>(this._model, options);
  };

  public deleteModel(): Promise<DatabaseStatus> {
    return Helpers.deleteModel(this._model.name);
  };

  public static getAllModels(): Promise<DatabaseStatus> {
    return Helpers.getAllModels();
  };

  public static deleteModel(name: string): Promise<DatabaseStatus> {
    return Helpers.deleteModel(name);
  };
}

export { Database }

export default Database;

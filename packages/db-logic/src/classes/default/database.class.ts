import type { Model } from "mongoose";

import {
	CreateData,
	Filter,
	FindOptions,
	GetData,
	UpdateOptions,
	Status as DatabaseStatus
} from "types/schema/mongodb.types";

import getData from "./helpers/database/get-data.helper";
import getAllModels from "./helpers/database/get-all-models.helper";
import deleteModel from "./helpers/database/delete-model.helper";

class Database<T, K = Partial<T>> {
	private readonly _model: Model<T>;

	public constructor(model: Model<T>) {
		this._model = model;
	}

	get model() {
		return this._model;
	}

	public create = async (doc: CreateData<T> & K) => {
		return await this._model.create(doc);
	};

	public update = async (options: UpdateOptions<T>) => {
		return await this._model.updateOne(options.filter, options.update);
	};

	public delete = async (filter: Filter<T>) => {
		return await this._model.deleteOne(filter);
	};

	public getData = async (
		options: FindOptions<T>
	): Promise<DatabaseStatus<GetData<T>>> => {
		return await getData<T>(this._model, options);
	};

	public deleteModel = async (): Promise<DatabaseStatus> => {
		return await deleteModel(this._model.name);
	};

	public static getAllModels = async (): Promise<DatabaseStatus> => {
		return await getAllModels();
	};

	public static deleteModel = async (name: string): Promise<DatabaseStatus> => {
		return await deleteModel(name);
	};
}

export default Database;

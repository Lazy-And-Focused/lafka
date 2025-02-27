import type { Model } from "mongoose";

import {
	CreateData,
	Filter,
	FindOptions,
	GetData,
	UpdateOptions,
	Status as DatabaseStatus
} from "lafka/types/schema/mongodb.types";

import getData from "./helpers/database/get-data.helper";
import getAllModels from "./helpers/database/get-all-models.helper";
import deleteModel from "./helpers/database/delete-model.helper";

class Database<T extends { id: string }, K = Partial<T>> {
	private readonly _model: Model<T>;

	public constructor(model: Model<T>) {
		this._model = model;
	}

	get model() {
		return this._model;
	}

	public findLast = async (): Promise<T> => {
		return (await this._model.findOne({}, {}, { sort: { "created_at": -1 }, new: true }))!
	}

	public generateId = async (): Promise<string> => {
		const id = await this._model.countDocuments();

		return `${(id === 0 ? 0 : (+(await this.findLast()).id)) + 1}`;
	};

	public create = async (doc: CreateData<T> & K) => {
		return await this._model.create({
			...doc,
			id: await this.id
		});
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

	get id(): Promise<string> {
		return this.generateId();
	}
}

export default Database;

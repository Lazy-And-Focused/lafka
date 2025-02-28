import { Model } from "mongoose";
import Models from "database/models.database";

import {
	CreateData,
	Filter,
	FindOptions,
	GetData,
	UpdateOptions,
	Status as DatabaseStatus,
	CreateModelData,
	UpdateModelData,
	ModelNames
} from "lafka/types/schema/mongodb.types";

import getData from "./helpers/database/get-data.helper";
import getAllModels from "./helpers/database/get-all-models.helper";
import deleteModel from "./helpers/database/delete-model.helper";

export interface DatabaseType<T extends { id: string }, K = Partial<T>, N extends ModelNames = ModelNames> {
	name: N;
	model: Model<T>;
	id: Promise<string>;
	
	findLast: () => Promise<T>;
	generateId: () => Promise<string>;
	
	create: (doc: CreateData<T> & K) => CreateModelData<T>;
	update: (options: UpdateOptions<T>) => UpdateModelData;
	
	getData: (options: FindOptions<T>) => Promise<DatabaseStatus<GetData<T>>>;
	deleteModel: () => Promise<DatabaseStatus>;
}

class Database<T extends { id: string }, K = Partial<T>, N extends ModelNames = ModelNames> implements DatabaseType<T, K, N> {
	private readonly _model: Model<T>;
	protected readonly _database: Models;

	public constructor(model: Model<T>, models: Models) {
		this._database = models;
		this._model = model;
	}

	get name(): N {
		return this._model.modelName as N;
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

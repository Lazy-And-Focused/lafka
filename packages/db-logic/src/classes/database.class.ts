import { Model, UpdateWriteOpResult } from "mongoose";

import {
	CreateData,
	Filter,
	FindOptions,
	UpdateOptions,
	Status as DatabaseStatus,
	CreateModelData,
	Models,
	DeleteResult,
	PickTypeInObject
} from "lafka/types/mongodb.types";
import { LAFka } from "lafka/types";

import { Schemas } from "../database/schemas/index";

import getData from "./helpers/get-data.helper";
import getAllModels from "./helpers/get-all-models.helper";
import deleteModel from "./helpers/delete-model.helper";

export interface DatabaseType<T extends { id: string }, K = Partial<T>> {
	name: Models;
	model: Model<T>;
	id: Promise<string>;
	
	findLast: () => Promise<T>;
	generateId: () => Promise<string>;
	
	create: (doc: CreateData<T> & K) => CreateModelData<T>;
	update: (options: UpdateOptions<T>) => Promise<UpdateWriteOpResult>;
	push: (options: {filter: Filter<T>, update: Partial<PickTypeInObject<T, any[]>>}) => Promise<UpdateWriteOpResult>;
	delete: (filter: Filter<T>) => Promise<DeleteResult>;
	
	getData: (options: FindOptions<T>) => Promise<DatabaseStatus<T[]>>;
	deleteModel: () => Promise<DatabaseStatus>;
}

class Database<T extends { id: string }, K = Partial<T>> implements DatabaseType<T, K> {
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

	public static parse = <T extends { id: string}>(data: T, type: Schemas.Models): T => {
		const output: {[key: string]: unknown} = {};
		const keys = LAFka.keys[type];
		
		keys.forEach((k: string) => {
			output[k] = (data as {[key: string]: unknown})[k];
		});

		return output as T;
	}

	public findLast = async (): Promise<Readonly<T>> => {
		return (await this._model.findOne({}, {}, { sort: { "created_at": -1 }, new: true }))!;
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
		return await this._model.updateOne(options.filter, options.update || {});
	};

	public push = async(options: {filter: Filter<T>, update: Partial<PickTypeInObject<T, any[]>>}) => {
		const data = await this._model.updateOne(options.filter, {
			$push: {
				...options.update as any
			}
		});

		return data;
	};

	public delete = async (filter: Filter<T>) => {
		return await this._model.deleteOne({...filter});
	};

	public getData = async (
		options: FindOptions<T>
	): Promise<DatabaseStatus<T[]>> => {
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

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

import { RedisClientConnection, Repository } from "redis-om";

import type { User } from "lafka/types/authors/user.types";
import type { Comment } from "lafka/types/content/comment.types";
import type { BlogPost } from "lafka/types/posts/blog-post.types";
import type { ForumPost } from "lafka/types/posts/forum-post.types";

export interface DatabaseType<T extends { id: string }, K = Partial<T>> {
	name: ModelNames;
	model: Model<T>;
	id: Promise<string>;
	
	findLast: () => Promise<T>;
	generateId: () => Promise<string>;
	
	create: (doc: CreateData<T> & K) => CreateModelData<T>;
	update: (options: UpdateOptions<T>) => UpdateModelData;
	
	getData: (options: FindOptions<T>) => Promise<DatabaseStatus<GetData<T>>>;
	deleteModel: () => Promise<DatabaseStatus>;
}

class Database<T extends { id: string }, K = Partial<T>> implements DatabaseType<T, K> {
	private readonly _model: Model<T>;
	protected readonly _database: Models;

	public constructor(model: Model<T>, models: Models) {
		this._database = models;
		this._model = model;
	}

	public get name(): ModelNames {
		return this._model.modelName as ModelNames;
	}

	public get model() {
		return this._model;
	}

	public get redis(): {
		repository: Repository<Readonly<BlogPost & ForumPost>> | Repository<Readonly<Comment>> | Repository<Readonly<User>>,
		redis: RedisClientConnection
	} | false {
		if (this.name === "auth_users") return false;

		return {
			repository: this._database.redis[this.name],
			redis: this._database.redis.redis
		};
	}

	public findLast = async (): Promise<Readonly<T>> => {
		if (this.redis) {
			const data = await this.redis.repository.search().sortDesc("created_at").first();
			
			if (data) return data as unknown as Readonly<T>;
		}

		return (await this._model.findOne({}, {}, { sort: { "created_at": -1 }, new: true }))!
	}

	public generateId = async (): Promise<string> => {
		if (this.redis) {
			const redisId = await this.redis.repository.search().count();

			return `${(redisId === 0 ? 0 : (+(await this.findLast()).id))+1}`;
		}

		const id = await this._model.countDocuments();

		return `${(id === 0 ? 0 : (+(await this.findLast()).id)) + 1}`;
	};

	public create = async (doc: CreateData<T> & K) => {
		this.id.then((id) => {
			if (this.redis) (this.redis.repository as Repository<any>).save({ ...doc, id });
		});

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

import type {
	FilterQuery,
	IfAny,
	ProjectionType,
	QueryOptions,
	UpdateQuery,
	UpdateWithAggregationPipeline,
	Document,
	Require_id
} from "mongoose";

export type Filter<T> = FilterQuery<T>;
export type Update<T> = UpdateQuery<T> | UpdateWithAggregationPipeline;
export type Projection<T> = ProjectionType<T> | null | undefined;
export type Options<T> = QueryOptions<T> | null | undefined;
export type GetData<T> = IfAny<T, any, Document<unknown, {}, T> & Require_id<T>>[];

export type UpdateOptions<T, K = T> = {
	filter: Filter<T>;
	update?: Update<K>;
};

export type FindOptions<T> = {
	filter: Filter<T>;
	projection?: Projection<T>;
	options?: Options<T>;
};

export type ModelData<T> = Omit<T, "id"|"_id">;
export type CreateData<T> = Partial<ModelData<T>>;
export type CreatePickData<T, K extends keyof ModelData<T>> = Partial<ModelData<T>> &
	Pick<ModelData<T>, K>;

export interface Status<T extends any = any> {
	text: string;
	type: 0 | 1;
	data?: T;
	error?: string | null;
}

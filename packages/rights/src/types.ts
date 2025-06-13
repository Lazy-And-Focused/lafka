export type MustArray<T, K=T> = [T, ...K[]];
export type ArrayOrType<T> = MustArray<T> | T;

export type Bit = bigint|number|string|boolean;
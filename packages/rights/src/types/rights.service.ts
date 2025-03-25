import { Rights } from "@lafka/types";

/**
 * @generics
 * T: "default" | "users" | "posts" | "organizations"
 * 
 * ```js
 * if (T === "default") {
 *    K: "ME" | "USERS" | "POSTS" | "ORGANIZATIONS"
 * }
 * else {
 *    K: string (the id)
 * }
 * ```
 */
export type RightsType<
  T extends Rights.RightsKeys,
  K extends T extends "default"
    ? keyof Rights.Lazy.Rights
    : string
> = K extends keyof Rights.Lazy.Rights
  ? (keyof Rights.Lazy.Rights[K])
  : (keyof (Rights.Rights[T][keyof Rights.Rights[T]]));

/**
 * @generics
 * T: "default" | "users" | "posts" | "organizations"
 * 
 * ```js
 * if (T === "default") {
 *    K: "ME" | "USERS" | "POSTS" | "ORGANIZATIONS"
 * }
 * else {
 *    K: string (the id)
 * }
 * ```
 */
export type RightsTypeArray<
  T extends Rights.RightsKeys,
  K extends T extends "default"
    ? keyof Rights.Lazy.Rights
    : string
> = [RightsType<T, K>, ...RightsType<T, K>[]];

/**
 * @generics
 * T: "default" | "users" | "posts" | "organizations"
 * 
 * ```js
 * if (T === "default") {
 *    K: "ME" | "USERS" | "POSTS" | "ORGANIZATIONS"
 * }
 * else {
 *    K: string (the id)
 * }
 * ```
 */
export declare abstract class LazyRightsService<
  T extends Rights.RightsKeys,
  K extends T extends "default"
    ? keyof Rights.Lazy.Rights
    : string = T extends "default"
      ? keyof Rights.Lazy.Rights
      : string
> {
  public constructor(rights: Rights.Rights[T]);
  
  public has<R extends RightsTypeArray<T, K> = RightsTypeArray<T, K>>(data: {
    key: K extends keyof Rights.Lazy.Rights ? K : string,
    rights: R
  }): Record<R[number], boolean> | false;
}
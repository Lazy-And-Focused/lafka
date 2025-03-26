import { Rights as RightsTypes } from "@lafka/types";

export namespace Types {
  export namespace Rights {
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
    export type Type<
      T extends RightsTypes.RightsKeys,
      K extends T extends "default"
        ? keyof RightsTypes.Lazy.Rights
        : string
    > = K extends keyof RightsTypes.Lazy.Rights
      ? (keyof RightsTypes.Lazy.Rights[K])
      : (keyof (RightsTypes.Rights[T][keyof RightsTypes.Rights[T]]));
    
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
    export type TypeArray<
      T extends RightsTypes.RightsKeys,
      K extends T extends "default"
        ? keyof RightsTypes.Lazy.Rights
        : string
    > = [Type<T, K>, ...Type<T, K>[]];
    
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
      T extends RightsTypes.RightsKeys,
      K extends T extends "default"
        ? keyof RightsTypes.Lazy.Rights
        : string = T extends "default"
          ? keyof RightsTypes.Lazy.Rights
          : string
    > {
      public constructor(rights: RightsTypes.Rights[T]);
      
      public has<R extends TypeArray<T, K> = TypeArray<T, K>>(data: {
        key: K extends keyof RightsTypes.Lazy.Rights ? K : string,
        rights: R
      }): Record<R[number], boolean> | false;
    }
  }
};
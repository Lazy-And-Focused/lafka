import { Rights } from "@lafka/types";

import {
  LazyRightsService as ILazyRightsService,
  RightsType as IRightsType,
  RightsTypeArray as IRightsTypeArray
} from "./rights.service";

export declare namespace Types {
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
  export abstract class LazyRightsService<
    T extends Rights.RightsKeys,
    K extends T extends "default"
      ? keyof Rights.Lazy.Rights
      : string = T extends "default"
        ? keyof Rights.Lazy.Rights
        : string
  > extends ILazyRightsService<T, K> {}

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
  > = IRightsType<T, K>;
  
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
  > = IRightsTypeArray<T, K>;
}
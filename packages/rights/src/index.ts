import { Types } from "./types";
import { Rights as LAFkaTypes } from "@lafka/types";

export { Types } from "./types";

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
  export class LazyRightsService<
  T extends LAFkaTypes.RightsKeys,
  K extends T extends "default"
    ? keyof LAFkaTypes.Lazy.Rights
    : string = T extends "default"
      ? keyof LAFkaTypes.Lazy.Rights
      : string
  > extends Types.Rights.LazyRightsService<T, K> {
  /**
   * ```js
   * (async() => {
   *    const { rights } = (await (await fetch(api_url, {headers})).json());
   * 
   *    new LazyRightsService<"default">(rights.default);
   *    new LazyRightsService<"users">(rights.users);
   *    new LazyRightsService<"posts">(rights.posts);
   *    new LazyRightsService<"organizations">(rights.organizations);
   * })();
   * ```
   * 
   * @param rights Rights.Rights[T]
   */
  public constructor(public readonly rights: LAFkaTypes.Rights[T]) {
    super(rights);
  }

  /**
   * ```js
   * import { Rights } from "@lafka/types"
   * 
   * (async() => {
   *    const { rights } = await (await fetch(api_url, {headers})).json();
   * 
   *    new LazyRightsService<"default">(rights.default).has({
   *        key: "ME",
   *        rights: ["ADMINISTRATOR"]
   *    });
   * 
   *    new LazyRightsService<"posts">(rights.posts).has({
   *        key: "some-user-id",
   *        rights: ["DELETE"]
   *    });
   * })();
   * ```
   * 
   * @returns {false|Record<R[number], boolean>}
   */
  public has<R extends Types.Rights.TypeArray<T, K> = Types.Rights.TypeArray<T, K>>(data: {
    key: K extends keyof LAFkaTypes.Lazy.Rights ? K : string,
    rights: R
  }): false | Record<R[number], boolean> {
    const rights = Array.from(new Set(data.rights));

    if (rights.length === 0) return false;

    const existingRights = (this.rights as any)[data.key];

    return Object.fromEntries(rights.map((right) => {
      return existingRights[right] === 0
        ? [right, false]
        : [right, true];
    })) as Record<R[number], boolean>;
  }
  };

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
  export class RightsService<
  T extends LAFkaTypes.RightsKeys,
  K extends T extends "default"
    ? keyof LAFkaTypes.Lazy.Rights
    : string = T extends "default"
      ? keyof LAFkaTypes.Lazy.Rights
      : string
  > {
  /**
   * ```js
   * import { Rights } from "@lafka/types";
   * 
   * (async() => {
   *    const { rights } = (await (await fetch(api_url, {headers})).json());
   * 
   *    new RightsService<"default">(rights.default);
   *    new RightsService<"users">(rights.users);
   *    new RightsService<"posts">(rights.posts);
   *    new RightsService<"organizations">(rights.organizations);
   * })();
   * ```
   * 
   * @param rights Rights.Rights[T]
   */
  public constructor(public readonly rights: LAFkaTypes.Rights[T]) {};

  public hasOne(data: {
    key: K extends keyof LAFkaTypes.Lazy.Rights ? K : string;
    right: bigint|number;
  }) {
    const right = BigInt(data.right);
    const raw = LAFkaTypes.Parser.execute((this.rights as any)[data.key]);
    
    return (raw & right) === right;
  }

  /**
   * ```js
   * import { Rights } from "@lafka/types";
   * 
   * (async() => {
   *    const { rights } = (await (await fetch(api_url, {headers})).json());
   * 
   *    new RightsService<"posts">(rights.posts).has({
   *       key: "12345",
   *       rights: [
   *           Rights.Default.POSTS_RIGHTS.MANAGE,
   *           Rights.Default.POSTS_RIGHTS.COMMENTS_READ,
   *       ]
   *    });
   * 
   *    new RightsService<"posts">(rights.posts).has({
   *       key: "67890",
   *       rights: Rights.Default.POSTS_RIGHTS.OWNER,
   *    });
   *    // is equals ⩚  |  is equals
   *    // is equals |  ⩛  is equals
   *    new RightsService<"posts">(rights.posts).hasOne({
   *       key: "67890",
   *       right: Rights.Default.POSTS_RIGHTS.OWNER,
   *    });
   * })()
   * ```
   * 
   * @returns {boolean}
   */
  public has(
    data: {
      key: K extends keyof LAFkaTypes.Lazy.Rights ? K : string;
      rights: [...[bigint|number]] | bigint|number;
    }
  ): boolean {
    return (Array.isArray(data.rights)
      ? data.rights
      : [data.rights])
      .every((v) => this.hasOne({...data, right: v}));
  }
  }
}
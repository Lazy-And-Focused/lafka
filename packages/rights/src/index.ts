import { LAFka, Rights as LAFkaRights } from "@lafka/types";
import { ArrayOrType } from "./types";

export * from "./bit-field";

export namespace Rights {
  export class UserService {
    public constructor(private readonly user: LAFka.User) {};

    /**
     * ```ts
     * const fockusty = await LAFka.API.getUser("@fockusty");
     * new Rights.UserService(fockusty).has({
     *  right: "me",
     *  rights: ["ADMINISTATOR"]
     * });
     * ```
     * 
     * @param right "me" or "users"
     * @param rights rights of user if `rights` === "me", if `rights` === "users" 
     * { [userId: string]: (keyof LAFkaRights.Default.UserRights["USERS"])[] }
     * @returns {boolean}
     */
    public has = <
      T extends (keyof LAFkaRights.Lazy.Rights["user"]),
      K extends T extends "me"
        ? ArrayOrType<keyof (LAFkaRights.Lazy.Rights["user"]["me"])>
        : { [key: string]: ArrayOrType<keyof (LAFkaRights.Lazy.Rights["user"]["users"][keyof LAFkaRights.Lazy.Rights["user"]["users"]])> }
    >({
      right,
      rights
    }: {
      right: T,
      rights: K
    }): T extends "me" ? boolean : { [P in keyof K]: boolean } => {
      if (typeof rights === "object" && !Array.isArray(rights) && Object.keys(rights).length === 0) return {} as any;

      if (right === "me") {
        const r = Array.isArray(rights)
          ? LAFkaRights.Parser.toBigIntFromArray("user", "me", rights)
          : LAFkaRights.Parser.toBigInt("user", "me", rights as any);

        return ((BigInt(this.user.rights.me) & r) === r) as any;
      } else if (right === "users") {
        return Object.fromEntries(Object.keys(rights).map(k => {
          const r = Array.isArray((rights as any)[k])
            ? LAFkaRights.Parser.toBigIntFromArray("user", "users", (rights as any)[k])
            : LAFkaRights.Parser.toBigInt("user", "users", rights as any);

          return [k, (BigInt(Object.fromEntries(this.user.rights.users)[k] || LAFkaRights.Raw.Default.USERS) & r) === r];
        })) as any;
      }

      return false as any;
    }
  }

  
  export class PostService {
    public constructor(private readonly post: LAFka.Post) {};

    /**
     * ```ts
     * import { Rights } from "@lafka/rights";
     * 
     * // import { LAFka, Rights as LAFkaRights } from "@lafka/types";
     * // const post: LAFka.Post;
     * // const fockusty: LAFka.User;
     * 
     * new Rights.PostService(post).has({
     *   rights: "VIEW",
     *   userId: fockusty.id
     * });
     *
     * new Rights.PostService(post).has({
     *   rights: ["VIEW", "REACT", "COMMENTS_READ"],
     *   userId: "4"
     * });
     * ```
     * 
     * @param rights Post rights (`LAFkaRights.Keys.Posts`)
     * @param userId id of user
     * @returns {boolean}
     */
    public readonly has = <
      T extends ArrayOrType<LAFkaRights.Keys.Posts>
    >({
      rights,
      userId
    }: {
      rights: ArrayOrType<T>,
      userId: string
    }): boolean => {
      if (this.post.creator_id === userId) return true;

      const r = Array.isArray(rights)
        ? LAFkaRights.Parser.toBigIntFromArray("content", "posts", rights as any)
        : LAFkaRights.Parser.toBigInt("content", "posts", rights);

      return (BigInt(Object.fromEntries(
        this.post.rights)[userId] || `${LAFkaRights.Raw.Default.POSTS}`
      ) & r) === r;
    }
  }
}
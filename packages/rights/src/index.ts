import { LAFka, Rights as LAFkaRights } from "@lafka/types";

/**
 * I need:
 * UserService
 * PostService
 * OrganizationService
 */

type MustArray<T, K=T> = [T, ...K[]];
type ArrayOrType<T> = MustArray<T> | T;

export namespace Rights {
  export class UserService {
    public constructor(private readonly user: LAFka.User) {};

    /**
     * ```ts
     * const fockusty = await LAFka.Api.getUser("@fockusty");
     * new Rights.UserService(fockusty).has(["ADMINISTATOR"]);
     * ```
     */
    public has = <
      T extends ArrayOrType<keyof LAFkaRights.Types.My>,
    >(rights: T): boolean => {
      const r = LAFkaRights.Parser.toBigIntFromArray("My", Array.isArray(rights) ? rights : [rights]);

      return (BigInt(this.user.rights) & r) === r;
    }
  }

  export class PostService {
    public constructor(public readonly post: LAFka.Post) {};

    /**
     * ```ts
     * const fockusty = await LAFka.Api.getUser("@fockusty");
     * const posts = await LAFka.Api.getPost("1");
     * 
     * new Rights.PostService(posts).has({
     *  rights: ["OWNER"],
     *  userId: fockusty.id
     * });
     * ```
     */
    public readonly has = <
      T extends ArrayOrType<keyof LAFkaRights.Types.Posts>
    >({
      rights,
      userId
    }: {
      rights: T, userId: string
    }) => {
      if (this.post.creator_id === userId) return true;
      if (typeof rights !== "bigint" && !Array.isArray(rights)) return false;

      const r = LAFkaRights.Parser.toBigIntFromArray("Posts", Array.isArray(rights) ? rights : [rights]);

      return (BigInt(this.post.rights) & r) === r;
    }
  }
}
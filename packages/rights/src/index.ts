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
     * new Rights.PostService(posts).hasRights(["OWNER"]})(fockusty.id);
     * ```
     */
    public readonly hasRights = <
      T extends ArrayOrType<keyof LAFkaRights.Types.Posts>
    >(rights: T): ((userId: string) => boolean) => {
      const r = LAFkaRights.Parser.toBigIntFromArray("Posts", Array.isArray(rights) ? rights : [rights]);
      const postRights: {[userId: string]: string} = Object.fromEntries(this.post.rights);

      return (userId: string) => {
        return (BigInt(postRights[userId]) & r) === r;
      };
    };

    /**
     * ```ts
     * const fockusty = await LAFka.Api.getUser("@fockusty");
     * const posts = await LAFka.Api.getPost("1");
     * 
     * new Rights.PostService(posts).userHas(fockusty.id)(["OWNER"]});
     * ```
     */
    public readonly userHas = <
      T extends ArrayOrType<keyof LAFkaRights.Types.Posts>
    >(userId: string): ((rights: T) => boolean) => {
      const postRights: {[userId: string]: string} = Object.fromEntries(this.post.rights);
      
      return (rights: T) => {
        const r = LAFkaRights.Parser.toBigIntFromArray("Posts", Array.isArray(rights) ? rights : [rights]);
        
        return (BigInt(postRights[userId]) & r) === r;
      };
    }

    /**
     * ```ts
     * const fockusty = await LAFka.Api.getUser("@fockusty");
     * const posts = await LAFka.Api.getPost("1");
     * 
     * new Rights.PostService(posts).has({
     *   userId: fockusty.id,
     *   rights: ["OWNER"]
     * });
     * ```
     */
    public readonly has = <
      T extends ArrayOrType<keyof LAFkaRights.Types.Posts>
    >({ rights, userId }: { rights: T, userId: string }): boolean => {
      return this.hasRights(rights)(userId);
    };
  }
}
type MustArray<T, K=T> = [T, ...K[]];

export namespace Rights {
  export class Builder<T extends string> {
    public constructor(public readonly rights: (T[]|Readonly<T[]>)) {};

    /**
     * starts with offset bigint
     * @example
     * input: offset = 10n
     * 
     * output: rights = {
     *   someRight1: 1n << 10n,
     *   someRight2: 1n << 11n
     *   ...
     * }
     * 
     * @param [exclude=[]] prioritet in filters
     * @example
     * input:
     * exclude = ["someRight1", "someRight2"]
     * include = ["someRight1", "someRight3"]
     * 
     * output = {
     *   someRight1: 0n << 0n,
     *   someRight2: 0n << 1n,
     *   someRight3: 1n << 2n
     * }
     */
    public execute(
      offset: bigint|({[key: string]: bigint}|{readonly [key: string]: bigint}) = 0n,
      exclude: (T[]|readonly T[]) = [],
      include?: (T[]|readonly T[]),
    ): Record<T, bigint> {
      return Object.fromEntries(this.rights.map((right, index) => {
        const modifier = (this.resolveOffset(offset) + BigInt(index));
        
        if (include && !include.includes(right)) return [right, 0n << modifier];
        if (exclude.includes(right)) return [right, 0n << modifier];
        return [right, 1n << modifier];
      })) as Record<T, bigint>;
    };
    private logarithm2(bigint: bigint): bigint {
      return BigInt(bigint.toString(2).length-1);
    };
    private max(...values: bigint[]): bigint {
      return values.toSorted((a, b) => {
        if (a > b) {
          return 1;
        } else if (a < b){
          return -1;
        } else {
          return 0;
        }
      }).toReversed()[0];
    };
    private resolveOffset(offset: bigint|({[key: string]: bigint}|{ readonly [key: string]: bigint})): bigint {
      if (typeof offset === "bigint") return offset;
      const keys = Object.keys(offset);
      if (keys.length === 0) return 0n;
      return this.logarithm2(this.max(...keys.map((key) => offset[key]))) + 1n;
    }
  };

  export class Parser {
    public static toBigInt = <
      T extends keyof Rights.Types.All,
    >(
      type: T,
      right: keyof typeof Rights.Constants.AVAILABLE[T]
    ): bigint => {
      return ((Rights.Constants.AVAILABLE[type] as any))[right];
    };

    public static toBigIntFromArray = <
      T extends keyof Rights.Types.All,
    >(
      type: T,
      rights: MustArray<keyof typeof Rights.Constants.AVAILABLE[T]>
    ) =>
      Parser.execute(Object.fromEntries(rights.map(v =>
        [v, Parser.toBigInt(type, v)])));

    public static exist = <
      T extends keyof Rights.Types.All,
      K extends keyof Rights.Types.All[T]
    >(
      type: [T, K],
      right: bigint
    ): boolean => {
      return ((Rights.Constants.DEFAULT[type[0]] as any)[type[1]] & right) === right;
    }

    public static execute<T extends object>(rights: T[keyof T] | T) {
      let raw: bigint = 0n;
      
      Object.keys(rights).forEach(k => {
        if (typeof rights[k] === "bigint")
          raw += rights[k];
        else Object.keys(rights[k]).forEach(k2 => raw += rights[k][k2])
      });

      return raw;
    }
  };

  export namespace Types {
    export type My = Record<(typeof Rights.Constants.My.ALL)[number], bigint>;
    export type Posts = Record<(typeof Rights.Constants.Posts.ALL)[number], bigint>;
    export type Organizations = Record<(typeof Rights.Constants.Organizations.ALL)[number], bigint>;

    export type All = {
      My: My,
      Posts: Posts,
      Organizations: Organizations
    }
  }

  export namespace Constants {
    export const AVAILABLE = {
      My: My.AVAILABLE,
      Posts: Posts.AVAILABLE,
      Organizations: Organizations.AVAILABLE
    } as const;

    export const DEFAULT = {
      My: My.DEFAULT,
      Posts: Posts.DEFAULT,
      Organizations: Organizations.DEFAULT
    } as const;

    export const ALL = {
      My: My.ALL,
      Posts: Posts.ALL,
      Organizations: Organizations.ALL,
    } as const;

    export const RIGHTS = {
      RAW: {
        AVAILABLE: {
          My: Parser.execute(My.AVAILABLE),
          Posts: Parser.execute(Posts.AVAILABLE),
          Organizations: Parser.execute(Organizations.AVAILABLE)
        } as const,

        DEFAULT: {
          My: Parser.execute(My.DEFAULT),
          Posts: Parser.execute(Posts.DEFAULT),
          Organizations: Parser.execute(Organizations.DEFAULT)
        } as const
      } as const,

      OBJECT: {
        AVAILABLE: {
          My: My.AVAILABLE,
          Posts: Posts.AVAILABLE,
          Organizations: Organizations.AVAILABLE
        } as const,

        DEFAULT: {
          My: My.DEFAULT,
          Posts: Posts.DEFAULT,
          Organizations: Organizations.DEFAULT
        } as const
      } as const
    } as const;

    export namespace My {
      export const ALL = [
        "ADMINISTRATOR",
        "MODERATOR",
        "USER",
        "MUTE",
        "BAN",
        "POSTS_CREATE",
        "COMMENTS_CREATE",
        "ORGANIZATIONS_CREATE",
        "POSTS_MANAGE",
        "COMMENTS_MANAGE",
        "ORGANIZATIONS_MANAGE",
        "POSTS_DELETE",
        "COMMENTS_DELETE",
        "ORGANIZATIONS_DELETE"
      ] as const;
  
      export const EXCLUDE = [
        "ADMINISTRATOR",
        "MODERATOR",
        "MUTE",
        "BAN",
        "POSTS_MANAGE",
        "COMMENTS_MANAGE",
        "ORGANIZATIONS_MANAGE",
        "POSTS_DELETE",
        "COMMENTS_DELETE",
        "ORGANIZATIONS_DELETE",
      ] as const;

      export const AVAILABLE: Types.My = new Builder(My.ALL).execute(0n);
      export const DEFAULT: Types.My = new Builder(My.ALL).execute(0n, My.EXCLUDE);
    }

    export namespace Posts {
      export const ALL = [
        "OWNER",
        "MANAGER",
        "VIEW",
        "MANAGE",
        "DELETE",
        "REACT",
        "ATTACH_FILES",
        "COMMENTS_READ",
        "COMMENTS_CREATE",
        "COMMENTS_DELETE",
        "COMMENTS_MANAGE",
        "COMMENTS_REACT",
        "VIEWERS_MUTE",
        "VIEWERS_BLOCK",
      ] as const;

      export const EXCLUDE = [
        "OWNER",
        "MANAGER",
        "MANAGE",
        "DELETE",
        "COMMENTS_DELETE",
        "COMMENTS_MANAGE",
        "VIEWERS_MUTE",
        "VIEWERS_BLOCK"
      ] as const;

      export const AVAILABLE: Types.Posts = new Builder(Posts.ALL).execute(My.AVAILABLE);
      export const DEFAULT: Types.Posts = new Builder(Posts.ALL).execute(My.AVAILABLE, Posts.EXCLUDE);
    }

    export namespace Organizations {
      export const ALL = [
        "OWNER",
        "ADMINISTRATOR",
        "INVITE_CREATE",
        "RIGHTS_MANAGE",
        "READ",
        "MANAGE",
        "DELETE",
        "POSTS_READ",
        "POSTS_CREATE",
        "POSTS_MANAGE",
        "POSTS_DELETE",
        "ROLES_MANAGE",
        "MEMBERS_KICK",
        "VIEWERS_BLOCK",
      ] as const;

      export const EXCLUDE = [
        "OWNER",
        "ADMINISTRATOR",
        "INVITE_CREATE",
        "RIGHTS_MANAGE",
        "MANAGE",
        "DELETE",
        "POSTS_CREATE",
        "POSTS_MANAGE",
        "POSTS_DELETE",
        "ROLES_MANAGE",
        "MEMBERS_KICK",
        "VIEWERS_BLOCK",
      ] as const;

      export const AVAILABLE: Types.Organizations = new Builder(Organizations.ALL).execute(Posts.AVAILABLE);
      export const DEFAULT: Types.Organizations = new Builder(Organizations.ALL).execute(Posts.AVAILABLE, Organizations.EXCLUDE);
    }
  }
}
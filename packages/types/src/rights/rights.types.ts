type MustArray<T, K=T> = [T, ...K[]];

export namespace Rights {
  export class Parser {
    public static toBigInt = <
      T extends keyof Rights.Lazy.Rights,
      K extends keyof Rights.Lazy.Rights[T]
    >(
      type: T,
      key: K,
      right: T extends "user"
          ? K extends "me"
            ? keyof (Rights.Lazy.Rights[T][K])
            : keyof (Rights.Lazy.Rights[T][K][keyof (Rights.Lazy.Rights[T][K])])
          : keyof (Rights.Lazy.Rights[T][K][keyof (Rights.Lazy.Rights[T][K])])
    ): bigint => {
      return ((Rights.Lazy.RIGHTS[type] as any)[key])[right];
    };

    public static toBigIntFromArray = <
      T extends keyof Lazy.Rights,
      K extends keyof Lazy.Rights[T]
    >(
      type: T,
      key: K,
      rights: MustArray<
        T extends "user"
          ? K extends "me"
            ? keyof (Rights.Lazy.Rights[T][K])
            : keyof (Rights.Lazy.Rights[T][K][keyof (Rights.Lazy.Rights[T][K])])
          : keyof (Rights.Lazy.Rights[T][K][keyof (Rights.Lazy.Rights[T][K])])
        >
    ) =>
      Parser.execute(Object.fromEntries(rights.map(v =>
        [v, Parser.toBigInt(type, key, v as any)])));

    public static exist = <
      T extends Rights.Keys.Keys,
      K extends Rights.Keys.Double[T]
    >(
      type: [T, K],
      right: bigint
    ): boolean => {
      return ((Rights.Raw.Lazy.RIGHTS[type[0]] as any)[type[1]] & right) === right;
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
  }

  export namespace Lazy {
    export interface Me {
      readonly ADMINISTRATOR: bigint,
      readonly MODERATOR: bigint,
      readonly USER: bigint,
      readonly MUTE: bigint,
      readonly BAN: bigint,
      readonly POSTS_CREATE: bigint,
      readonly COMMENTS_CREATE: bigint,
      readonly ORGANIZATIONS_CREATE: bigint,
      readonly POSTS_MANAGE: bigint,
      readonly COMMENTS_MANAGE: bigint,
      readonly ORGANIZATIONS_MANAGE: bigint,
      readonly POSTS_DELETE: bigint,
      readonly COMMENTS_DELETE: bigint,
      readonly ORGANIZATIONS_DELETE: bigint,
    };

    export interface Users {
      readonly READ: bigint,
      readonly MANAGE: bigint,
      readonly MODERATE: bigint,
    };

    export interface Posts {
      readonly OWNER: bigint,
      readonly MANAGER: bigint,
      readonly VIEW: bigint,
      readonly MANAGE: bigint,
      readonly DELETE: bigint,
      readonly REACT: bigint,
      readonly ATTACH_FILES: bigint,
      readonly COMMENTS_READ: bigint,
      readonly COMMENTS_CREATE: bigint,
      readonly COMMENTS_DELETE: bigint,
      readonly COMMENTS_MANAGE: bigint,
      readonly COMMENTS_REACT: bigint,
      readonly VIEWERS_MUTE: bigint,
      readonly VIEWERS_BLOCK: bigint,
    };

    export interface Organizations {
      readonly OWNER: bigint,
      readonly ADMINISTRATOR: bigint,
      readonly INVITE_CREATE: bigint,
      readonly RIGHTS_MANAGE: bigint,
      readonly READ: bigint,
      readonly MANAGE: bigint,
      readonly DELETE: bigint,
      readonly POSTS_READ: bigint,
      readonly POSTS_CREATE: bigint,
      readonly POSTS_MANAGE: bigint,
      readonly POSTS_DELETE: bigint,
      readonly ROLES_MANAGE: bigint,
      readonly MEMBERS_KICK: bigint,
      readonly VIEWERS_BLOCK: bigint,
    };

    export interface TypeRights {
      readonly user: {
        readonly me: Me,
        readonly users: Users,
      },

      readonly content: {
        readonly posts: Posts,
        readonly organizations: Organizations
      }
    };

    export interface Rights {
      readonly user: {
        readonly me: Me,
      
        readonly users: {
          readonly [userId: string]: Users
        },
      },
  
      readonly content: {
        readonly posts: {
          readonly [postId: string]: Posts
        },
      
        readonly organizations: {
          readonly [organizationId: string]: Organizations
        },
      }
    };
    
    // prettier-ignore-start
    export const ME: Me = {
      ADMINISTRATOR:                  1n << 0n,
      MODERATOR:                      1n << 1n,
      USER:                           1n << 2n,
      MUTE:                           1n << 3n,
      BAN:                            1n << 4n,
      POSTS_CREATE:                   1n << 5n,
      COMMENTS_CREATE:                1n << 6n,
      ORGANIZATIONS_CREATE:           1n << 7n,
      POSTS_MANAGE:                   1n << 8n,
      COMMENTS_MANAGE:                1n << 9n,
      ORGANIZATIONS_MANAGE:           1n << 10n,
      POSTS_DELETE:                   1n << 11n,
      COMMENTS_DELETE:                1n << 12n,
      ORGANIZATIONS_DELETE:           1n << 13n,
    } as const;
  
    export const USERS: Users = {
      READ:                           1n << 14n,
      MANAGE:                         1n << 15n,
      MODERATE:                       1n << 16n,
    } as const;
  
    export const POSTS: Posts = {
      OWNER:                          1n << 17n,
      MANAGER:                        1n << 18n,
      VIEW:                           1n << 19n,
      MANAGE:                         1n << 20n,
      DELETE:                         1n << 21n,
      REACT:                          1n << 22n,
      ATTACH_FILES:                   1n << 23n,
      COMMENTS_READ:                  1n << 24n,
      COMMENTS_CREATE:                1n << 25n,
      COMMENTS_DELETE:                1n << 26n,
      COMMENTS_MANAGE:                1n << 27n,
      COMMENTS_REACT:                 1n << 28n,
      VIEWERS_MUTE:                   1n << 29n,
      VIEWERS_BLOCK:                  1n << 30n,
    } as const;
  
    export const ORGANIZATIONS: Organizations = {
      OWNER:                          1n << 31n,
      ADMINISTRATOR:                  1n << 32n,
      INVITE_CREATE:                  1n << 33n,
      RIGHTS_MANAGE:                  1n << 34n,
      READ:                           1n << 35n,
      MANAGE:                         1n << 36n,
      DELETE:                         1n << 37n,
      POSTS_READ:                     1n << 38n,
      POSTS_CREATE:                   1n << 39n,
      POSTS_MANAGE:                   1n << 40n,
      POSTS_DELETE:                   1n << 41n,
      ROLES_MANAGE:                   1n << 42n,
      MEMBERS_KICK:                   1n << 43n,
      VIEWERS_BLOCK:                  1n << 44n,
    } as const;
    // prettier-ignore-end
  
    export const RIGHTS = {
      user: {
        me: ME,
        users: USERS
      } as const,

      content: {
        posts: POSTS,
        organizations: ORGANIZATIONS,
      } as const
    } as const;
  }

  export namespace Default {
    // prettier-ignore-start
    export const ME: Rights.Lazy.Me = {
      ADMINISTRATOR:                  0n << 0n,         /* lazy: 1n << 0n */
      MODERATOR:                      0n << 1n,         /* lazy: 1n << 1n */
      USER:                           1n << 2n,         /* lazy: 1n << 2n */
      MUTE:                           0n << 3n,         /* lazy: 1n << 3n */
      BAN:                            0n << 4n,         /* lazy: 1n << 4n */
      POSTS_CREATE:                   1n << 5n,         /* lazy: 1n << 5n */
      COMMENTS_CREATE:                1n << 6n,         /* lazy: 1n << 6n */
      ORGANIZATIONS_CREATE:           1n << 7n,         /* lazy: 1n << 7n */
      POSTS_MANAGE:                   0n << 8n,         /* lazy: 1n << 8n */
      COMMENTS_MANAGE:                0n << 9n,         /* lazy: 1n << 9n */
      ORGANIZATIONS_MANAGE:           0n << 10n,        /* lazy: 1n << 10n */
      POSTS_DELETE:                   0n << 11n,        /* lazy: 1n << 11n */
      COMMENTS_DELETE:                0n << 12n,        /* lazy: 1n << 12n */
      ORGANIZATIONS_DELETE:           0n << 13n,        /* lazy: 1n << 13n */
    } as const;

    export const USERS: Rights.Lazy.Users = {
      READ:                           1n << 14n,        /* lazy: 1n << 14n */
      MANAGE:                         0n << 15n,        /* lazy: 1n << 15n */
      MODERATE:                       0n << 16n,        /* lazy: 1n << 16n */
    } as const;

    export const POSTS: Rights.Lazy.Posts = {
      OWNER:                          0n << 17n,        /* lazy: 1n << 17n */
      MANAGER:                        0n << 18n,        /* lazy: 1n << 18n */
      VIEW:                           1n << 19n,        /* lazy: 1n << 19n */
      MANAGE:                         0n << 20n,        /* lazy: 1n << 20n */
      DELETE:                         0n << 21n,        /* lazy: 1n << 21n */
      REACT:                          1n << 22n,        /* lazy: 1n << 22n */
      ATTACH_FILES:                   1n << 23n,        /* lazy: 1n << 23n */
      COMMENTS_READ:                  1n << 24n,        /* lazy: 1n << 24n */
      COMMENTS_CREATE:                1n << 25n,        /* lazy: 1n << 25n */
      COMMENTS_DELETE:                0n << 26n,        /* lazy: 1n << 26n */
      COMMENTS_MANAGE:                0n << 27n,        /* lazy: 1n << 27n */
      COMMENTS_REACT:                 1n << 28n,        /* lazy: 1n << 28n */
      VIEWERS_MUTE:                   0n << 29n,        /* lazy: 1n << 29n */
      VIEWERS_BLOCK:                  0n << 30n,        /* lazy: 1n << 30n */
    } as const;

    export const ORGANIZATIONS: Rights.Lazy.Organizations = {
      OWNER:                          0n << 31n,        /* lazy: 1n << 31n */
      ADMINISTRATOR:                  0n << 32n,        /* lazy: 1n << 32n */
      INVITE_CREATE:                  0n << 33n,        /* lazy: 1n << 33n */
      RIGHTS_MANAGE:                  0n << 34n,        /* lazy: 1n << 34n */
      READ:                           1n << 35n,        /* lazy: 1n << 35n */
      MANAGE:                         0n << 36n,        /* lazy: 1n << 36n */
      DELETE:                         0n << 37n,        /* lazy: 1n << 37n */
      POSTS_READ:                     1n << 38n,        /* lazy: 1n << 38n */
      POSTS_CREATE:                   0n << 39n,        /* lazy: 1n << 39n */
      POSTS_MANAGE:                   0n << 40n,        /* lazy: 1n << 40n */
      POSTS_DELETE:                   0n << 41n,        /* lazy: 1n << 41n */
      ROLES_MANAGE:                   0n << 42n,        /* lazy: 1n << 42n */
      MEMBERS_KICK:                   0n << 43n,        /* lazy: 1n << 43n */
      VIEWERS_BLOCK:                  0n << 44n,        /* lazy: 1n << 44n */
    } as const;
    // prettier-ignore-end

    export const RIGHTS = {
      user: {
        me: ME,
        users: USERS
      } as const,

      content: {
        posts: POSTS,
        organizations: ORGANIZATIONS
      } as const
    };
  }

  export namespace Raw {
    export namespace Lazy {
      export const ME = Parser.execute(Rights.Lazy.RIGHTS.user.me);
      export const USERS = Parser.execute(Rights.Lazy.RIGHTS.user.users);

      export const POSTS = Parser.execute(Rights.Lazy.RIGHTS.content.posts);
      export const ORGANIZATIONS = Parser.execute(Rights.Lazy.RIGHTS.content.organizations);

      export const RIGHTS = {
        user: {
          me: ME,
          users: USERS
        } as const,

        content: {
          posts: POSTS,
          organizations: ORGANIZATIONS
        } as const
      }
    }

    export namespace Default {
      export const ME = Parser.execute(Rights.Default.RIGHTS.user.me);
      export const USERS = Parser.execute(Rights.Default.RIGHTS.user.users);
  
      export const POSTS = Parser.execute(Rights.Default.RIGHTS.content.posts);
      export const ORGANIZATIONS = Parser.execute(Rights.Default.RIGHTS.content.posts);

      export const RIGHTS = {
        user: {
          users: USERS,
          posts: POSTS
        } as const,

        content: {
          posts: POSTS,
          organizations: ORGANIZATIONS
        } as const
      }
    }

    export interface Rights {
      readonly user: {
        /** @bigint */       
        readonly me: string /* it's a bigint */;
        /**
         * @first userId
         * @second bigint (rights) 
         */
        readonly users: [string, string /* it's a bigint */][],
      },

      readonly content: {
        /**
         * @first userId
         * @second bigint (rights) 
         */
        readonly posts: [string, string /* it's a bigint */][],
        /**
         * @first userId
         * @second bigint (rights) 
         */
        readonly organizations: [string, string /* it's a bigint */][],
      }
    };
  };

  export namespace Keys {
    export const ME = [
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
    export type Me = (typeof ME)[number];
    
    export const USERS = [
      "READ",
      "MANAGE",
      "MODERATE"
    ] as const;
    export type Users = (typeof USERS)[number];
    
    export const POSTS = [
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
      "VIEWERS_BLOCK"
    ] as const;
    export type Posts = (typeof POSTS)[number];
    
    export const ORGANIZATIONS = [
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
      "VIEWERS_BLOCK"
    ] as const;
    export type Organizations = (typeof ORGANIZATIONS)[number];
  
    export const KEYS = [
      "user",
      "content"
    ] as const;
    export type Keys = (typeof KEYS)[number];
  
    export const DOUBLE = {
      "user": [
        "me",
        "users"
      ] as const,
  
      "content": [
        "posts",
        "organizations"
      ] as const
    } as const;
    export type Double = {
      [P in keyof typeof DOUBLE]: (typeof DOUBLE)[P][number];
    };
  }
}
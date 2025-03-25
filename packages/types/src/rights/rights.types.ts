export namespace Rights {
  export class Parser {
    public static execute(rights: Lazy.Rights[keyof Lazy.Rights] | Lazy.Rights) {
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
    export interface MeRights {
      readonly ADMINISTRATOR: number|bigint,
      readonly MODERATOR: number|bigint,
      readonly USER: number|bigint,
      readonly MUTE: number|bigint,
      readonly BAN: number|bigint,
      readonly POSTS_CREATE: number|bigint,
      readonly COMMENTS_CREATE: number|bigint,
      readonly ORGANIZATIONS_CREATE: number|bigint,
      readonly POSTS_MANAGE: number|bigint,
      readonly COMMENTS_MANAGE: number|bigint,
      readonly ORGANIZATIONS_MANAGE: number|bigint,
      readonly POSTS_DELETE: number|bigint,
      readonly COMMENTS_DELETE: number|bigint,
      readonly ORGANIZATIONS_DELETE: number|bigint,
    };

    export interface UsersRights {
      readonly READ: number|bigint,
      readonly MANAGE: number|bigint,
      readonly MODERATE: number|bigint,
    };

    export interface PostsRights {
      readonly OWNER: number|bigint,
      readonly MANAGER: number|bigint,
      readonly VIEW: number|bigint,
      readonly MANAGE: number|bigint,
      readonly DELETE: number|bigint,
      readonly REACT: number|bigint,
      readonly ATTACH_FILES: number|bigint,
      readonly COMMENTS_READ: number|bigint,
      readonly COMMENTS_CREATE: number|bigint,
      readonly COMMENTS_DELETE: number|bigint,
      readonly COMMENTS_MANAGE: number|bigint,
      readonly COMMENTS_REACT: number|bigint,
      readonly VIEWERS_MUTE: number|bigint,
      readonly VIEWERS_BLOCK: number|bigint,
    };

    export interface OrganizationsRights {
      readonly OWNER: number|bigint,
      readonly ADMINISTRATOR: number|bigint,
      readonly INVITE_CREATE: number|bigint,
      readonly RIGHTS_MANAGE: number|bigint,
      readonly READ: number|bigint,
      readonly MANAGE: number|bigint,
      readonly DELETE: number|bigint,
      readonly POSTS_READ: number|bigint,
      readonly POSTS_CREATE: number|bigint,
      readonly POSTS_MANAGE: number|bigint,
      readonly POSTS_DELETE: number|bigint,
      readonly ROLES_MANAGE: number|bigint,
      readonly MEMBERS_KICK: number|bigint,
      readonly VIEWERS_BLOCK: number|bigint,
    };

    export interface Rights {
      readonly ME: MeRights,
      readonly USERS: UsersRights,
      readonly POSTS: PostsRights,
      readonly ORGANIZATIONS: OrganizationsRights
    };
    
    // prettier-ignore-start
    export const ME_RIGHTS: MeRights = {
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
  
    export const USERS_RIGHTS: UsersRights = {
      READ:                           1n << 14n,
      MANAGE:                         1n << 15n,
      MODERATE:                       1n << 16n,
    } as const;
  
    export const POSTS_RIGHTS: PostsRights = {
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
  
    export const ORGANIZATIONS_RIGHTS: OrganizationsRights = {
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
  
    export const RIGHTS: Rights = {
      ME: ME_RIGHTS,
      USERS: USERS_RIGHTS,
      POSTS: POSTS_RIGHTS,
      ORGANIZATIONS: ORGANIZATIONS_RIGHTS
    } as const;
    // prettier-ignore-end
  }

  export namespace Default {
    // prettier-ignore-start
    export const ME_RIGHTS: Lazy.MeRights = {
      ADMINISTRATOR:                  0n << 0n,         /* default: 1n << 1n */
      MODERATOR:                      0n << 1n,         /* default: 1n << 2n */
      USER:                           1n << 2n,         /* default: 1n << 3n */
      MUTE:                           0n << 3n,         /* default: 1n << 4n */
      BAN:                            0n << 4n,         /* default: 1n << 5n */
      POSTS_CREATE:                   1n << 5n,         /* default: 1n << 6n */
      COMMENTS_CREATE:                1n << 6n,         /* default: 1n << 7n */
      ORGANIZATIONS_CREATE:           1n << 7n,         /* default: 1n << 8n */
      POSTS_MANAGE:                   0n << 8n,         /* default: 1n << 9n */
      COMMENTS_MANAGE:                0n << 9n,         /* default: 1n << 10n */
      ORGANIZATIONS_MANAGE:           0n << 10n,        /* default: 1n << 11n */
      POSTS_DELETE:                   0n << 11n,        /* default: 1n << 12n */
      COMMENTS_DELETE:                0n << 12n,        /* default: 1n << 13n */
      ORGANIZATIONS_DELETE:           0n << 13n,        /* default: 1n << 14n */
    } as const;

    export const USERS_RIGHTS: Lazy.UsersRights = {
      READ:                           1n << 14n,        /* default: 1n << 15n */
      MANAGE:                         0n << 15n,        /* default: 1n << 16n */
      MODERATE:                       0n << 16n,        /* default: 1n << 17n */
    } as const;

    export const POSTS_RIGHTS: Lazy.PostsRights = {
      OWNER:                          0n << 17n,        /* default: 1n << 18n */
      MANAGER:                        0n << 18n,        /* default: 1n << 19n */
      VIEW:                           1n << 19n,        /* default: 1n << 20n */
      MANAGE:                         0n << 20n,        /* default: 1n << 21n */
      DELETE:                         0n << 21n,        /* default: 1n << 22n */
      REACT:                          1n << 22n,        /* default: 1n << 23n */
      ATTACH_FILES:                   1n << 23n,        /* default: 1n << 24n */
      COMMENTS_READ:                  1n << 24n,        /* default: 1n << 25n */
      COMMENTS_CREATE:                1n << 25n,        /* default: 1n << 26n */
      COMMENTS_DELETE:                0n << 26n,        /* default: 1n << 27n */
      COMMENTS_MANAGE:                0n << 27n,        /* default: 1n << 28n */
      COMMENTS_REACT:                 1n << 28n,        /* default: 1n << 29n */
      VIEWERS_MUTE:                   0n << 29n,        /* default: 1n << 30n */
      VIEWERS_BLOCK:                  0n << 30n,        /* default: 1n << 31n */
    } as const;

    export const ORGANIZATIONS_RIGHTS: Lazy.OrganizationsRights = {
      OWNER:                          0n << 31n,        /* default: 1n << 32n */
      ADMINISTRATOR:                  0n << 32n,        /* default: 1n << 33n */
      INVITE_CREATE:                  0n << 33n,        /* default: 1n << 34n */
      RIGHTS_MANAGE:                  0n << 34n,        /* default: 1n << 35n */
      READ:                           1n << 35n,        /* default: 1n << 36n */
      MANAGE:                         0n << 36n,        /* default: 1n << 37n */
      DELETE:                         0n << 37n,        /* default: 1n << 38n */
      POSTS_READ:                     1n << 38n,        /* default: 1n << 39n */
      POSTS_CREATE:                   0n << 39n,        /* default: 1n << 40n */
      POSTS_MANAGE:                   0n << 40n,        /* default: 1n << 41n */
      POSTS_DELETE:                   0n << 41n,        /* default: 1n << 42n */
      ROLES_MANAGE:                   0n << 42n,        /* default: 1n << 43n */
      MEMBERS_KICK:                   0n << 43n,        /* default: 1n << 44n */
      VIEWERS_BLOCK:                  0n << 44n,        /* default: 1n << 45n */
    } as const;

    export const USER_RIGHTS = {
      ME: ME_RIGHTS,
      USERS: USERS_RIGHTS,
      POSTS: POSTS_RIGHTS,
      ORGANIZATIONS: ORGANIZATIONS_RIGHTS
    } as const;

    export interface UserRights {
      ME: Lazy.MeRights,
      USERS: Lazy.UsersRights,
      POSTS: Lazy.PostsRights,
      ORGANIZATIONS: Lazy.OrganizationsRights,
    }
    // prettier-ignore-end
  }

  export namespace Raw {
    export const LAZY_ALL_RIGHTS = Parser.execute(Lazy.RIGHTS);

    export const LAZY_ME_RIGHTS = Parser.execute(Lazy.RIGHTS.ME);
    export const LAZY_USERS_RIGHTS = Parser.execute(Lazy.RIGHTS.USERS);
    export const LAZY_POSTS_RIGHTS = Parser.execute(Lazy.RIGHTS.POSTS);
    export const LAZY_ORGANIZATIONS_RIGHTS = Parser.execute(Lazy.RIGHTS.ORGANIZATIONS);

    export const DEFAULT_USER_ALL_RIGHTS = Parser.execute(Default.USER_RIGHTS);
    export const DEFAULT_USER_ME_RIGHTS = Parser.execute(Default.USER_RIGHTS.ME);
    export const DEFAULT_USER_USERS_RIGHTS = Parser.execute(Default.USER_RIGHTS.USERS);
    export const DEFAULT_USER_POSTS_RIGHTS = Parser.execute(Default.USER_RIGHTS.POSTS);
    export const DEFAULT_USER_ORGANIZATIONS_RIGHTS = Parser.execute(Default.USER_RIGHTS.ORGANIZATIONS);

    export const LAZY_RIGHTS = {
      ALL: LAZY_ALL_RIGHTS,
      
      ME: LAZY_ME_RIGHTS,
      USERS: LAZY_USERS_RIGHTS,
      POSTS: LAZY_POSTS_RIGHTS,
      ORGANIZATIONS: LAZY_ORGANIZATIONS_RIGHTS
    } as const;
  
    export const DEFAULT_USER_RIGHTS = {
      ALL: DEFAULT_USER_ALL_RIGHTS,
      
      ME: DEFAULT_USER_ME_RIGHTS,
      USERS: DEFAULT_USER_USERS_RIGHTS,
      POSTS: DEFAULT_USER_POSTS_RIGHTS,
      ORGANIZATIONS: DEFAULT_USER_ORGANIZATIONS_RIGHTS
    } as const;
  
    export const LAZY_RIGHTS_KEYS = [
      "ALL",
      "ME",
      "USERS",
      "POSTS",
      "ORGANIZATIONS"
    ] as const;
  
    export const DEFAULT_USER_RIGHTS_KEYS = [
      "ALL",
      "ME",
      "USERS",
      "POSTS",
      "ORGANIZATIONS"
    ] as const;
    
    export type LazyRights = typeof LAZY_RIGHTS;
    export type LazyRightsKeys = keyof LazyRights;
    export type DefaultUserRights = typeof DEFAULT_USER_RIGHTS;
    export type DefaultUserRightsKeys = keyof DefaultUserRights;
  }
  
  export type MeRights = keyof Lazy.MeRights;
  export type UsersRights = keyof Lazy.UsersRights;
  export type PostsRights = keyof Lazy.PostsRights;
  export type OrganizationsRights = keyof Lazy.OrganizationsRights;

  export const ME_KEYS = [
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
  export type MeRightsKeys = typeof ME_KEYS[number];
  
  export const USERS_KEYS = [
    "READ",
    "MANAGE",
    "MODERATE"
  ] as const;
  export type UsersRightsKeys = typeof USERS_KEYS[number];
  
  export const POSTS_KEYS = [
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
  export type PostsRightsKeys = typeof POSTS_KEYS[number];
  
  export const ORGANIZATIONS_KEYS = [
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
  export type OrganizationsRightsKeys = typeof ORGANIZATIONS_KEYS[number];
  
  export const LAZY_KEYS = [
    "ME",
    "USERS",
    "POSTS",
    "ORGANIZATIONS"
  ] as const;
  export type LazyRightsKeys = typeof LAZY_KEYS[number];
  
  export const KEYS = [
    "default",
    "users",
    "posts",
    "organizations"
  ] as const;
  export type RightsKeys = typeof KEYS[number];
  
  export type GetKeys<T extends LazyRightsKeys> = ({
    ME: MeRightsKeys,
    USERS: UsersRightsKeys,
    POSTS: PostsRightsKeys,
    ORGANIZATIONS: OrganizationsRightsKeys
  })[T];
  
  export interface Rights {
    default: Default.UserRights,
  
    users: {
      [userId: string]: Lazy.UsersRights
    },
  
    posts: {
      [postId: string]: Lazy.PostsRights
    },
  
    organizations: {
      [organizationId: string]: Lazy.OrganizationsRights
    },
  };
}
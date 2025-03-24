export namespace Rights {
  export type LazyMeRights = Readonly<{
    ADMINISTRATOR: number|bigint,
    MODERATOR: number|bigint,
    USER: number|bigint,
    
    MUTE: number|bigint,
    BAN: number|bigint,
  
    POSTS_CREATE: number|bigint,
    COMMENTS_CREATE: number|bigint,
    ORGANIZATIONS_CREATE: number|bigint,
  
    POSTS_MANAGE: number|bigint,
    COMMENTS_MANAGE: number|bigint,
    ORGANIZATIONS_MANAGE: number|bigint,
  
    POSTS_DELETE: number|bigint,
    COMMENTS_DELETE: number|bigint,
    ORGANIZATIONS_DELETE: number|bigint,
  }>;
  
  export type MeRights = keyof LazyMeRights;
  
  export type LazyUsersRights = Readonly<{
    READ: number|bigint,
    MANAGE: number|bigint,
    MODERATE: number|bigint,
  }>;
  
  export type UsersRights = keyof LazyUsersRights;
  
  export type LazyPostsRights = Readonly<{
    OWNER: number|bigint,
    MANAGER: number|bigint,
  
    VIEW: number|bigint,
    MANAGE: number|bigint,
    DELETE: number|bigint,
    REACT: number|bigint,
    ATTACH_FILES: number|bigint,
  
    COMMENTS_READ: number|bigint,
    COMMENTS_CREATE: number|bigint,
    COMMENTS_DELETE: number|bigint,
    COMMENTS_MANAGE: number|bigint,
    COMMENTS_REACT: number|bigint,
    
    VIEWERS_MUTE: number|bigint,
    VIEWERS_BLOCK: number|bigint,
  }>;
  
  export type PostsRights = keyof LazyPostsRights;
  
  export type LazyOrganizationsRights = Readonly<{
    OWNER: number|bigint,
    ADMINISTRATOR: number|bigint,
  
    INVITE_CREATE: number|bigint,
    RIGHTS_MANAGE: number|bigint,
  
    READ: number|bigint,
    MANAGE: number|bigint,
    DELETE: number|bigint,
  
    POSTS_READ: number|bigint,
    POSTS_CREATE: number|bigint,
    POSTS_MANAGE: number|bigint,
    POSTS_DELETE: number|bigint,
  
    ROLES_MANAGE: number|bigint,
  
    MEMBERS_KICK: number|bigint,
    VIEWERS_BLOCK: number|bigint,
  }>;
  
  export type OrganizationsRights = keyof LazyOrganizationsRights;
  
  export interface LazyRights {
    readonly ME: LazyMeRights,
    readonly USERS: LazyUsersRights,
    readonly POSTS: LazyPostsRights,
    readonly ORGANIZATIONS: LazyOrganizationsRights
  };
  
  // prettier-ignore-start
  export const LAZY_RIGHTS: LazyRights = {
    ME: {
      ADMINISTRATOR:                  1n << 1n,
      MODERATOR:                      1n << 2n,
      USER:                           1n << 3n,
      
      MUTE:                           1n << 4n,
      BAN:                            1n << 5n,
    
      POSTS_CREATE:                   1n << 6n,
      COMMENTS_CREATE:                1n << 7n,
      ORGANIZATIONS_CREATE:           1n << 8n,
    
      POSTS_MANAGE:                   1n << 9n,
      COMMENTS_MANAGE:                1n << 10n,
      ORGANIZATIONS_MANAGE:           1n << 11n,
    
      POSTS_DELETE:                   1n << 12n,
      COMMENTS_DELETE:                1n << 13n,
      ORGANIZATIONS_DELETE:           1n << 14n,
    },
  
    USERS: {
      READ:                           1n << 15n,
      MANAGE:                         1n << 16n,
      MODERATE:                       1n << 17n,
    },
  
    POSTS: {
      OWNER:                          1n << 18n,
      MANAGER:                        1n << 19n,
  
      VIEW:                           1n << 20n,
      MANAGE:                         1n << 21n,
      DELETE:                         1n << 22n,
      REACT:                          1n << 23n,
      ATTACH_FILES:                   1n << 24n,
  
      COMMENTS_READ:                  1n << 25n,
      COMMENTS_CREATE:                1n << 26n,
      COMMENTS_DELETE:                1n << 27n,
      COMMENTS_MANAGE:                1n << 28n,
      COMMENTS_REACT:                 1n << 29n,
      
      VIEWERS_MUTE:                   1n << 30n,
      VIEWERS_BLOCK:                  1n << 31n,
    },
  
    ORGANIZATIONS: {
      OWNER:                          1n << 32n,
      ADMINISTRATOR:                  1n << 33n,
  
      INVITE_CREATE:                  1n << 34n,
      RIGHTS_MANAGE:                  1n << 35n,
  
      READ:                           1n << 36n,
      MANAGE:                         1n << 37n,
      DELETE:                         1n << 38n,
  
      POSTS_READ:                     1n << 39n,
      POSTS_CREATE:                   1n << 40n,
      POSTS_MANAGE:                   1n << 41n,
      POSTS_DELETE:                   1n << 42n,
  
      ROLES_MANAGE:                   1n << 43n,
  
      MEMBERS_KICK:                   1n << 44n,
      VIEWERS_BLOCK:                  1n << 45n,
    }
  } as const;
  
  export const DEFAULT_USER_RIGHTS: Readonly<{
    [P in keyof LazyRights]: LazyRights[Uppercase<P>]
  }> = {
    ME: {
      ADMINISTRATOR:                  1n << 0n,        /* default: 1n << 1n */
      MODERATOR:                      1n << 0n,        /* default: 1n << 2n */
      USER:                           1n << 3n,        /* default: 1n << 3n */
      MUTE:                           1n << 0n,        /* default: 1n << 4n */
      BAN:                            1n << 0n,        /* default: 1n << 5n */
      POSTS_CREATE:                   1n << 6n,        /* default: 1n << 6n */
      COMMENTS_CREATE:                1n << 7n,        /* default: 1n << 7n */
      ORGANIZATIONS_CREATE:           1n << 8n,        /* default: 1n << 8n */
      POSTS_MANAGE:                   1n << 0n,        /* default: 1n << 9n */
      COMMENTS_MANAGE:                1n << 0n,        /* default: 1n << 10n */
      ORGANIZATIONS_MANAGE:           1n << 0n,        /* default: 1n << 11n */
      POSTS_DELETE:                   1n << 0n,        /* default: 1n << 12n */
      COMMENTS_DELETE:                1n << 0n,        /* default: 1n << 13n */
      ORGANIZATIONS_DELETE:           1n << 0n,        /* default: 1n << 14n */
    },
  
    USERS: {
      READ:                           1n << 15n,       /* default: 1n << 15n */
      MANAGE:                         1n << 0n,        /* default: 1n << 16n */
      MODERATE:                       1n << 0n,        /* default: 1n << 17n */
    },
  
    POSTS: {
      OWNER:                          1n << 0n,        /* default: 1n << 18n */
      MANAGER:                        1n << 0n,        /* default: 1n << 19n */
      VIEW:                           1n << 20n,       /* default: 1n << 20n */
      MANAGE:                         1n << 0n,        /* default: 1n << 21n */
      DELETE:                         1n << 0n,        /* default: 1n << 22n */
      REACT:                          1n << 23n,       /* default: 1n << 23n */
      ATTACH_FILES:                   1n << 24n,       /* default: 1n << 24n */
      COMMENTS_READ:                  1n << 25n,       /* default: 1n << 25n */
      COMMENTS_CREATE:                1n << 26n,       /* default: 1n << 26n */
      COMMENTS_DELETE:                1n << 0n,        /* default: 1n << 27n */
      COMMENTS_MANAGE:                1n << 0n,        /* default: 1n << 28n */
      COMMENTS_REACT:                 1n << 29n,       /* default: 1n << 29n */
      VIEWERS_MUTE:                   1n << 0n,        /* default: 1n << 30n */
      VIEWERS_BLOCK:                  1n << 0n,        /* default: 1n << 31n */
    },
  
    ORGANIZATIONS: {
      OWNER:                          1n << 0n,        /* default: 1n << 32n */
      ADMINISTRATOR:                  1n << 0n,        /* default: 1n << 33n */
      INVITE_CREATE:                  1n << 0n,        /* default: 1n << 34n */
      RIGHTS_MANAGE:                  1n << 0n,        /* default: 1n << 35n */
      READ:                           1n << 36n,       /* default: 1n << 36n */
      MANAGE:                         1n << 0n,        /* default: 1n << 37n */
      DELETE:                         1n << 0n,        /* default: 1n << 38n */
      POSTS_READ:                     1n << 39n,       /* default: 1n << 39n */
      POSTS_CREATE:                   1n << 0n,        /* default: 1n << 40n */
      POSTS_MANAGE:                   1n << 0n,        /* default: 1n << 41n */
      POSTS_DELETE:                   1n << 0n,        /* default: 1n << 42n */
      ROLES_MANAGE:                   1n << 0n,        /* default: 1n << 43n */
      MEMBERS_KICK:                   1n << 0n,        /* default: 1n << 44n */
      VIEWERS_BLOCK:                  1n << 0n,        /* default: 1n << 45n */
    }
  } as const;
  // prettier-ignore-end
  
  export const R_ME_KEYS = [
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
  export type MeRightsKeys = typeof R_ME_KEYS[number];
  
  export const R_USERS_KEYS = [
    "READ",
    "MANAGE",
    "MODERATE"
  ] as const;
  export type UsersRightsKeys = typeof R_USERS_KEYS[number];
  
  export const R_POSTS_KEYS = [
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
  export type PostsRightsKeys = typeof R_POSTS_KEYS[number];
  
  export const R_ORGANIZATIONS_KEYS = [
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
  export type OrganizationsRightsKeys = typeof R_ORGANIZATIONS_KEYS[number];
  
  export const R_LAZY_KEYS = [
    "ME",
    "USERS",
    "POSTS",
    "ORGANIZATIONS"
  ] as const;
  export type LazyRightsKeys = typeof R_LAZY_KEYS[number];
  
  export const R_KEYS = [
    "default",
    "users",
    "posts",
    "organizations"
  ] as const;
  export type RightsKeys = typeof R_KEYS[number];
  
  export type GetKeys<T extends LazyRightsKeys> = ({
    ME: MeRightsKeys,
    USERS: UsersRightsKeys,
    POSTS: PostsRightsKeys,
    ORGANIZATIONS: OrganizationsRightsKeys
  })[T];
  
  export interface Rights {
    default: typeof DEFAULT_USER_RIGHTS,
  
    users: {
      [userId: string]: LazyUsersRights
    },
  
    posts: {
      [postId: string]: LazyPostsRights
    },
  
    organizations: {
      [organizationId: string]: LazyOrganizationsRights
    },
  };
}
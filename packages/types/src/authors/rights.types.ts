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

export const LAZY_RIGHTS: LazyRights = {
  ME: {
    ADMINISTRATOR: 0x000000001,
    MODERATOR: 0x000000002,
    USER: 0x000000004,
    
    MUTE: 0x000000008,
    BAN: 0x000000010,
  
    POSTS_CREATE: 0x000000020,
    COMMENTS_CREATE: 0x000000040,
    ORGANIZATIONS_CREATE: 0x000000080,
  
    POSTS_MANAGE: 0x000000100,
    COMMENTS_MANAGE: 0x000000200,
    ORGANIZATIONS_MANAGE: 0x000000400,
  
    POSTS_DELETE: 0x000000800,
    COMMENTS_DELETE: 0x000001000,
    ORGANIZATIONS_DELETE: 0x000002000,
  },

  USERS: {
    READ: 0x000000001,
    MANAGE: 0x000000002,
    MODERATE: 0x000000004,
  },

  POSTS: {
    OWNER: 0x000000001,
    MANAGER: 0x000000002,

    VIEW: 0x000000004,
    MANAGE: 0x000000008,
    DELETE: 0x000000010,
    REACT: 0x000000020,
    ATTACH_FILES: 0x000000040,

    COMMENTS_READ: 0x000000080,
    COMMENTS_CREATE: 0x000000100,
    COMMENTS_DELETE: 0x000000200,
    COMMENTS_MANAGE: 0x000000400,
    COMMENTS_REACT: 0x000000800,
    
    VIEWERS_MUTE: 0x000001000,
    VIEWERS_BLOCK: 0x000002000,
  },

  ORGANIZATIONS: {
    OWNER: 0x000000001,
    ADMINISTRATOR: 0x000000002,

    INVITE_CREATE: 0x000000004,
    RIGHTS_MANAGE: 0x000000008,

    READ: 0x000000010,
    MANAGE: 0x000000020,
    DELETE: 0x000000040,

    POSTS_READ: 0x000000080,
    POSTS_CREATE: 0x000000100,
    POSTS_MANAGE: 0x000000200,
    POSTS_DELETE: 0x000000400,

    ROLES_MANAGE: 0x000000800,

    MEMBERS_KICK: 0x000001000,
    VIEWERS_BLOCK: 0x000002000,
  }
} as const;

export const DEFAULT_USER_RIGHTS: Readonly<{
  [P in Lowercase<keyof LazyRights>]: LazyRights[Uppercase<P>]
}> = {
  me: {
    ADMINISTRATOR: 0x000000000,
    MODERATOR: 0x000000000,
    USER: 0x000000004,
    
    MUTE: 0x000000000,
    BAN: 0x000000000,
  
    POSTS_CREATE: 0x000000020,
    COMMENTS_CREATE: 0x000000040,
    ORGANIZATIONS_CREATE: 0x000000080,
  
    POSTS_MANAGE: 0x000000000,
    COMMENTS_MANAGE: 0x000000000,
    ORGANIZATIONS_MANAGE: 0x000000000,
  
    POSTS_DELETE: 0x000000000,
    COMMENTS_DELETE: 0x000000000,
    ORGANIZATIONS_DELETE: 0x000000000,
  },

  users: {
    READ: 0x000000001,
    MANAGE: 0x000000000,
    MODERATE: 0x000000000,
  },

  posts: {
    OWNER: 0x000000000,
    MANAGER: 0x000000000,

    VIEW: 0x000000004,
    MANAGE: 0x000000000,
    DELETE: 0x000000000,
    REACT: 0x000000020,
    ATTACH_FILES: 0x000000040,

    COMMENTS_READ: 0x000000100,
    COMMENTS_CREATE: 0x000000200,
    COMMENTS_DELETE: 0x000000000,
    COMMENTS_MANAGE: 0x000000000,
    COMMENTS_REACT: 0x000001000,
    
    VIEWERS_MUTE: 0x000000000,
    VIEWERS_BLOCK: 0x000000000,
  },

  organizations: {
    OWNER: 0x000000000,
    ADMINISTRATOR: 0x000000000,

    INVITE_CREATE: 0x000000000,
    RIGHTS_MANAGE: 0x000000000,

    READ: 0x000000010,
    MANAGE: 0x000000000,
    DELETE: 0x000000000,

    POSTS_READ: 0x000000080,
    POSTS_CREATE: 0x000000000,
    POSTS_MANAGE: 0x000000000,
    POSTS_DELETE: 0x000000000,

    ROLES_MANAGE: 0x000000000,

    MEMBERS_KICK: 0x000000000,
    VIEWERS_BLOCK: 0x000000000,
  }
} as const;

export const R_KEYS = [
  "users",
  "posts",
  "organizations"
] as const;

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
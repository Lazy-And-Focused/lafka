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
    ADMINISTRATOR:                  0x00000000000000001,
    MODERATOR:                      0x00000000000000002,
    USER:                           0x00000000000000004,
    
    MUTE:                           0x00000000000000008,
    BAN:                            0x00000000000000010,
  
    POSTS_CREATE:                   0x00000000000000020,
    COMMENTS_CREATE:                0x00000000000000040,
    ORGANIZATIONS_CREATE:           0x00000000000000080,
  
    POSTS_MANAGE:                   0x00000000000000100,
    COMMENTS_MANAGE:                0x00000000000000200,
    ORGANIZATIONS_MANAGE:           0x00000000000000400,
  
    POSTS_DELETE:                   0x00000000000000800,
    COMMENTS_DELETE:                0x00000000000001000,
    ORGANIZATIONS_DELETE:           0x00000000000002000,
  },

  USERS: {
    READ:                           0x00000000000004000,
    MANAGE:                         0x00000000000008000,
    MODERATE:                       0x00000000000010000,
  },

  POSTS: {
    OWNER:                          0x00000000000020000,
    MANAGER:                        0x00000000000040000,

    VIEW:                           0x00000000000080000,
    MANAGE:                         0x00000000000100000,
    DELETE:                         0x00000000000200000,
    REACT:                          0x00000000000400000,
    ATTACH_FILES:                   0x00000000000800000,

    COMMENTS_READ:                  0x00000000001000000,
    COMMENTS_CREATE:                0x00000000002000000,
    COMMENTS_DELETE:                0x00000000004000000,
    COMMENTS_MANAGE:                0x00000000008000000,
    COMMENTS_REACT:                 0x00000000010000000,
    
    VIEWERS_MUTE:                   0x00000000020000000,
    VIEWERS_BLOCK:                  0x00000000040000000,
  },

  ORGANIZATIONS: {
    OWNER:                          0x00000000080000000,
    ADMINISTRATOR:                  0x00000000100000000,

    INVITE_CREATE:                  0x00000000200000000,
    RIGHTS_MANAGE:                  0x00000000400000000,

    READ:                           0x00000000800000000,
    MANAGE:                         0x00000001000000000,
    DELETE:                         0x00000002000000000,

    POSTS_READ:                     0x00000004000000000,
    POSTS_CREATE:                   0x00000008000000000,
    POSTS_MANAGE:                   0x00000010000000000,
    POSTS_DELETE:                   0x00000020000000000,

    ROLES_MANAGE:                   0x00000080000000000,

    MEMBERS_KICK:                   0x00000100000000000,
    VIEWERS_BLOCK:                  0x00000200000000000,
  }
} as const;

export const DEFAULT_USER_RIGHTS: Readonly<{
  [P in keyof LazyRights]: LazyRights[Uppercase<P>]
}> = {
  ME: {
    ADMINISTRATOR:                  0x00000000000000000,
    MODERATOR:                      0x00000000000000000,
    USER:                           0x00000000000000004,
    
    MUTE:                           0x00000000000000000,
    BAN:                            0x00000000000000000,
  
    POSTS_CREATE:                   0x00000000000000020,
    COMMENTS_CREATE:                0x00000000000000040,
    ORGANIZATIONS_CREATE:           0x00000000000000080,
  
    POSTS_MANAGE:                   0x00000000000000000,
    COMMENTS_MANAGE:                0x00000000000000000,
    ORGANIZATIONS_MANAGE:           0x00000000000000000,
  
    POSTS_DELETE:                   0x00000000000000000,
    COMMENTS_DELETE:                0x00000000000000000,
    ORGANIZATIONS_DELETE:           0x00000000000000000,
  },

  USERS: {
    READ:                           0x00000000000004000,
    MANAGE:                         0x00000000000000000,
    MODERATE:                       0x00000000000000000,
  },

  POSTS: {
    OWNER:                          0x00000000000000000,
    MANAGER:                        0x00000000000000000,

    VIEW:                           0x00000000000080000,
    MANAGE:                         0x00000000000000000,
    DELETE:                         0x00000000000000000,
    REACT:                          0x00000000000400000,
    ATTACH_FILES:                   0x00000000000800000,

    COMMENTS_READ:                  0x00000000001000000,
    COMMENTS_CREATE:                0x00000000002000000,
    COMMENTS_DELETE:                0x00000000000000000,
    COMMENTS_MANAGE:                0x00000000000000000,
    COMMENTS_REACT:                 0x00000000010000000,
    
    VIEWERS_MUTE:                   0x00000000000000000,
    VIEWERS_BLOCK:                  0x00000000000000000,
  },

  ORGANIZATIONS: {
    OWNER:                          0x00000000000000000,
    ADMINISTRATOR:                  0x00000000000000000,

    INVITE_CREATE:                  0x00000000000000000,
    RIGHTS_MANAGE:                  0x00000000000000000,

    READ:                           0x00000000800000000,
    MANAGE:                         0x00000000000000000,
    DELETE:                         0x00000000000000000,

    POSTS_READ:                     0x00000004000000000,
    POSTS_CREATE:                   0x00000000000000000,
    POSTS_MANAGE:                   0x00000000000000000,
    POSTS_DELETE:                   0x00000000000000000,

    ROLES_MANAGE:                   0x00000000000000000,

    MEMBERS_KICK:                   0x00000000000000000,
    VIEWERS_BLOCK:                  0x00000000000000000,
  }
} as const;
// prettier-ignore-end

export const R_LAZY_KEYS = [
  "ME",
  "USERS",
  "POSTS",
  "ORGANIZATIONS"
];

export const R_KEYS = [
  "default",
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
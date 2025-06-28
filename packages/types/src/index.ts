import { UpdateWriteOpResult, DeleteResult } from "mongoose";

export { Rights } from "./rights/rights.types";

export namespace LAFka {
  // AuthUsers types & constants


  export const AUTH_TYPES = ["google", "yandex"] as const;
  export type AuthTypes = (typeof AUTH_TYPES)[number];
  export interface AuthUser {
    id: string;
    profile_id: string;
    service_id: string;
    access_token: string;
    refresh_token?: string;
    created_at: string;
    type: AuthTypes;
  };
  

  // Users types & constants


  export interface User {
    id: string;

    username: string;
    nickname?: string;
    avatar?: string;

    biography?: string;
    links: Link[];

    created_at: string;

    forum_posts: string[];
    blog_posts: string[];
    followed_forum_posts: string[];
    followed_blog_posts: string[];
    blocked_posts: string[];

    followers: string[];
    following: string[];

    /* bigint */
    rights: string;
  }


  // Comments types & constants

  export interface Comment {
    id: string;
  
    content: string;
  
    created_at: string;
    changed_at?: string;
  
    author_id: string;
    post_id: string;
  
    reply?: string;
  }
  

  // Posts types & constants


  export const POST_TYPES = ["forum", "blog"] as const;
  export type PostTypes = (typeof POST_TYPES)[number];
  export const VIEW_STAUTS = ["open", "limited", "link"] as const;
  export type ViewStatus = (typeof VIEW_STAUTS)[number];
  
  export type LazyPost = {
    id: string;

    name: string;
    content: string;
    description?: string;
    comments: string[];
    followers: number;

    /** ISO date-format */
    created_at: string;
    /** ISO date-format */
    changed_at?: string;

    creator_id: string;

    status: ViewStatus;
    /* key: string, value: bigint */
    rights: Map<string, string>;
    
    /** forum */
    tags: Tag[];

    /** blog */
    likes: number;
    dislikes: number;
    reposts: number;

    type: "blog"|"forum";
  };

  export type Post = {
    id: string;

    name: string;
    content: string;
    description?: string;
    comments: string[];
    followers: number;

    created_at: string;
    changed_at?: string;

    creator_id: string;

    status: ViewStatus;
    /* key: string, value: bigint */
    rights: Map<string, string>;
  } & ({
    /** forum */
    tags: Tag[];

    type: "forum"
  } | {
    /** blog */
    likes: number;
    /** blog */
    dislikes: number;
    /** blog */
    reposts: number;

    type: "blog"
  });


  // Organizations types & constants


  export const ORGANIZATION_KEYS = [
    "id",
    "owner_id",
    "creator_id",
    "members",
    "posts",
    "rights"
  ] as const;
  export const S_ORGANIZATION_KEYS: readonly string[] = ORGANIZATION_KEYS;
  export type OrganizationKeys = (typeof ORGANIZATION_KEYS)[number];

  export interface Organization {
    id: string;
    
    name: string;
    description: string;
    email: string;

    logo: string;
    banner: string;
    
    owner_id: string;
    creator_id: string;
    members: string[];
    posts: string[];

    links: Link[];

    /* key: string, value: bigint */
    rights: Map<string, string>;
  }


  // Utility types & constants


  export const POST_STATUS = {
    blocked: "blocked",
    closed: "closed",
    open: "open",
  } as const;
  export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];
  export const TAGS = [
    "Design",
    "Eat",
    "IT",
    "Other",
    "Programming",
    "Social",
  ] as const;
  export const S_TAGS: readonly string[] = TAGS;
  export type LazyTags = string;
  export type Tags = (typeof TAGS)[number];
  
  export type Tag<T extends boolean = false> = {
    id: string;
    name: T extends true ? Tags : LazyTags;
  };
  
  export type Link = {
    name: string;
    link: string;
  };
}

export namespace LAFka.Database {
  export const MODELS = ["auth_users", "posts", "comments", "users"] as const;
  export type Models = (typeof MODELS)[number];
};

export namespace LAFka.Response {
  export type DataType = Exclude<LAFka.Database.Models, "auth_users">;
  
  export type GetData<T> = {
    type: DataType;
  } & ({
    successed: false;
    resource: null;
    error: unknown;
  } | {
    successed: true;
    resource: T;
    error: null;
  });
  
  export type CreateData<T> = {
    type: DataType;
    date: string;
  } & ({
    successed: true;
    created_resource: T;
    error: null;
  } | {
    successed: false;
    created_resource: null;
    error: unknown;
  });
  
  export type ChangeData = {
    type: DataType;
    date: string;
  } & ({
    successed: false;
    changed_resource: null;
    error: unknown;
  } | {
    successed: true;
    changed_resource: UpdateWriteOpResult;
    error: null;
  });
  
  export type DeleteData = {
    type: DataType;
    date: string;
  } & ({
    successed: false;
    deleted_resource: null;
    error: unknown;
  } | {
    successed: true;
    deleted_resource: DeleteResult;
    error: null;
  });
};
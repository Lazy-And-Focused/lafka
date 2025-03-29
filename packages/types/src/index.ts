import { UpdateWriteOpResult, DeleteResult } from "mongoose";

import { Rights } from "./rights/rights.types";
export { Rights } from "./rights/rights.types";

export namespace LAFka {
  export namespace Response {
    export type DataType = Exclude<Database.Models, "auth_users">;
    
    export type GetData<T> = {
      type: DataType;
    } & ({
      successed: true;
      resource: null;
      error: unknown;
    } | {
      successed: true;
      resource: T;
      error: null;
    });
    
    export type CreateData<T> = {
      type: DataType;
      date: Date;
    } & ({
      successed: true;
      created_resource: T;
    } | {
      successed: false;
      created_resource: null;
      error: unknown;
    });
    
    export type ChangeDataSuccessed<T> = {
      type: DataType;
      date: Date;
      successed: true;
      error: null;
    } & ({
      changed_resource: UpdateWriteOpResult;
      changed_resource_type: "update";
    } | {
      changed_resource: T;
      changed_resource_type: "resource";
    });
    
    export type ChangeData<T> = {
      type: DataType;
      date: Date;
    } & ({
      successed: false;
      changed_resource: null;
      error: unknown;
    } | ChangeDataSuccessed<T>);
    
    export type DeleteDataSuccessed<T> = {
      type: DataType;
      successed: boolean;
      error: null;
      date: Date;
    } & ({
      deleted_resource_type: "delete";
      deleted_resource: DeleteResult;
    } | {
      deleted_resource_type: "resource";
      deleted_resource: T;
    });

    export type DeleteData<T> = {
      type: DataType;
      date: Date;
    } & ({
      successed: false;
      deleted_resource: null;
      error: unknown;
    } | DeleteDataSuccessed<T>);
  }

  export namespace Database {
    export const MODELS = ["auth_users", "posts", "comments", "users"] as const;
    export type Models = (typeof MODELS)[number];

    export const KEYS = {
      auth_users: LAFka.AUTH_USER_KEYS,
      posts: [...LAFka.POST_KEYS, ...LAFka.FORUM_POST_KEYS, ...LAFka.BLOG_POST_KEYS],
      comments: LAFka.COMMENT_KEYS,
      users: LAFka.USER_KEYS,
    
      blog_posts: LAFka.BLOG_POST_KEYS,
      forum_posts: LAFka.FORUM_POST_KEYS
    } as const;
    
  }

  

  // AuthUsers types & constants


  export const AUTH_TYPES = ["google", "yandex"] as const;
  export type AuthTypes = (typeof AUTH_TYPES)[number];
  export const AUTH_USER_KEYS = [
    "id",
    "profile_id",
    "service_id",
    "access_token",
    "refresh_token",
    "created_at",
    "type"
  ] as const;
  export interface AuthUser {
    id: string;
    profile_id: string;
    service_id: string;
    access_token: string;
    refresh_token?: string;
    created_at: Date;
    type: AuthTypes;
  };
  

  // Users types & constants


  export const USER_KEYS = [
    "id",
    "username",
    "nickname",
    "avatar",
    "biography",
    "links",
    "created_at",
    "forum_posts",
    "blog_posts",
    "followed_forum_posts",
    "followed_blog_posts",
    "blocked_posts",
    "followers",
    "following",
    "rights"
  ] as const;
  export interface User {
    id: string;

    username: string;
    nickname?: string;
    avatar?: string;

    biography?: string;
    links: Link[];

    created_at: Date;

    forum_posts: string[];
    blog_posts: string[];
    followed_forum_posts: string[];
    followed_blog_posts: string[];
    blocked_posts: string[];

    followers: string[];
    following: string[];

    rights: Rights.Rights;
  }


  // Comments types & constants


  export const COMMENT_KEYS = [
    "id",
    "content",
    "created_at",
    "changed_at",
    "author_id",
    "post_id",
    "reply"
  ] as const;
  export interface Comment {
    id: string;
  
    content: string;
  
    created_at: Date;
    changed_at?: Date;
  
    author_id: string;
    post_id: string;
  
    reply?: string;
  }
  

  // Posts types & constants


  export const BLOG_POST_KEYS = ["likes", "dislikes", "reposts"] as const;
  export interface BlogPost extends Post {
    likes: number;
    dislikes: number;
    reposts: number;
  }

  export const FORUM_POST_KEYS = ["tags", "status"] as const;
  export interface ForumPost extends Post {
    tags: Tag[];
    status: PostStatus;
  }

  export const POST_KEYS = [
    "id",
    "name",
    "content",
    "description",
    "comments",
    "followers",
    "created_at",
    "changed_at",
    "creator_id",
    "type",
    "view_status"
  ] as const;
  export const POST_TYPES = ["forum", "blog"] as const
  export type PostTypes = (typeof POST_TYPES)[number];
  export interface Post {
    id: string;

    name: string;
    content: string;
    description?: string;
    comments: string[];
    followers: number;

    created_at: Date;
    changed_at?: Date;

    creator_id: string;

    type: PostTypes;
    view_status: 0 | 1;
  }

  export type BlogAndForumPost = BlogPost & ForumPost;


  // Utility types & constants


  export const POST_STATUS = {
    closed: "closed",
    open: "open",
    blocked: "blocked"
  } as const;
  export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];
  export const TAGS = [
    "Программирование",
    "Социальные сети",
    "Дизайн",
    "Еда",
    "IT"
  ] as const;
  export type LazyTags = string;
  export type Tags = (typeof TAGS)[number];
  
  export type Tag = {
    id: string;
    name: Tags | LazyTags;
  };
  
  export type Link = {
    name: string;
    link: string;
  };
}
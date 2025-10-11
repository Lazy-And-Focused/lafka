import { PostTag } from "./utility.types";

export const POST_TYPES = ["forum", "blog"] as const;
export type PostTypes = (typeof POST_TYPES)[number];

export const VIEW_STATUS = ["open", "limited", "link"] as const;
export type ViewStatus = (typeof VIEW_STATUS)[number];

export type CreatePost = {
  name: string;
  content: string;
  description?: string;

  tags?: PostTag[];
  status?: ViewStatus;

  creator_id: string;

  type: "forum" | "blog";
};

export type LazyPost = {
  id: string;

  name: string;
  content: string;
  description?: string;
  comments: string[];
  followers: number;
  tags: PostTag[];

  created_at: string;
  changed_at?: string;

  creator_id: string;

  status: ViewStatus;
  /** @key {string} @value {bigint} */
  rights: Map<string, string>;

  /** blog */
  likes: number;
  /** blog */
  dislikes: number;
  /** blog */
  reposts: number;

  type: "blog" | "forum";
};

export type ForumPost = {
  type: "forum"
};

export type BlogPost = {
  likes: number;
  dislikes: number;
  reposts: number;

  type: "blog";
}

export type Post = {
  id: string;

  name: string;
  content: string;
  description?: string;
  comments: string[];
  followers: number;
  tags: PostTag[];

  created_at: string;
  changed_at?: string;

  creator_id: string;

  status: ViewStatus;
  /** @key {string}, @value {bigint} */
  rights: Map<string, string>;
} & (ForumPost | BlogPost);

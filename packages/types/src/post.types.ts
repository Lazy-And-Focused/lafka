import { PostTag } from "./utility.types";

export const POST_TYPES = ["forum", "blog"] as const;
export type PostTypes = (typeof POST_TYPES)[number];

export const VIEW_STAUTS = ["open", "limited", "link"] as const;
export type ViewStatus = (typeof VIEW_STAUTS)[number];

export type CreatePost = {
  name: string;
  content: string;
  description?: string;

  tags?: PostTag[];
  status?: ViewStatus;

  creator_id: string;

  type: "forum"|"blog";
}

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
  /* key: string, value: bigint */
  rights: Map<string, string>;

  /** blog */
  likes: number;
  /** blog */
  dislikes: number;
  /** blog */
  reposts: number;

  type: "blog"|"forum";
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
  /* key: string, value: bigint */
  rights: Map<string, string>;
} & ({
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
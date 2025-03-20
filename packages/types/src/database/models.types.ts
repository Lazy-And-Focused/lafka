import { AUKeys } from "../auth/auth-user.types";
import { BPKeys } from "../posts/blog-post.types";
import { CKeys } from "../content/comment.types";
import { PFKeys } from "../posts/forum-post.types";
import { PKeys } from "../posts/post.types";
import { UKeys } from "../authors/user.types";

export const MODELS = [
  "auth_users",
  "posts",
  "comments",
  "users"
] as const;

export type Models = (typeof MODELS)[number];

export const KEYS = {
  auth_users: AUKeys,
  posts: [...PKeys, ...PFKeys, ...BPKeys],
  comments: CKeys,
  users: UKeys,
  
  blog_posts: BPKeys,
  forum_posts: PFKeys,
} as const;

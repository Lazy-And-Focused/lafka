import { AU_KEYS } from "../auth/auth-user.types";
import { BP_KEYS } from "../posts/blog-post.types";
import { C_KEYS } from "../content/comment.types";
import { PF_KEYS } from "../posts/forum-post.types";
import { P_KEYS } from "../posts/post.types";
import { U_KEYS } from "../authors/user.types";

export const MODELS = ["auth_users", "posts", "comments", "users"] as const;

export type Models = (typeof MODELS)[number];

export const KEYS = {
  auth_users: AU_KEYS,
  posts: [...P_KEYS, ...PF_KEYS, ...BP_KEYS],
  comments: C_KEYS,
  users: U_KEYS,

  blog_posts: BP_KEYS,
  forum_posts: PF_KEYS
} as const;

import { Link } from "./utility.types";

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
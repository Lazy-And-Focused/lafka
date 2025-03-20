import type { Link } from "../utility/utility.types";

export const U_KEYS = [
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
	"following"
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
}
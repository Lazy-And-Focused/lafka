import type { Link } from "../utility/utility.types";

interface User {
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

export { User };

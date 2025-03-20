import type { Post } from "./post.types";

export const BP_KEYS = [
	"likes",
	"dislikes",
	"reposts"
] as const;

export interface BlogPost extends Post {
	likes: number;
	dislikes: number;
	reposts: number;
};
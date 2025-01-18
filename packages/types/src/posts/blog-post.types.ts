import type { Post } from "./post.types";

interface BlogPost extends Post {
	likes: number;
	dislikes: number;
	reposts: number;
}

export { BlogPost };

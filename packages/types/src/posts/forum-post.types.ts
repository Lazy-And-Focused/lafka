import type { Post } from "./post.types";
import type { Tag, PostStatus } from "../utility/utility.types";

interface ForumPost extends Post {
	tags: Tag[];
	status: PostStatus;
}

export { ForumPost };

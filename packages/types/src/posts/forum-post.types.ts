import type { Post } from "./post.types";
import type { Tag, PostStatus } from "../utility/utility.types";

export const PFKeys = [
	"tags",
	"status"
];

export interface ForumPost extends Post {
	tags: Tag[];
	status: PostStatus;
}

import DatabaseClass from "../classes/default/database.class";

import AuthUserSchema from "./schema/auth-user.schema";
import CommentsSchema from "./schema/comments.schema";
import PostsSchema from "./schema/posts.schema";
import UsersSchema from "./schema/user.schema";

import type { User } from "types/authors/user.types";
import type { Comment } from "types/content/comment.types";
import type { BlogPost } from "types/posts/blog-post.types";
import type { ForumPost } from "types/posts/forum-post.types";
import type AuthUser from "types/auth/auth-user.types";

class Database {
	private readonly _auth_users = new DatabaseClass<AuthUser>(AuthUserSchema)
	private readonly _comments = new DatabaseClass<Comment>(CommentsSchema);

	private readonly _posts = new DatabaseClass<
		BlogPost & ForumPost,
		Pick<BlogPost & ForumPost, "content" | "creator_id" | "name" | "type">
	>(PostsSchema);

	private readonly _users = new DatabaseClass<User, Pick<User, "username">>(
		UsersSchema
	);

	get auth_users() {
		return this._auth_users;
	}

	get comments() {
		return this._comments;
	}

	get posts() {
		return this._posts;
	}

	get users() {
		return this._users;
	}
}

export default new Database();

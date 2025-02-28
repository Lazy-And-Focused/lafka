import DatabaseClass, { DatabaseType } from "../classes/default/database.class";
import authUsersClass from "../classes/default/auth-user.class";
import commentsClass from "../classes/default/comment.class";
import postsClass from "../classes/default/posts.class";
import userClass from "../classes/default/user.class";

import AuthUserSchema from "./schema/auth-user.schema";
import CommentsSchema from "./schema/comments.schema";
import PostsSchema from "./schema/posts.schema";
import UsersSchema from "./schema/user.schema";

import type { CreatePickData, ModelData, ModelNames } from "lafka/types/schema/mongodb.types";
import type { AuthUser } from "lafka/types/auth/auth-user.types";
import type { User } from "lafka/types/authors/user.types";
import type { Comment } from "lafka/types/content/comment.types";
import type { BlogPost } from "lafka/types/posts/blog-post.types";
import type { ForumPost } from "lafka/types/posts/forum-post.types";

import Redis from "lafka/redis/modesl.database";
import { Model } from "mongoose";

export type authUsersConstructor = ModelData<Omit<AuthUser, "created_at">> & { profile_id?: string };
export type commentsConstructor = CreatePickData<Comment, "author_id" | "post_id" | "content"> & {
	id?: string;
};

export type postsConstructor = CreatePickData<
	ForumPost & BlogPost,
	"content" | "creator_id" | "name" | "type"
> & { _id?: string };

export type userConstructorData = CreatePickData<
	User, "username" | "created_at"
> & { id?: string };
export type userConstructor<T extends boolean> =
	T extends true
		? (Partial<User> & { id: string })
		: (CreatePickData<User, "username"> & { id?: string });

class Database {
	private readonly _redis: Redis;

	private readonly _auth_users: DatabaseType<AuthUser, Partial<AuthUser>>;
	private readonly _comments: DatabaseType<Comment>;

	private readonly _posts: DatabaseType<
		BlogPost & ForumPost,
		Pick<BlogPost & ForumPost, "content" | "creator_id" | "name" | "type">
	>;

	private readonly _users: DatabaseType<User, Pick<User, "username">>

	private readonly _classes: {
		auth_users: (data: authUsersConstructor) => authUsersClass,
		comments: (data: commentsConstructor) => commentsClass,
		posts: (data: postsConstructor) => postsClass,
		user: <T extends boolean = false>(data: userConstructor<T>) => userClass<T>,
		database: <T extends { id: string }, K = Partial<T>>(model: Model<T>) => DatabaseClass<T, K>
	};

	public constructor(redis: Redis) {
		this._redis = redis;

		this._classes = {
			auth_users: (data: authUsersConstructor) => new authUsersClass(data, this),
			comments: (data: commentsConstructor) => new commentsClass(data, this),
			posts: (data: postsConstructor) => new postsClass(data, this),
			user: <T extends boolean = false>(data: userConstructor<T>) => new userClass<T>(data, this),
			database: <T extends { id: string }, K = Partial<T>>(model: Model<T>) => new DatabaseClass<T, K>(model, this)
		};

		this._auth_users = new DatabaseClass<AuthUser>(AuthUserSchema, this);
		this._comments = new DatabaseClass<Comment>(CommentsSchema, this);
		this._posts = new DatabaseClass<ForumPost&BlogPost>(PostsSchema, this);
		this._users = new DatabaseClass<User>(UsersSchema, this);
	}

	public get redis() {
		return this._redis;
	}

	public get classes() {
		return this._classes;
	}

	public get auth_users() {
		return this._auth_users;
	}

	public get comments() {
		return this._comments;
	}

	public get posts() {
		return this._posts;
	}

	public get users() {
		return this._users;
	}
}

export default Database;

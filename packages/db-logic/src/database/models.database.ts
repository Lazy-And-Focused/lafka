import DatabaseClass, { DatabaseType } from "../classes/default/database.class";
import authUsersClass from "../classes/default/auth-user.class";
import commentsClass from "../classes/default/comment.class";
import postsClass from "../classes/default/posts.class";
import userClass from "../classes/default/user.class";

import AuthUserSchema from "./schemas/auth-user.schema";
import CommentsSchema from "./schemas/comments.schema";
import PostsSchema from "./schemas/posts.schema";
import UsersSchema from "./schemas/user.schema";

import type { CreatePickData, ModelData } from "lafka/types/mongodb.types";
import { LAFka } from "lafka/types";
import { Model } from "mongoose";

type AuthUser = LAFka.AuthUser;
type BlogPost = LAFka.BlogPost;
type Comment = LAFka.Comment;
type ForumPost = LAFka.ForumPost;
type User = LAFka.User;

export namespace Constructors {
	export type auth_users = ModelData<Omit<AuthUser, "created_at">> & { profile_id?: string };
	export type comments = CreatePickData<Comment, "author_id" | "post_id" | "content"> & {
		id?: string;
	};

	export type posts = CreatePickData<
		ForumPost & BlogPost,
		"content" | "creator_id" | "name" | "type"
	> & { _id?: string };

	export type users_data = CreatePickData<
		User, "username" | "created_at"
	> & { id?: string };

	export type users<T> = T extends true
		? (Partial<User> & { id: string })
		: (CreatePickData<User, "username"> & { id?: string })
}

class Database {
	private readonly _auth_users: DatabaseType<AuthUser, Partial<AuthUser>>;
	private readonly _comments: DatabaseType<Comment>;

	private readonly _posts: DatabaseType<
		BlogPost & ForumPost,
		Pick<BlogPost & ForumPost, "content" | "creator_id" | "name" | "type">
	>;

	private readonly _users: DatabaseType<User, Pick<User, "username">>;

	private readonly _classes: {
		auth_users: (data: Constructors.auth_users) => authUsersClass,
		comments: (data: Constructors.comments) => commentsClass,
		posts: (data: Constructors.posts) => postsClass,
		user: <T extends boolean = false>(data: Constructors.users<T>) => userClass<T>,
		database: <T extends { id: string }, K = Partial<T>>(model: Model<T>) => DatabaseClass<T, K>
	};

	public constructor() {
		this._classes = {
			auth_users: (data: Constructors.auth_users) => new authUsersClass(data),
			comments: (data: Constructors.comments) => new commentsClass(data),
			posts: (data: Constructors.posts) => new postsClass(data),
			user: <T extends boolean = false>(data: Constructors.users<T>) => new userClass<T>(data),
			database: <T extends { id: string }, K = Partial<T>>(model: Model<T>) => new DatabaseClass<T, K>(model)
		};

		this._auth_users = new DatabaseClass<AuthUser>(AuthUserSchema);
		this._comments = new DatabaseClass<Comment>(CommentsSchema);
		this._posts = new DatabaseClass<ForumPost&BlogPost>(PostsSchema);
		this._users = new DatabaseClass<User>(UsersSchema);
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

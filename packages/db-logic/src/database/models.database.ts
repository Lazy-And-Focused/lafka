import { Classes } from "../classes";
import { Schemas } from "./schemas";

import type { CreatePickData, ModelData } from "lafka/types/mongodb.types";
import { LAFka } from "lafka/types";

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
	private readonly _auth_users: Classes.DatabaseType<AuthUser, Partial<AuthUser>>;
	private readonly _comments: Classes.DatabaseType<Comment>;

	private readonly _posts: Classes.DatabaseType<
		BlogPost & ForumPost,
		Pick<BlogPost & ForumPost, "content" | "creator_id" | "name" | "type">
	>;

	private readonly _users: Classes.DatabaseType<User, Pick<User, "username">>;
	private readonly _classes = Classes;

	public constructor() {
		this._auth_users = new Classes.Database<AuthUser>(Schemas.databases.auth_users);
		this._comments = new Classes.Database<Comment>(Schemas.databases.comments);
		this._posts = new Classes.Database<ForumPost&BlogPost>(Schemas.databases.posts);
		this._users = new Classes.Database<User>(Schemas.databases.users);
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

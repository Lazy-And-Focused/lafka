import { BlogPost } from "lafka/types/posts/blog-post.types";
import { ForumPost } from "lafka/types/posts/forum-post.types";

import { Link as LinkType } from "lafka/types/utility/utility.types";
import { User as UserType } from "lafka/types/authors/user.types";

import Database, { userConstructor, userConstructorData } from "database/models.database";
import type {
	CreateData,
	CreatePickData,
	Status as StatusType
} from "lafka/types/schema/mongodb.types";
import { Status, Error } from "lafka/types/schema/status.classes";

import Post from "./posts.class";

import Redis from "lafka/redis/modesl.database";

enum CreatePost {
	forum = "_forum_posts",
	blog = "_blog_posts",
	followed_forum = "_followed_forum_posts",
	followed_blog = "_followed_blog_posts",
	blocked = "_blocked_posts"
}

type PostTypes = "forum" | "blog" | "followed_forum" | "followed_blog" | "blocked";
type Data = "username" | "nickname" | "biography" | "avatar" | "links";
type UserDataTypes = `_${Data}`;
type UserPostTypes = `${PostTypes}_posts`;

class User<T extends boolean = false> implements UserType {
	private _id: string;
	private _username: string;
	private _nickname?: string;
	private _avatar?: string;

	private _biography?: string;
	private _links: LinkType[] = [];

	private _created_at: Date;

	private _forum_posts: string[] = [];
	private _blog_posts: string[] = [];

	private _followed_forum_posts: string[] = [];
	private _followed_blog_posts: string[] = [];

	private _blocked_posts: string[] = [];

	private _followers: string[] = [];
	private _following: string[] = [];

	private initialized: boolean = false;

	private readonly _constructor_data: userConstructorData;
	private readonly _redis: Redis;

	private readonly _database: Database;

	public constructor(
		data: userConstructor<T>,
		redis: Redis
	) {
		this._redis = redis;
		this._database = new Database(redis);

		const now = new Date();

		if (!data.username && !data.id)
			throw new Error("id and username is not defined");

		this._constructor_data = {
			id: "",
			username: "",
			...data,
			created_at: now
		};

		this._id = data.id || "";
		this._username = data.username || "";
		this._created_at = now;
	}

	public readonly init = async (): Promise<T extends true ? (this|null) : (this)> => {
		if (this.initialized) return this;

		const data = this._constructor_data;
		const filter = !!data.id
			? { id: data.id, username: data.username }
			: { username: data.username };

		const status: StatusType<UserType[]> = await this._database.users.getData({
			filter: { ...filter }
		});

		if (status.type === 0 || !status.data) {
			if (filter.id && !filter.username)
				return null as any;

			const user = await this._database.users.create({
				...data,
				avatar: undefined,
				nickname: undefined,
				biography: undefined,
				links: [],
				created_at: data.created_at,
				blog_posts: [],
				forum_posts: [],
				followed_blog_posts: [],
				followed_forum_posts: [],
				blocked_posts: [],
				followers: [],
				following: []
			});

			this.paste(data, user);
		} else {
			const user = status.data[0];
			const updateData = this.paste(data, user);

			this._database.users.update({
				filter: { username: data.username },
				update: {
					username: updateData._username,
					avatar: updateData._avatar,
					nickname: updateData._nickname,
					biography: updateData._biography,
					links: updateData._links,
					blog_posts: updateData._blog_posts,
					forum_posts: updateData._forum_posts,
					followed_blog_posts: updateData._followed_blog_posts,
					followed_forum_posts: updateData._followed_forum_posts,
					blocked_posts: updateData._blocked_posts,
					followers: updateData._followers,
					following: updateData._following
				}
			});
		}

		this.initialized = true;

		return this;
	};

	private readonly paste = (data: CreateData<UserType>, user: UserType) => {
		this._id = user.id;
		this._avatar = data.avatar || user.avatar;
		this._nickname = data.nickname || user.nickname;
		this._biography = data.biography || user.biography;
		this._links = data.links || user.links;

		this._created_at = data.created_at || user.created_at;

		this._blog_posts = data.blog_posts || user.blog_posts;
		this._forum_posts = data.forum_posts || user.forum_posts;
		this._followed_blog_posts = data.followed_blog_posts || user.followed_blog_posts;
		this._followed_forum_posts =
			data.followed_forum_posts || user.followed_forum_posts;

		this._blocked_posts = data.blocked_posts || user.blocked_posts;
		this._followers = data.followers || user.followers;
		this._following = data.following || user.following;

		return this;
	};

	private readonly getDatabaseUser = async (id?: string) => {
		return await this._database.users.model.findOne({ id: id || this._id });
	};

	private async addPosts(posts: string[], type: PostTypes) {
		this[CreatePost[type]].push(...posts);

		const databaseType = (type + "_posts") as UserPostTypes;
		const user = await this.getDatabaseUser();

		if (!user) return new Error("user not found");

		user[databaseType].push(...posts);

		return await user.save();
	}

	private async followController(
		following: string,
		action: "follow" | "unfollow"
	): Promise<StatusType<any>> {
		const followingUser = await this.getDatabaseUser(following);
		const user = await this.getDatabaseUser();

		if (!followingUser || !user) return new Error("user not found");

		if (action === "follow") {
			followingUser.followers.push(this._id);
			user.following.push(following);
		} else {
			followingUser.followers = followingUser.followers.filter(
				(id) => id !== this._id
			);
			user.following = user.following.filter((id) => id !== following);
		}

		followingUser.save();
		user.save();

		return new Status({ type: 1, text: action + "ing!" });
	}

	public readonly updateData = async (data: string | LinkType[], type: Data) => {
		const user = await this.getDatabaseUser();

		if (!user) return new Error("user not found");
		const userType = ("_" + type) as UserDataTypes;

		if (typeof data === "string" && type !== "links" && userType !== "_links") {
			user[type] = data;
			this[userType] = data;
		} else if (Array.isArray(data) && type === "links" && userType === "_links") {
			user[type] = data;
			this[userType] = data;
		} else {
			return new Error("type mismatch");
		}

		await user.save();
		return new Status({ type: 1, text: type + " updated" });
	};

	public async createPost(
		post: CreatePickData<ForumPost & BlogPost, "content" | "name" | "type">
	) {
		const created = await new Post({ ...post, creator_id: this._id }, this._redis).init();

		return {
			response: await this.addPosts([created.id], post.type),
			post: created
		};
	}

	public async follow(following: string) {
		return await this.followController(following, "follow");
	}

	public async unfollow(unfollowing: string) {
		return await this.followController(unfollowing, "unfollow");
	}

	public get id(): string {
		return this._id;
	}

	public get username(): string {
		return this._username;
	}

	public get nickname(): string | undefined {
		return this._nickname || undefined;
	}

	public get biography(): string {
		return this._biography || "";
	}

	public get links(): LinkType[] {
		return this._links;
	}

	public get avatar(): string | undefined {
		return this._avatar;
	}

	public get created_at(): Date {
		return this._created_at;
	}

	public get forum_posts(): string[] {
		return this._forum_posts;
	}

	public get blog_posts(): string[] {
		return this._blog_posts;
	}

	public get followed_forum_posts(): string[] {
		return this._followed_forum_posts;
	}

	public get followed_blog_posts(): string[] {
		return this._followed_blog_posts;
	}

	public get blocked_posts(): string[] {
		return this._blocked_posts;
	}

	public get followers(): string[] {
		return this._followers;
	}

	public get following(): string[] {
		return this._following;
	}
}

export default User;

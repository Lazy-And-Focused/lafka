import { BlogPost } from "lafka/types/posts/blog-post.types";
import { ForumPost } from "lafka/types/posts/forum-post.types";

import { Link as LinkType } from "lafka/types/utility/utility.types";
import { User as UserType } from "lafka/types/authors/user.types";

import Database, { userConstructor } from "database/models.database";
import type {
	CreateData,
	CreatePickData,
	Status as StatusType
} from "lafka/types/schema/mongodb.types";
import { Status, Error } from "lafka/types/schema/status.classes";

import Post from "./posts.class";

enum CreatePost {
	forum = "forum_posts",
	blog = "blog_posts",
	followed_forum = "followed_forum_posts",
	followed_blog = "followed_blog_posts",
	blocked = "blocked_posts"
}

type PostTypes = "forum" | "blog" | "followed_forum" | "followed_blog" | "blocked";
type Data = "username" | "nickname" | "biography" | "avatar" | "links";

class User<T extends boolean = false> implements UserType {
	private readonly _users = new Database().users;
	
	private _data: UserType;
	private initialized: boolean = false;

	public constructor(
		data: userConstructor<T>
	) {
		if (!data.username && !data.id)
			throw new Error("id and username is not defined");

		this._data = {
			id: "",
			username: "",
			created_at: new Date(),
			blocked_posts: [],
			blog_posts: [],
			followed_blog_posts: [],
			followed_forum_posts: [],
			followers: [],
			following: [],
			forum_posts: [],
			links: [],
			avatar: undefined,
			nickname: undefined,
			biography: undefined,
			...data
		}
	}

	public readonly init = async (): Promise<T extends true ? (this|null) : (this)> => {
		if (this.initialized) return this;

		const data = this._data;
		const filter = !!data.id
			? { id: data.id, username: data.username }
			: { username: data.username };

		const status: StatusType<UserType[]> = await this._users.getData({
			filter: { ...filter }
		});

		if (status.type === 0 || !status.data) {
			if (filter.id && !filter.username)
				return null as any;

			const user = await this._users.create(data);

			this.paste(data, user);
		} else {
			const user = status.data[0];
			const updateData = this.paste(data, user);

			this._users.update({
				filter: { username: data.username },
				update: {
					created_at: updateData._data.created_at,
					blocked_posts: updateData._data.blocked_posts,
					blog_posts: updateData._data.blog_posts,
					followed_blog_posts: updateData._data.followed_blog_posts,
					followed_forum_posts: updateData._data.followed_forum_posts,
					followers: updateData._data.followers,
					following: updateData._data.following,
					forum_posts: updateData._data.forum_posts,
					links: updateData._data.links,
					avatar: updateData._data.avatar,
					nickname: updateData._data.nickname,
					biography: updateData._data.biography
				}
			});
		}

		this.initialized = true;

		return this;
	};

	private readonly paste = (data: CreateData<UserType>, user: UserType) => {
		this._data = {
			...data,
			...user
		};

		return this;
	};

	private readonly getDatabaseUser = async (id?: string) => {
		const { data } = await this._users.getData({filter: {id: id||this._data.id}});

		return data ? data[0] : null;
	};

	private async addPosts(posts: string[], type: PostTypes) {
		this._data[CreatePost[type]].push(...posts);

		return await this._users.push({
			filter: { id: this._data.id },
			update: { [CreatePost[type]]: posts }
		});
	}

	private async followController(
		following: string,
		action: "follow" | "unfollow"
	): Promise<StatusType<any>> {
		const followingUser = await this.getDatabaseUser(following);
		const user = await this.getDatabaseUser();

		if (!followingUser || !user) return new Error("user not found");

		if (action === "follow") {
			followingUser.followers.push(this._data.id);
			user.following.push(following);
		} else {
			followingUser.followers = followingUser.followers.filter(
				(id) => id !== this._data.id
			);
			user.following = user.following.filter((id) => id !== following);
		}

		this._users.update({
			filter: { id: followingUser.id },
			update: { followers: followingUser.followers }
		});

		this._users.update({
			filter: { id: user.id },
			update: { followers: user.following }
		});

		return new Status({ type: 1, text: action + "ing!" });
	}

	public readonly updateData = async (data: string | LinkType[], type: Data) => {
		if (typeof data === "string" && type !== "links") {
			this._data[type] === data;
			await this._users.update({
				filter: { id: this._data.id },
				update: { [type]: data }
			});
		} else if (Array.isArray(data) && type === "links") {
			this._data[type].push(...data);
			await this._users.push({
				filter: { id: this._data.id },
				update: { [type]: data }
			});
		} else {
			return new Error("type mismatch");
		}

		return new Status({ type: 1, text: type + " updated" });
	};

	public async createPost(
		post: CreatePickData<ForumPost & BlogPost, "content" | "name" | "type">
	) {
		const created = await new Post({ ...post, creator_id: this._data.id }).init();

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
		return this._data.id;
	}

	public get username(): string {
		return this._data.username;
	}

	public get nickname(): string | undefined {
		return this._data.nickname || undefined;
	}

	public get biography(): string {
		return this._data.biography || "";
	}

	public get links(): LinkType[] {
		return this._data.links;
	}

	public get avatar(): string | undefined {
		return this._data.avatar;
	}

	public get created_at(): Date {
		return this._data.created_at;
	}

	public get forum_posts(): string[] {
		return this._data.forum_posts;
	}

	public get blog_posts(): string[] {
		return this._data.blog_posts;
	}

	public get followed_forum_posts(): string[] {
		return this._data.followed_forum_posts;
	}

	public get followed_blog_posts(): string[] {
		return this._data.followed_blog_posts;
	}

	public get blocked_posts(): string[] {
		return this._data.blocked_posts;
	}

	public get followers(): string[] {
		return this._data.followers;
	}

	public get following(): string[] {
		return this._data.following;
	}
}

export default User;

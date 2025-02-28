import Database, { postsConstructor } from "../../database/models.database";

import type { BlogPost } from "lafka/types/posts/blog-post.types";
import type { ForumPost } from "lafka/types/posts/forum-post.types";
import type { Post as PostType } from "lafka/types/posts/post.types";
import type { PostStatus, Tag } from "lafka/types/utility/utility.types";
import type { CreateData, CreatePickData } from "lafka/types/schema/mongodb.types";
import type { Comment as CommentType } from "lafka/types/content/comment.types";
import Comment from "./comment.class";

import Redis from "lafka/redis/modesl.database";

class Post implements PostType {
	private _id: string;
	private _created_at: Date;
	private _creator_id: string;

	private _type: "forum" | "blog";

	private _name: string;
	private _content: string;
	private _description?: string;

	private _comments: string[] = [];

	private _followers: number = 0;

	private _changed_at?: Date;

	private _view_status: 0 | 1 = 1;

	private _likes: number = 0;
	private _dislikes: number = 0;
	private _reposts: number = 0;

	private _tags: Tag[] = [];
	private _status: PostStatus = "open";

	private initialized: boolean = false;

	private readonly _constructor_data: postsConstructor & { id?: string };
	private readonly _redis: Redis;

	private readonly _database: Database;

	public constructor(
		data: postsConstructor,
		redis: Redis
	) {
		this._redis = redis;
		this._database = new Database(redis);

		const now = new Date();

		this._name = data.name;
		this._content = data.content;
		this._description = data.description;

		this._creator_id = data.creator_id;
		this._type = data.type;

		this._id = "";
		this._created_at = now;

		this._constructor_data = {
			...data,
			created_at: now
		};
	}

	public readonly init = async () => {
		if (this.initialized) return this;

		const data = this._constructor_data;

		const create = async () => {
			if (this.initialized) return this;

			this.initialized = true;

			const post = await this._database.posts.create({
				content: data.content,
				creator_id: data.creator_id,
				name: data.name,
				type: data.type,

				created_at: data.created_at,
				changed_at: undefined,
				description: this.description,
				view_status: 1,
				followers: 0,

				comments: [],

				dislikes: 0,
				likes: 0,
				reposts: 0,

				tags: [],
				status: "open"
			});

			return this.paste(data, post);
		};

		if (data.id) {
			const status = await this._database.posts.getData({
				filter: { id: data.id }
			});

			if (status.data) {
				this.initialized = true;
				return this.paste(data, status.data[0]);
			}
		}

		await create();

		return this;
	};

	private readonly paste = (
		data: CreateData<BlogPost & ForumPost> & { id?: string },
		post: BlogPost & ForumPost
	) => {
		this._id = data.id || post.id;

		this._name = data.name || post.name;
		this._content = data.content || post.content;
		this._description = data.description || post.description;
		this._comments = data.comments || post.comments;
		this._followers = data.followers || post.followers;
		this._creator_id = data.creator_id || post.creator_id;
		this._changed_at = data.changed_at || post.changed_at;
		this._view_status = data.view_status || post.view_status;

		if (this._type === "blog") {
			this._likes = data.likes || post.likes;
			this._dislikes = data.dislikes || post.dislikes;
			this._reposts = data.reposts || post.reposts;
		} else {
			this._tags = data.tags || post.tags;
			this._status = data.status || post.status;
		}

		return this;
	};

	private readonly getDatabasePost = async (id?: string) => {
		return await this._database.posts.model.findOne({ id: id || this._id });
	};

	private readonly changed = () => {
		this._changed_at = new Date();
	};

	private readonly addComments = async (comments: string[]) => {
		this._comments.push(...comments);
		const post = await this.getDatabasePost();

		if (!post) return new Error("post not found");

		post.comments.push(...comments);
		return await post.save();
	};

	public async createComment(
		comment: CreatePickData<CommentType, "author_id" | "content">
	) {
		const created = await new Comment({
			post_id: this._id,
			...comment
		}, this._redis).init();

		return {
			response: this.addComments([created.id]),
			comment: created
		};
	}

	public readonly addTags = async (tags: Tag[]) => {
		if (this._type !== "forum") return "this is a blog post";

		this._tags.push(...tags);

		return await this._database.posts.update({
			filter: { id: this._id },
			update: { $push: { tags: tags } }
		});
	};

	public addLikes = async (likes: number) => {
		if (this._type != "blog") return "this is a forum posts";

		this._likes += likes;

		return await this._database.posts.update({
			filter: { id: this._id },
			update: { likes: this._likes }
		});
	};

	public addDislikes = async (dislikes: number) => {
		if (this._type != "blog") return "this is a forum posts";

		this._dislikes += dislikes;

		return await this._database.posts.update({
			filter: { id: this._id },
			update: { dislikes: this._dislikes }
		});
	};

	public addReposts = async (reposts: number) => {
		if (this._type != "blog") return "this is a forum posts";

		this._reposts += reposts;

		return await this._database.posts.update({
			filter: { id: this._id },
			update: { reposts: this._reposts }
		});
	};

	public set name(data: string) {
		this.changed();

		this._name = data;
	}

	public set content(data: string) {
		this.changed();

		this._content = data;
	}

	public set description(data: string) {
		this.changed();

		this._description = data;
	}

	public set followers(followers: number) {
		this._followers = followers;
	}

	public get id(): string {
		return this._id;
	}

	public get created_at() {
		return this._created_at;
	}

	public get changed_at() {
		return this._changed_at;
	}

	public get creator_id() {
		return this._creator_id;
	}

	public get view_status() {
		return this._view_status;
	}

	public get name(): string {
		return this._name;
	}

	public get content(): string {
		return this._content;
	}

	public get description(): string | undefined {
		return this._description;
	}

	public get comments(): string[] {
		return this._comments;
	}

	public get followers(): number {
		return this._followers;
	}

	public get createdAt(): Date {
		return this._created_at;
	}

	public get changedAt(): Date | undefined {
		return this._changed_at;
	}

	public get type(): "forum" | "blog" {
		return this._type;
	}

	public get likes(): number {
		if (this._type != "blog") return 0;

		return this._likes;
	}

	public get dislikes(): number {
		if (this._type != "blog") return 0;

		return this._dislikes;
	}

	public get reposts(): number {
		if (this._type != "blog") return 0;

		return this._reposts;
	}

	public get tags(): Tag[] {
		if (this._type != "forum") return [];

		return this._tags;
	}

	public get status(): PostStatus {
		if (this._type !== "forum") return "blocked";

		return this._status;
	}
}

export default Post;

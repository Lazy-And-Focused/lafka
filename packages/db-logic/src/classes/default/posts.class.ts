import Database from "../../database/models.database";

import type { BlogPost } from "types/posts/blog-post.types";
import type { ForumPost } from "types/posts/forum-post.types";
import type { Post as PostType } from "types/posts/post.types";
import type { PostStatus, Tag } from "types/utility/utility.types";
import type {
	CreateData,
	CreatePickData
} from "types/schema/mongodb.types";
import type { Comment as CommentType } from "types/content/comment.types";
import Comment from "./comment.class";

class Post implements PostType {
	private _id_: string;
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

	private readonly _constructor_data: CreatePickData<
		ForumPost & BlogPost,
		"content" | "creator_id" | "name" | "type" | "created_at"
	> & { _id?: string };

	public constructor(
		data: CreatePickData<
			ForumPost & BlogPost,
			"content" | "creator_id" | "name" | "type"
		> & { _id?: string }
	) {
		const now = new Date();

		this._name = data.name;
		this._content = data.content;
		this._description = data.description;

		this._creator_id = data.creator_id;
		this._type = data.type;

		this._id_ = "";
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

			const post = await Database.posts.create({
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

		if (data._id) {
			const status = await Database.posts.getData({
				filter: { _id: data._id }
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
		data: CreateData<BlogPost & ForumPost> & { _id?: string },
		post: BlogPost & ForumPost
	) => {
		this._id_ = data._id || post._id;

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
		return await Database.posts.model.findById(id || this._id);
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
			post_id: this._id_,
			...comment,
		}).init();

		return {
			response: this.addComments([created._id]),
			comment: created
		};
	}

	public readonly addTags = async (tags: Tag[]) => {
		if (this._type !== "forum") return "this is a blog post";

		this._tags.push(...tags);

		return await Database.posts.update({
			filter: { _id: this._id_ },
			update: { $push: { tags: tags } }
		});
	};

	public addLikes = async (likes: number) => {
		if (this._type != "blog") return "this is a forum posts";

		this._likes += likes;

		return await Database.posts.update({
			filter: { _id: this._id_ },
			update: { likes: this._likes }
		});
	};

	public addDislikes = async (dislikes: number) => {
		if (this._type != "blog") return "this is a forum posts";

		this._dislikes += dislikes;

		return await Database.posts.update({
			filter: { _id: this._id_ },
			update: { dislikes: this._dislikes }
		});
	};

	public addReposts = async (reposts: number) => {
		if (this._type != "blog") return "this is a forum posts";

		this._reposts += reposts;

		return await Database.posts.update({
			filter: { _id: this._id_ },
			update: { reposts: this._reposts }
		});
	};

	set name(data: string) {
		this.changed();

		this._name = data;
	}

	set content(data: string) {
		this.changed();

		this._content = data;
	}

	set description(data: string) {
		this.changed();

		this._description = data;
	}

	set followers(followers: number) {
		this._followers = followers;
	}

	get id(): string {
		return this._id_;
	}

	get _id() {
		return this._id_;
	}

	get created_at() {
		return this._created_at;
	}

	get changed_at() {
		return this._changed_at;
	}

	get creator_id() {
		return this._creator_id;
	}

	get view_status() {
		return this._view_status;
	}

	get name(): string {
		return this._name;
	}

	get content(): string {
		return this._content;
	}

	get description(): string | undefined {
		return this._description;
	}

	get comments(): string[] {
		return this._comments;
	}

	get followers(): number {
		return this._followers;
	}

	get createdAt(): Date {
		return this._created_at;
	}

	get changedAt(): Date | undefined {
		return this._changed_at;
	}

	get type(): "forum" | "blog" {
		return this._type;
	}

	get likes(): number {
		if (this._type != "blog") return 0;

		return this._likes;
	}

	get dislikes(): number {
		if (this._type != "blog") return 0;

		return this._dislikes;
	}

	get reposts(): number {
		if (this._type != "blog") return 0;

		return this._reposts;
	}

	get tags(): Tag[] {
		if (this._type != "forum") return [];

		return this._tags;
	}

	get status(): PostStatus {
		if (this._type !== "forum") return "blocked";

		return this._status;
	}
}

export default Post;

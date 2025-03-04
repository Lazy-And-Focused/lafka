import Database, { postsConstructor } from "../../database/models.database";

import type { BlogPost } from "lafka/types/posts/blog-post.types";
import type { ForumPost } from "lafka/types/posts/forum-post.types";
import type { Post as PostType } from "lafka/types/posts/post.types";
import type { PostStatus, Tag } from "lafka/types/utility/utility.types";
import type { CreateData, CreatePickData } from "lafka/types/schema/mongodb.types";
import type { Comment as CommentType } from "lafka/types/content/comment.types";

import Comment from "./comment.class";

class Post implements PostType {
	private _data: BlogPost&ForumPost;
	private initialized: boolean = false;

	private readonly _posts = new Database().posts;

	public constructor(
		data: postsConstructor
	) {
		this._data = {
			id: "",
			created_at: new Date(),

			likes: 0,
			dislikes: 0,
			reposts: 0,

			followers: 0,
			comments: [],

			view_status: 1,

			tags: [],
			status: "open",

			...data,
		}
	}

	public readonly init = async () => {
		if (this.initialized) return this;

		const data = this._data;

		const create = async () => {
			if (this.initialized) return this;
			this.initialized = true;

			const post = await this._posts.create(data);

			return this.paste(data, post);
		};

		if (data.id) {
			const { data: gettedPost } = await this._posts.getData({
				filter: { id: data.id }
			});

			if (gettedPost) {
				this.initialized = true;
				return this.paste(data, gettedPost[0]);
			}
		}

		await create();

		return this;
	};

	private readonly paste = (
		data: CreateData<BlogPost & ForumPost> & { id?: string },
		post: BlogPost & ForumPost
	) => {
		this._data = {
			...data,
			...post
		};

		return this;
	};

	private readonly changed = () => {
		this._data.changed_at = new Date();
	};

	private readonly addComments = async (comments: string[]) => {
		this._data.comments.push(...comments);

		return await this._posts.push({
			filter: { id: this._data.id },
			update: { comments: comments }
		});
	};

	public async createComment(
		comment: CreatePickData<CommentType, "author_id" | "content">
	) {
		const created = await new Comment({
			post_id: this._data.id,
			...comment
		}).init();

		return {
			response: this.addComments([created.id]),
			comment: created
		};
	}

	public readonly addTags = async (tags: Tag[]) => {
		if (this._data.type !== "forum") return "this is a blog post";

		this._data.tags.push(...tags);

		return await this._posts.push({
			filter: { id: this._data.id },
			update: { tags: tags }
		});
	};

	public addLikes = async (likes: number) => {
		if (this._data.type != "blog") return "this is a forum posts";

		this._data.likes += likes;

		return await this._posts.update({
			filter: { id: this._data.id },
			update: { likes: this._data.likes }
		});
	};

	public addDislikes = async (dislikes: number) => {
		if (this._data.type != "blog") return "this is a forum posts";

		this._data.dislikes += dislikes;

		return await this._posts.update({
			filter: { id: this._data.id },
			update: { dislikes: this._data.dislikes }
		});
	};

	public addReposts = async (reposts: number) => {
		if (this._data.type != "blog") return "this is a forum posts";

		this._data.reposts += reposts;

		return await this._posts.update({
			filter: { id: this._data.id },
			update: { reposts: this._data.reposts }
		});
	};

	public set name(data: string) {
		this.changed();

		this._data.name = data;
	}

	public set content(data: string) {
		this.changed();

		this._data.content = data;
	}

	public set description(data: string) {
		this.changed();

		this._data.description = data;
	}

	public set followers(followers: number) {
		this._data.followers = followers;
	}

	public get id(): string {
		return this._data.id;
	}

	public get created_at() {
		return this._data.created_at;
	}

	public get changed_at() {
		return this._data.changed_at;
	}

	public get creator_id() {
		return this._data.creator_id;
	}

	public get view_status() {
		return this._data.view_status;
	}

	public get name(): string {
		return this._data.name;
	}

	public get content(): string {
		return this._data.content;
	}

	public get description(): string | undefined {
		return this._data.description;
	}

	public get comments(): string[] {
		return this._data.comments;
	}

	public get followers(): number {
		return this._data.followers;
	}

	public get createdAt(): Date {
		return this._data.created_at;
	}

	public get changedAt(): Date | undefined {
		return this._data.changed_at;
	}

	public get type(): "forum" | "blog" {
		return this._data.type;
	}

	public get likes(): number {
		if (this._data.type != "blog") return 0;

		return this._data.likes;
	}

	public get dislikes(): number {
		if (this._data.type != "blog") return 0;

		return this._data.dislikes;
	}

	public get reposts(): number {
		if (this._data.type != "blog") return 0;

		return this._data.reposts;
	}

	public get tags(): Tag[] {
		if (this._data.type != "forum") return [];

		return this._data.tags;
	}

	public get status(): PostStatus {
		if (this._data.type !== "forum") return "blocked";

		return this._data.status;
	}
}

export default Post;

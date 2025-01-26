import type { Comment as CommentType } from "types/content/comment.types";

import Database from "database/models.database";
import { CreatePickData } from "types/schema/mongodb.types";

class Comment implements CommentType {
	private _id: string;
	private _created_at: Date;
	private _author_id: string;
	private _post_id: string;

	private _content: string;

	private _reply?: string;
	private _changed_at?: Date;

	private readonly _constructor_data: CreatePickData<
		CommentType,
		"author_id" | "post_id" | "content" | "created_at"
	> & { id?: string };
	private initialized: boolean = false;

	public constructor(
		data: CreatePickData<CommentType, "author_id" | "post_id" | "content"> & {
			id?: string;
		}
	) {
		const now = new Date();

		this._id = "";
		this._created_at = now;
		this._content = data.content;
		this._author_id = data.author_id;
		this._post_id = data.post_id;

		this._constructor_data = {
			...data,
			created_at: now
		};
	}

	public init = async () => {
		if (this.initialized) return this;
		const data = this._constructor_data;

		const create = async () => {
			if (this.initialized) return this;

			this.initialized = true;

			const comment = await Database.comments.create({
				author_id: data.author_id,
				content: data.content,
				created_at: data.created_at,
				post_id: data.post_id,
				reply: data.reply,
				changed_at: undefined
			});

			return this.paste(data, comment);
		};

		if (data.id) {
			const comment = await Database.comments.model.findOne({ id: data.id });

			if (comment) {
				this.initialized = true;
				return this.paste(data, comment);
			}
		}

		await create();

		return this;
	};

	private paste(
		data: CreatePickData<
			CommentType,
			"author_id" | "post_id" | "content" | "created_at"
		>,
		comment: CommentType
	) {
		this._id = comment.id;
		this._author_id = data.author_id || comment.author_id;
		this._content = data.content || comment.content;
		this._created_at = data.created_at || comment.created_at;
		this._post_id = data.post_id || comment.post_id;
		this._reply = data.reply || comment.reply;
		this._changed_at = data.changed_at || comment.changed_at;

		return this;
	}

	private changed = () => {
		this._changed_at = new Date();
	};

	public set content(content: string) {
		this.changed();

		this._content = content;
	}

	public get id(): string {
		return this._id;
	}

	public get content(): string {
		return this._content;
	}

	public get created_at(): Date {
		return this._created_at;
	}

	public get author_id(): string {
		return this._author_id;
	}

	public get post_id(): string {
		return this._post_id;
	}

	public get reply(): string | undefined {
		return this._reply;
	}

	public get changed_at(): Date | undefined {
		return this._changed_at;
	}
}

export default Comment;

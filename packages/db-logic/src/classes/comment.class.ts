import { LAFka } from "lafka/types";

import Database, { Constructors } from "database/models.database";

class Comment implements LAFka.Comment {
	private readonly _comments = new Database().comments;

	private initialized: boolean = false;
	private _data: LAFka.Comment;

	public constructor(
		data: Constructors.comments
	) {
		const now = new Date();

		this._data = {
			id: "",
			created_at: now,
			...data
		};
	}

	public init = async () => {
		if (this.initialized) return this;
		const data = this._data;

		const create = async () => {
			if (this.initialized) return this;

			this.initialized = true;

			const comment = await this._comments.create({
				...data, changed_at: undefined
			});

			return this.paste(data, comment);
		};

		if (data.id) {
			const comment = await this._comments.model.findOne({ id: data.id });

			if (comment) {
				this.initialized = true;
				return this.paste(data, comment);
			}
		}

		await create();

		return this;
	};

	private paste(
		data: Constructors.comments & { created_at: Date },
		comment: LAFka.Comment
	) {
		this._data = {
			...data,
			...comment,

			id: comment.id
		};

		return this;
	}

	private changed() {
		this._data.changed_at = new Date();
	};

	public set content(content: string) {
		this.changed();

		this._data.content = content;
	}

	public get id(): string {
		return this._data.id;
	}

	public get content(): string {
		return this._data.content;
	}

	public get created_at(): Date {
		return this._data.created_at;
	}

	public get author_id(): string {
		return this._data.author_id;
	}

	public get post_id(): string {
		return this._data.post_id;
	}

	public get reply(): string | undefined {
		return this._data.reply;
	}

	public get changed_at(): Date | undefined {
		return this._data.changed_at;
	}
}

export default Comment;

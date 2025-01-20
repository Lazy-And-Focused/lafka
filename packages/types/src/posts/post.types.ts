interface Post {
	_id: string;

	name: string;
	content: string;
	description?: string;
	comments: string[];
	followers: number;

	created_at: Date;
	changed_at?: Date;

	creator_id: string;

	type: "forum" | "blog";
	view_status: 0 | 1;
}

export { Post };

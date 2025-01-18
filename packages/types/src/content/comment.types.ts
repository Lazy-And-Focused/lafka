interface Comment {
	_id: string;

	content: string;

	created_at: Date;
	changed_at?: Date;

	author_id: string;
	post_id: string;

	reply?: string;
}

export { Comment };

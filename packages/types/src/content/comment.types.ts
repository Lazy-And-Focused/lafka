export const C_KEYS = [
	"id",
	"content",
	"created_at",
	"changed_at",
	"author_id",
	"post_id",
	"reply",
] as const;

export interface Comment {
	id: string;

	content: string;

	created_at: Date;
	changed_at?: Date;

	author_id: string;
	post_id: string;

	reply?: string;
}
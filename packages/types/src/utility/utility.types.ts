export type PostStatus = "closed" | "open" | "blocked";
export type Tags = "Лох";

export type Tag = {
	id: string;
	name: Tags;
};

export type Link = {
	name: string;
	link: string;
};

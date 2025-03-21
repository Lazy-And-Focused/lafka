export const P_KEYS = [
  "id",
  "name",
  "content",
  "description",
  "comments",
  "followers",
  "created_at",
  "changed_at",
  "creator_id",
  "type",
  "view_status"
] as const;

export interface Post {
  id: string;

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

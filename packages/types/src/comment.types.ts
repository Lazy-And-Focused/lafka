export interface CreateComment {
  content: string;
  author_id: string;
  post_id: string;

  reply?: string;
};

export interface Comment {
  id: string;

  content: string;

  created_at: string;
  changed_at?: string;

  author_id: string;
  post_id: string;

  reply?: string;
}
# Types

Просто отдельная документация по типам, дабы не открывать бесконечно файлы

## AuthTypes
```ts
type AuthTypes = "google" | "yandex";
```

<hr>

## GetData
```ts
interface GetData<T extends unknown> {
  type: "user"|"post"|"comment";
  successed: boolean;
  resource?: T;
  error?: unknown;
}
```

## CreateData
```ts
interface CreateData<T extends unknown> {
  type: "user"|"post"|"comment";
  successed: boolean;
  created_resource?: T;
  date: Date;
  error?: unknown;
}
```

## ChangeData
```ts
interface ChangeData<T extends unknown> {
  type: "user"|"post"|"comment";
  successed: boolean;

  resource: T;
  changed_resource?: T;
  date: Date;
    
  error?: unknown;
}
```

## DeleteData
```ts
interface DeleteData<T extends unknown> {
  type: "user"|"post"|"comment";
  successed: boolean;
	
  resource: T;
  date: Date;

  error?: unknown;
}
```

<hr>

## User
```ts
interface User {
  id: string;

  username: string;
  nickname?: string;
  avatar?: string;

  biography?: string;
  links: Link[];

  created_at: Date;

  forum_posts: string[];
  blog_posts: string[];
  followed_forum_posts: string[];
  followed_blog_posts: string[];
  blocked_posts: string[];

  followers: string[];
  following: string[];
}
```

### Link
```ts
type Link = {
  name: string;
  link: string;
}
```

<hr>

## Post
```ts
interface Post {
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

  // Forum post:

  tags: Tag[] | null;
  status: PostStatus | null;

  // Blog post:

  likes: number | null;
  dislikes: number | null;
  reposts: number | null;
}
```

### Tag
```ts
type Tags = "?";

type Tag = {
  id: string;
  name: Tags;
};
```

### PostStatus
```ts
type PostStatus = "closed" | "open" | "blocked";
```

<hr>

## Comment
```ts
interface Comment {
  id: string;

  content: string;

  created_at: Date;
  changed_at?: Date;

  author_id: string;
  post_id: string;

  reply?: string;
}
```

<hr>
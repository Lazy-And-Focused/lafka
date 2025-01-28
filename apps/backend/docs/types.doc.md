# Types

Просто отдельная документация по типам, дабы не открывать бесконечно файлы

## AuthTypes
```ts
type AuthTypes = "google" | "yandex";
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
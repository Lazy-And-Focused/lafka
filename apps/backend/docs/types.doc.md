# Types

Просто отдельная документация по типам, дабы не открывать бесконечно файлы

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
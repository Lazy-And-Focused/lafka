# Types

[Назад](./index.doc.md)

---

Просто отдельная документация по типам, дабы не открывать бесконечно файлы

- Стоит уточнить, что все типы находятся в катологе
  [`packages/types`](../../../packages/types/src/index.ts)

## AuthTypes

```ts
type AuthTypes = 'google' | 'yandex';
```

## DataType

```ts
/**
 * @Models "auth_users" | "posts" | "comments" | "users"
 */
type DataType = Exclude<Models, 'auth_users'>;
// "posts" | "comments" | "users"
```

---

## GetData

```ts
type GetData<T extends unknown> = {
  type: DataType;
} & (
  | {
      successed: false;
      resource: null;
      error: unknown;
    }
  | {
      successed: true;
      resource: T;
      error: null;
    }
);
```

## CreateData

```ts
type CreateData<T extends unknown> = {
  type: DataType;
  date: Date;
} & (
  | {
      successed: true;
      created_resource: T;
      error: null;
    }
  | {
      successed: false;
      created_resource: null;
      error: unknown;
    }
);
```

## ChangeData

```ts
export type ChangeDataSuccessed<T extends unknown> = {
  type: DataType;
  date: Date;
  successed: true;
  error: null;
} & (
  | {
      changed_resource: UpdateWriteOpResult;
      changed_resource_type: 'update';
    }
  | {
      changed_resource: T;
      changed_resource_type: 'resource';
    }
);

export type ChangeData<T extends unknown> = {
  type: DataType;
  date: Date;
} & (
  | {
      successed: false;
      changed_resource: null;
      error: unknown;
    }
  | ChangeDataSuccessed<T>
);
```

## DeleteData

```ts
export type DeleteDataSuccessed<T extends unknown> = {
  type: DataType;
  successed: boolean;
  error: null;
  date: Date;
} & ({
  deleted_resource_type: "delete";
  deleted_resource: DeleteResult;
} | {
  deleted_resource_type: "resource";
  deleted_resource: T;
});
export type DeleteData<T extends unknown> = {
  type: DataType;
  date: Date;
} & ({
  successed: false;
  deleted_resource: null;
  error: unknown;
} | DeleteDataSuccessed<T>);
}
```

---

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
  rights: Rights.Rights;
}
```

### Rights

```ts
interface Rights {
  readonly default: string /* it's a bigint */;
  readonly users: [string, string /* it's a bigint */][];
  readonly posts: [string, string /* it's a bigint */][];
  readonly organizations: [string, string /* it's a bigint */][];
}
```

### Link

```ts
type Link = {
  name: string;
  link: string;
};
```

---

## Post

```ts
const POST_TYPES = ['forum', 'blog'] as const;
type PostTypes = (typeof POST_TYPES)[number];
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
  type: PostTypes;
  view_status: 0 | 1;

  /* BlogPost */
  likes: number;
  dislikes: number;
  reposts: number;

  /* ForumPost */
  tags: Tag[];
  status: PostStatus;
}

interface BlogPost extends Post {
  likes: number;
  dislikes: number;
  reposts: number;
}

interface ForumPost extends Post {
  tags: Tag[];
  status: PostStatus;
}
```

### Tag

- [Tag](../../../packages/types/src/index.ts)

```ts
type Tags = '?';

type Tag = {
  id: string;
  name: Tags;
};
```

### PostStatus

```ts
type PostStatus = 'closed' | 'open' | 'blocked';
```

---

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

---

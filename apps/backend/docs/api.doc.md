# Api
Документация по api для фронтенда. Запросы, пути, агрументы и другое будет описано тут используя типы из `packages/types` (`@types/lafka`). Или же использование типов из [отдельной документации](./types.doc.md)

<hr>

## Пример (root (если есть))
### `/users/:id`

- == Описание ==

#### params
| name         | type               | value                        |
| ------------ | ------------------ | --------------------------   |
| `id`         | `string`           | `id` пользователя на сайте   |

#### abbreviations
| full          | abbreviation       |
| ------------- | ------------------ |
| `/api/v1`       | /api               |
| `/user`         | /u                 |

#### methods
| method       | data            | response |
| ------------ | --------------- | -------- |
| `get`        | `access_token`  | [`User`](./types.doc.md#user)   |
| `post`       | `1234`          | `undefined` |
| `delete`     | `null`          | `1234helloworld` |

<hr>

## root
### `/api`

## Аутентификация/Авторизация
### `/auth/:method`

- Предназначается для аутентификации/авторизации пользователя на платформе, не предназначен для использования с помощью `fetch`-запросов. Требуется перенаправления (`redirect`).

#### params
| name         | type               | value                        |
| ------------ | ------------------ | --------------------------   |
| `method`     | [`AuthTypes`](./types.doc.md#authtypes)        | Метод аутентификации на сайте (google, yandex...)   |

<hr>

## Пользователь
### `/users/:id`

- Предназначается для фетчинга пользователя с помощью запросов.

#### types
<details>
<summary><a href="./types.doc.md#user">User</a></summary>

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

</details>

#### params
| name         | type               | value                        |
| ------------ | ------------------ | --------------------------   |
| `id`         | `string`           | `id` пользователя на сайте   |
#### abbreviations
| full          | abbreviation       |
| ------------- | ------------------ |
| `/user`       | `/u`               |
#### methods
| method       | data                | response |
| ------------ | ------------------  | -------- |
| `get`        | `access_token: string`      | [`GetData<User>`](./types.doc.md#getdata) |
| `delete`     | `access_token: string`      | [`DeleteData<User>`](./types.doc.md#deletedata) |
| `put`        | `{ access_token: string } & Partial<User>`      | [`ChangeData<User>`](./types.doc.md/#changedata) |

<hr>

## Посты (/posts)
### `root`

#### types
<details>
<summary><a href="./types.doc.md#post">Post</a></summary>

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

</details>

#### abbreviations
| full          | abbreviation       |
| ------------- | ------------------ |
| `/posts`      | `/p`               |
#### methods
| method       | data                | response |
| ------------ | ------------------  | -------- |
| post         | `{ acess_token: string, content: string, creator_id: string, name: string, type: string }` | [`CreateData<Post>`](./types.doc.md#createdata) |

### `/:id`
#### params
| name         | type               | value                        |
| ------------ | ------------------ | --------------------------   |
| `id`         | `string`           | `id` поста на сайте          |
#### methods
| method       | data                | response |
| ------------ | ------------------  | -------- |
| get          | `undefined`              | [`GetData<Post>`](./types.doc.md#getdata) |
| put          | `{ access_token: string, user_id: string } & Partial<Post>`     | [`ChangeData<Post>`](./types.doc.md#changedata) |
| delete       | `{ acess_token: string, user_id: string }` | [`DeleteData<Post>`](./types.doc.md#deletedata) |

## Комментарии (/comments)
### `root`

#### types
<details>
<summary><a href="./types.doc.md#comment">Comment</a></summary>

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

</details>

#### abbreviations
| full          | abbreviation       |
| ------------- | ------------------ |
| `/comments`   | `/c`               |
#### methods
| method       | data                | response |
| ------------ | ------------------  | -------- |
| `post`       | `{ access_token: string, author_id: string, post_id: string, content: string }` | [`CreateData<Comment>`](./types.doc.md#changedata) |

### /:id
#### params
| name         | type               | value                        |
| ------------ | ------------------ | --------------------------   |
| `id`         | `string`           | `id` комментария на сайте    |
#### methods
| method       | data                | response |
| ------------ | ------------------  | -------- |
| `get`        | `undefined`         | [`GetData<Comment>`](./types.doc.md#getdata) |
| `put`        | `{ access_token: string, user_id: string } & Partial<Comment>` | [`ChangeData<Comment>`](./types.doc.md#changedata) |
| `delete`     | `{ access_token: string, user_id: string }` | [`DeleteData<Comment>`](./types.doc.md#deletedata) |
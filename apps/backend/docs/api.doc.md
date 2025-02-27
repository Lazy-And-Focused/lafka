# Api
Документация по api для фронтенда. Запросы, пути, агрументы и другое будет описано тут используя типы из `packages/types` (`@types/lafka`). Или же использование типов из [отдельной документации](./types.doc.md)

<hr>

## Пример (root (если есть))
### `/users/:data`

- == Описание ==

#### params
| name         | type               | value                            | example |
| ------------ | ------------------ | --------------------------       | ------- |
| `data`         | `string`           | `data` пользователя на сайте   | `fetch(api + "/u/@FOCKUSTY")`, `fetch(api + "/u/12345")` |

#### abbreviations
| full          | abbreviation       |
| ------------- | ------------------ |
| `/api/v1`       | /api               |
| `/user`         | /u                 |

#### methods
| method       | body            | response |
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
### `/users/:data`

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

##### `data`: `string`
- `id` или `username` на сайте, поиск по `username`: `@FOCKUSTY`, поиск по `id`: `1234567`

1. get
```ts
// find by username, successed: true
fetch(api + "/users/@FOCKUSTY", { method: "GET" }).then((data: GetData<User>) => {
  console.log(data) // { successed: true, type: "user", resource: {...}, error: undefined } 
});

// find by id, successed: false
fetch(api + "/users/1234567890", { method: "GET" }).then(data => {
  console.log(data) // { successed: false, type: "user", resource: null, error: "user not found" }
});

/* 
  returning GetData<User>
  not required data in body
  method - get
*/
```

2. delete
```ts
// delete by username, successed: true
fetch(api + "/users/@FOCKUSTY", {
  method: "DELETE",
  body: JSON.stringify({ access_token: MY_TOKEN })
}).then(data => {
  console.log(data) // { type: "user", successed: true, date: Date, resource: {...}, error: undefined }
});

// delete by id, successed: false
fetch(api + "/u/1234", {
  method: "DELETE",
  body: JSON.stringify({ access_token: MY_TOKEN })
}).then(data => {
  console.log(data) // { type: "user", successed: false, date: Date, resource: {...}, error: "403" }
});

/* 
  returning DeleteData<User>
  required a access_token in body
  method - delete
*/
```

3. put
```ts
// put by username, successed: true
fetch(api + "/u/@FOCKUSTY", {
  method: "PUT",
  body: JSON.stringify({
    access_token: MY_TOKEN,
    nickname: "fickus228",
    biography: "The Hatter"
  })
}).then(data => {
  console.log(data) // { type: "user", successed: true, date: Date, resource: {...}, changed_resource: {...}, error: undefined }
});

// put by id, successed: false
fetch(api + "/u/1235", {
  method: "PUT",
  body: JSON.stringify({
    access_token: MY_TOKEN,
    nickname: "fickus228",
    biography: "The Hatter"
  })
}).then(data => {
  console.log(data) // { type: "user", successed: false, date: Date, resource: {...}, changed_resource: undefined, error: "403" }
});

/* 
  returning ChangeData<User>
  required a access_token in body, also Partial<User>
  method - put
*/
```

| name         | type               | value                        | expample 			|
| ------------ | ------------------ | --------------------------   | ------------------ |
| `data`       | `string`           | `id` или `username` на сайте, поиск по `username`: `@FOCKUSTY`, поиск по `id`: `1234567` | `fetch(api + "/u/@FOCKUSTY")`, `fetch(api + "/users/12345")` |
#### abbreviations
| full          | abbreviation       |
| ------------- | ------------------ |
| `/users`       | `/u`               |
#### methods
| method       | body                | response |
| ------------ | ------------------  | -------- |
| `get`        | `null`     		     | [`GetData<User>`](./types.doc.md#getdata) |
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
| method       | body                | response |
| ------------ | ------------------  | -------- |
| post         | `{ acess_token: string, content: string, creator_id: string, name: string, type: string }` | [`CreateData<Post>`](./types.doc.md#createdata) |

### `/:data`
#### params
| name         | type               | value                        |
| ------------ | ------------------ | --------------------------   |
| `id`         | `string`           | `id` поста на сайте          |
#### methods
| method       | body                | response |
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
| method       | body                | response |
| ------------ | ------------------  | -------- |
| `post`       | `{ access_token: string, author_id: string, post_id: string, content: string }` | [`CreateData<Comment>`](./types.doc.md#changedata) |

### /:id
#### params
| name         | type               | value                        |
| ------------ | ------------------ | --------------------------   |
| `id`         | `string`           | `id` комментария на сайте    |
#### methods
| method       | body                | response |
| ------------ | ------------------  | -------- |
| `get`        | `undefined`         | [`GetData<Comment>`](./types.doc.md#getdata) |
| `put`        | `{ access_token: string, user_id: string } & Partial<Comment>` | [`ChangeData<Comment>`](./types.doc.md#changedata) |
| `delete`     | `{ access_token: string, user_id: string }` | [`DeleteData<Comment>`](./types.doc.md#deletedata) |
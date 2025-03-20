# Api
Документация по api для фронтенда. Запросы, пути, агрументы и другое будет описано тут используя типы из `packages/types` (`@types/lafka`). Или же использование типов из [отдельной документации](./types.doc.md)

<hr>

## Пример (root (если есть))
### `/users/`

- == Описание ==

#### params
| name         | type               | value                            | example |
| ------------ | ------------------ | --------------------------       | ------- |
| `identifier`         | `string`           | индетификатор (username или id) пользователя на сайте   | `fetch(api + "/u/@FOCKUSTY")`, `fetch(api + "/u/12345")` |

#### abbreviations
| full          | abbreviation       |
| ------------- | ------------------ |
| `/users`      | /u                 |

#### Routes
| path | method       | body            | headers             | response |
| ------ | ------------ | --------------- | ------------------- | -------- |
| `/:daaata` | `get`        | `null`          | `{ token: string }` | [`User`](./types.doc.md#user)   |
| `/:daaata` | `post`       | `1234`          | `{ token: string }` | `undefined` |
| `/:daaata` | `delete`     | `null`          | `{ token: string }` | `1234helloworld` |

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
### `/users/`

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

##### `identifier`: `string`
- `id` или `username` на сайте, поиск по `username`: `@FOCKUSTY`, поиск по `id`: `1234567`

<details>
<summary>1. GET (ME)</summary>

</details>

```ts
// successed: true
fetch(api + "/users/", {
  method: "GET",
  headers: { token: "id-token_in-cookie" }
}).then(async data => {
  console.log(await data.json()) // { type: "users", successed: true, resource: {...}, error: undefined }
});

// successed: false
fetch(api + "/users/", {
  method: "GET",
  headers: { token: "id-token_in-cookie" }
}).then(async data => {
  console.log(await data.json()) // { type: "users", successed: false, resource: undefined, error: "FORBIDDEN" }
});

/* 
  returning GetData<User>
  required an id-token from cookies
  method - GET
*/
```

<details>
<summary>2. GET</summary>

```ts
// find by username, successed: true
fetch(api + "/users/@FOCKUSTY", { method: "GET" }).then(async (data: GetData<User>) => {
  console.log(await data.json()) // { successed: true, type: "users", resource: {...}, error: undefined } 
});

// find by id, successed: false
fetch(api + "/users/1234567890", { method: "GET" }).then(async data => {
  console.log(await data.json()) // { successed: false, type: "users", resource: null, error: "user not found" }
});

/* 
  returning GetData<User>
  not required data in headers/body
  method - GET
*/
```

</details>

<details>
<summary>3. DELETE</summary>

```ts
// delete by username, successed: true
fetch(api + "/users/@FOCKUSTY", {
  method: "DELETE",
  headers: { token: "id-token_in-cookie" }
}).then(async data => {
  console.log(await data.json()) // { type: "users", successed: true, date: Date, resource: {...}, error: undefined }
});

// delete by id, successed: false
fetch(api + "/u/1234", {
  method: "DELETE",
  headers: { token: "id-token_in-cookie" }
}).then(async data => {
  console.log(await data.json()) // { type: "users", successed: false, date: Date, resource: {...}, error: "403" }
});

/* 
  returning DeleteData<User>
  required an id-token from cookies
  method - DELETE
*/
```

</details>

<details>
<summary>4. PUT</summary>

```ts
// put by username, successed: true
fetch(api + "/u/@FOCKUSTY", {
  method: "PUT",
  headers: { token: "id-token_in-cookie" },
  body: JSON.stringify({
    nickname: "fickus228",
    biography: "The Hatter"
  })
}).then(async data => {
  console.log(await data.json()) // { type: "users", successed: true, date: Date, resource: {...}, changed_resource: {...}, error: undefined }
});

// put by id, successed: false
fetch(api + "/u/1235", {
  method: "PUT",
  headers: { token: "id-token_in-cookie" },
  body: JSON.stringify({
    nickname: "fickus228",
    biography: "The Hatter"
  })
}).then(async data => {
  console.log(await data.json()) // { type: "users", successed: false, date: Date, resource: {...}, changed_resource: undefined, error: "403" }
});

/* 
  returning ChangeData<User>
  required:
    body: Partial<User>,
    headers: an id-token from cookies
  method - put
*/
```

</details>

| name         | type               | value                        | expample 			|
| ------------ | ------------------ | --------------------------   | ------------------ |
| `identifier`       | `string`           | `id` или `username` на сайте, поиск по `username`: `@FOCKUSTY`, поиск по `id`: `1234567` | `fetch(api + "/u/@FOCKUSTY")`, `fetch(api + "/users/12345")` |
#### abbreviations
| full          | abbreviation       |
| ------------- | ------------------ |
| `/users`       | `/u`               |
#### Routes
| path                | method       | body                | headers           | response |
| ------------------- | ------------ | ------------------  | ----------------- | -------- |
| `/`                 | `get`        | `null`     		     | `{token: string}` | [`GetData<User>`](./types.doc.md#getdata) |
| `/:identifier`      | `get`        | `null`     		     | `null`            | [`GetData<User>`](./types.doc.md#getdata) |
| `/:identifier`      | `delete`     | `null`              | `{token: string}` | [`DeleteData<User>`](./types.doc.md#deletedata) |
| `/:identifier`      | `put`        | `Partial<User>`     | `{token: string}` | [`ChangeData<User>`](./types.doc.md/#changedata) |

<hr>

## Посты
### /posts/

#### params
##### `id`: `string`
- `id` поста на сайте, поиск: `1235412`

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
#### Routes
| path                  | method       | body                | headers           | response |
| -----  | ------------ | ------------------  | ----------------- | -------- |
| `/`    | post                    | `{ content: string, creator_id: string, name: string, type: string }` | `{token: string}` | [`CreateData<Post>`](./types.doc.md#createdata) |
| `/:id` | get                     | `null`                                | `null` | [`GetData<Post>`](./types.doc.md#getdata) |
| `/:id` | put (your post)         | `null` | `{token: string}` | [`ChangeData<Post>`](./types.doc.md#changedata) |
| `/:id` | put (not your post)     | `Partial<Post> & { user_id: string }` | `{token: string}` | [`ChangeData<Post>`](./types.doc.md#changedata) |
| `/:id` | delete (your post)      | `null`                 | `{token: string}` | [`DeleteData<Post>`](./types.doc.md#deletedata) |
| `/:id` | delete (not your post)  | `{ user_id: string }`                 | `{token: string}` | [`DeleteData<Post>`](./types.doc.md#deletedata) |

## Комментарии
### `/comments/`

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

#### params
##### `id`: `string`
- `id` комментария на сайте, поиск: `1235412`

#### abbreviations
| full          | abbreviation       |
| ------------- | ------------------ |
| `/comments`   | `/c`               |
#### Routes
| path                | method       | body                | headers           | response |
| ------------------- | ------------ | ------------------  | ----------------- | -------- |
| `/` | `post`          | `{ access_token: string, author_id: string, post_id: string, content: string }` | [`CreateData<Comment>`](./types.doc.md#changedata) |
| `/:id` | `get`                    | `null` | `null` | [`GetData<Comment>`](./types.doc.md#getdata) |
| `/:id` | `put` (your comment)        | `null` | `{token: string}` | [`ChangeData<Comment>`](./types.doc.md#changedata) |
| `/:id` | `put` (not your comment)    | `Partial<Comment> & { user_id: string }` | `{token: string}` | [`ChangeData<Comment>`](./types.doc.md#changedata) |
| `/:id` | `delete` (your comment)     | `null` | `{token: string}` | [`DeleteData<Comment>`](./types.doc.md#deletedata) |
| `/:id` | `delete` (not your comment) | `{ user_id: string }` | `{token: string}` | [`DeleteData<Comment>`](./types.doc.md#deletedata) |
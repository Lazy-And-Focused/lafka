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
  rights: Rights.Rights;
}
```

</details>



#### query
1. `cache`: `boolean`
- По умолчанию: `true`
- Включает/выключает взятие данных сперва из кэша

2. `returnUser`: `boolean`
- По умолчанию: `false`
- (Для put, delete) вовзращает User, а не UpdateWriteOpResult или DeleteResult (Дополнительно обращается к базе данных)

#### params
1. `identifier`: `string`
- `id` или `username` на сайте, поиск по `username`: `@FOCKUSTY`, поиск по `id`: `1234567`

#### examples

<details>
<summary>1. GET (ME)</summary>

```ts
// successed: true
fetch(api + "/users/", {
  method: "GET",
  headers: { 'Content-Type': 'application/json;charset=utf-8', token: "id-token_in-cookie" }
}).then(async data => {
  console.log(await data.json()) // { type: "users", successed: true, resource: {...}, error: null }
});

// successed: false
fetch(api + "/users/", {
  method: "GET",
  headers: { 'Content-Type': 'application/json;charset=utf-8', token: "id-token_in-cookie" }
}).then(async data => {
  console.log(await data.json()) // { type: "users", successed: false, resource: null, error: "???" }
});

/* 
  returning GetData<User>
  required an id-token from cookies
  method - GET
*/
```

</details>

<details>
<summary>2. GET</summary>

```ts
// find by username, successed: true
fetch(api + "/users/@FOCKUSTY", { 'Content-Type': 'application/json;charset=utf-8', method: "GET" }).then(async (data: GetData<User>) => {
  console.log(await data.json()) // { successed: true, type: "users", resource: {...}, error: null } 
});

// find by id, successed: false
fetch(api + "/users/1234567890", { 'Content-Type': 'application/json;charset=utf-8', method: "GET" }).then(async data => {
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
  headers: { 'Content-Type': 'application/json;charset=utf-8', token: "id-token_in-cookie" }
}).then(async data => {
  console.log(await data.json()) // { type: "users", successed: true, date: Date, resource: {...}, error: null }
});

// delete by id, successed: false
fetch(api + "/u/1234", {
  method: "DELETE",
  headers: { 'Content-Type': 'application/json;charset=utf-8', token: "id-token_in-cookie" }
}).then(async data => {
  console.log(await data.json()) // { type: "users", successed: false, date: Date, resource: null, error: "???" }
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
  headers: { 'Content-Type': 'application/json;charset=utf-8', token: "id-token_in-cookie" },
  body: JSON.stringify({
    nickname: "fickus228",
    biography: "The Hatter"
  })
}).then(async data => {
  console.log(await data.json()) // { type: "users", successed: true, date: Date, resource: {...}, changed_resource: {...}, error: null }
});

// put by id, successed: false
fetch(api + "/u/1235", {
  method: "PUT",
  headers: { 'Content-Type': 'application/json;charset=utf-8', token: "id-token_in-cookie" },
  body: JSON.stringify({
    nickname: "fickus228",
    biography: "The Hatter"
  })
}).then(async data => {
  console.log(await data.json()) // { type: "users", successed: false, date: Date, null, changed_resource: null, error: "???" }
});

/* 
  returning ChangeData<User>
  required:
    body: Partial<User>,
    headers: an id-token from cookies
  method - PUT
*/
```

</details>

#### abbreviations
| full          | abbreviation       |
| ------------- | ------------------ |
| `/users`      | `/u`               |

#### Routes
| path                | query    | method       | body                | headers           | response |
| ------------------- | -------- | ------------ | ------------------  | ----------------- | -------- |
| `/`                 | `cache: boolean\|undefined` | `get`        | `null`     		      | `{token: string}` | [`GetData<User>`](./types.doc.md#getdata) |
| `/:identifier`      | `cache: boolean\|undefined` | `get`        | `null`     		      | `null`            | [`GetData<User>`](./types.doc.md#getdata) |
| `/:identifier`      | `returnUser: boolean\|undefined` | `delete`     | `null`              | `{token: string}` | [`DeleteData<User>`](./types.doc.md#deletedata) |
| `/:identifier`      | `cache: boolean\|undefined` <br> `returnUser: boolean\|undefined` | `put`        | `Partial<User>`     | `{token: string}` | [`ChangeData<User>`](./types.doc.md/#changedata) |

<hr>

## Посты
### /posts/

#### query
1. `offset`: `number`
- По умолчанию: `0`
- Количество постов, которые Вы хотите пропустить
2. `count`: `number`
- По умолчанию: `0`
- Длина постов для загрузки
3. `sortBy`: `string` `("likes"|"dislikes"|"followers"|"created_at"|"changed_at")`
- По умолчанию: `"created_at"`
- Метод сортировки постов
4. `sortType`: `string|boolean` `("asc"|"desc"|1|-1|true|false)`
- По умолчанию: `-1`
- Сортировка постов по возрастанию `("asc", 1, true)` и убыванию `("desc", -1, false)`

##### params
1. `id`: `string`
- `id` поста на сайте, поиск: `1235412`

#### types
<details>
<summary><a href="./types.doc.md#post">Post</a></summary>

```ts
const POST_TYPES = ["forum", "blog"] as const
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

</details>

#### examples

<details>
<summary>1. POST</summary>

```ts
// successed: true
fetch(api + "/posts/", {
  method: "POST",
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  body: JSON.stringify({
    name: "It's my first post!",
    content: "A + B = C?!!!!!! WOOOOOOOOOOOOOOOOW!",
    type: "blog"
  })
}).then(data => console.log(await data.json())) // { type: "posts", successed: true, date: Date, error: null, created_resource: {...} }

// successed: false
fetch(api + "/posts/", {
  method: "POST",
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  body: JSON.stringify({
    name: "It's my first post!",
    content: "A + B = C?!!!!!! WOOOOOOOOOOOOOOOOW!",
    type: "forum"
  })
}).then(data => console.log(await data.json())) // { type: "posts", successed: false, date: Date, created_resuorce: null, error: "Some error: {code}"|unknown}

/* 
  returning CreateData<Post>
  required:
    an id-token from cookie
    Partial<Post> & { name: string, content: string, type: "blog" | "forum" }
  method - POST
*/
```

</details>

<details>
<summary>2. GET</summary>

```ts
// const query = "?offset=0&count=5"
// successed: true
fetch(api + "/posts/" + query, {
  method: "GET",
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
}).then(data => console.log(await data.json())) // { type: "posts", successed: true, error: null, resource: [{...}, {...}, {...}, {...}, {...}] }

// successed: false
fetch(api + "/posts/" + query, {
  method: "GET",
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
}).then(data => console.log(await data.json())) // { type: "posts", successed: false, resuorce: null, error: "Some error: {code}"|unknown}

/* 
  returning GetData<Post>
  method - GET
*/
```

</details>

<details>
<summary>3. GET (Post)</summary>

```ts
// successed: true
fetch(api + "/posts/1234", {
  method: "GET",
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
}).then(data => console.log(await data.json())) // { type: "posts", successed: true, error: null, resource: {...} }

// successed: false
fetch(api + "/posts/1234", {
  method: "GET",
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
}).then(data => console.log(await data.json())) // { type: "posts", successed: false, resuorce: null, error: "Some error: {code}"|unknown}

/* 
  returning GetData<Post>
  method - GET
*/
```

</details>

<details>
<summary>4. DELETE</summary>

```ts
// successed: true
fetch(api + "/posts/1234", {
  method: "DELETE",
  headers: { 'Content-Type': 'application/json;charset=utf-8', token: "id-token_in-cookie" }
}).then(data => console.log(await data.json())) // { type: "posts", successed: true, error: null, resource: {...} }

// successed: false
fetch(api + "/posts/1234", {
  method: "DELETE",
  headers: { 'Content-Type': 'application/json;charset=utf-8', token: "id-token_in-cookie" },
}).then(data => console.log(await data.json())) // { type: "posts", successed: false, resuorce: null, error: "Some error: {code}"|unknown}

/* 
  returning DeleteData<Post>
  required an id-token from cookie
  method - DELETE
*/
```

</details>

<details>
<summary>5. PUT</summary>

```ts
// successed: true
fetch(api + "/posts/1234", {
  method: "PUT",
  headers: { 'Content-Type': 'application/json;charset=utf-8', token: "id-token_in-cookie" },
  body: JSON.stringify({
    content: "I CAN CHANGE THIS POST HAHAHAHAH",
  })
}).then(data => console.log(await data.json())) // { type: "posts", successed: true, error: null, resource: {...} }

// successed: false
fetch(api + "/posts/1234", {
  method: "PUT",
  headers: { 'Content-Type': 'application/json;charset=utf-8', token: "id-token_in-cookie" },
  body: JSON.stringify({
    name: "I CAN CHANGE THIS POST HAHAHAHAH",
  })
}).then(data => console.log(await data.json())) // { type: "posts", successed: false, resuorce: null, error: "Some error: {code}"|unknown}

/* 
  returning ChangeData<Post>
  required
    id-token from cookie
    Partial<Post> in body
  method - PUT
*/
```

</details>

#### abbreviations
| full          | abbreviation       |
| ------------- | ------------------ |
| `/posts`      | `/p`               |

#### Routes
| path      | query             | method       | body                | headers           | response |
| --------- | ----------------- |------------ | ------------------  | ----------------- | -------- |
| `/`       |                   | post                    | `{ content: string, creator_id: string, name: string, type: string }` | `{token: string}` | [`CreateData<Post>`](./types.doc.md#createdata) |
| `/`       | `offset: number\|undefined`  <br> `count: number\|undefined` <br> [`sortBy: UNIQUE_TYPE\|undefined`](./api.doc.md#query-1) <br> [`sortType: UNIQUE_TYPE\|undefined`](./api.doc.md#query-1) | get                     | `null`  | `null` | [`CreateData<Post>`](./types.doc.md#createdata) |
| `/:id`    | `null` | get                     | `null` | `null` | [`GetData<Post>`](./types.doc.md#getdata) |
| `/:id`    | `null` | put     | `Partial<Post>` | `{token: string}` | [`ChangeData<Post>`](./types.doc.md#changedata) |
| `/:id`    | `null` | delete      | `null`                 | `{token: string}` | [`DeleteData<Post>`](./types.doc.md#deletedata) |

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
1. `id`: `string`
- `id` комментария на сайте, поиск: `1235412`

#### abbreviations
| full          | abbreviation       |
| ------------- | ------------------ |
| `/comments`   | `/c`               |

#### Routes
| path                | method       | body                | headers           | response |
| ------------------- | ------------ | ------------------  | ----------------- | -------- |
| `/` | `post`          | `{ access_token: string, author_id: string, post_id: string, content: string }` | [`CreateData<Comment>`](./types.doc.md#changedata) |
| `/:id` | `get`        | `null` | `null` | [`GetData<Comment>`](./types.doc.md#getdata) |
| `/:id` | `put`        | `null` | `{token: string}` | [`ChangeData<Comment>`](./types.doc.md#changedata) |
| `/:id` | `delete`     | `null` | `{token: string}` | [`DeleteData<Comment>`](./types.doc.md#deletedata) |
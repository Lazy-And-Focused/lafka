# Api
Документация по api для фронтенда. Запросы, пути, агрументы и другое будет описано тут используя типы из `packages/types` (`@types/lafka`). Или же использование типов из [отдельной документации](./types.doc.md)

<hr>

## Пример (root (если есть))
### /users/:id

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
### /api/:v
- `api` с возможностью выбрать версию

#### params
| name         | type               | value                                 |
| ------------ | ------------------ | -------------------------------       |
| `v`          | `string`           | Версия api (`v1`, `v2`, `v3`)         |

<hr>

## Аутентификация/Авторизация
### /auth/:method

- Предназначается для аутентификации/авторизации пользователя на платформе, не предназначен для использования с помощью `fetch`-запросов. Требуется перенаправления (`redirect`).

#### params
| name         | type               | value                        |
| ------------ | ------------------ | --------------------------   |
| `method`     | [`AuthTypes`](./types.doc.md#authtypes)        | Метод аутентификации на сайте (google, yandex...)   |

<hr>

## Пользователь
### /users/:id

- Предназначается для фетчинга пользователя с помощью запросов.

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
| `get`        | `access token`      | [`User`](./types.doc.md#user) |
| `delete`     | `access token`      | [`DeleteData`](./types.doc.md#deletedata) |
| `put`        | `access token`      | [`ChangeData`](./types.doc.md/#changedata) |

<hr>

## Посты (/posts)
### root
#### abbreviations
| full          | abbreviation       |
| ------------- | ------------------ |
| `/posts`      | `/p`               |
#### methods
| method       | data                | response |
| ------------ | ------------------  | -------- |
| post         | `{ content: string, creator_id: string, name: string, type: string }` | [`Post`](./types.doc.md#post) |

### /:id
#### params
| name         | type               | value                        |
| ------------ | ------------------ | --------------------------   |
| `id`         | `string`           | `id` поста на сайте          |
#### methods
| method       | data                | response |
| ------------ | ------------------  | -------- |
| get          | `null`              | [`Post`](./types.doc.md/#post)
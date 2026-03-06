# Битовая система прав (БСП)

## Типизация
- [Краткая документация по существующим битам](./types.md)
- [Файл типизации](../../types/src/rights/rights.types.ts)

## Для тех, кто будет работать на прямую

### Как работает?
- Биты не повторяются в правах, так что каждое право имеет уникальное значение: 1, 2, 4, 8, 16...
- Биты сверяются оператором И (`&`) и если получается, что биты пересекаются, то права имеются, иначе нет

### Почему права — степень двух?
- БСП использует бинарную систему, состоящая из единицы и нуля
- Так получается, что мы используем все числа в бинарной, начиная с единицы (ноль — отсутствие прав)
- Так как для каждого право нужно рассчитать уникальное число, которое не будет препятствовать другим правам, нам нужно брать следующие битовое число
- Скажем, что `00001` (один в десятичное) — наше первое право, тогда следующим будет `00010` (Два в десятичное). Тогда пересечение этих прав образует `00011` — такие права у нас имеются. Чтобы проверить, имеется ли у нас первое право, нужно использовать оператор `&`: `00011` & `00001`, тогда у нас получится `00001`, означающее, что право у нас имеется, на языке программирования JavaScript это будет выглядеть следующим образом:
```js
const userRights = 0x00001 // Допустим, что тут объявлены наши права
/**
 * @param bit bit of permisson, what we want to checks
 * @return {boolean}
 */
function hasPermission(bit) {
  return (userRights & bit) === bit
}
```
- Мы сравниваем `userRights & bit` с `bit` для того, чтобы получить `boolean`-ответ

### Справочная информация
- Язык почти не важен!
- [Битовые поля c++](https://learn.microsoft.com/ru-ru/cpp/cpp/cpp-bit-fields)
- [Битовые поля Википедия](https://en.wikipedia.org/wiki/Bit_field)
- [Битовые поля JavaScript](https://emergent.systems/posts/bit-fields/)

## Для тех, кто будет работать косвенно (через API, библиотеку или другие системы)
- Используйте `has`, чтобы проверить, имеются ли определенные права у пользователя с чем-либо
- UserService
```js
import { Rights } from "@lafka/rights";

(async() => {
  const { data: fockusty } = await (await fetch(api_url + "/users/", {headers})).json();

  new Rights.UserService(fockusty).has({
    right: "me",
    rights: ["POSTS_CREATE"] // equalt rights: "POSTS_CREATE"
  }); // boolean

  new Rights.UserService(fockusty).has({
    right: "users",
    rights: {
      "123": ["MANAGE", "MODERATE", "READ"],
      "321": ["READ"],
      "666": "MODERATE",
    }
  }) // { "123": boolean, "321": boolean "666": boolean };
})();
```

- PostService
```js
import { Rights } from "@lafka/rights";

(async() => {
  // const fockusty: LAFka.User;

  const { data: post } = (await (await fetch(api_url + "posts/" + myCoolPostId, {headers})).json());

  new Rights.PostService(post).has({
    rights: "VIEW",
    userId: fockusty.id
  }); // boolean

  new Rights.PostService(post).has({
    rights: "DELETE",
    userId: fockusty.id
  }); // boolean

  new Rights.PostService(post).has({
    rights: "OWNER",
    userId: "2"
  }); // boolean

  new Rights.PostService(post).has({
    rights: ["VIEW", "REACT", "COMMENTS_READ"],
    userId: "4"
  }); // boolean
})()
```
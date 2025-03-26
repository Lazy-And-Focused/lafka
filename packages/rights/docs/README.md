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

## Для тех, кто будет работать косвенно (через API или другие системы)
- Используйте `has`, чтобы проверить, имеются ли определенные права у пользователя
- LazyRightsService
```js
import { Rights } from "@lafka/types"

(async() => {
  const { rights } = await (await fetch(api_url, {headers})).json();

  new LazyRightsService<"default">(rights.default).has({
      key: "ME",
      rights: ["ADMINISTRATOR"]
  });

  new LazyRightsService<"posts">(rights.posts).has({
      key: "some-user-id",
      rights: ["DELETE"]
  });
})();
```

- RightsService
```js
import { Rights } from "@lafka/types";

(async() => {
  const { rights } = (await (await fetch(api_url, {headers})).json());

  new RightsService<"posts">(rights.posts).has({
      key: "12345",
          rights: [
              Rights.Default.POSTS_RIGHTS.MANAGE,
              Rights.Default.POSTS_RIGHTS.COMMENTS_READ,
          ]
  });

  new RightsService<"posts">(rights.posts).has({
      key: "67890",
      rights: Rights.Default.POSTS_RIGHTS.OWNER,
  });
  // is equals ⩚  |  is equals
  // is equals |  ⩛  is equals
  new RightsService<"posts">(rights.posts).hasOne({
      key: "67890",
      right: Rights.Default.POSTS_RIGHTS.OWNER,
  });
})()
```
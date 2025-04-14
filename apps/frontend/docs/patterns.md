# Code Style (Patterns)

[Назад](./index.md)

---

<!-- prettier-ignore -->
> [!CAUTION]
> Эта страница проектируется, пишется и обсуждается. Если есть предложения, то
> не стесняйтксь писать в issue или в чат Telegram.

Раздел посвящён неймингу и паттернам, которые Вы должны соблюдать в
рамках кода для Frontentd-части приложения.

## Проект | Каталоги

Речь идёт о файловых каталогах – папках. Frontend LAFka имеет
следующую структуру:

```Markdown
src/
- app/
    - [page]        - папка с путём до страницы. ничего нового
- components/
    - kit/          - ui kit. временно (будет перемещно в отдельных пакет)
    - icons/        - иконки
- libs/             - самописные мини-библиотеки, классы или утилиты,
                      выполняющие несколько вещей в себе
- utils/            - утилиты
- hooks/            - react-хуки
- config/           - конфигурационные файлы
```

## Next.js | Layouts & Pages

Как называются слои (layouts) вы и сами прекрасно знаете:

```Markdown
- page1
    - layout.tsx
    - page.tsx

- page2
    - layout.tsx
    - page.tsx
```

Функциональные компоненты, экспортируемые по умолчанию должны иметь
нейминг вида: `ИмяТип`:

```TypeScript
// home/layout.tsx
export default function HomeLayout({ children }) {
    return children;
}
// home/layout.tsx
export default function HomePage() { return null }

// user/layout.tsx
export default function UserPage() { return null }
```

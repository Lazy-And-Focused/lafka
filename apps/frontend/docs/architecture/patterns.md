# Code Style (Patterns)

[← Назад](./index.md)

---

<!-- prettier-ignore -->
> [!CAUTION]
> Эта страница проектируется, пишется и обсуждается. Если есть предложения, то
> не стесняйтесь писать [в issue](https://github.com/Lazy-And-Focused/LAFka/issues)
> или [в чат Telegram](https://t.me/laf_disccussion).

Раздел посвящён неймингу и паттернам, которые Вы должны соблюдать в
рамках кода для Frontend-части приложения.

## Next.js | Layouts & Pages

Функциональные компоненты, экспортируемые по умолчанию, должны иметь
нейминг вида: `ИмяТип`:

```TypeScript
// home/layout.tsx
export default function HomeLayout({ children }) {
    return children;
}
// home/page.tsx
export default function HomePage() { return null }

// user/page.tsx
export default function UserPage() { return null }
```

---

Далее

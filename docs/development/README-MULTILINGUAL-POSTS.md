# Добавление мультиязычных постов в блог

## Проблема

В текущей схеме базы данных поле `slug` имеет уникальное ограничение, что не
позволяет создавать посты с одинаковыми slug для разных языков.

## Решение

Нужно обновить ограничение в базе данных, чтобы уникальность проверялась по
комбинации `slug` + `locale`.

### Шаги для обновления базы данных:

1. Откройте [Neon Console](https://console.neon.tech)
2. Перейдите в SQL Editor
3. Выполните следующий SQL:

```sql
-- Drop the existing unique constraint on slug
ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS blog_posts_slug_key;

-- Create a new unique constraint on slug + locale combination
ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_slug_locale_unique UNIQUE (slug, locale);
```

4. После успешного выполнения SQL, запустите скрипт добавления русских постов:

```bash
npx tsx lib/scripts/add-russian-posts.ts
```

## Проверка результатов

Проверить все посты в базе данных:

```bash
npx tsx lib/scripts/list-all-posts.ts
```

Посмотреть русские посты на сайте:

- http://localhost:3000/ru/blog

## Структура мультиязычных постов

Каждый пост имеет:

- `slug` - одинаковый для всех языковых версий
- `locale` - код языка (en, ru, he)
- `title`, `excerpt`, `content` - переведенный контент

Это позволяет иметь одинаковые URL для разных языков:

- `/en/blog/css-animations`
- `/ru/blog/css-animations`
- `/he/blog/css-animations`

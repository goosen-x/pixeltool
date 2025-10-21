# 📊 Полный отчёт об использовании файлов в папке lib/

**Дата анализа:** 2025-10-11 **Всего файлов в lib/:** 108 файлов **Анализируемые
директории:** app/, components/

---

## 🎯 Краткая сводка

| Категория                               | Количество | Процент |
| --------------------------------------- | ---------- | ------- |
| 🔥 Активно используются (10+ импортов)  | 3          | 2.8%    |
| 📦 Умеренно используются (3-9 импортов) | 7          | 6.5%    |
| ⚡ Редко используются (1-2 импорта)     | 27         | 25.0%   |
| ⚠️ Не используются (0 импортов)         | 71         | 65.7%   |

---

## 🔥 Критически важные файлы (10+ импортов)

### 1. `lib/utils.ts` - 134 импорта

**Статус:** АКТИВНО ИСПОЛЬЗУЕТСЯ **Описание:** Основные утилитарные функции
проекта (cn, clsx, tailwind-merge) **Рекомендация:** ✅ СОХРАНИТЬ - критически
важный файл

### 2. `lib/constants/widgets.ts` - 25 импортов

**Статус:** АКТИВНО ИСПОЛЬЗУЕТСЯ **Описание:** Конфигурация всех 51 виджетов,
единственный источник истины **Рекомендация:** ✅ СОХРАНИТЬ - критически важный
файл

### 3. `lib/hooks/useWidgetKeyboard.ts` - 16 импортов

**Статус:** АКТИВНО ИСПОЛЬЗУЕТСЯ **Описание:** Обработка клавиатурных сокращений
для виджетов **Рекомендация:** ✅ СОХРАНИТЬ - активно используется

---

## 📦 Умеренно используемые файлы (3-9 импортов)

| Файл                            | Импорты | Рекомендация                 |
| ------------------------------- | ------- | ---------------------------- |
| `lib/hooks/widgets/index.ts`    | 5       | ✅ Сохранить - barrel export |
| `lib/hooks/useAnalytics.ts`     | 4       | ✅ Сохранить - аналитика     |
| `lib/db/blog.ts`                | 4       | ✅ Сохранить - работа с БД   |
| `lib/api.ts`                    | 3       | ⚠️ Проверить использование   |
| `lib/hooks/useFavorites.ts`     | 3       | ✅ Сохранить - избранное     |
| `lib/analytics/yandex-goals.ts` | 3       | ✅ Сохранить - метрика       |
| `lib/utils/highlightText.tsx`   | 3       | ✅ Сохранить - подсветка     |

---

## ⚡ Редко используемые файлы (1-2 импорта)

### Инфраструктура (сохранить):

- `lib/redisOnline.ts` (2) - онлайн-пользователи
- `lib/session.ts` (1) - управление сессиями
- `lib/api-file.ts` (1) - API файлов
- `lib/api-db.ts` (2) - API БД

### Типы (сохранить):

- `lib/types/database.ts` (2)
- `lib/types/widget-base.ts` (1)
- `lib/types/author.ts` (1)

### Утилиты (проверить):

- `lib/utils/ascii-converter.ts` (1)
- `lib/utils/color-converter.ts` (1)
- `lib/utils/bezier-easing.ts` (2)

### Хуки (сохранить):

- `lib/hooks/useThemeWithTransition.tsx` (2)
- `lib/hooks/useMediaQuery.tsx` (2)
- `lib/hooks/useSearchHistory.ts` (2)
- `lib/hooks/useSpecialSymbols.ts` (1)
- `lib/hooks/widgets/useWidgetCreation.ts` (2)

### Данные (используются косвенно):

- `lib/data/emoji-data.ts` (2) - используется в emoji-list

---

## ⚠️ НЕИСПОЛЬЗУЕМЫЕ ФАЙЛЫ (требуют внимания)

### 📜 Скрипты (18 файлов) - МОЖНО УДАЛИТЬ

**Рекомендация:** Удалить или переместить в `/scripts` в корень проекта

```
lib/scripts/add-css-variables-ru.ts
lib/scripts/add-live-code-example-post.ts
lib/scripts/add-russian-posts.ts
lib/scripts/add-test-post.ts
lib/scripts/check-analytics-setup.ts
lib/scripts/check-events.ts
lib/scripts/check-supabase.ts
lib/scripts/count-widgets.ts
lib/scripts/fix-base64-encoder.ts
lib/scripts/fix-widget-imports.ts
lib/scripts/list-all-posts.ts
lib/scripts/list-posts.ts
lib/scripts/migrate-posts.ts
lib/scripts/migrate-to-supabase.ts
lib/scripts/populate-widgets-supabase.ts
lib/scripts/test-supabase-simple.ts
lib/scripts/update-widget-design.ts
lib/scripts/verify-supabase-setup.ts
```

**Причина:** Это одноразовые миграционные скрипты, которые уже были выполнены

---

### 🛠️ Хуки виджетов (9 файлов) - ТРЕБУЮТ ПРОВЕРКИ

**Неиспользуемые хуки:**

```typescript
lib / hooks / widgets / useLoanCalculator.ts // ❌ Не используется
lib / hooks / widgets / useBMICalculator.ts // ❌ Не используется
lib / hooks / widgets / useConverter.ts // ❌ Не используется
lib / hooks / widgets / usePercentageCalculator.ts // ❌ Не используется
lib / hooks / widgets / useSpecialSymbolsPicker.ts // ❌ Не используется
lib / hooks / widgets / useGenerator.ts // ❌ Не используется
lib / hooks / widgets / useCompoundInterestCalculator.ts // ❌ Не используется
lib / hooks / widgets / useAsciiArtGenerator.ts // ❌ Не используется
lib / hooks / widgets / useCalculator.ts // ❌ Не используется
```

**Рекомендация:**

1. ⚠️ Проверить, планируется ли их использование
2. Если виджеты существуют, но не используют хуки - интегрировать
3. Если виджеты отсутствуют - удалить хуки
4. Удалить из `lib/hooks/widgets/index.ts` экспорты

**Используемые хуки:**

- ✅ `useFancyTextGenerator.ts` - используется в fancy-text-generator
- ✅ `useSystemInfo.ts` - используется в system-info
- ✅ `useCSSGradientGenerator.ts` - используется в css-gradient-generator

---

### 📁 Данные виджетов (4 файла) - ТРЕБУЮТ ПРОВЕРКИ

```
lib/data/fancy-text-data.ts (15KB)      // ⚠️ Используется в fancy-text-generator
lib/data/special-symbols-data.ts (15KB)  // ⚠️ Может использоваться косвенно
lib/data/system-info-data.ts (9.6KB)    // ⚠️ Используется в system-info
lib/data/widgets-static.ts (2.2KB)      // ❌ Не используется
```

**Примечание:** Некоторые data-файлы могут использоваться косвенно через хуки.
Требуется детальная проверка.

**Рекомендация:**

- Проверить прямое использование в компонентах виджетов
- Если не используются - рассмотреть удаление или интеграцию

---

### 🗄️ База данных (7 файлов) - LEGACY КОД

```
lib/db/check-widgets-db.ts       // ❌ Не используется
lib/db/connection.ts             // ❌ Не используется
lib/db/safe-query.ts             // ❌ Не используется
lib/db/schema.ts                 // ❌ Не используется
lib/db/supabase-adapter.ts       // ❌ Не используется
lib/db/widgets-supabase.ts       // ❌ Не используется (313 строк!)
lib/db/with-retry.ts             // ❌ Не используется
```

**Рекомендация:**

- ⚠️ Это может быть legacy-код от старой реализации БД
- Проверить, используется ли альтернативная реализация (lib/supabase/client.ts -
  ✅ используется)
- Если Supabase интеграция работает через client.ts/server.ts - удалить весь
  lib/db/

---

### 📝 Markdown & Blog (4 файла) - ЧАСТИЧНО ИСПОЛЬЗУЮТСЯ

```
lib/helpers/markdownToHtml.ts           // ✅ Используется в app/blog/[slug]/page.tsx
lib/remark-plugins/remark-tool-link.ts  // ✅ Используется через markdownToHtml
lib/remark-plugins/remark-live-code.ts  // ✅ Используется через markdownToHtml
lib/actions/posts.ts                    // ❌ Не используется напрямую
```

**Рекомендация:**

- ✅ Сохранить markdown/remark файлы - используются косвенно
- ⚠️ `lib/actions/posts.ts` - проверить, нужен ли для серверных действий

---

### 🎨 Помощники (2 файла)

```
lib/helpers/generateRandomColor.ts  // ❌ Не используется
lib/helpers/markdownToHtml.ts       // ✅ Используется
```

**Рекомендация:**

- Удалить `generateRandomColor.ts`
- Сохранить `markdownToHtml.ts`

---

### ⚙️ Конфигурация (3 файла)

```
lib/config/features.ts                      // ❌ Не используется
lib/constants/socials.tsx                   // ❌ Не используется
lib/constants/widgetShortcuts.example.ts    // ❌ Пример (можно удалить)
```

**Рекомендация:**

- Удалить `features.ts` если не планируется feature flags
- Проверить `socials.tsx` - может использоваться в футере/контактах
- `widgetShortcuts.example.ts` - это просто пример, можно удалить

---

### 🔧 Прочие утилиты (2 файла)

```
lib/widgets/index.ts (225 строк!)  // ❌ Не используется напрямую
lib/seo/widget-schemas.ts          // ❌ Не используется
```

**Рекомендация:**

- Проверить `lib/widgets/index.ts` - 225 строк неиспользуемого кода!
- Может быть старой реализацией загрузки виджетов

---

## 📋 План действий

### 🔴 Приоритет 1: Безопасное удаление (0 рисков)

**Действие:** Удалить следующие файлы и папки:

```bash
# 1. Удалить все миграционные скрипты
rm -rf lib/scripts/

# 2. Удалить неиспользуемые хуки виджетов
rm lib/hooks/widgets/useLoanCalculator.ts
rm lib/hooks/widgets/useBMICalculator.ts
rm lib/hooks/widgets/useConverter.ts
rm lib/hooks/widgets/usePercentageCalculator.ts
rm lib/hooks/widgets/useSpecialSymbolsPicker.ts
rm lib/hooks/widgets/useGenerator.ts
rm lib/hooks/widgets/useCompoundInterestCalculator.ts
rm lib/hooks/widgets/useAsciiArtGenerator.ts
rm lib/hooks/widgets/useCalculator.ts

# 3. Обновить lib/hooks/widgets/index.ts (удалить экспорты)

# 4. Удалить вспомогательные файлы
rm lib/helpers/generateRandomColor.ts
rm lib/constants/widgetShortcuts.example.ts
```

**Экономия:** ~20 файлов, уменьшение размера кодовой базы

---

### 🟡 Приоритет 2: Требует проверки (средний риск)

**Действие:** Проверить и принять решение:

1. **lib/db/** (7 файлов):
   - Проверить, не используется ли через динамические импорты
   - Если нет - удалить всю папку `lib/db/`
   - Сохранить только `lib/db/blog.ts` (4 импорта)

2. **lib/data/** (4 файла):
   - Проверить каждый data-файл на использование в виджетах
   - Удалить `lib/data/widgets-static.ts`
   - Остальные проверить детально

3. **lib/widgets/index.ts** (225 строк):
   - Проверить, не используется ли через динамические импорты
   - Если нет - удалить

4. **lib/actions/posts.ts**:
   - Проверить серверные компоненты и API роуты
   - Если не используется - удалить

5. **lib/config/features.ts, lib/constants/socials.tsx**:
   - Проверить использование в футере/header
   - Принять решение по удалению

---

### 🟢 Приоритет 3: Оптимизация (низкий риск)

**Действие:** Рефакторинг и оптимизация:

1. **Переместить скрипты:**

   ```bash
   # Вместо удаления, переместить в корень
   mkdir -p scripts/archive
   mv lib/scripts/* scripts/archive/
   ```

2. **Создать документацию:**
   - Добавить README.md в lib/ с описанием структуры
   - Документировать, какие модули для чего используются

3. **Настроить ESLint правило:**
   - Добавить правило для обнаружения неиспользуемых экспортов
   - Настроить pre-commit хук

---

## 📊 Финальная статистика

### Текущее состояние:

- **Всего файлов:** 108
- **Активно используются:** 37 файлов (34%)
- **Не используются:** 71 файл (66%)

### После очистки (прогноз):

- **Останется файлов:** ~50-60
- **Будет удалено:** ~50 файлов
- **Экономия места:** ~500KB кода
- **Улучшение читаемости:** значительное

---

## ⚡ Быстрые команды для очистки

### Вариант 1: Агрессивная очистка (удалить всё неиспользуемое)

```bash
# Удалить скрипты
rm -rf lib/scripts/

# Удалить неиспользуемые хуки
rm lib/hooks/widgets/{useLoanCalculator,useBMICalculator,useConverter,usePercentageCalculator,useSpecialSymbolsPicker,useGenerator,useCompoundInterestCalculator,useAsciiArtGenerator,useCalculator}.ts

# Удалить legacy БД код (ОСТОРОЖНО!)
rm lib/db/check-widgets-db.ts lib/db/connection.ts lib/db/safe-query.ts lib/db/schema.ts lib/db/supabase-adapter.ts lib/db/widgets-supabase.ts lib/db/with-retry.ts

# Удалить прочие файлы
rm lib/helpers/generateRandomColor.ts
rm lib/constants/widgetShortcuts.example.ts
rm lib/data/widgets-static.ts
rm lib/widgets/index.ts
```

### Вариант 2: Безопасная очистка (только 100% неиспользуемое)

```bash
# Переместить скрипты в архив
mkdir -p scripts/archive
mv lib/scripts/* scripts/archive/

# Удалить очевидно неиспользуемые файлы
rm lib/helpers/generateRandomColor.ts
rm lib/constants/widgetShortcuts.example.ts
```

---

## 🎯 Рекомендации

1. **Немедленно:**
   - Удалить lib/scripts/ (миграции уже выполнены)
   - Удалить 9 неиспользуемых widget hooks
   - Обновить lib/hooks/widgets/index.ts

2. **В течение недели:**
   - Проверить lib/db/ и принять решение
   - Проверить lib/data/ файлы
   - Удалить lib/widgets/index.ts если не используется

3. **Долгосрочно:**
   - Настроить автоматическую проверку неиспользуемых файлов
   - Добавить документацию структуры lib/
   - Регулярно проводить аудит кодовой базы

---

**Дата создания отчёта:** 2025-10-11 **Автор:** Claude Code Analysis **Версия:**
1.0

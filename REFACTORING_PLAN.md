# 📋 ПЛАН РЕФАКТОРИНГА: Структура виджетов

**Дата:** 12 октября 2025
**Статус:** ✅ Одобрен
**Вариант:** #3 - Split by Category

---

## 🎯 ЦЕЛЬ

Разделить огромный `widgets.ts` (2577 строк) на маленькие файлы по категориям и устранить тройное дублирование title/description.

---

## 📦 НОВАЯ СТРУКТУРА

```
lib/constants/widgets/
  ├── index.ts           ← главный экспорт + функции getWidgetById, getWidgetsByCategory
  ├── css.ts             ← CSS виджеты (~10 шт, ~350 строк)
  ├── html.ts            ← HTML виджеты (~5 шт, ~200 строк)
  ├── javascript.ts      ← JavaScript виджеты (~8 шт, ~300 строк)
  ├── text.ts            ← Текстовые виджеты (~10 шт, ~350 строк)
  ├── generators.ts      ← Генераторы (~12 шт, ~450 строк)
  ├── security.ts        ← Безопасность (~7 шт, ~250 строк)
  └── tools.ts           ← Утилиты (остальные, ~300 строк)
```

---

## 🔄 ИЗМЕНЯЕМЫЕ ФАЙЛЫ

### Создаваемые файлы (8):
1. `/lib/constants/widgets/index.ts`
2. `/lib/constants/widgets/css.ts`
3. `/lib/constants/widgets/html.ts`
4. `/lib/constants/widgets/javascript.ts`
5. `/lib/constants/widgets/text.ts`
6. `/lib/constants/widgets/generators.ts`
7. `/lib/constants/widgets/security.ts`
8. `/lib/constants/widgets/tools.ts`

### Изменяемые файлы (2):
1. `/components/widgets/WidgetHeader.tsx` - удалить WIDGET_TRANSLATIONS
2. `/components/seo/WidgetSEOWrapper.tsx` - удалить WIDGET_TRANSLATIONS

### Удаляемые файлы (1):
1. `/lib/constants/widgets.ts` - после успешной миграции

---

## 📝 ПОШАГОВЫЙ ПЛАН

### ✅ ШАГ 1: Создать структуру папки (5 мин)

```bash
mkdir -p lib/constants/widgets
cd lib/constants/widgets
touch index.ts css.ts html.ts javascript.ts text.ts generators.ts security.ts tools.ts
```

---

### ✅ ШАГ 2: Создать index.ts (15 мин)

**Содержимое:**

```typescript
// Импорты иконок (скопировать из widgets.ts)
import {
  BarChart3,
  Binary,
  Box,
  // ... все иконки
} from 'lucide-react'

// Интерфейсы
export interface WidgetFAQ {
  question: string
  answer: string
}

export interface Widget {
  id: string
  icon: React.ComponentType<{ className?: string }>
  iconName?: string
  category: 'css' | 'html' | 'javascript' | 'text' | 'generators' | 'security' | 'tools'
  translationKey: string
  path: string
  gradient: string
  title?: string
  description?: string
  useCase?: string
  recommendedTools?: string[]
  faqs?: WidgetFAQ[]
  tags?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  metaDescription?: string
}

// Импорты категорий
import { cssWidgets } from './css'
import { htmlWidgets } from './html'
import { javascriptWidgets } from './javascript'
import { textWidgets } from './text'
import { generatorWidgets } from './generators'
import { securityWidgets } from './security'
import { toolWidgets } from './tools'

// Главный массив
export const widgets: Widget[] = [
  ...cssWidgets,
  ...htmlWidgets,
  ...javascriptWidgets,
  ...textWidgets,
  ...generatorWidgets,
  ...securityWidgets,
  ...toolWidgets
]

// Утилитные функции
export const getWidgetById = (id: string): Widget | undefined => {
  return widgets.find(w => w.id === id)
}

export const getWidgetsByCategory = (
  category: Widget['category']
): Widget[] => {
  return widgets.filter(w => w.category === category)
}

export const widgetCategories = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'JavaScript',
  text: 'Текст',
  generators: 'Генераторы',
  security: 'Безопасность',
  tools: 'Утилиты'
} as const

export const getWidgetFAQs = (translationKey: string): any[] => {
  // Оставить реализацию как в оригинале
  return []
}
```

---

### ✅ ШАГ 3: Разделить виджеты по категориям (1 час)

#### Пример файла `css.ts`:

```typescript
import { Widget } from './index'
import { Ruler, Grid3X3, Layers, Palette, Spline, Box, Sparkles } from 'lucide-react'

export const cssWidgets: Widget[] = [
  {
    id: 'css-clamp-calculator',
    icon: Ruler,
    iconName: 'Ruler',
    category: 'css',
    translationKey: 'clampCalculator',
    path: 'css-clamp-calculator',
    gradient: 'from-amber-500 to-orange-500',
    title: 'CSS Clamp калькулятор',
    description: 'Создавайте адаптивную типографику и отступы, которые плавно масштабируются между размерами экрана',
    tags: ['css', 'clamp', 'calculator', 'typography'],
    // ... остальные поля
  },
  {
    id: 'flexbox-generator',
    icon: Grid3X3,
    iconName: 'Grid3X3',
    category: 'css',
    translationKey: 'flexboxGenerator',
    path: 'flexbox-generator',
    gradient: 'from-blue-500 to-cyan-500',
    title: 'CSS Flexbox генератор',
    description: 'Бесплатный онлайн генератор CSS Flexbox. Визуальный инструмент для создания и изучения CSS Flexbox макетов с кодом',
    tags: ['css', 'flexbox', 'generator', 'layout'],
    // ... остальные поля
  },
  // ... остальные CSS виджеты
]
```

#### Распределение по категориям:

**css.ts** (category === 'css'):
- css-clamp-calculator
- flexbox-generator
- grid-generator
- css-specificity
- bezier-curve
- px-rem-converter
- css-box-shadow
- css-gradient
- color-contrast
- css-keyframes
- css-minifier

**html.ts** (category === 'html'):
- html-tree
- html-xml-parser
- opengraph-validator
- svg-encoder

**javascript.ts** (category === 'javascript'):
- json-tools
- js-minifier
- js-validator
- javascript-syntax-checker
- php-syntax-checker
- mysql-syntax-checker
- json-yaml-formatter
- base64-encoder (может быть в security)

**text.ts** (category === 'text'):
- text-counter
- text-case-converter
- text-diff
- regex-tester
- special-symbols-picker
- fancy-text-generator
- emoji-list
- text-emoticons
- ascii-art-generator

**generators.ts** (category === 'generators'):
- qr-generator
- password-generator
- random-number-generator
- random-list-generator
- uuid-generator
- mock-data-generator
- favicon-generator
- coin-flip
- dice-roller
- draw-lots
- team-randomizer

**security.ts** (category === 'security'):
- base64-encoder
- jwt-decoder
- (другие security виджеты)

**tools.ts** (остальные):
- youtube-thumbnail
- color-converter
- image-size-checker
- system-info
- timer-countdown
- utm-builder
- seo-markdown-generator
- и другие

---

### ✅ ШАГ 4: Обновить title/description (встроено в Шаг 3)

**Источник актуальных данных:** `/components/widgets/WidgetHeader.tsx` (WIDGET_TRANSLATIONS)

**Примеры обновлений:**

| Widget ID | Старое (widgets.ts) | Новое (из WidgetHeader.tsx) |
|-----------|-------------------|----------------------------|
| flexbox-generator | "Генератор CSS Flexbox онлайн" | "CSS Flexbox генератор" |
| grid-generator | "Генератор CSS Grid онлайн" | "CSS Grid генератор" |
| html-tree | "HTML древо визуализатор" | "Визуализатор HTML дерева" |
| bezier-curve | "Генератор кривых Безье" | "CSS Cubic-bezier генератор" |
| qr-generator | "Генератор QR кодов онлайн - создать QR код бесплатно" | "Генератор QR-кодов" |

---

### ✅ ШАГ 5: Удалить WIDGET_TRANSLATIONS из WidgetHeader.tsx (15 мин)

**Было:**
```typescript
const WIDGET_TRANSLATIONS = {
  'qr-generator': {
    title: 'Генератор QR-кодов',
    description: '...'
  },
  // ... 300+ строк
} as const

const widgetData = WIDGET_TRANSLATIONS[widget.id as keyof typeof WIDGET_TRANSLATIONS]
const title = widgetData?.title || widget.id
```

**Стало:**
```typescript
import { getWidgetById } from '@/lib/constants/widgets'

const widget = getWidgetById(widgetId)
const title = widget?.title || widget?.id || 'Инструмент'
const description = widget?.description || 'Инструмент для веб-разработки'
```

---

### ✅ ШАГ 6: Удалить WIDGET_TRANSLATIONS из WidgetSEOWrapper.tsx (15 мин)

**Аналогично WidgetHeader.tsx:**

```typescript
// Было: локальный WIDGET_TRANSLATIONS

// Стало: используем widget напрямую
const title = widget?.title || widget.id
const description = widget?.description || 'Инструмент для веб-разработки'
```

---

### ✅ ШАГ 7: Обновить импорты по всему проекту (15 мин)

Найти все файлы, импортирующие из `@/lib/constants/widgets`:

```bash
grep -r "from '@/lib/constants/widgets'" app/ components/ lib/
```

**Хорошая новость:** Путь импорта НЕ изменится!
```typescript
// По-прежнему работает:
import { widgets, getWidgetById } from '@/lib/constants/widgets'
```

---

### ✅ ШАГ 8: Удалить старый файл (5 мин)

```bash
rm lib/constants/widgets.ts
```

**Но только после проверки!**

---

### ✅ ШАГ 9: Тестирование (30 мин)

```bash
# TypeScript проверка
yarn typecheck

# Сборка
yarn build

# Ручная проверка
# - Открыть 5 виджетов
# - Проверить title/description
# - Проверить sidebar (все виджеты на месте)
# - Проверить поиск виджетов
```

---

## ⏱️ ВРЕМЯ ВЫПОЛНЕНИЯ

| Шаг | Время |
|-----|-------|
| 1. Создать структуру | 5 мин |
| 2. Создать index.ts | 15 мин |
| 3. Разделить виджеты | 1 час |
| 4. Обновить title/description | (встроено) |
| 5. Обновить WidgetHeader | 15 мин |
| 6. Обновить WidgetSEOWrapper | 15 мин |
| 7. Обновить импорты | 15 мин |
| 8. Удалить старый файл | 5 мин |
| 9. Тестирование | 30 мин |
| **ИТОГО** | **2-3 часа** |

---

## ⚠️ РИСКИ И МИТИГАЦИЯ

| Риск | Вероятность | Митигация |
|------|-------------|-----------|
| TypeScript ошибки | Средняя | Проверять typecheck на каждом шаге |
| Потеря виджетов | Низкая | Подсчёт до/после: 52 виджета |
| Забыть обновить title | Средняя | Построчная сверка с WidgetHeader.tsx |
| Сломать импорты | Низкая | Путь не меняется |

---

## ✅ КРИТЕРИИ УСПЕХА

- [x] widgets.ts удалён, заменён на 8 файлов
- [x] Каждый файл < 400 строк
- [x] WIDGET_TRANSLATIONS удалён из WidgetHeader.tsx
- [x] WIDGET_TRANSLATIONS удалён из WidgetSEOWrapper.tsx
- [x] Один источник правды для title/description
- [x] 0 TypeScript ошибок
- [x] Успешная сборка (`yarn build`)
- [x] Все 52 виджета работают

---

## 📊 ДО и ПОСЛЕ

### ДО:
```
lib/constants/widgets.ts               2577 строк
components/widgets/WidgetHeader.tsx     +300 строк (WIDGET_TRANSLATIONS)
components/seo/WidgetSEOWrapper.tsx     +300 строк (WIDGET_TRANSLATIONS)
─────────────────────────────────────────────────
ИТОГО дублирование:                     ~900 строк
```

### ПОСЛЕ:
```
lib/constants/widgets/
  ├── index.ts           50 строк
  ├── css.ts            350 строк
  ├── html.ts           200 строк
  ├── javascript.ts     300 строк
  ├── text.ts           350 строк
  ├── generators.ts     450 строк
  ├── security.ts       250 строк
  └── tools.ts          300 строк
────────────────────────────────────
ИТОГО:                 2250 строк (без дублирования!)

components/widgets/WidgetHeader.tsx     -300 строк
components/seo/WidgetSEOWrapper.tsx     -300 строк
────────────────────────────────────
ЭКОНОМИЯ:              ~600 строк дублирования
```

---

## 🚀 НАЧАТЬ С

**Первый шаг:**
```bash
cd /Users/dmitryborisenko/Documents/frontend/goose-labs/pixeltool
mkdir -p lib/constants/widgets
```

---

**Статус:** Готов к выполнению
**Следующее действие:** Создать структуру папки

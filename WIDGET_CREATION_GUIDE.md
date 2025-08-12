# Widget Creation Guide

## Полный чеклист для добавления нового виджета

### 1. Создание основных файлов

#### 1.1 Страница виджета
- Путь: `/app/[locale]/(tools)/tools/[widget-slug]/page.tsx`
- Использовать `'use client'` директиву
- Импортировать `useTranslations` из `next-intl`
- Все тексты через `t('key')`, никаких хардкод строк

#### 1.2 Константы виджета
- Файл: `/lib/constants/widgets.ts`
- Добавить объект виджета в массив `widgets`:
```typescript
{
  id: 'widget-id',
  href: '/tools/widget-slug',
  title: { en: 'Widget Title', ru: 'Название Виджета' },
  description: { en: 'Description', ru: 'Описание' },
  icon: IconComponent,
  category: 'category-name',
  useCase: { en: 'Use case', ru: 'Применение' },
  tags: ['tag1', 'tag2'],
  metadata: { /* SEO метаданные */ },
  faq: [
    {
      question: { en: 'Question 1?', ru: 'Вопрос 1?' },
      answer: { en: 'Answer 1', ru: 'Ответ 1' }
    },
    // Минимум 5 FAQ вопросов
  ]
}
```

### 2. Переводы

#### 2.1 Файлы переводов
- `/messages/en.json`
- `/messages/ru.json`

#### 2.2 Структура переводов
```json
{
  "widgets": {
    "widgetId": {
      "title": "Widget Title",
      "description": "Widget description",
      "useCase": "Use case description",
      // Все ключи из компонента
      "placeholder": "Enter value",
      "button": "Calculate",
      "result": "Result",
      // и т.д.
    }
  }
}
```

#### 2.3 Обязательные переводы
- `title` - заголовок виджета
- `description` - описание виджета
- `useCase` - сценарий использования
- Все UI элементы (кнопки, плейсхолдеры, лейблы)
- Сообщения об ошибках
- Результаты вычислений

### 3. SEO оптимизация

#### 3.1 Метаданные страницы
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const metadata = widgetMetadata['widget-id']?.[locale as 'en' | 'ru']
  
  return {
    title: metadata?.title || 'Default Title',
    description: metadata?.description || 'Default description',
    keywords: metadata?.keywords?.join(', '),
    // ...
  }
}
```

#### 3.2 SEO метаданные в widget-metadata.ts
```typescript
'widget-id': {
  en: {
    title: 'Widget Title - Action Description | Tool Type',
    description: 'Comprehensive description with keywords. What it does, how it helps.',
    keywords: ['keyword1', 'keyword2', 'related terms']
  },
  ru: {
    title: 'Название Виджета - Описание Действия | Тип Инструмента',
    description: 'Подробное описание с ключевыми словами. Что делает, как помогает.',
    keywords: ['ключевое1', 'ключевое2', 'связанные термины']
  }
}
```

### 4. FAQ секция

#### 4.1 Требования к FAQ
- Минимум 5 вопросов и ответов
- Вопросы должны покрывать:
  - Что делает инструмент
  - Как им пользоваться
  - Технические детали
  - Распространенные проблемы
  - Преимущества использования

#### 4.2 Добавление FAQ в компонент
```tsx
{widgetId && <WidgetFAQ widgetId={widgetId} />}
```

### 5. Компоненты и стилизация

#### 5.1 Обязательные импорты
```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
```

#### 5.2 Структура компонента
```tsx
<Card className="relative z-10">
  <CardHeader>
    <CardTitle>{t('title')}</CardTitle>
    <CardDescription>{t('description')}</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Форма/контент */}
  </CardContent>
</Card>
```

### 6. Проверка перед коммитом

#### 6.1 Чеклист
- [ ] Все строки переведены (нет хардкода)
- [ ] FAQ содержит минимум 5 вопросов
- [ ] SEO метаданные заполнены для en и ru
- [ ] Виджет добавлен в widgets.ts
- [ ] Проверен функционал в обеих локалях
- [ ] Добавлены все необходимые переводы в messages
- [ ] Использованы семантичные HTML теги
- [ ] Добавлена обработка ошибок

#### 6.2 Команды проверки
```bash
npm run lint
npm run build
```

### 7. Частые ошибки

1. **Забыли перевод useCase** - добавить в messages файлы
2. **Хардкод текста** - всё через t() функцию
3. **Мало FAQ** - минимум 5 вопросов
4. **Нет SEO метаданных** - добавить в widget-metadata.ts
5. **Неправильная категория** - проверить существующие категории
6. **Забыли иконку** - импортировать из lucide-react

### 8. Примеры хороших виджетов

Используйте как образец:
- `/app/[locale]/(tools)/tools/css-clamp-calculator/page.tsx`
- `/app/[locale]/(tools)/tools/password-generator/page.tsx`
- `/app/[locale]/(tools)/tools/percentage-calculator/page.tsx`

### 9. Дополнительные возможности

- **Аналитика**: Виджет автоматически отслеживается
- **Статистика**: Отображается в правом сайдбаре
- **Поиск**: Виджет автоматически индексируется для поиска
- **Structured Data**: Добавляется автоматически через WidgetSEOWrapper

### 10. Команда для нового виджета

При создании нового виджета следуй этому порядку:
1. Создай страницу компонента
2. Добавь в widgets.ts с полным описанием и FAQ
3. Добавь переводы в messages (en.json, ru.json)
4. Добавь SEO метаданные в widget-metadata.ts
5. Протестируй в обеих локалях
6. Запусти lint и build для проверки
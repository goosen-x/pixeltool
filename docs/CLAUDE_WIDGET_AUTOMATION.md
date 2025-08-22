# Claude Widget Automation System

## 🤖 Автоматизированное создание виджетов для Claude Code

Эта система позволяет Claude автоматически создавать виджеты без ошибок, которые
возникали при ручном создании.

## 📋 Доступные команды

### 1. `npm run claude-widget` - Автоматическое создание виджета

**Использование:**

```bash
npm run claude-widget -- --name "Widget Name" --description "Description" --category webdev --icon Globe --tags "tag1,tag2"
```

**Параметры:**

- `--name` (обязательно) - Название виджета
- `--description` (обязательно) - Описание виджета
- `--category` (обязательно) - Категория виджета
- `--icon` (обязательно) - Иконка из Lucide React
- `--tags` (опционально) - Теги через запятую

### 2. `npm run create-widget-improved` - Интерактивное создание

Улучшенная версия с валидацией и пошаговым созданием.

### 3. `npm run create-widget` - Оригинальная версия

Базовая версия без улучшений.

## 🎯 Доступные категории

- `webdev` - Веб-разработка
- `business` - Бизнес и финансы
- `content` - Создание контента
- `security` - Безопасность и приватность
- `multimedia` - Мультимедиа
- `analytics` - Аналитика и данные
- `lifestyle` - Здоровье и образ жизни

## 🎨 Доступные иконки (Lucide React)

**Популярные иконки:**

- `Globe` - Интернет, сайты
- `Key` - Пароли, безопасность
- `Lock` - Безопасность, шифрование
- `Shield` - Защита, безопасность
- `Search` - Поиск, валидация
- `Calculator` - Вычисления
- `Code` - Программирование
- `Palette` - Дизайн, цвета
- `FileText` - Текст, документы
- `Image` - Изображения
- `Settings` - Настройки
- `Zap` - Быстрые операции
- `Sparkles` - Генерация, магия
- `Target` - Точность, цели
- `Wrench` - Инструменты

**И множество других:** `Camera`, `Music`, `Video`, `Mail`, `Phone`, `Clock`,
`Calendar`, `Map`, `User`, `Heart`, `Star`, `Share`, `Download`, `Upload`,
`Save`, `Edit`, `Copy`, etc.

## 🚀 Примеры использования для Claude

### Пример 1: QR Code Generator

```bash
npm run claude-widget -- --name "QR Code Generator" --description "Generate QR codes for text, URLs, and data" --category generator --icon "QrCode" --tags "qr,code,generator,url"
```

### Пример 2: Password Strength Checker

```bash
npm run claude-widget -- --name "Password Strength Checker" --description "Check password strength and security" --category security --icon "Shield" --tags "password,security,strength,checker"
```

### Пример 3: Color Palette Generator

```bash
npm run claude-widget -- --name "Color Palette Generator" --description "Generate beautiful color palettes for design" --category content --icon "Palette" --tags "color,palette,design,generator"
```

### Пример 4: JSON Validator

```bash
npm run claude-widget -- --name "JSON Validator" --description "Validate and format JSON data" --category webdev --icon "FileText" --tags "json,validator,format,syntax"
```

## ✅ Что автоматически делает система

1. **Создаёт файл виджета** из шаблона с правильными заменами
2. **Добавляет в widgets.ts** с правильным импортом иконки
3. **Добавляет переводы** в правильное место (`widgets` секция) в EN и RU файлах
4. **Генерирует TypeScript типы** автоматически
5. **Проверяет TypeScript** на ошибки
6. **Валидирует** категории и иконки
7. **Не добавляет заголовки** - WidgetContainer уже предоставляет заголовок и
   описание

## 🛡️ Защита от ошибок

- ✅ Проверяет существование иконок в Lucide React
- ✅ Валидирует категории
- ✅ Не перезаписывает существующие виджеты
- ✅ Добавляет переводы в правильную секцию JSON
- ✅ Автоматически форматирует код
- ✅ Генерирует типы после создания
- ✅ **НЕ ДОБАВЛЯЕТ ЗАГОЛОВКИ** - виджеты должны занимать полную ширину без
  дублирования h1/h2/h3

## 📝 Инструкция для Claude

**Когда пользователь просит создать виджет:**

1. Используйте команду `npm run claude-widget` вместо ручного создания
2. Передайте все параметры через аргументы командной строки
3. Система автоматически создаст всё корректно
4. После создания можете сразу редактировать логику виджета

**Пример для Claude:**

```bash
# Пользователь: "создай виджет password generator"
npm run claude-widget -- --name "Password Generator" --description "Generate secure passwords with custom options" --category security --icon "Key" --tags "password,generator,security,random"
```

**⚠️ ВАЖНО ДЛЯ CLAUDE:**

- **НЕ ДОБАВЛЯЙТЕ заголовки** (h1, h2, h3) на верхнем уровне виджета - layout
  уже отображает WidgetHeader
- **НЕ ИСПОЛЬЗУЙТЕ WidgetContainer** - он дублирует заголовки из layout
- Виджет должен возвращать только контент, обёрнутый в
  `<div className="space-y-6">`
- Начинайте сразу с основного контента виджета
- Заголовки h3 внутри секций (например, для результатов) использовать МОЖНО

## 🔧 Устранение неполадок

### Если возникла ошибка "Icon not found"

Проверьте список доступных иконок в этом документе или используйте одну из
популярных.

### Если переводы не находятся

Система автоматически добавляет их в `widgets` секцию. Проверьте, что не
используете старые ключи переводов.

### Если TypeScript ошибки

Система автоматически проверяет типы. Если есть ошибки, они будут показаны в
выводе команды.

## 🎯 Преимущества автоматизации

- **Нет ошибок с переводами** - автоматически добавляются в правильное место
- **Нет ошибок с иконками** - проверяется существование в Lucide React
- **Нет ошибок с компонентами** - правильная передача JSX элементов
- **Быстрое создание** - одна команда вместо множества файлов
- **Консистентность** - все виджеты следуют одному паттерну
- **Правильная структура** - виджеты не дублируют заголовки, используют полную
  ширину

Используйте эту систему для быстрого и надёжного создания виджетов! 🚀

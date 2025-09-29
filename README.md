# PixelTool.pro

Коллекция полезных онлайн-инструментов и виджетов для разработчиков и дизайнеров.

![screen-gif](/public/images/readme.gif)

## 🌟 Особенности

- Более 40 полезных инструментов и калькуляторов
- Адаптивный дизайн для всех устройств
- Темная и светлая темы
- Быстрая производительность с Next.js 15
- Горячие клавиши для быстрого доступа
- Избранные инструменты
- 3D анимации и интерактивные элементы

## 🛠 Технологический стек

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Three.js / React Three Fiber
- Docker для развертывания
- PostgreSQL (Supabase)

## 🚀 Быстрый старт

### Требования

- Node.js (v20 или выше)
- Yarn

### Установка

1. Клонировать репозиторий:

   ```
   git clone https://github.com/goosen-x/pixeltool
   cd pixeltool
   ```

2. Установить зависимости:

   ```
   yarn install
   ```

3. Создать файл `.env.local` из примера:

   ```
   cp .env.example .env.local
   ```

   И заполнить необходимые переменные окружения.

### Запуск в режиме разработки

```
yarn dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📁 Структура проекта

- `app/`: Next.js App Router страницы
  - `(main)/`: Главная страница
  - `(tools)/`: Страницы инструментов
  - `(other)/`: Блог, контакты и др.
- `components/`: React компоненты
  - `widgets/`: Базовые компоненты виджетов
  - `ui/`: UI компоненты (shadcn/ui)
  - `global/`: Глобальные компоненты
- `lib/`: Утилиты и хуки
  - `db/`: Работа с базой данных
  - `hooks/`: Пользовательские React хуки
  - `utils/`: Вспомогательные функции
- `public/`: Статические файлы

## 🚢 Развертывание

### Docker (рекомендуется)

```bash
# Сборка образа
docker build -t pixeltool .

# Запуск контейнера
docker run -p 3000:3000 --env-file .env.production pixeltool
```

### GitHub Actions CI/CD

Проект настроен на автоматическое развертывание через GitHub Actions.
См. `.github/workflows/deploy.yml` для деталей.

### Production сборка

```bash
yarn build
yarn start
```

## 📚 Документация

Полная документация проекта организована в папке `/docs`:
- [Обзор документации](docs/README.md) - Структурированный каталог всей документации
- [CLAUDE.md](CLAUDE.md) - Основные инструкции для работы с Claude Code
- [Создание виджетов](docs/guides/WIDGET_CREATION_GUIDE.md) - Руководство по созданию новых инструментов

## 🎯 Основные команды

```bash
# Разработка
yarn dev                 # Запуск сервера разработки
yarn build               # Production сборка
yarn lint                # Проверка ESLint
yarn typecheck           # Проверка TypeScript
yarn clean               # Очистка кеша

# Проверка качества
yarn check:all           # Все проверки
yarn format              # Форматирование кода

# База данных
yarn tsx lib/scripts/migrate-posts.ts     # Миграция постов
yarn tsx lib/scripts/check-supabase.ts    # Проверка подключения
```

## 🤝 Участие в разработке

Открыт для предложений и улучшений. Не стесняйтесь создавать issues или pull requests.

## 📞 Контакты

Дмитрий Борисенко -
[dmitryborisenko.msk@gmail.com](mailto:dmitryborisenko.msk@gmail.com)

Проект: [https://www.pixeltool.pro](https://www.pixeltool.pro)

---

Спасибо за интерес к проекту!

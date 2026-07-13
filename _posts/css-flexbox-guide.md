---
title: 'CSS Flexbox: полное руководство с практическими примерами'
excerpt:
  'Подробное руководство по раскладке CSS Flexbox. Разбираемся с
  флекс-контейнерами, флекс-элементами, выравниванием и реальными сценариями
  применения на примерах кода.'
coverImage: '/images/blog/css-flexbox-guide.png'
date: '2025-06-24T10:00:00.000Z'
author:
  name: Дмитрий Борисенко
  picture: '/images/avatar.jpeg'
ogImage:
  url: '/images/blog/css-flexbox-guide.png'
related:
  - css-grid-layout
  - css-container-queries
  - css-clamp-complete-guide
---

Flexbox (Flexible Box Layout) — это одномерный способ раскладки, который отлично
справляется с распределением пространства и выравниванием элементов внутри
контейнера. Он идеально подходит для вёрстки компонентов, навигационных панелей
и любых ситуаций, где нужны гибкие, адаптивные расположения.

## Основы флекс-контейнера

Чтобы создать флекс-контейнер, задайте `display: flex`:

```css
.container {
	display: flex;
	/* or display: inline-flex; for inline containers */
}
```

## Основная и поперечная ось

Понимание осей — ключ к работе с Flexbox:

```css
.container {
	display: flex;
	flex-direction: row; /* Main axis: horizontal, Cross axis: vertical */
	/* Other values: row-reverse, column, column-reverse */
}
```

Не держите все свойства в голове: соберите раскладку визуально и заберите
готовый CSS.

/tools/flexbox-generator

## Свойства флекс-контейнера

### 1. justify-content (выравнивание по основной оси)

```css
.container {
	display: flex;
	justify-content: flex-start; /* Default */
	/* Other values: flex-end, center, space-between, space-around, space-evenly */
}

/* Practical example: Navigation */
.nav {
	display: flex;
	justify-content: space-between;
	padding: 1rem;
	background: #2c3e50;
}

.nav-logo {
	font-weight: bold;
	color: white;
}

.nav-links {
	display: flex;
	gap: 2rem;
	list-style: none;
}
```

### 2. align-items (выравнивание по поперечной оси)

```css
.container {
	display: flex;
	align-items: stretch; /* Default */
	/* Other values: flex-start, flex-end, center, baseline */
}

/* Practical example: Card with icon */
.card {
	display: flex;
	align-items: center;
	padding: 1rem;
	background: white;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-icon {
	width: 48px;
	height: 48px;
	margin-right: 1rem;
}
```

### 3. flex-wrap

```css
.container {
	display: flex;
	flex-wrap: nowrap; /* Default */
	/* Other values: wrap, wrap-reverse */
}

/* Practical example: Tag list */
.tag-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.tag {
	padding: 0.25rem 0.75rem;
	background: #3498db;
	color: white;
	border-radius: 20px;
	font-size: 0.875rem;
}
```

### 4. align-content (поперечное выравнивание нескольких строк)

```css
.container {
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	/* Other values: flex-end, center, space-between, space-around, stretch */
	height: 300px;
}
```

### 5. gap (расстояние между элементами)

```css
.container {
	display: flex;
	gap: 20px; /* Both row and column gap */
	/* Or separately: row-gap: 10px; column-gap: 20px; */
}
```

## Свойства флекс-элементов

### 1. flex-grow, flex-shrink, flex-basis

Три свойства управляют тем, как элемент делит место:

```css
.item {
	flex-grow: 0; /* насколько растёт, если место осталось */
	flex-shrink: 1; /* насколько сжимается, если места не хватает */
	flex-basis: auto; /* с какого размера начинает */
}
```

Это значения по умолчанию — короткая запись `flex: 0 1 auto`. Элемент не растёт,
но сжимается, а стартует от размера своего содержимого.

### flex: 1 или flex: auto — в чём разница

Вот вопрос, ради которого сюда чаще всего и приходят: «почему мои колонки
получились разной ширины?» Ответ прячется в `flex-basis`.

```css
/* Колонки строго одинаковые, что бы в них ни лежало */
.item {
	flex: 1;
} /* = flex: 1 1 0   — basis НОЛЬ */

/* Колонки стартуют от содержимого, делится только остаток */
.item {
	flex: auto;
} /* = flex: 1 1 auto — basis AUTO */
```

`flex: 1` обнуляет базовый размер: браузер считает, что элементы занимают ноль,
и делит между ними всё место поровну. Колонки выходят равными, даже если в одной
слово, а в другой абзац.

`flex: auto` оставляет базовым размером содержимое: сначала каждый элемент берёт
своё, и только остаток делится поровну. Колонка с длинным текстом окажется шире.

Главная ловушка: **`flex: <число>` всегда обнуляет basis**. Написав `flex: 1`,
вы молча получаете `flex-basis: 0`, а не `auto`.

И ещё: `flex-basis` работает по главной оси. При `flex-direction: column` это
высота, а не ширина.

```css
/* Practical example: Sidebar layout */
.layout {
	display: flex;
	gap: 2rem;
	min-height: 100dvh;
}

.sidebar {
	flex: 0 0 250px; /* Don't grow or shrink, fixed 250px */
	background: #ecf0f1;
	padding: 1rem;
}

.main-content {
	flex: 1; /* Take remaining space */
	padding: 1rem;
}
```

### 2. align-self (индивидуальное выравнивание по поперечной оси)

```css
.item {
	align-self: auto; /* Default - uses align-items value */
	/* Other values: flex-start, flex-end, center, baseline, stretch */
}

/* Practical example: Hero section */
.hero {
	display: flex;
	align-items: center;
	min-height: 400px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-content {
	flex: 1;
	padding: 2rem;
	color: white;
}

.hero-image {
	flex: 1;
	align-self: stretch;
	object-fit: cover;
}
```

### 3. order (визуальный порядок)

**Предупреждение, о котором обычно молчат:** `order` меняет только картинку.
Порядок в DOM остаётся прежним, а значит прежним остаётся и порядок обхода по
Tab, и порядок чтения скринридером.

Человек с клавиатурой увидит фокус, прыгающий по экрану хаотично: визуально
элементы идут слева направо, а фокус — в исходном порядке разметки. То же
касается `row-reverse` и `column-reverse`.

Вывод простой: `order` годится для декоративной перестановки, но если порядок
важен по смыслу — меняйте разметку, а не CSS.

```css
.item {
	order: 0; /* по умолчанию */
	/* отрицательные значения идут первыми, положительные — последними */
}

/* Practical example: Mobile-first layout */
.article {
	display: flex;
	flex-direction: column;
}

.article-content {
	order: 2;
}
.article-sidebar {
	order: 1;
}
.article-related {
	order: 3;
}

@media (min-width: 768px) {
	.article {
		flex-direction: row;
	}

	.article-content {
		order: 1;
		flex: 2;
	}
	.article-sidebar {
		order: 2;
		flex: 1;
	}
	.article-related {
		order: 3;
		flex: 1;
	}
}
```

## Распространённые паттерны Flexbox

### 1. Центрирование содержимого

```css
/* Perfect centering */
.center-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100dvh;
}

/* Horizontal centering only */
.h-center {
	display: flex;
	justify-content: center;
}

/* Vertical centering only */
.v-center {
	display: flex;
	align-items: center;
}
```

### 2. Колонки одинаковой высоты

```css
.columns {
	display: flex;
	gap: 2rem;
}

.column {
	flex: 1;
	padding: 1.5rem;
	background: #f8f9fa;
	border-radius: 8px;
	/* All columns will have equal height automatically */
}
```

### 3. Прижатый к низу футер

```css
body {
	display: flex;
	flex-direction: column;
	min-height: 100dvh;
	margin: 0;
}

main {
	flex: 1; /* Takes all available space */
}

footer {
	background: #2c3e50;
	color: white;
	padding: 2rem;
	/* Always sticks to bottom */
}
```

### 4. Медиа-объект

```css
.media {
	display: flex;
	align-items: flex-start;
	gap: 1rem;
}

.media-image {
	flex-shrink: 0;
	width: 100px;
	height: 100px;
	object-fit: cover;
	border-radius: 8px;
}

.media-content {
	flex: 1;
}
```

### 5. Адаптивная навигация

```css
.navbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 2rem;
	background: #2c3e50;
}

.nav-menu {
	display: flex;
	gap: 2rem;
	list-style: none;
	margin: 0;
	padding: 0;
}

.nav-item a {
	color: white;
	text-decoration: none;
	transition: opacity 0.3s;
}

.nav-item a:hover {
	opacity: 0.8;
}

/* Mobile menu */
@media (max-width: 768px) {
	.nav-menu {
		position: fixed;
		left: -100%;
		top: 70px;
		flex-direction: column;
		background-color: #2c3e50;
		width: 100%;
		text-align: center;
		transition: 0.3s;
		padding: 2rem 0;
	}

	.nav-menu.active {
		left: 0;
	}
}
```

### 6. Сетка карточек на Flexbox

```css
.card-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 1.5rem;
	padding: 2rem;
}

.card {
	flex: 1 1 300px; /* базовый размер 300px — это НЕ минимум: элемент сожмётся */
	display: flex;
	flex-direction: column;
	background: white;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s;
}

.card:hover {
	transform: translateY(-4px);
}

.card-image {
	height: 200px;
	object-fit: cover;
}

.card-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 1.5rem;
}

.card-title {
	margin: 0 0 0.5rem;
	font-size: 1.25rem;
}

.card-description {
	flex: 1;
	color: #666;
	line-height: 1.6;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 1rem;
	padding-top: 1rem;
	border-top: 1px solid #eee;
}
```

## Flexbox или Grid

Используйте Flexbox, когда:

- работаете с одномерными раскладками;
- размер содержимого должен определять раскладку;
- нужно выравнивание и распределение пространства;
- строите навигационные панели, тулбары или небольшие компоненты.

Используйте [Grid](/blog/css-grid-layout), когда:

- работаете с двумерными раскладками;
- нужен точный контроль над строками и колонками;
- строите сложные макеты страниц;
- хотите накладывать элементы друг на друга.

## Главная ловушка: элемент не сжимается

Классическая ситуация: во флекс-контейнере лежит блок с длинным текстом — и он
разносит всю раскладку, вылезая за края.

Причина неочевидна. У флекс-элемента по умолчанию `min-width: auto`, то есть он
**не может стать уже своего содержимого**. Длинное слово, неразрывная строка или
блок с `overflow: hidden` внутри — и элемент упирается, растягивая контейнер.

```css
/* Лечение: разрешаем элементу сжиматься */
.item {
	min-width: 0;
}

/* Для колонки — то же самое по вертикали */
.item {
	min-height: 0;
}
```

Это ответ на большинство вопросов вида «почему у меня flexbox уехал».

## Поддержка браузерами

Flexbox работает везде с 2015 года. Вендорные префиксы (`-webkit-box`,
`-ms-flexbox`) относятся к IE10 и Safari 6 — писать их руками в 2026-м не нужно,
а если бы и было нужно, это работа Autoprefixer, а не ваша.

Flexbox стал незаменимым инструментом современной веб-разработки. Освойте эти
концепции — и вы сможете с лёгкостью создавать гибкие адаптивные раскладки!

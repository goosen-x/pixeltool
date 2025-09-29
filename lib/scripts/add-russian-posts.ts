import { config } from 'dotenv'
import path from 'path'

// Load environment variables FIRST
config({ path: path.join(process.cwd(), '.env.local') })

// Russian translations of existing posts
const russianPosts = [
	{
		slug: 'css-animations',
		title: 'CSS Анимации: От Основ до Продвинутых Техник',
		excerpt:
			'Узнайте, как создавать потрясающие анимации с помощью CSS. От простых переходов до сложных keyframe анимаций, оптимизации производительности и реальных примеров.',
		content: `# CSS Анимации: От Основ до Продвинутых Техник

CSS анимации оживляют веб-интерфейсы, создавая захватывающий пользовательский опыт без JavaScript. Это руководство охватывает всё от базовых переходов до продвинутых техник анимации.

## CSS Transitions (Переходы)

Переходы — это простейшая форма CSS анимации, идеальная для эффектов при наведении и изменении состояний.

### Базовый синтаксис переходов

\`\`\`css
.button {
  background: #3498db;
  color: white;
  padding: 10px 20px;
  transition: background 0.3s ease;
}

.button:hover {
  background: #2980b9;
}
\`\`\`

### Множественные переходы

\`\`\`css
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
\`\`\`

## Keyframe Анимации

Для более сложных анимаций используйте @keyframes:

\`\`\`css
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.pulse-button {
  animation: pulse 2s infinite;
}
\`\`\`

## Оптимизация производительности

1. **Используйте transform и opacity** — они оптимизированы браузером
2. **Избегайте анимации layout свойств** (width, height, padding)
3. **Используйте will-change** для подготовки браузера к анимации

\`\`\`css
.animated-element {
  will-change: transform;
}
\`\`\`

## Практические примеры

### Анимация загрузки

\`\`\`css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loader {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
\`\`\`

CSS анимации — мощный инструмент для создания интерактивных и привлекательных веб-интерфейсов!`
	},
	{
		slug: 'css-container-queries',
		title: 'CSS Container Queries: Будущее Адаптивных Компонентов',
		excerpt:
			'Узнайте, как CSS Container Queries позволяют создавать по-настоящему адаптивные компоненты, которые реагируют на размер своего контейнера, а не viewport.',
		content: `# CSS Container Queries: Будущее Адаптивных Компонентов

CSS Container Queries революционизируют способ создания адаптивных компонентов, позволяя стилям реагировать на размер контейнера, а не только viewport.

## Что такое Container Queries?

Container Queries позволяют применять стили на основе размера родительского контейнера компонента, а не размера окна браузера.

### Базовый синтаксис

\`\`\`css
/* Определяем контейнер */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Используем container query */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
\`\`\`

## Преимущества над Media Queries

1. **Компонентная независимость** — компоненты адаптируются к своему контейнеру
2. **Переиспользуемость** — один компонент работает в разных контекстах
3. **Более точный контроль** — стили основаны на реальном доступном пространстве

## Практические примеры

### Адаптивная карточка

\`\`\`css
.product-card {
  container-type: inline-size;
}

.product-content {
  padding: 1rem;
}

/* Компактный вид для маленьких контейнеров */
@container (max-width: 300px) {
  .product-content {
    font-size: 0.875rem;
  }

  .product-image {
    height: 150px;
  }
}

/* Расширенный вид для больших контейнеров */
@container (min-width: 500px) {
  .product-content {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 2rem;
  }
}
\`\`\`

## Единицы измерения Container Query

\`\`\`css
/* cqw - 1% от ширины контейнера */
/* cqh - 1% от высоты контейнера */
/* cqi - 1% от inline размера */
/* cqb - 1% от block размера */

.responsive-text {
  font-size: clamp(1rem, 5cqi, 2rem);
}
\`\`\`

Container Queries — это будущее компонентной архитектуры в CSS!`
	},
	{
		slug: 'css-flexbox-guide',
		title: 'CSS Flexbox: Полное Руководство с Практическими Примерами',
		excerpt:
			'Исчерпывающее руководство по CSS Flexbox. Изучите flex контейнеры, элементы, выравнивание и создавайте адаптивные макеты с лёгкостью.',
		content: `# CSS Flexbox: Полное Руководство с Практическими Примерами

Flexbox — это мощная система компоновки, которая делает создание гибких и адаптивных макетов простым и интуитивным.

## Основы Flexbox

### Создание Flex контейнера

\`\`\`css
.container {
  display: flex;
}
\`\`\`

### Основные свойства контейнера

\`\`\`css
.flex-container {
  display: flex;
  flex-direction: row; /* row | column | row-reverse | column-reverse */
  flex-wrap: wrap; /* nowrap | wrap | wrap-reverse */
  justify-content: space-between; /* flex-start | center | space-around | space-evenly */
  align-items: center; /* stretch | flex-start | flex-end | baseline */
  gap: 1rem; /* Расстояние между элементами */
}
\`\`\`

## Свойства Flex элементов

### Управление размером

\`\`\`css
.flex-item {
  flex-grow: 1; /* Фактор роста */
  flex-shrink: 1; /* Фактор сжатия */
  flex-basis: 200px; /* Базовый размер */

  /* Сокращённая запись */
  flex: 1 1 200px;
}
\`\`\`

### Индивидуальное выравнивание

\`\`\`css
.special-item {
  align-self: flex-start; /* Переопределяет align-items родителя */
}
\`\`\`

## Практические примеры

### Адаптивная навигация

\`\`\`css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.nav-logo {
  flex-shrink: 0;
}

.nav-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
  }
}
\`\`\`

### Карточки одинаковой высоты

\`\`\`css
.cards-container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.card {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
}

.card-content {
  flex-grow: 1; /* Заполняет доступное пространство */
}

.card-footer {
  margin-top: auto; /* Прижимается к низу */
}
\`\`\`

## Продвинутые техники

### Центрирование элементов

\`\`\`css
/* Идеальное центрирование */
.center-perfect {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
\`\`\`

### Holy Grail Layout

\`\`\`css
.holy-grail {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.holy-grail-body {
  display: flex;
  flex: 1;
}

.sidebar {
  flex: 0 0 200px;
}

.main-content {
  flex: 1;
}

@media (max-width: 768px) {
  .holy-grail-body {
    flex-direction: column;
  }

  .sidebar {
    flex-basis: auto;
  }
}
\`\`\`

Flexbox — незаменимый инструмент для современной веб-разработки!`
	},
	{
		slug: 'css-grid-layout',
		title: 'CSS Grid Layout: Полное Руководство с Примерами',
		excerpt:
			'Освойте CSS Grid Layout с практическими примерами. Узнайте, как создавать сложные двумерные макеты с помощью grid контейнеров, линий и областей.',
		content: `# CSS Grid Layout: Полное Руководство с Примерами

CSS Grid — это двумерная система компоновки, которая революционизировала способ создания макетов веб-страниц.

## Основы Grid

### Создание Grid контейнера

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}
\`\`\`

### Единицы измерения Grid

\`\`\`css
.grid {
  /* fr - фракционная единица */
  grid-template-columns: 1fr 2fr 1fr;

  /* Фиксированные и гибкие размеры */
  grid-template-columns: 200px 1fr 200px;

  /* Функция repeat() */
  grid-template-columns: repeat(3, 1fr);

  /* minmax() для адаптивности */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
\`\`\`

## Размещение элементов

### По номерам линий

\`\`\`css
.grid-item {
  grid-column: 1 / 3; /* От линии 1 до линии 3 */
  grid-row: 2 / 4;
}

/* Сокращённая запись */
.item {
  grid-area: 2 / 1 / 4 / 3; /* row-start / col-start / row-end / col-end */
}
\`\`\`

### Именованные области

\`\`\`css
.page-layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
\`\`\`

## Практические примеры

### Адаптивная галерея

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.gallery-item {
  aspect-ratio: 1;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
\`\`\`

### Сложный макет журнала

\`\`\`css
.magazine-layout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.featured-article {
  grid-column: span 2;
  grid-row: span 2;
}

.regular-article {
  grid-column: span 1;
}

@media (max-width: 768px) {
  .magazine-layout {
    grid-template-columns: 1fr;
  }

  .featured-article {
    grid-column: span 1;
    grid-row: span 1;
  }
}
\`\`\`

## Продвинутые техники

### Выравнивание в Grid

\`\`\`css
.grid-container {
  display: grid;

  /* Выравнивание всех элементов */
  justify-items: center; /* По горизонтали */
  align-items: center; /* По вертикали */

  /* Выравнивание самого grid */
  justify-content: center;
  align-content: center;
}

/* Индивидуальное выравнивание */
.grid-item {
  justify-self: end;
  align-self: start;
}
\`\`\`

### Наложение элементов

\`\`\`css
.overlapping-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.background-element {
  grid-column: 1 / -1;
  grid-row: 1;
  z-index: 0;
}

.foreground-element {
  grid-column: 2 / 3;
  grid-row: 1;
  z-index: 1;
}
\`\`\`

CSS Grid — мощнейший инструмент для создания любых макетов!`
	},
	{
		slug: 'css-pseudo-selectors',
		title:
			'CSS Псевдо-классы и Псевдо-элементы: Мастерство Продвинутых Селекторов',
		excerpt:
			'Глубокое погружение в CSS псевдо-классы и псевдо-элементы. Изучите :hover, :focus, ::before, ::after и продвинутые селекторы для создания интерактивных интерфейсов.',
		content: `# CSS Псевдо-классы и Псевдо-элементы: Мастерство Продвинутых Селекторов

Псевдо-классы и псевдо-элементы расширяют возможности CSS, позволяя стилизовать элементы на основе их состояния и создавать дополнительный контент.

## Псевдо-классы

### Состояния взаимодействия

\`\`\`css
/* Основные состояния */
a:hover { color: #3498db; }
button:active { transform: scale(0.95); }
input:focus { outline: 2px solid #3498db; }

/* Группировка состояний */
button:hover,
button:focus {
  background: #2980b9;
}

/* Focus-visible для доступности */
button:focus-visible {
  outline: 3px solid orange;
}
\`\`\`

### Структурные псевдо-классы

\`\`\`css
/* Выбор по позиции */
li:first-child { font-weight: bold; }
li:last-child { margin-bottom: 0; }
li:nth-child(odd) { background: #f5f5f5; }
li:nth-child(3n) { color: red; }

/* Выбор по типу */
p:first-of-type { font-size: 1.2em; }
h2:last-of-type { margin-bottom: 2rem; }

/* Единственный элемент */
li:only-child { list-style: none; }
\`\`\`

### Логические псевдо-классы

\`\`\`css
/* :not() селектор */
input:not([type="submit"]) {
  border: 1px solid #ddd;
}

/* :is() для группировки */
:is(h1, h2, h3):hover {
  color: #3498db;
}

/* :where() с нулевой специфичностью */
:where(article, section) h2 {
  margin-top: 2rem;
}

/* :has() - родительский селектор */
.card:has(img) {
  display: grid;
  grid-template-columns: 200px 1fr;
}
\`\`\`

## Псевдо-элементы

### ::before и ::after

\`\`\`css
/* Декоративные элементы */
.quote::before {
  content: """;
  font-size: 3em;
  color: #ccc;
}

/* Иконки через CSS */
.external-link::after {
  content: " ↗";
  font-size: 0.8em;
}

/* Очистка float */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
\`\`\`

### Стилизация текста

\`\`\`css
/* Первая буква */
p::first-letter {
  font-size: 3em;
  float: left;
  line-height: 1;
  margin-right: 0.1em;
}

/* Первая строка */
p::first-line {
  font-weight: bold;
  color: #333;
}

/* Выделение текста */
::selection {
  background: #3498db;
  color: white;
}
\`\`\`

## Продвинутые техники

### Анимированные подчёркивания

\`\`\`css
.animated-link {
  position: relative;
  text-decoration: none;
}

.animated-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #3498db;
  transition: width 0.3s ease;
}

.animated-link:hover::after {
  width: 100%;
}
\`\`\`

### Tooltip через CSS

\`\`\`css
.tooltip {
  position: relative;
}

.tooltip::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  background: #333;
  color: white;
  border-radius: 4px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.tooltip:hover::before {
  opacity: 1;
}
\`\`\`

### Счётчики CSS

\`\`\`css
.numbered-list {
  counter-reset: item;
}

.numbered-list li::before {
  counter-increment: item;
  content: counter(item) ". ";
  font-weight: bold;
  color: #3498db;
}
\`\`\`

Псевдо-классы и псевдо-элементы — ключ к созданию интерактивных и красивых интерфейсов!`
	},
	{
		slug: 'css-variables',
		title: 'CSS Переменные (Custom Properties): Динамическая Стилизация',
		excerpt:
			'Освойте CSS custom properties для динамической и поддерживаемой стилизации. Изучите область видимости, наследование, резервные значения и интеграцию с JavaScript.',
		content: `# CSS Переменные (Custom Properties): Динамическая Стилизация

CSS переменные (custom properties) привносят динамичность в CSS, позволяя создавать гибкие и легко настраиваемые стили.

## Основы CSS переменных

### Объявление и использование

\`\`\`css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --spacing-unit: 1rem;
  --border-radius: 4px;
}

.button {
  background: var(--primary-color);
  padding: var(--spacing-unit);
  border-radius: var(--border-radius);
}
\`\`\`

### Резервные значения

\`\`\`css
.element {
  /* Резервное значение, если переменная не определена */
  color: var(--text-color, #333);

  /* Множественные резервы */
  background: var(--bg-color, var(--fallback-bg, white));
}
\`\`\`

## Область видимости и наследование

### Локальные переменные

\`\`\`css
.card {
  --card-padding: 2rem;
  --card-bg: #f5f5f5;

  padding: var(--card-padding);
  background: var(--card-bg);
}

.card.compact {
  --card-padding: 1rem;
}
\`\`\`

### Каскадирование

\`\`\`css
:root {
  --text-size: 16px;
}

.large-text {
  --text-size: 20px;
}

p {
  font-size: var(--text-size);
}
\`\`\`

## Практические примеры

### Темы оформления

\`\`\`css
/* Светлая тема (по умолчанию) */
:root {
  --bg-color: white;
  --text-color: #333;
  --border-color: #ddd;
}

/* Тёмная тема */
[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #f0f0f0;
  --border-color: #444;
}

/* Применение */
body {
  background: var(--bg-color);
  color: var(--text-color);
}

.card {
  border: 1px solid var(--border-color);
}
\`\`\`

### Адаптивная типографика

\`\`\`css
:root {
  --base-font: 16px;
  --scale-ratio: 1.25;

  --text-xs: calc(var(--base-font) / var(--scale-ratio));
  --text-sm: var(--base-font);
  --text-md: calc(var(--base-font) * var(--scale-ratio));
  --text-lg: calc(var(--base-font) * var(--scale-ratio) * var(--scale-ratio));
}

h1 { font-size: var(--text-lg); }
h2 { font-size: var(--text-md); }
p { font-size: var(--text-sm); }
small { font-size: var(--text-xs); }
\`\`\`

## Интеграция с JavaScript

### Чтение переменных

\`\`\`javascript
// Получить значение переменной
const rootStyles = getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue('--primary-color');
\`\`\`

### Изменение переменных

\`\`\`javascript
// Установить новое значение
document.documentElement.style.setProperty('--primary-color', '#e74c3c');

// Переключение темы
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
}
\`\`\`

## Продвинутые техники

### Анимация с переменными

\`\`\`css
.animated-gradient {
  --gradient-angle: 0deg;
  background: linear-gradient(
    var(--gradient-angle),
    #3498db,
    #e74c3c
  );
  animation: rotate-gradient 3s linear infinite;
}

@keyframes rotate-gradient {
  to {
    --gradient-angle: 360deg;
  }
}
\`\`\`

### Компонентные системы

\`\`\`css
.btn {
  --btn-padding-x: 1rem;
  --btn-padding-y: 0.5rem;
  --btn-bg: var(--primary-color);
  --btn-color: white;
  --btn-border-radius: var(--border-radius);

  padding: var(--btn-padding-y) var(--btn-padding-x);
  background: var(--btn-bg);
  color: var(--btn-color);
  border-radius: var(--btn-border-radius);
}

.btn--large {
  --btn-padding-x: 1.5rem;
  --btn-padding-y: 0.75rem;
}

.btn--success {
  --btn-bg: var(--success-color);
}
\`\`\`

CSS переменные — это мощный инструмент для создания гибких и поддерживаемых стилей!`
	}
]

async function addRussianPosts() {
	console.log('Starting to add Russian versions of blog posts...')

	// Dynamically import after env vars are loaded
	const { createBlogPost, getAllAuthors } = await import('../db/blog')

	try {
		// Get all authors
		const authors = await getAllAuthors()
		const defaultAuthor = authors.find(a => a.name === 'Dmitry Borisenko')

		if (!defaultAuthor) {
			console.error(
				'Default author not found. Please run database schema first.'
			)
			return
		}

		console.log(`Found author: ${defaultAuthor.name}`)
		console.log(`Adding ${russianPosts.length} Russian posts...`)

		let successCount = 0
		let skipCount = 0
		let errorCount = 0

		for (const postData of russianPosts) {
			const post = {
				...postData,
				cover_image: '/images/avatar.jpeg',
				published: true,
				locale: 'ru',
				author_ids: [defaultAuthor.id]
			}

			console.log(`\nAdding: ${post.title}`)

			try {
				const result = await createBlogPost(post)
				if (result) {
					console.log(`✅ Successfully added: ${post.title}`)
					successCount++
				} else {
					console.log(`⚠️  Skipped (may already exist): ${post.title}`)
					skipCount++
				}
			} catch (error: any) {
				if (error.message?.includes('duplicate key')) {
					console.log(`⚠️  Already exists: ${post.title}`)
					skipCount++
				} else {
					console.error(`❌ Error adding ${post.title}:`, error.message)
					errorCount++
				}
			}
		}

		console.log('\n=== Summary ===')
		console.log(`✅ Successfully added: ${successCount} posts`)
		console.log(`⚠️  Skipped/Already exists: ${skipCount} posts`)
		console.log(`❌ Errors: ${errorCount} posts`)
		console.log(`Total processed: ${russianPosts.length} posts`)
		console.log('\nRussian posts addition completed!')

		if (successCount > 0) {
			console.log('\n🎉 Russian posts are now available at:')
			console.log('   http://localhost:3000/ru/blog')
		}
	} catch (error) {
		console.error('Failed to add Russian posts:', error)
	}
}

// Run the script
addRussianPosts()

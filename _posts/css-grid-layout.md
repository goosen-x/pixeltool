---
title: 'CSS Grid Layout: полное руководство с примерами'
excerpt:
  'Освойте CSS Grid Layout на практических примерах. Узнайте, как создавать
  сложные макеты с помощью grid-контейнеров, grid-элементов и адаптивных
  паттернов вёрстки.'
coverImage: '/images/blog/css-grid-layout.png'
date: '2025-09-02T10:00:00.000Z'
author:
  name: Дмитрий Борисенко
  picture: '/images/avatar.jpeg'
ogImage:
  url: '/images/blog/css-grid-layout.png'
related:
  - css-flexbox-guide
  - css-container-queries
  - css-shadows
---

CSS Grid Layout — это мощная двумерная система вёрстки, которая совершила
революцию в том, как мы создаём макеты для веба. В отличие от
[Flexbox](/blog/css-flexbox-guide), который в основном одномерный, Grid
позволяет работать одновременно и со строками, и с колонками.

## Базовый grid-контейнер

Чтобы создать grid-контейнер, достаточно применить к элементу `display: grid`:

```css
.container {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 100px 200px;
	gap: 20px;
}
```

Так мы получаем сетку из трёх равных колонок и двух строк с заданной высотой.

## Grid Template Areas

Одна из самых наглядных возможностей CSS Grid — именованные области (template
areas):

```css
.container {
	display: grid;
	grid-template-areas:
		'header header header'
		'sidebar main main'
		'footer footer footer';
	grid-template-columns: 200px 1fr 1fr;
	grid-template-rows: 80px 1fr 60px;
	gap: 10px;
}

.header {
	grid-area: header;
	background: #3498db;
}

.sidebar {
	grid-area: sidebar;
	background: #e74c3c;
}

.main {
	grid-area: main;
	background: #2ecc71;
}

.footer {
	grid-area: footer;
	background: #34495e;
}
```

Построить сетку мышью и сразу получить код — быстрее, чем подбирать значения
вслепую.

/tools/grid-generator

## Адаптивная сетка с auto-fit и minmax

Создавайте адаптивные сетки без медиазапросов:

```css
.gallery {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
}
```

Это создаёт адаптивную галерею, в которой элементы автоматически переносятся на
новые строки по мере необходимости.

### auto-fit или auto-fill — что выбрать

Разница проявляется ровно в одном случае: **когда элементов меньше, чем
помещается колонок**. Во всех остальных ситуациях они ведут себя одинаково,
поэтому подмену легко не заметить — до того дня, когда в галерее останется две
карточки.

- `auto-fill` **сохраняет** пустые колонки. Две карточки в сетке на четыре
  колонки останутся узкими и прижмутся влево — оставшиеся две колонки просто
  пустуют.
- `auto-fit` **схлопывает** пустые колонки до нуля. Те же две карточки
  растянутся и займут всю ширину.

```css
/* Карточки растягиваются на всю ширину, даже если их две */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

/* Карточки держат свой размер, пустое место остаётся справа */
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
```

Практическое правило: для галерей и карточек берите `auto-fit` — растянуться
обычно лучше, чем оставить дыру. `auto-fill` пригодится, когда ширина элемента
принципиальна и растягивать его нельзя.

И ещё одна ловушка: `minmax(250px, 1fr)` вылезет за узкий экран, если контейнер
уже 250px. Страховка — `min()`:

```css
grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
```

## Продвинутое размещение элементов

Управляйте расположением элементов с точностью до дорожки:

Здесь нужно сразу поймать одну вещь, на которой спотыкаются все: **числа в
`grid-column` — это номера линий, а не колонок.** Линии — это границы между
дорожками, и в сетке из трёх колонок их четыре.

```
 1        2        3        4     ← линии
 │  кол1  │  кол2  │  кол3  │
```

Поэтому `grid-column: 1 / 3` занимает **две** колонки (от линии 1 до линии 3), а
не три.

```css
.item {
	grid-column: 1 / 3; /* от линии 1 до линии 3 = две колонки */
	grid-row: 2 / 4; /* от линии 2 до линии 4 = две строки */
}

/* Using span keyword */
.wide-item {
	grid-column: span 2;
	grid-row: span 3;
}

/* Negative line numbers */
.full-width {
	grid-column: 1 / -1; /* Spans entire width */
}
```

## Неявная и явная сетка

CSS Grid автоматически создаёт дорожки, когда это необходимо:

```css
.container {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-auto-rows: minmax(100px, auto);
	grid-auto-flow: dense; /* Fills gaps automatically */
}
```

## Практический пример: макет дашборда

Вот полноценный макет дашборда на CSS Grid:

```html
<div class="dashboard">
	<header class="dashboard-header">Header</header>
	<nav class="dashboard-nav">Navigation</nav>
	<main class="dashboard-main">
		<div class="card">Card 1</div>
		<div class="card">Card 2</div>
		<div class="card wide">Wide Card</div>
		<div class="card">Card 3</div>
	</main>
	<aside class="dashboard-sidebar">Sidebar</aside>
</div>
```

```css
.dashboard {
	display: grid;
	grid-template-areas:
		'header header header'
		'nav main sidebar';
	grid-template-columns: 200px 1fr 250px;
	grid-template-rows: 60px 1fr;
	min-height: 100dvh;
	gap: 1rem;
	padding: 1rem;
}

.dashboard-header {
	grid-area: header;
	background: #2c3e50;
	color: white;
	padding: 1rem;
}

.dashboard-nav {
	grid-area: nav;
	background: #34495e;
	color: white;
	padding: 1rem;
}

.dashboard-main {
	grid-area: main;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
	grid-auto-rows: minmax(150px, auto);
}

.dashboard-sidebar {
	grid-area: sidebar;
	background: #ecf0f1;
	padding: 1rem;
}

.card {
	background: white;
	padding: 1rem;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card.wide {
	grid-column: span 2;
}

/* Responsive */
@media (max-width: 768px) {
	.dashboard {
		grid-template-areas:
			'header'
			'nav'
			'main'
			'sidebar';
		grid-template-columns: 1fr;
		grid-template-rows: auto auto 1fr auto;
	}
}
```

### Почему `.card.wide` ломает эту раскладку

В коде выше есть мина, которая срабатывает не на мобильном, а на планшете —
где-то между 769px и 1050px. Разберём, потому что ошибка типовая.

Колонки `nav` и `sidebar` съедают 450px фиксированной ширины. На экране 800px
центральной колонке остаётся около 300px, и в `auto-fit, minmax(200px, 1fr)`
помещается **одна** колонка. А карточка `.wide` требует `grid-column: span 2` —
двух колонок, которых нет. Grid покорно создаёт неявную вторую колонку, и
дашборд уезжает за край экрана.

Медиазапрос на 768px не спасает: поломка живёт **выше** его порога.

Правильное лечение — не медиазапрос по ширине окна, а **контейнерный запрос**:
растягивать карточку надо тогда, когда места хватает у самого контейнера, а не у
экрана.

```css
.dashboard-main {
	container-type: inline-size;
}

/* По умолчанию карточка обычная — безопасное состояние */
.card.wide {
	grid-column: span 1;
}

/* Растягиваем, только если контейнер реально вмещает две колонки */
@container (min-width: 420px) {
	.card.wide {
		grid-column: span 2;
	}
}
```

Общее правило: **`span N` всегда рискует создать неявную колонку.** Если не
уверены, что колонок хватит, значением по умолчанию делайте `span 1`, а
растягивание включайте отдельно.

## Выравнивание в сетке

Управляйте выравниванием как всей сетки, так и отдельных элементов:

```css
.container {
	display: grid;
	grid-template-columns: repeat(3, 100px);
	grid-template-rows: repeat(2, 100px);
	gap: 10px;

	/* Grid alignment */
	justify-content: center; /* Horizontal alignment */
	align-content: center; /* Vertical alignment */

	/* Item alignment */
	justify-items: center; /* All items horizontally */
	align-items: center; /* All items vertically */
}

/* Individual item alignment */
.special-item {
	justify-self: start;
	align-self: end;
}
```

## Subgrid

Subgrid работает во всех основных браузерах с 2023 года — это Baseline, и
относиться к нему как к экзотике больше не нужно.

Он решает конкретную боль: у вложенных карточек **не выравниваются
внутренности**. Заголовки съезжают, потому что каждая карточка сама себе сетка и
ничего не знает о соседях. Subgrid заставляет дочернюю сетку жить по дорожкам
родителя:

```css
.cards {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20px;
}

/* Карточка занимает три строки родителя: заголовок, текст, кнопка */
.card {
	display: grid;
	grid-row: span 3;
	grid-template-rows: subgrid;
	gap: 0.5rem;
}
```

Теперь заголовки всех карточек стоят на одной линии, тексты — на одной, кнопки
прибиты к низу. Раньше ради этого приходилось задавать фиксированные высоты.

Важная деталь: `subgrid` наследует **дорожки** родителя, но `gap` можно
переопределить — дочерняя сетка не обязана повторять отступы родительской.

## Лучшие практики

1. **Используйте Grid для двумерных макетов**: когда нужно управлять и строками,
   и колонками
2. **Комбинируйте с Flexbox**: используйте Grid для общего макета, а
   [Flexbox](/blog/css-flexbox-guide) — для внутренней структуры компонентов
3. **Подход mobile-first**: начинайте с простых макетов и усложняйте их для
   больших экранов
4. **Семантичный HTML**: используйте правильные HTML-элементы независимо от
   размещения в сетке
5. **Запасные варианты**: при необходимости предусматривайте fallback для старых
   браузеров

CSS Grid преобразил возможности вёрстки для веба, сделав сложные дизайны
достижимыми с помощью чистого и поддерживаемого кода. Освойте его — и в вашем
арсенале веб-разработчика появится по-настоящему мощный инструмент.

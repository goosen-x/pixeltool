---
title: 'CSS Grid Layout: полное руководство с примерами'
excerpt:
  'Освойте CSS Grid Layout на практических примерах. Узнайте, как создавать
  сложные макеты с помощью grid-контейнеров, grid-элементов и адаптивных
  паттернов вёрстки.'
coverImage: '/images/blog/css-grid-layout.png'
date: '2025-09-02T10:00:00.000Z'
category: development
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

[Flexbox](/blog/css-flexbox-guide) раскладывает элементы по одной оси. CSS Grid
работает сразу в двух: задаёт и строки, и колонки. Поэтому макет страницы целиком
обычно собирают на Grid, а Flexbox оставляют для мелочей внутри блоков.

## Базовый grid-контейнер

Сетка начинается с `display: grid` на родителе. Дочерние элементы сами станут
ячейками:

```css
.container {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 100px 200px;
	gap: 20px;
}
```

Получается три равные колонки и две строки: верхняя высотой 100px, нижняя 200px.
Единица `fr` делит свободное место, оставшееся после фиксированных размеров и
отступов.

## Именованные области: grid-template-areas

Именованные области я считаю самой наглядной частью Grid. Макет рисуется прямо
в CSS строками из имён, и по коду видно, где шапка, а где сайдбар:

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

Такую сетку быстрее построить мышью в
[генераторе CSS Grid](/tools/grid-generator) и забрать готовый код, чем
подбирать значения вслепую.

## Адаптивная сетка с auto-fit и minmax

Галерее карточек медиазапросы обычно не нужны. Хватает одной строки:

```css
.gallery {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
}
```

Браузер сам решает, сколько колонок шириной от 250px влезает в контейнер, и
переносит лишние карточки на следующую строку. На телефоне будет одна колонка, на
широком мониторе пять или шесть.

### auto-fit или auto-fill: что выбрать

Разница видна ровно в одном случае: элементов меньше, чем помещается колонок.
В остальных ситуациях они ведут себя одинаково, поэтому подмену легко не заметить.
До того дня, когда в галерее останется две карточки.

- `auto-fill` сохраняет пустые колонки. Две карточки в сетке на четыре колонки
  останутся узкими и прижмутся влево, а оставшиеся две колонки просто пустуют.
- `auto-fit` схлопывает пустые колонки до нуля. Те же две карточки растянутся и
  займут всю ширину.

```css
/* Карточки растягиваются на всю ширину, даже если их две */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

/* Карточки держат свой размер, пустое место остаётся справа */
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
```

Для галерей и карточек я беру `auto-fit`: растянуться обычно лучше, чем оставить
дыру. `auto-fill` пригодится, когда ширина элемента принципиальна и растягивать
его нельзя.

Есть и вторая ловушка. `minmax(250px, 1fr)` вылезет за край, если контейнер уже
250px, а это обычный телефон с отступами по бокам. Страхует от этого `min()`:

```css
grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
```

## Продвинутое размещение элементов

Элемент можно поставить в любое место сетки вручную. Сначала про то, на чём
спотыкаются почти все: числа в `grid-column` означают номера линий, а не колонок.
Линии проходят по границам дорожек, и в сетке из трёх колонок их четыре.

```
 1        2        3        4     ← линии
 │  кол1  │  кол2  │  кол3  │
```

Поэтому `grid-column: 1 / 3` занимает две колонки, от линии 1 до линии 3. Ключевое
слово `span` считает уже дорожки, а отрицательные номера отсчитывают линии с конца:
`1 / -1` растягивает элемент на всю ширину, сколько бы колонок ни было.

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

Явная сетка задаётся в `grid-template-*`. Если элементов больше, чем ячеек, Grid
достраивает строки сам, это неявная сетка. Их размер задаёт `grid-auto-rows`:

```css
.container {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-auto-rows: minmax(100px, auto);
	grid-auto-flow: dense; /* Fills gaps automatically */
}
```

Здесь каждая новая строка будет не ниже 100px и вырастет, если контенту тесно.
`dense` заставляет браузер затыкать дыры мелкими элементами, которые идут позже
по коду. Дыр становится меньше, но визуальный порядок перестаёт совпадать с
порядком в HTML. Для фотогалереи это не страшно, а в списке, по которому ходят
клавиатурой через Tab, фокус начнёт прыгать по экрану.

## Практический пример: макет дашборда

Шапка сверху, навигация слева, сайдбар справа, карточки в центре. На телефоне всё
выстраивается в одну колонку:

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

В коде выше есть мина. Срабатывает она не на телефоне, а на планшете, примерно
между 769px и 930px. Ошибка типовая, поэтому разберу подробно.

Колонки `nav` и `sidebar` съедают 450px, ещё 64px уходят на `gap` и `padding`.
На экране 800px центральной колонке остаётся меньше 300px, и в
`auto-fit, minmax(200px, 1fr)` помещается одна колонка. А карточке `.wide` нужно
`grid-column: span 2`, то есть две колонки, которых нет. Grid покорно создаёт
неявную вторую колонку, и дашборд уезжает за край экрана.

Медиазапрос на 768px не спасает, поломка живёт выше его порога.

Лечится это [контейнерным запросом](/blog/css-container-queries). Растягивать
карточку надо тогда, когда места хватает самому контейнеру, ширина окна тут ничего
не говорит.

```css
.dashboard-main {
	container-type: inline-size;
}

/* По умолчанию карточка обычная, это безопасное состояние */
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

420px взяты с запасом: две колонки по 200px плюс отступ 16px. Вывод шире этого
примера: `span N` всегда рискует создать неявную колонку. Если не уверены, что
колонок хватит, по умолчанию оставляйте `span 1`, а растягивание включайте
отдельным условием.

## Выравнивание в сетке

Свойства выравнивания путают из-за похожих имён. `justify-*` работает по
горизонтали, `align-*` по вертикали. Окончание `-content` двигает всю сетку внутри
контейнера (имеет смысл, только если дорожки уже контейнера), `-items` выравнивает
содержимое во всех ячейках, `-self` в одной конкретной:

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

Subgrid поддерживается во всех основных браузерах с сентября 2023 года (Chrome 117
вышел последним), так что экзотикой его считать уже не стоит.

Он решает конкретную проблему. В ряду карточек заголовки разной длины, и тексты
под ними начинаются на разной высоте. Каждая карточка сама себе сетка и ничего не
знает о соседях. Subgrid заставляет дочернюю сетку жить по дорожкам родителя:

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

Теперь заголовки всех карточек стоят на одной линии, тексты на одной, кнопки
прибиты к низу. Раньше ради этого приходилось задавать фиксированные высоты.

`subgrid` берёт у родителя дорожки, но `gap` можно задать свой: дочерняя сетка
не обязана повторять отступы родительской.

## Что учитывать на практике

Grid нужен там, где важны и строки, и колонки: каркас страницы, дашборд,
галерея. Внутри компонента, где элементы стоят в ряд, проще
[Flexbox](/blog/css-flexbox-guide). Я обычно начинаю с мобильной раскладки в одну
колонку и достраиваю её для широких экранов, тогда сетка редко ломается на
промежуточных ширинах.

Расстановка через `grid-area` и `order` меняет только картинку. Скринридер и Tab
по-прежнему идут по порядку HTML, поэтому теги и их последовательность выбирайте
по смыслу. А запасной вариант для старых браузеров сейчас почти никому не нужен:
Grid работает везде с 2017 года, subgrid с 2023-го.

Флоаты и абсолютное позиционирование для макетов можно спокойно забыть. Сетка
описывается в одном месте и читается прямо из CSS.

/tools/grid-generator

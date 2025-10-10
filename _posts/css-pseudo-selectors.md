---
title: 'CSS Псевдоклассы и Псевдоэлементы: Полное руководство 2025'
excerpt: 'Освойте CSS псевдоклассы и псевдоэлементы для создания продвинутых интерактивных элементов и визуальных эффектов без JavaScript. Интерактивные примеры и лучшие практики.'
coverImage: '/images/avatar.jpeg'
date: '2025-01-10T10:00:00.000Z'
author:
  name: Дмитрий Борисенко
  picture: '/images/avatar.jpeg'
ogImage:
  url: '/images/avatar.jpeg'
categories: ['CSS', 'Web Development', 'Tutorial']
keywords:
  [
    'CSS псевдоклассы',
    'CSS псевдоэлементы',
    'CSS selectors',
    'hover',
    'before after',
    'nth-child',
    'CSS has',
    'CSS is'
  ]
liveCodeExample: true
---

CSS псевдоклассы и псевдоэлементы — это мощные селекторы, позволяющие стилизовать элементы в зависимости от их состояния или создавать виртуальные элементы. Понимание этих селекторов открывает возможности для продвинутой стилизации без дополнительного HTML или JavaScript.

## Разница между псевдоклассами и псевдоэлементами

### Псевдоклассы (:)

Нацеливаются на элементы в зависимости от их состояния или позиции:

```css
button:hover {} /* Состояние при наведении */
li:first-child {} /* Позиция в DOM */
input:valid {} /* Валидация формы */
```

### Псевдоэлементы (::)

Создают или нацеливаются на виртуальные элементы:

```css
p::first-line {} /* Часть элемента */
div::before {} /* Создание нового элемента */
::selection {} /* Стилизация выделения */
```

**Важно:** Псевдоклассы используют одно двоеточие `:`, псевдоэлементы — два `::`

## Основные псевдоклассы

### 1. Интерактивные состояния

```html:live
// title: Интерактивные состояния кнопки
<button class="demo-button">Наведи на меня</button>
<input class="demo-input" placeholder="Кликни для фокуса">
```

```css:live
/* Наведение курсора */
.demo-button {
	background-color: #3498db;
	color: white;
	padding: 12px 24px;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.3s ease;
	font-size: 16px;
	margin-bottom: 10px;
	display: block;
}

.demo-button:hover {
	background-color: #2980b9;
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

/* Нажатие */
.demo-button:active {
	transform: translateY(0);
	box-shadow: 0 2px 4px rgba(52, 152, 219, 0.2);
}

/* Фокус для доступности */
.demo-input {
	padding: 10px;
	border: 2px solid #ddd;
	border-radius: 4px;
	width: 100%;
	transition: all 0.3s;
	font-size: 14px;
}

.demo-input:focus {
	outline: none;
	border-color: #3498db;
	box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* Фокус только с клавиатуры */
.demo-button:focus-visible {
	outline: 3px solid #f39c12;
	outline-offset: 2px;
}
```

### 2. Структурные псевдоклассы

```html:live
// title: Структурные селекторы nth-child
<ul class="demo-list">
	<li>Первый элемент (стилизован)</li>
	<li>Второй элемент (чётный)</li>
	<li>Третий элемент (кратен 3)</li>
	<li>Четвёртый элемент (чётный)</li>
	<li>Пятый элемент</li>
	<li>Шестой элемент (чётный, кратен 3)</li>
	<li>Последний элемент (стилизован)</li>
</ul>
```

```css:live
.demo-list {
	list-style: none;
	padding: 0;
	margin: 0;
}

.demo-list li {
	padding: 12px 16px;
	border: 1px solid #ddd;
	margin-bottom: -1px;
	transition: background-color 0.2s;
}

/* Первый элемент */
.demo-list li:first-child {
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	background-color: #e3f2fd;
}

/* Последний элемент */
.demo-list li:last-child {
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
	background-color: #e8f5e9;
}

/* Чётные элементы */
.demo-list li:nth-child(even) {
	background-color: #f8f9fa;
}

/* Каждый третий элемент */
.demo-list li:nth-child(3n) {
	border-left: 3px solid #3498db;
}

.demo-list li:hover {
	background-color: #fff3e0;
}
```

**Полезные паттерны nth-child:**

```css
/* Каждый третий элемент */
:nth-child(3n) { }

/* Первые 3 элемента */
:nth-child(-n + 3) { }

/* Все, кроме первых 3 */
:nth-child(n + 4) { }

/* Нечётные */
:nth-child(odd) { }

/* Чётные */
:nth-child(even) { }
```

### 3. Псевдоклассы форм

```html:live
// title: Валидация и состояния форм
<form class="demo-form">
	<div class="form-field">
		<input type="email" required placeholder="Email (обязательно)">
	</div>
	<div class="form-field">
		<input type="text" placeholder="Имя (опционально)">
	</div>
	<div class="form-field">
		<input type="text" disabled value="Неактивное поле">
	</div>
	<div class="form-field">
		<input type="checkbox" id="agree">
		<label for="agree">Согласен с условиями</label>
	</div>
</form>
```

```css:live
.demo-form {
	max-width: 400px;
}

.form-field {
	margin-bottom: 16px;
}

.demo-form input[type="email"],
.demo-form input[type="text"] {
	width: 100%;
	padding: 10px;
	border: 2px solid #ddd;
	border-radius: 4px;
	transition: all 0.3s;
	font-size: 14px;
}

/* Валидное поле */
.demo-form input:valid {
	border-color: #27ae60;
	background-color: #f0fdf4;
}

/* Невалидное поле */
.demo-form input:invalid {
	border-color: #e74c3c;
	background-color: #fef2f2;
}

/* Обязательное поле */
.demo-form input:required {
	border-left: 4px solid #f39c12;
}

/* Неактивное поле */
.demo-form input:disabled {
	background-color: #ecf0f1;
	cursor: not-allowed;
	opacity: 0.6;
}

/* Чекбокс */
.demo-form input[type='checkbox']:checked + label {
	color: #27ae60;
	font-weight: 600;
}

/* Placeholder */
.demo-form input::placeholder {
	color: #95a5a6;
	font-style: italic;
}

.demo-form input:focus::placeholder {
	color: transparent;
}
```

### 4. Продвинутые селекторы

#### :has() — Родительский селектор

```html:live
// title: Селектор :has() для родителей
<div class="demo-card">
	<input type="checkbox" id="card1">
	<label for="card1">Отметьте, чтобы активировать карточку</label>
	<p>Карточка изменит стиль при выборе</p>
</div>

<div class="demo-card card-with-image">
	<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%233498db' width='100' height='100'/%3E%3C/svg%3E" alt="Demo">
	<div>
		<h4 style="margin-top: 0;">Карточка с изображением</h4>
		<p style="margin-bottom: 0;">Автоматически использует grid layout</p>
	</div>
</div>
```

```css:live
.demo-card {
	border: 2px solid #ddd;
	padding: 16px;
	border-radius: 8px;
	margin-bottom: 16px;
	transition: all 0.3s;
}

/* Карточка с изображением */
.demo-card:has(img) {
	display: grid;
	grid-template-columns: 100px 1fr;
	gap: 16px;
	background-color: #f8f9fa;
}

/* Карточка с checked чекбоксом */
.demo-card:has(input:checked) {
	border-color: #3498db;
	background-color: #e3f2fd;
	box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
}

.demo-card img {
	width: 100%;
	border-radius: 4px;
}
```

#### :target — Элемент по якорю

```html:live
// title: Навигация с :target
<nav class="demo-nav">
	<a href="#section1">Секция 1</a>
	<a href="#section2">Секция 2</a>
	<a href="#section3">Секция 3</a>
</nav>

<div id="section1" class="demo-section">
	<h4>Секция 1</h4>
	<p>Кликните на ссылку выше, чтобы подсветить эту секцию</p>
</div>

<div id="section2" class="demo-section">
	<h4>Секция 2</h4>
	<p>Активная секция будет подсвечена жёлтым</p>
</div>

<div id="section3" class="demo-section">
	<h4>Секция 3</h4>
	<p>Используйте :target для создания табов без JavaScript</p>
</div>
```

```css:live
.demo-section {
	padding: 20px;
	margin: 10px 0;
	border: 2px solid #ddd;
	border-radius: 8px;
	transition: all 0.3s;
}

.demo-section:target {
	background-color: #fff9c4;
	border-color: #f39c12;
	box-shadow: 0 0 0 4px rgba(243, 156, 18, 0.1);
}

.demo-nav {
	margin-bottom: 20px;
}

.demo-nav a {
	display: inline-block;
	margin: 5px;
	padding: 8px 16px;
	background: #3498db;
	color: white;
	text-decoration: none;
	border-radius: 4px;
}

.demo-nav a:hover {
	background: #2980b9;
}
```

## Мощные псевдоэлементы

### 1. ::before и ::after

```html:live
// title: Псевдоэлементы ::before и ::after
<blockquote class="demo-quote">
	CSS — это не просто язык стилей, это искусство создания красивого интернета.
</blockquote>

<p style="margin-top: 20px;">
	<a href="https://developer.mozilla.org" class="external-link">MDN Documentation</a>
</p>

<p style="margin-top: 20px;">
	Наведите на 
	<span class="tooltip" data-tooltip="Это всплывающая подсказка!">этот текст</span>
	чтобы увидеть тултип.
</p>
```

```css:live
.demo-quote {
	position: relative;
	padding: 30px 40px;
	background: #f8f9fa;
	border-radius: 8px;
	font-size: 18px;
	font-style: italic;
	color: #2c3e50;
}

.demo-quote::before {
	content: '"';
	position: absolute;
	top: 10px;
	left: 10px;
	font-size: 60px;
	color: #bdc3c7;
	font-family: Georgia, serif;
	line-height: 1;
}

.demo-quote::after {
	content: '"';
	position: absolute;
	bottom: 10px;
	right: 20px;
	font-size: 60px;
	color: #bdc3c7;
	font-family: Georgia, serif;
	line-height: 1;
}

/* Внешние ссылки с иконкой */
.external-link {
	color: #3498db;
	text-decoration: none;
}

.external-link::after {
	content: ' ↗';
	font-size: 0.8em;
	vertical-align: super;
}

/* Тултип */
.tooltip {
	position: relative;
	display: inline-block;
	border-bottom: 1px dashed #3498db;
	cursor: help;
}

.tooltip::after {
	content: attr(data-tooltip);
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
	background: #333;
	color: white;
	padding: 8px 12px;
	border-radius: 4px;
	white-space: nowrap;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.3s;
	margin-bottom: 5px;
	font-size: 14px;
	font-style: normal;
}

.tooltip:hover::after {
	opacity: 1;
}
```

### 2. Кастомные счётчики

```html:live
// title: CSS счётчики с ::before
<ul class="timeline">
	<li class="timeline-item">
		<h4>Изучите основы</h4>
		<p>Начните с псевдоклассов и псевдоэлементов</p>
	</li>
	<li class="timeline-item">
		<h4>Практикуйтесь</h4>
		<p>Создавайте интерактивные компоненты</p>
	</li>
	<li class="timeline-item">
		<h4>Оптимизируйте</h4>
		<p>Улучшайте производительность CSS</p>
	</li>
	<li class="timeline-item">
		<h4>Делитесь знаниями</h4>
		<p>Помогайте другим разработчикам</p>
	</li>
</ul>
```

```css:live
.timeline {
	counter-reset: timeline;
	padding-left: 0;
	list-style: none;
}

.timeline-item {
	counter-increment: timeline;
	position: relative;
	padding-left: 60px;
	margin-bottom: 30px;
	padding-bottom: 20px;
	border-left: 2px solid #e0e0e0;
}

.timeline-item:last-child {
	border-left: none;
}

.timeline-item::before {
	content: counter(timeline);
	position: absolute;
	left: -20px;
	top: 0;
	width: 40px;
	height: 40px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	font-size: 18px;
	box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.timeline-item h4 {
	margin-top: 0;
	color: #2c3e50;
}

.timeline-item p {
	color: #7f8c8d;
	margin: 0;
}
```

### 3. ::first-letter и ::first-line

```html:live
// title: Типографика с ::first-letter
<p class="article-text">
	Псевдоэлементы позволяют создавать эффектные типографские решения без дополнительной разметки. Буквица (drop cap) — классический приём книжного дизайна, который легко реализуется с помощью ::first-letter. Первая строка абзаца также может быть визуально выделена для лучшей читаемости и привлечения внимания читателя.
</p>
```

```css:live
.article-text {
	text-align: justify;
	color: #555;
	line-height: 1.6;
	font-size: 16px;
}

.article-text::first-letter {
	font-size: 4rem;
	font-weight: bold;
	float: left;
	line-height: 0.8;
	margin: 0.1em 0.2em 0 0;
	color: #e74c3c;
	font-family: Georgia, serif;
}

.article-text::first-line {
	font-weight: 600;
	font-size: 1.1em;
	color: #2c3e50;
}
```

### 4. ::selection — Стилизация выделения

```html:live
// title: Кастомное выделение текста
<div class="selectable-text">
	<p>Выделите этот текст, чтобы увидеть <span class="important-text">кастомный цвет выделения</span>. Разные элементы могут иметь разные стили выделения!</p>
</div>
```

```css:live
.selectable-text {
	padding: 20px;
	background: #f8f9fa;
	border-radius: 8px;
}

.selectable-text::selection {
	background-color: #3498db;
	color: white;
}

.important-text {
	color: #e74c3c;
	font-weight: bold;
}

.important-text::selection {
	background-color: #e74c3c;
	color: white;
}
```

## Практические примеры

### Кастомный чекбокс

```html:live
// title: Кастомный чекбокс без JavaScript
<label class="custom-checkbox-wrapper">
	<input type="checkbox" class="custom-checkbox">
	<span class="checkbox-label">Вариант 1</span>
</label>

<label class="custom-checkbox-wrapper">
	<input type="checkbox" class="custom-checkbox" checked>
	<span class="checkbox-label">Вариант 2 (выбран)</span>
</label>

<label class="custom-checkbox-wrapper">
	<input type="checkbox" class="custom-checkbox" disabled>
	<span class="checkbox-label">Вариант 3 (неактивен)</span>
</label>
```

```css:live
.custom-checkbox-wrapper {
	display: block;
	margin: 10px 0;
}

.custom-checkbox {
	position: absolute;
	opacity: 0;
	cursor: pointer;
}

.checkbox-label {
	position: relative;
	padding-left: 35px;
	cursor: pointer;
	user-select: none;
	font-size: 16px;
}

.checkbox-label::before {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 24px;
	height: 24px;
	border: 2px solid #3498db;
	border-radius: 4px;
	background: white;
	transition: all 0.3s ease;
}

.checkbox-label::after {
	content: '✓';
	position: absolute;
	left: 6px;
	top: 50%;
	transform: translateY(-50%) scale(0);
	color: white;
	font-size: 16px;
	font-weight: bold;
	transition: transform 0.2s ease;
}

.custom-checkbox:checked + .checkbox-label::before {
	background: #3498db;
	border-color: #3498db;
}

.custom-checkbox:checked + .checkbox-label::after {
	transform: translateY(-50%) scale(1);
}

.custom-checkbox:focus + .checkbox-label::before {
	box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
}

.custom-checkbox:disabled + .checkbox-label {
	opacity: 0.5;
	cursor: not-allowed;
}
```

### Состояние загрузки (Skeleton)

```html:live
// title: Skeleton loader эффект
<div class="skeleton-card">
	<div class="skeleton skeleton-title"></div>
	<div class="skeleton skeleton-text"></div>
	<div class="skeleton skeleton-text"></div>
	<div class="skeleton skeleton-text-short"></div>
</div>
```

```css:live
.skeleton-card {
	padding: 20px;
	background: white;
	border-radius: 8px;
	border: 1px solid #e0e0e0;
}

.skeleton {
	position: relative;
	overflow: hidden;
	background: #e0e0e0;
	border-radius: 4px;
	margin-bottom: 10px;
}

.skeleton::after {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: linear-gradient(
		90deg,
		transparent 0%,
		rgba(255, 255, 255, 0.6) 50%,
		transparent 100%
	);
	animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
	0% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(100%);
	}
}

.skeleton-title {
	height: 24px;
	width: 60%;
}

.skeleton-text {
	height: 16px;
	width: 100%;
}

.skeleton-text-short {
	height: 16px;
	width: 80%;
}
```

## Инструменты для работы с CSS

При работе с псевдоклассами и сложными селекторами полезно понимать специфичность CSS:

/tools/css-specificity-calculator

Для создания визуальных эффектов с градиентами в псевдоэлементах:

/tools/css-gradient-generator

## Советы по производительности

1. **Псевдоэлементы создают реальные элементы** — они влияют на render tree
2. **Сложные селекторы замедляют рендеринг** — держите специфичность разумной
3. **Избегайте дорогих свойств** — тени, фильтры в ::before/::after
4. **Используйте CSS containment** — ограничьте область пересчёта стилей

```css
/* Оптимизация для анимаций в псевдоэлементах */
.element::before {
	content: '';
	will-change: transform;
	/* Будет рендериться на отдельном слое */
}
```

## Поддержка браузерами

Большинство псевдоклассов и псевдоэлементов имеют отличную поддержку:

| Селектор | Поддержка |
|----------|-----------|
| `:hover`, `:focus`, `:active` | ✅ Все браузеры |
| `:nth-child()`, `:first-child` | ✅ Все браузеры |
| `::before`, `::after` | ✅ Все браузеры |
| `:is()`, `:where()` | ✅ Современные браузеры |
| `:has()` | ⚠️ Только современные (2023+) |
| `:focus-visible` | ✅ Современные браузеры |

## Распространённые ошибки

### 1. Забывание content для ::before/::after

```css
/* ❌ Не будет работать */
.element::before {
	display: block;
	width: 100px;
}

/* ✅ Правильно */
.element::before {
	content: '';
	display: block;
	width: 100px;
}
```

### 2. Двойное двоеточие для псевдоклассов

```css
/* ❌ Неправильно */
button::hover {
	background: red;
}

/* ✅ Правильно */
button:hover {
	background: red;
}
```

### 3. Попытка стилизовать ::before у элементов замены

```css
/* ❌ Не работает для img, input, br */
img::before {
	content: 'Иконка';
}

/* ✅ Оберните в контейнер */
.image-wrapper::before {
	content: 'Иконка';
}
```

## Заключение

Псевдоклассы и псевдоэлементы — это фундаментальные инструменты современного CSS. Они позволяют:

- ✅ Создавать интерактивные элементы без JavaScript
- ✅ Добавлять декоративные элементы без HTML
- ✅ Стилизовать состояния форм и валидацию
- ✅ Реализовывать сложные UI паттерны
- ✅ Улучшать доступность с `:focus-visible`

### Основные выводы:

1. Используйте `:focus-visible` для доступности
2. `:has()` открывает новые возможности для родительских селекторов
3. `::before` и `::after` отлично подходят для декоративных элементов
4. Комбинируйте псевдоклассы для точной стилизации
5. Помните о производительности при сложных селекторах

Практикуйтесь с интерактивными примерами выше и создавайте красивые интерфейсы!

## Полезные ресурсы

- [Калькулятор специфичности CSS](/tools/css-specificity-calculator)
- [Генератор CSS градиентов](/tools/css-gradient-generator)
- [MDN: Псевдоклассы](https://developer.mozilla.org/ru/docs/Web/CSS/Pseudo-classes)
- [MDN: Псевдоэлементы](https://developer.mozilla.org/ru/docs/Web/CSS/Pseudo-elements)

---

**Совет:** Попробуйте изменить код в интерактивных примерах выше, чтобы увидеть, как работают разные псевдоклассы и псевдоэлементы в реальном времени!

---
title: 'CSS clamp(): Полное руководство 2025 с примерами'
excerpt:
  'Как работать с CSS clamp() для адаптивной типографики и размеров. Простые
  примеры, формулы и практические кейсы. Интерактивные демо.'
coverImage: '/images/avatar.jpeg'
date: '2025-10-10T09:00:00.000Z'
author:
  name: Dmitry Borisenko
  picture: '/images/avatar.jpeg'
ogImage:
  url: '/images/avatar.jpeg'
---

В этой статье разбираем `clamp()` — функцию CSS, которая задает значение с
нижней и верхней границей. Это удобно для адаптивной вёрстки, особенно для
`font-size`, `padding` и `margin`.

/tools/css-clamp-calculator

## Что такое clamp()


CSS функция `clamp()` революционизировала подход к созданию адаптивного дизайна.
В этом руководстве мы подробно разберём, как использовать эту мощную функцию для
создания плавной, адаптивной типографики без единого медиа-запроса.

/tools/css-clamp-calculator

## Что такое CSS Clamp()?

Функция `clamp()` позволяет установить значение, которое адаптируется в заданном
диапазоне. Синтаксис:

```css
clamp(минимум, предпочтительное, максимум)
```

### Как это работает:

- **Минимум**: наименьшее допустимое значение
- **Предпочтительное**: динамическое значение (обычно с vw)
- **Максимум**: наибольшее допустимое значение

## Практические примеры

### 1. Адаптивные заголовки

```css
h1 {
	font-size: clamp(2rem, 5vw, 4rem);
}
```

Этот заголовок:

- Не будет меньше 32px (2rem)
- Масштабируется с шириной экрана
- Не превысит 64px (4rem)

### 2. Плавные отступы

```css
.container {
	padding: clamp(1rem, 3vw, 3rem);
}
```

### 3. Адаптивная ширина контейнера

```css
.content {
	width: clamp(300px, 90%, 1200px);
}
```

## Формула для идеального clamp()

Для расчёта оптимальных значений используйте формулу:

```
предпочтительное = минимум + (максимум - минимум) × (100vw - минимальный_viewport) / (максимальный_viewport - минимальный_viewport)
```

### Пример расчёта:

- Минимальный размер: 16px при 320px viewport
- Максимальный размер: 24px при 1200px viewport

```css
font-size: clamp(1rem, 0.909rem + 0.909vw, 1.5rem);
```

## Преимущества использования clamp()

### 1. Меньше кода

Вместо множества медиа-запросов:

```css
/* Старый подход */
p {
	font-size: 16px;
}
@media (min-width: 768px) {
	p {
		font-size: 18px;
	}
}
@media (min-width: 1024px) {
	p {
		font-size: 20px;
	}
}
@media (min-width: 1440px) {
	p {
		font-size: 22px;
	}
}

/* С clamp() */
p {
	font-size: clamp(1rem, 0.875rem + 0.625vw, 1.375rem);
}
```

### 2. Плавные переходы

Размеры изменяются постепенно, без резких скачков при смене брейкпоинтов.

### 3. Лучшая производительность

Браузер выполняет меньше вычислений при изменении размера окна.

## Лучшие практики

### 1. Используйте относительные единицы

```css
/* Хорошо */
clamp(1rem, 2vw + 0.5rem, 2rem)

/* Избегайте */
clamp(16px, 2vw + 8px, 32px)
```

### 2. Тестируйте на разных устройствах

Проверяйте, как выглядят размеры на:

- Мобильных (320-414px)
- Планшетах (768-1024px)
- Десктопах (1280px+)

### 3. Комбинируйте с CSS переменными

```css
:root {
	--min-size: 1rem;
	--max-size: 2.5rem;
	--fluid-size: 1.5vw + 0.5rem;
}

h2 {
	font-size: clamp(var(--min-size), var(--fluid-size), var(--max-size));
}
```

## Инструменты для работы с clamp()

### CSS Clamp Calculator

Используйте наш [калькулятор CSS Clamp](/ru/projects/clamp-calculator) для
быстрого расчёта значений:

- Визуальный предпросмотр
- Мгновенные вычисления
- Копирование готового кода

## Поддержка браузерами

CSS `clamp()` поддерживается всеми современными браузерами:

- Chrome 79+
- Firefox 75+
- Safari 13.1+
- Edge 79+

Для старых браузеров используйте fallback:

```css
.text {
	font-size: 1.125rem; /* Fallback */
	font-size: clamp(1rem, 1vw + 0.875rem, 1.5rem);
}
```

## Распространённые ошибки

### 1. Неправильный порядок значений

```css
/* Неправильно: максимум меньше минимума */
clamp(2rem, 5vw, 1rem)

/* Правильно */
clamp(1rem, 5vw, 2rem)
```

### 2. Слишком большой диапазон

```css
/* Избегайте экстремальных значений */
clamp(0.5rem, 10vw, 5rem) /* Слишком большой разброс */

/* Лучше */
clamp(1rem, 2vw + 0.5rem, 1.5rem)
```

### 3. Использование только vw

```css
/* Проблема: на больших экранах слишком большой размер */
clamp(1rem, 5vw, 3rem)

/* Решение: добавьте базовое значение */
clamp(1rem, 2vw + 0.75rem, 3rem)
```

## Продвинутые техники

### 1. Нелинейное масштабирование

```css
/* Используйте calc() для сложных формул */
font-size: clamp(1rem, calc(1rem + 2 * ((100vw - 20rem) / 60)), 2rem);
```

### 2. Адаптивная сетка

```css
.grid {
	display: grid;
	gap: clamp(1rem, 2vw, 2rem);
	grid-template-columns: repeat(
		auto-fit,
		minmax(clamp(250px, 30%, 350px), 1fr)
	);
}
```

### 3. Анимированные значения

```css
@keyframes grow {
	from {
		width: clamp(100px, 20vw, 200px);
	}
	to {
		width: clamp(200px, 40vw, 400px);
	}
}
```

## Заключение

CSS `clamp()` — это мощный инструмент для создания по-настоящему адаптивного
дизайна. Он упрощает код, улучшает производительность и обеспечивает плавное
масштабирование элементов.

### Ключевые выводы:

1. Используйте `clamp()` для типографики и отступов
2. Комбинируйте с относительными единицами
3. Тестируйте на разных размерах экрана
4. Применяйте наш [калькулятор](/ru/projects/clamp-calculator) для точных
   расчётов

Начните использовать `clamp()` уже сегодня и сделайте ваш дизайн более гибким и
современным!

## Полезные ресурсы

- [CSS Clamp Calculator](/ru/projects/clamp-calculator) — наш инструмент для
  расчётов
- [MDN: clamp()](https://developer.mozilla.org/ru/docs/Web/CSS/clamp)
- [Fluid Typography Calculator](https://www.fluid-type-scale.com/)
- [Modern Fluid Typography Using CSS Clamp](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/)


Формат: clamp(min, preferred, max)

- min — минимальное значение, ниже которого результат не опускается.
- preferred — желаемое (обычно флюидное, с `vw`, `vh`, calc()).
- max — максимальное значение, выше которого результат не растет.

Механика: браузер вычисляет preferred и затем ограничивает его интервалом [min,
max].

Пример 1: базовая типографика Желаем, чтобы шрифт был от 16px до 24px и рос
вместе с шириной экрана.

```css:live
// title: Базовая типографика c clamp()
.demo-1 {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  line-height: 1.5;
  padding: 1.25rem;
}

/* От 16px до 24px, флюидная середина на vw */
.demo-1 h1 {
  font-size: clamp(16px, 2vw + 12px, 24px);
}
```

```html:live
<div class="demo-1">
  <h1>Заголовок с clamp()</h1>
  <p>Масштабируй окно: размер шрифта ограничен 16–24px.</p>
</div>
```

Когда использовать

- Флюидные размеры с безопасными границами.
- Замена медиа‑запросов для простых кейсов.
- Контроль читаемости: не слишком мелко на мобильных и не гигантски на больших
  мониторах.

Пример 2: отступы/поля Адаптивные отступы: растут на широких экранах, но в
пределах.

```css:live
// title: Адаптивные отступы
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  padding: clamp(12px, 2vw, 24px);
}
```

```html:live
<div class="card">
  <p>Отступы растут, но не меньше 12px и не больше 24px.</p>
</div>
```

Пример 3: флюидная ширина блока Минимум 280px, максимум 640px, середина — 50vw.

```css:live
// title: Флюидная ширина блока
.box {
  margin: 1rem auto;
  background: #f6f7f9;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  width: clamp(280px, 50vw, 640px);
  padding: 1rem;
}
```

```html:live
<div class="box">
  <p>Меняй ширину окна — блок ограничен 280–640px.</p>
</div>
```

Пример 4: типографика с формулой calc() Можно сложить базу в px и долю от ширины
экрана.

```css:live
// title: Флюидная типографика с calc()
.title {
  font-weight: 700;
  font-size: clamp(1rem, calc(0.75rem + 2vw), 1.5rem);
}
```

```html:live
<h2 class="title">Флюидный заголовок</h2>
```

Как выбрать min, preferred, max

- min: комфорт на самом узком экране (обычно 320–375px ширина).
- max: читаемость на больших экранах (обычно 1024–1440px+).
- preferred: формула, растущая с шириной, например `calc(a + b * vw)`.

Типичная формула preferred

- Простой паттерн: `calc(base + slope * 1vw)`
- Где slope подбирается экспериментально или через инструмент:
  /tools/css-clamp-calculator

Пример 5: кнопка с предельной высотой

```css:live
// title: Кнопка с ограниченной высотой
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 clamp(12px, 2vw, 24px);
  height: clamp(36px, 4vw, 48px);
  background: #2563eb;
  color: #fff;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  transition: filter .2s;
}
.btn:hover { filter: brightness(1.1); }
```

```html:live
<button class="btn">Кнопка</button>
```

Edge‑кейсы и советы

- Единицы: можно смешивать px, rem, vw, %, но итог должен вычисляться в
  совместимые типы. Для шрифтов лучше rem/px + vw.
- Доступность: не блокируй пользовательский zoom. При шрифтах учитывай системные
  настройки, предпочитай rem вместо px.
- Кросс‑браузерность: поддержка clamp() хорошая во всех современных браузерах.
  Старые версии не поддерживают; при необходимости — fallback.
- Порядок аргументов важен: если preferred меньше min, результат = min; если
  больше max — результат = max.
- Не злоупотребляй: для сложной логики лучше медиа‑запросы.

Пример 6: fallback для старых браузеров Сначала фиксированное значение, потом
современное.

```css:live
// title: Fallback и прогрессивное улучшение
.heading {
  font-size: 18px;              /* fallback */
  font-size: clamp(16px, 2vw, 22px);
}
```

```html:live
<h3 class="heading">Заголовок с fallback</h3>
```

Частые сценарии

- Флюидная типографика: заголовки, параграфы, лиды.
- Отступы секций: padding-top/bottom.
- Размеры карточек/плитки: ширина/высота с границами.
- Иконки/аватары: чтобы не раздувались на 4K.

Быстрый чек‑лист

- Определи минимальный и максимальный комфортный размер.
- Выбери формулу preferred, которая плавно растет с шириной (vw).
- Сгенерируй выражение через /tools/css-clamp-calculator.
- Протестируй в DevTools при разных ширинах (320–1440px).
- Проверь Lighthouse: контраст, CLS, масштабирование.

Регулярный код (для справки)

```javascript
// Пример обычного блока кода
function clampValue(min, preferred, max, current) {
	return Math.min(Math.max(preferred(current), min), max)
}
```

Ссылки на документацию

- MDN: https://developer.mozilla.org/docs/Web/CSS/clamp
- Спецификация CSS Values and Units:
  https://www.w3.org/TR/css-values-4/#funcdef-clamp

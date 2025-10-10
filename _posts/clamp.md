---
title: 'CSS clamp(): Полное руководство с живыми примерами'
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
нижней и верхней границей. Это удобно для адаптивной типографики, отступов и
блоков. Для генерации выражений используй наш инструмент:
/tools/css-clamp-calculator.

Что такое clamp() Формат: clamp(min, preferred, max)

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

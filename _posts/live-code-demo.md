---
title: 'Интерактивные примеры кода: демо живого превью'
excerpt:
  'Посмотрите, как работает наша новая функция живого превью кода на
  интерактивных примерах HTML, CSS и JavaScript, которые можно редактировать
  и запускать в реальном времени.'
coverImage: '/images/avatar.jpeg'
date: '2025-08-07T10:00:00.000Z'
author:
  name: Dmitry Borisenko
  picture: '/images/avatar.jpeg'
ogImage:
  url: '/images/avatar.jpeg'
---

Этот пост демонстрирует нашу новую функцию живого превью кода. Теперь вы можете
добавлять интерактивные примеры, которые читатели увидят в действии!

## Простой пример с кнопкой

Начнём с простой интерактивной кнопки:

```html:live
// title: Interactive Button
<div class="container">
  <h2>Click the button!</h2>
  <button onclick="handleClick()">Click Me!</button>
  <p id="message"></p>
</div>
```

```css:live
.container {
  text-align: center;
  padding: 2rem;
  background: #f0f0f0;
  border-radius: 8px;
}

button {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #2980b9;
}

#message {
  margin-top: 1rem;
  font-weight: bold;
  color: #27ae60;
}
```

```js:live
let clickCount = 0;

function handleClick() {
  clickCount++;
  document.getElementById('message').textContent =
    `Button clicked ${clickCount} time${clickCount !== 1 ? 's' : ''}!`;
}
```

## Пример с анимированной карточкой

А вот пример посложнее — с CSS-анимациями:

```html:live
// title: Animated Card
<div class="card">
  <div class="card-header">
    <div class="avatar"></div>
    <h3>John Doe</h3>
  </div>
  <div class="card-body">
    <p>Hover over this card to see the animation effect!</p>
  </div>
</div>
```

```css:live
.card {
  width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.avatar {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  margin: 0 auto 1rem;
  position: relative;
  overflow: hidden;
}

.avatar::after {
  content: "👤";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
}

.card-body {
  padding: 1.5rem;
}

.card h3 {
  margin: 0;
}
```

## Динамический выбор цвета

Интерактивный пример с выбором цвета:

```html:live
// title: Color Picker Demo
<div class="color-picker">
  <h3>Pick a Color</h3>
  <input type="color" id="colorInput" value="#3498db" onchange="changeColor()">
  <div class="color-display" id="colorDisplay">
    <p>Selected Color</p>
    <code id="colorCode">#3498db</code>
  </div>
</div>
```

```css:live
.color-picker {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

#colorInput {
  width: 100px;
  height: 50px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 1rem 0;
}

.color-display {
  margin-top: 1rem;
  padding: 2rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  color: white;
  background-color: #3498db;
}

.color-display code {
  display: block;
  margin-top: 0.5rem;
  font-size: 1.2rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 4px;
}
```

```js:live
function changeColor() {
  const color = document.getElementById('colorInput').value;
  const display = document.getElementById('colorDisplay');
  const code = document.getElementById('colorCode');

  display.style.backgroundColor = color;
  code.textContent = color;

  // Adjust text color based on background
  const rgb = hexToRgb(color);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  display.style.color = brightness > 128 ? '#000' : '#fff';
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
```

## Как это работает

Чтобы создать такие живые примеры в своих markdown-файлах, используйте
специальный суффикс `:live`:

- `html:live` для HTML-кода
- `css:live` для CSS-кода
- `js:live` для JavaScript-кода

Блоки кода автоматически объединяются в интерактивное превью, с которым читатели
могут экспериментировать!

## Обычный код тоже работает

Разумеется, обычные блоки кода по-прежнему работают как положено:

```javascript
// This is a regular code block
function fibonacci(n) {
	if (n <= 1) return n
	return fibonacci(n - 1) + fibonacci(n - 2)
}

console.log(fibonacci(10)) // 55
```

Эта функция делает технические статьи гораздо интереснее и помогает читателям
разобраться в материале через практические эксперименты!

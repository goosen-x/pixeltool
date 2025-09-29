# Example Blog Post with Live Code

This is an example blog post showing how to use live code examples.

## Basic HTML Example

Here's a simple HTML example with live preview:

```html:live
// title: Basic HTML Structure
<div class="container">
  <h1>Hello World!</h1>
  <p>This is a live HTML example.</p>
  <button onclick="alert('Button clicked!')">Click me</button>
</div>
```

## HTML + CSS Example

You can combine HTML and CSS:

```html:live
<div class="card">
  <h2>Styled Card</h2>
  <p>This card has custom styling.</p>
  <button class="btn">Hover me</button>
</div>
```

```css:live
.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card h2 {
  margin: 0 0 1rem 0;
}

.btn {
  background: white;
  color: #667eea;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}
```

## HTML + CSS + JavaScript Example

Here's a complete interactive example:

```html:live
// title: Interactive Counter
<div class="counter-app">
  <h3>Counter App</h3>
  <div class="counter-display" id="counter">0</div>
  <div class="buttons">
    <button class="btn-counter" onclick="decrement()">-</button>
    <button class="btn-counter" onclick="increment()">+</button>
    <button class="btn-reset" onclick="reset()">Reset</button>
  </div>
</div>
```

```css:live
.counter-app {
  text-align: center;
  padding: 2rem;
  background: #f3f4f6;
  border-radius: 8px;
}

.counter-display {
  font-size: 3rem;
  font-weight: bold;
  color: #1f2937;
  margin: 1rem 0;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-counter {
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-counter:hover {
  background: #2563eb;
}

.btn-reset {
  padding: 0 1.5rem;
  border: none;
  border-radius: 8px;
  background: #ef4444;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-reset:hover {
  background: #dc2626;
}
```

```js:live
let count = 0;

function updateDisplay() {
  document.getElementById('counter').textContent = count;
}

function increment() {
  count++;
  updateDisplay();
}

function decrement() {
  count--;
  updateDisplay();
}

function reset() {
  count = 0;
  updateDisplay();
}
```

## Regular Code Blocks

Regular code blocks still work as before:

```javascript
// This is a regular code block without live preview
function greet(name) {
	return `Hello, ${name}!`
}

console.log(greet('World'))
```

## Usage Instructions

To create a live code example in your blog posts, use the `:live` suffix after
the language identifier:

- `html:live` for HTML code
- `css:live` for CSS code
- `js:live` for JavaScript code

You can include a title by adding a comment at the beginning:

```
// title: Your Example Title
```

The live examples will be rendered with an interactive preview where readers can
see the result and switch between viewing the code and the preview.

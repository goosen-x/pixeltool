---
title: 'CSS Grid Layout: Complete Guide with Examples'
excerpt:
  'Master CSS Grid Layout with practical examples. Learn how to create complex
  layouts with grid containers, grid items, and responsive design patterns.'
coverImage: '/images/avatar.jpeg'
date: '2024-12-10T10:00:00.000Z'
author:
  name: Dmitry Borisenko
  picture: '/images/avatar.jpeg'
ogImage:
  url: '/images/avatar.jpeg'
---

CSS Grid Layout is a powerful two-dimensional layout system that revolutionized
how we create web layouts. Unlike Flexbox, which is primarily one-dimensional,
Grid allows you to work with both rows and columns simultaneously.

## Basic Grid Container

To create a grid container, simply apply `display: grid` to an element:

```css
.container {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 100px 200px;
	gap: 20px;
}
```

This creates a grid with 3 equal columns and 2 rows with specific heights.

## Grid Template Areas

One of the most intuitive features of CSS Grid is template areas:

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

## Responsive Grid with auto-fit and minmax

Create responsive grids without media queries:

```css
.gallery {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
}
```

This creates a responsive gallery where items automatically wrap to new rows as
needed.

## Advanced Grid Placement

Control item placement with precision:

```css
.item {
	grid-column: 1 / 3; /* Spans from column 1 to 3 */
	grid-row: 2 / 4; /* Spans from row 2 to 4 */
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

## Implicit vs Explicit Grid

CSS Grid automatically creates tracks when needed:

```css
.container {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-auto-rows: minmax(100px, auto);
	grid-auto-flow: dense; /* Fills gaps automatically */
}
```

## Practical Example: Dashboard Layout

Here's a complete dashboard layout using CSS Grid:

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
	min-height: 100vh;
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

	.card.wide {
		grid-column: span 1;
	}
}
```

## Grid Alignment

Control alignment of the entire grid and individual items:

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

## Subgrid (Modern Browsers)

Subgrid allows nested grids to align with parent grid tracks:

```css
.parent {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20px;
}

.child {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 2;
}
```

## Best Practices

1. **Use Grid for 2D layouts**: When you need to control both rows and columns
2. **Combine with Flexbox**: Use Grid for overall layout, Flexbox for component
   internals
3. **Mobile-first approach**: Start with simple layouts and enhance for larger
   screens
4. **Semantic HTML**: Use proper HTML elements regardless of grid placement
5. **Fallbacks**: Provide fallbacks for older browsers when necessary

CSS Grid has transformed web layout possibilities, making complex designs
achievable with clean, maintainable code. Master it, and you'll have a powerful
tool in your web development arsenal.

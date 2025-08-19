---
title: 'CSS Flexbox: The Ultimate Guide with Practical Examples'
excerpt:
  'Comprehensive guide to CSS Flexbox layout. Learn flex containers, flex items,
  alignment, and real-world use cases with code examples.'
coverImage: '/images/avatar.jpeg'
date: '2024-12-08T10:00:00.000Z'
author:
  name: Dmitry Borisenko
  picture: '/images/avatar.jpeg'
ogImage:
  url: '/images/avatar.jpeg'
---

Flexbox (Flexible Box Layout) is a one-dimensional layout method that excels at
distributing space and aligning items in a container. It's perfect for component
layouts, navigation bars, and any scenario where you need flexible, responsive
arrangements.

## Flex Container Basics

To create a flex container, apply `display: flex`:

```css
.container {
	display: flex;
	/* or display: inline-flex; for inline containers */
}
```

## Main Axis and Cross Axis

Understanding axes is crucial for Flexbox:

```css
.container {
	display: flex;
	flex-direction: row; /* Main axis: horizontal, Cross axis: vertical */
	/* Other values: row-reverse, column, column-reverse */
}
```

## Flex Container Properties

### 1. justify-content (Main Axis Alignment)

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

### 2. align-items (Cross Axis Alignment)

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

### 4. align-content (Multi-line Cross Axis)

```css
.container {
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	/* Other values: flex-end, center, space-between, space-around, stretch */
	height: 300px;
}
```

### 5. gap (Spacing Between Items)

```css
.container {
	display: flex;
	gap: 20px; /* Both row and column gap */
	/* Or separately: row-gap: 10px; column-gap: 20px; */
}
```

## Flex Item Properties

### 1. flex-grow, flex-shrink, flex-basis

```css
.item {
	flex-grow: 0; /* Don't grow */
	flex-shrink: 1; /* Can shrink */
	flex-basis: auto; /* Initial size */

	/* Shorthand */
	flex: 1; /* Equivalent to: flex: 1 1 0 */
}

/* Practical example: Sidebar layout */
.layout {
	display: flex;
	gap: 2rem;
	min-height: 100vh;
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

### 2. align-self (Individual Cross Axis Alignment)

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

### 3. order (Visual Order)

```css
.item {
	order: 0; /* Default */
	/* Negative values come first, positive values come last */
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

## Common Flexbox Patterns

### 1. Centering Content

```css
/* Perfect centering */
.center-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
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

### 2. Equal Height Columns

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

### 3. Sticky Footer

```css
body {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
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

### 4. Media Object

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

### 5. Responsive Navigation

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

### 6. Card Grid with Flexbox

```css
.card-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 1.5rem;
	padding: 2rem;
}

.card {
	flex: 1 1 300px; /* Grow, shrink, min-width 300px */
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

## Flexbox vs Grid

Use Flexbox when:

- Working with one-dimensional layouts
- Content size should determine layout
- You need alignment and distribution of space
- Building navigation bars, toolbars, or small components

Use Grid when:

- Working with two-dimensional layouts
- You need precise control over rows and columns
- Building complex page layouts
- You want to overlap items

## Browser Support and Prefixes

Modern browsers fully support Flexbox, but for older browsers:

```css
.container {
	display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;

	-webkit-box-pack: center;
	-webkit-justify-content: center;
	-ms-flex-pack: center;
	justify-content: center;
}
```

Flexbox has become an essential tool for modern web development. Master these
concepts, and you'll be able to create flexible, responsive layouts with ease!

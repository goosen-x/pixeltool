---
title: 'CSS Container Queries: The Future of Responsive Components'
excerpt:
  'Learn how CSS Container Queries enable truly responsive components. Create
  layouts that adapt based on container size, not just viewport.'
coverImage: '/images/avatar.jpeg'
date: '2024-12-02T10:00:00.000Z'
author:
  name: Dmitry Borisenko
  picture: '/images/avatar.jpeg'
ogImage:
  url: '/images/avatar.jpeg'
---

CSS Container Queries are a game-changer for responsive design. Unlike media
queries that respond to viewport size, container queries allow components to
adapt based on their container's size, enabling truly modular and reusable
components.

## Understanding Container Queries

Container queries solve a fundamental limitation of media queries: components
that need to work in different contexts (sidebar, main content, modal) can now
adapt to their immediate container rather than the viewport.

### Basic Syntax

```css
/* Define a container */
.card-container {
	container-type: inline-size;
	container-name: card;
}

/* Query the container */
@container (min-width: 400px) {
	.card {
		display: grid;
		grid-template-columns: 150px 1fr;
		gap: 1rem;
	}
}

/* Named container query */
@container card (min-width: 400px) {
	.card-title {
		font-size: 1.5rem;
	}
}
```

## Container Types

### 1. Inline-Size Container

```css
.container {
	container-type: inline-size;
	/* Queries can check width (inline-size) */
}
```

### 2. Size Container

```css
.container {
	container-type: size;
	/* Queries can check both width and height */
	/* Note: This may affect layout */
}
```

### 3. Normal Container (Default)

```css
.container {
	container-type: normal;
	/* Only style queries allowed, no size queries */
}
```

## Container Query Units

New viewport-relative units for container queries:

```css
.element {
	/* Container query units */
	width: 50cqw; /* 50% of container query width */
	height: 80cqh; /* 80% of container query height */

	/* Logical units */
	padding: 2cqi; /* 2% of container query inline size */
	margin: 1cqb; /* 1% of container query block size */

	/* Smallest/largest dimensions */
	font-size: 5cqmin; /* 5% of container's smaller dimension */
	gap: 2cqmax; /* 2% of container's larger dimension */
}
```

## Practical Examples

### 1. Responsive Card Component

```css
/* Card that adapts to its container */
.card-wrapper {
	container-type: inline-size;
	container-name: card-container;
}

.card {
	background: white;
	border-radius: 8px;
	padding: 1rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Small container: Stacked layout */
@container card-container (max-width: 399px) {
	.card {
		text-align: center;
	}

	.card-image {
		width: 100%;
		height: 200px;
		object-fit: cover;
		border-radius: 8px;
	}

	.card-content {
		margin-top: 1rem;
	}

	.card-title {
		font-size: 1.25rem;
	}
}

/* Medium container: Side-by-side layout */
@container card-container (min-width: 400px) and (max-width: 599px) {
	.card {
		display: grid;
		grid-template-columns: 150px 1fr;
		gap: 1rem;
		align-items: start;
	}

	.card-image {
		width: 100%;
		height: 150px;
		object-fit: cover;
		border-radius: 8px;
	}

	.card-title {
		font-size: 1.375rem;
	}
}

/* Large container: Enhanced layout */
@container card-container (min-width: 600px) {
	.card {
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: 1.5rem;
	}

	.card-image {
		width: 100%;
		height: 200px;
		object-fit: cover;
		border-radius: 8px;
	}

	.card-title {
		font-size: 1.75rem;
		margin-bottom: 0.5rem;
	}

	.card-description {
		font-size: 1.125rem;
		line-height: 1.6;
	}

	.card-actions {
		margin-top: 1rem;
		display: flex;
		gap: 1rem;
	}
}
```

### 2. Responsive Navigation

```css
.nav-container {
	container-type: inline-size;
	container-name: navigation;
}

.nav {
	display: flex;
	align-items: center;
	padding: 1rem;
	background: #2c3e50;
}

.nav-items {
	display: flex;
	list-style: none;
	margin: 0;
	padding: 0;
}

/* Mobile: Hamburger menu */
@container navigation (max-width: 599px) {
	.nav-items {
		display: none;
	}

	.nav-toggle {
		display: block;
		margin-left: auto;
	}

	.nav-items.active {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: #2c3e50;
		padding: 1rem;
	}
}

/* Desktop: Full navigation */
@container navigation (min-width: 600px) {
	.nav-toggle {
		display: none;
	}

	.nav-items {
		gap: 2rem;
		margin-left: auto;
	}

	.nav-item a {
		color: white;
		text-decoration: none;
		font-size: 1rem;
		transition: opacity 0.3s;
	}

	.nav-item a:hover {
		opacity: 0.8;
	}
}
```

### 3. Adaptive Grid Layout

```css
.grid-container {
	container-type: inline-size;
	container-name: grid;
}

.grid {
	display: grid;
	gap: 1rem;
}

/* Responsive grid based on container width */
@container grid (max-width: 499px) {
	.grid {
		grid-template-columns: 1fr;
	}
}

@container grid (min-width: 500px) and (max-width: 799px) {
	.grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@container grid (min-width: 800px) and (max-width: 1199px) {
	.grid {
		grid-template-columns: repeat(3, 1fr);
	}
}

@container grid (min-width: 1200px) {
	.grid {
		grid-template-columns: repeat(4, 1fr);
	}
}
```

### 4. Article Layout

```css
.article-container {
	container-type: inline-size;
	container-name: article;
}

.article {
	padding: 2rem;
}

/* Narrow container: Mobile-optimized */
@container article (max-width: 599px) {
	.article-header {
		text-align: center;
	}

	.article-title {
		font-size: clamp(1.5rem, 5cqw, 2rem);
		line-height: 1.2;
	}

	.article-meta {
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.article-content {
		font-size: 1rem;
		line-height: 1.7;
	}

	.article-image {
		width: 100%;
		margin: 1rem 0;
	}
}

/* Wide container: Desktop-optimized */
@container article (min-width: 600px) {
	.article-title {
		font-size: clamp(2rem, 4cqw, 3rem);
	}

	.article-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.article-content {
		font-size: 1.125rem;
		line-height: 1.8;
		max-width: 65ch;
		margin: 0 auto;
	}

	.article-image {
		float: left;
		width: 40%;
		margin: 0 2rem 1rem 0;
	}
}
```

## Advanced Techniques

### 1. Combining with CSS Variables

```css
.dynamic-container {
	container-type: inline-size;
	--container-padding: clamp(1rem, 3cqw, 3rem);
	--font-scale: clamp(0.875, 0.5cqw, 1.25);
}

@container (min-width: 400px) {
	.dynamic-content {
		padding: var(--container-padding);
		font-size: calc(1rem * var(--font-scale));
	}
}
```

### 2. Container Query with Aspect Ratio

```css
.aspect-container {
	container-type: size;
	aspect-ratio: 16 / 9;
}

@container (aspect-ratio > 1) {
	.content {
		/* Landscape layout */
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
}

@container (aspect-ratio <= 1) {
	.content {
		/* Portrait layout */
		display: flex;
		flex-direction: column;
	}
}
```

### 3. Nested Container Queries

```css
.outer-container {
	container-type: inline-size;
	container-name: outer;
}

.inner-container {
	container-type: inline-size;
	container-name: inner;
}

/* Query outer container */
@container outer (min-width: 800px) {
	.outer-content {
		display: grid;
		grid-template-columns: 300px 1fr;
	}
}

/* Query inner container */
@container inner (min-width: 400px) {
	.inner-content {
		columns: 2;
		gap: 2rem;
	}
}
```

### 4. Style Queries (Future)

```css
/* Note: Style queries are still experimental */
@container style(--theme: dark) {
	.component {
		background: #1a1a1a;
		color: white;
	}
}

@container style(--layout: compact) {
	.component {
		padding: 0.5rem;
		font-size: 0.875rem;
	}
}
```

## Real-World Component Library

```css
/* Base container setup */
.component-container {
	container-type: inline-size;
}

/* Button component */
@container (max-width: 199px) {
	.btn {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}

	.btn-group {
		flex-direction: column;
		width: 100%;
	}

	.btn-group .btn {
		width: 100%;
	}
}

@container (min-width: 200px) {
	.btn {
		padding: 0.625rem 1.25rem;
		font-size: 1rem;
	}

	.btn-group {
		display: flex;
		gap: 0.5rem;
	}
}

/* Form component */
@container (max-width: 399px) {
	.form-group {
		margin-bottom: 1rem;
	}

	.form-label {
		display: block;
		margin-bottom: 0.25rem;
	}

	.form-input {
		width: 100%;
		padding: 0.5rem;
	}
}

@container (min-width: 400px) {
	.form-group {
		display: grid;
		grid-template-columns: 150px 1fr;
		gap: 1rem;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.form-label {
		text-align: right;
	}

	.form-input {
		padding: 0.625rem;
	}
}

/* Data table component */
.table-container {
	container-type: inline-size;
	overflow-x: auto;
}

@container (max-width: 599px) {
	.data-table {
		font-size: 0.875rem;
	}

	.data-table th,
	.data-table td {
		padding: 0.5rem;
	}

	/* Hide less important columns */
	.data-table .optional {
		display: none;
	}
}

@container (min-width: 600px) {
	.data-table {
		font-size: 1rem;
	}

	.data-table th,
	.data-table td {
		padding: 0.75rem 1rem;
	}

	.data-table .optional {
		display: table-cell;
	}
}
```

## Browser Support & Fallbacks

```css
/* Feature detection */
@supports (container-type: inline-size) {
	.container {
		container-type: inline-size;
	}
}

/* Fallback for older browsers */
@supports not (container-type: inline-size) {
	/* Use traditional media queries */
	@media (min-width: 768px) {
		.component {
			/* Desktop styles */
		}
	}
}
```

## Best Practices

1. **Name your containers**: Use descriptive container names for clarity
2. **Start with inline-size**: Most use cases only need width queries
3. **Avoid size type when possible**: It can affect layout calculations
4. **Use container units wisely**: They're powerful but can be confusing
5. **Progressive enhancement**: Always provide fallbacks
6. **Test in context**: Components should work in various container sizes

Container queries represent a paradigm shift in responsive design, enabling
truly modular components that adapt intelligently to their environment. Master
them to build more flexible and maintainable component systems!

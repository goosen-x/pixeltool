---
title: 'CSS Pseudo-classes and Pseudo-elements: Master Advanced Selectors'
excerpt:
  'Deep dive into CSS pseudo-classes and pseudo-elements. Learn how to create
  sophisticated interactions and visual effects without JavaScript.'
coverImage: '/images/avatar.jpeg'
date: '2024-11-30T10:00:00.000Z'
author:
  name: Dmitry Borisenko
  picture: '/images/avatar.jpeg'
ogImage:
  url: '/images/avatar.jpeg'
---

CSS pseudo-classes and pseudo-elements are powerful selectors that allow you to
style elements based on their state or create virtual elements. Understanding
these selectors unlocks advanced styling capabilities without additional HTML or
JavaScript.

## Understanding the Difference

### Pseudo-classes (:)

Target elements based on state or position:

```css
button:hover {
} /* State */
li:first-child {
} /* Position */
input:valid {
} /* Validation */
```

### Pseudo-elements (::)

Create or target virtual elements:

```css
p::first-line {
} /* Target part of element */
div::before {
} /* Create new element */
::selection {
} /* Style user selection */
```

## Essential Pseudo-classes

### 1. Interactive States

```css
/* Hover state */
.button:hover {
	background-color: #2980b9;
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Focus state - important for accessibility */
.input:focus {
	outline: 2px solid #3498db;
	outline-offset: 2px;
	border-color: #3498db;
}

/* Active state - when clicked */
.button:active {
	transform: translateY(0);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Visited links */
a:visited {
	color: #8e44ad;
}

/* Focus visible - only shows focus ring for keyboard navigation */
.button:focus-visible {
	outline: 3px solid #f39c12;
	outline-offset: 2px;
}

/* Remove focus for mouse users */
.button:focus:not(:focus-visible) {
	outline: none;
}
```

### 2. Structural Pseudo-classes

```css
/* First and last child */
.list-item:first-child {
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
}

.list-item:last-child {
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
}

/* Nth-child patterns */
.table-row:nth-child(even) {
	background-color: #f8f9fa;
}

.table-row:nth-child(odd) {
	background-color: white;
}

/* Every 3rd item */
.grid-item:nth-child(3n) {
	margin-right: 0;
}

/* First 3 items */
.card:nth-child(-n + 3) {
	background-color: #e3f2fd;
}

/* All but first 3 */
.card:nth-child(n + 4) {
	opacity: 0.8;
}

/* Only child */
.alert:only-child {
	margin: 2rem auto;
	max-width: 600px;
}

/* Type selectors */
p:first-of-type {
	font-size: 1.25rem;
	font-weight: 500;
}

h2:last-of-type {
	margin-bottom: 2rem;
}
```

### 3. Form Pseudo-classes

```css
/* Input states */
input:valid {
	border-color: #27ae60;
	background-color: #f0fdf4;
}

input:invalid {
	border-color: #e74c3c;
	background-color: #fef2f2;
}

input:required {
	border-left: 3px solid #f39c12;
}

input:optional {
	border-left: 3px solid #95a5a6;
}

input:disabled {
	background-color: #ecf0f1;
	cursor: not-allowed;
	opacity: 0.6;
}

input:enabled {
	background-color: white;
}

input:read-only {
	background-color: #f5f5f5;
	cursor: default;
}

input:read-write {
	background-color: white;
}

/* Checkbox and radio states */
input[type='checkbox']:checked + label {
	color: #27ae60;
	font-weight: bold;
}

input[type='radio']:checked + label::before {
	content: '✓ ';
	color: #27ae60;
}

/* Number input states */
input[type='number']:in-range {
	border-color: #27ae60;
}

input[type='number']:out-of-range {
	border-color: #e74c3c;
	background-color: #fee;
}

/* Placeholder shown */
input:placeholder-shown {
	border-style: dashed;
}

/* Form validation example */
.form-group:has(input:invalid) {
	background-color: #fef2f2;
	padding: 1rem;
	border-radius: 4px;
}

.form-group:has(input:valid) {
	background-color: #f0fdf4;
	padding: 1rem;
	border-radius: 4px;
}
```

### 4. Advanced Selectors

```css
/* :is() - matches any selector in the list */
:is(h1, h2, h3):hover {
	color: #3498db;
	cursor: pointer;
}

/* :where() - same as :is() but with 0 specificity */
:where(h1, h2, h3) {
	line-height: 1.2;
}

/* :has() - parent selector */
article:has(img) {
	display: grid;
	grid-template-columns: 1fr 2fr;
}

/* Container that has a checked checkbox */
.option-card:has(input:checked) {
	border-color: #3498db;
	background-color: #ebf5ff;
}

/* :not() - negation */
.button:not(:disabled):hover {
	transform: translateY(-2px);
}

/* Multiple :not() */
input:not([type='submit']):not([type='button']):not([type='reset']) {
	width: 100%;
	padding: 0.5rem;
}

/* :empty - elements with no children */
.message:empty {
	display: none;
}

.message:not(:empty) {
	padding: 1rem;
	border: 1px solid #ddd;
	border-radius: 4px;
}

/* :target - matches element targeted by URL hash */
section:target {
	background-color: #fffacd;
	padding: 2rem;
	border-left: 4px solid #f39c12;
}
```

## Powerful Pseudo-elements

### 1. ::before and ::after

```css
/* Decorative elements */
.quote::before {
	content: '' ';
  font-size: 3rem;
  color: #bdc3c7;
  position: absolute;
  top: -10px;
  left: -30px;
}

.quote::after {
  content: ' '';
	font-size: 3rem;
	color: #bdc3c7;
	position: absolute;
	bottom: -30px;
	right: -30px;
}

/* Icons without fonts */
.external-link::after {
	content: ' ↗';
	font-size: 0.8em;
	vertical-align: super;
}

/* Tooltips */
.tooltip {
	position: relative;
}

.tooltip::after {
	content: attr(data-tooltip);
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
	background: #333;
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 4px;
	white-space: nowrap;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.3s;
}

.tooltip:hover::after {
	opacity: 1;
}

/* Custom counters */
.timeline-item {
	counter-increment: timeline;
	position: relative;
	padding-left: 3rem;
}

.timeline-item::before {
	content: counter(timeline);
	position: absolute;
	left: 0;
	top: 0;
	width: 2rem;
	height: 2rem;
	background: #3498db;
	color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
}
```

### 2. ::first-line and ::first-letter

```css
/* Drop cap */
p::first-letter {
	font-size: 3rem;
	font-weight: bold;
	float: left;
	line-height: 1;
	margin-right: 0.5rem;
	color: #e74c3c;
}

/* Styled first line */
article p::first-line {
	font-weight: 500;
	font-size: 1.1em;
	color: #2c3e50;
}
```

### 3. ::selection

```css
/* Custom text selection */
::selection {
	background-color: #3498db;
	color: white;
}

/* Different selection for specific elements */
.important::selection {
	background-color: #e74c3c;
	color: white;
}

/* Firefox prefix */
::-moz-selection {
	background-color: #3498db;
	color: white;
}
```

### 4. Form Control Pseudo-elements

```css
/* Placeholder styling */
::placeholder {
	color: #95a5a6;
	font-style: italic;
}

input:focus::placeholder {
	color: transparent;
}

/* File input button */
::file-selector-button {
	background: #3498db;
	color: white;
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	margin-right: 1rem;
}

::file-selector-button:hover {
	background: #2980b9;
}

/* Webkit scrollbar */
::-webkit-scrollbar {
	width: 12px;
}

::-webkit-scrollbar-track {
	background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
	background: #555;
}
```

## Complex Examples

### 1. Custom Checkbox

```css
/* Hide default checkbox */
input[type='checkbox'] {
	position: absolute;
	opacity: 0;
}

/* Custom checkbox */
.checkbox-label {
	position: relative;
	padding-left: 30px;
	cursor: pointer;
}

.checkbox-label::before {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 20px;
	height: 20px;
	border: 2px solid #3498db;
	border-radius: 4px;
	background: white;
	transition: all 0.3s;
}

.checkbox-label::after {
	content: '✓';
	position: absolute;
	left: 5px;
	top: 50%;
	transform: translateY(-50%);
	color: white;
	font-size: 14px;
	opacity: 0;
	transition: opacity 0.3s;
}

input[type='checkbox']:checked + .checkbox-label::before {
	background: #3498db;
}

input[type='checkbox']:checked + .checkbox-label::after {
	opacity: 1;
}

input[type='checkbox']:focus + .checkbox-label::before {
	box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
}
```

### 2. Advanced Navigation

```css
/* Multi-level navigation with indicators */
.nav-item {
	position: relative;
}

.nav-item:hover > .nav-link {
	color: #3498db;
}

/* Dropdown indicator */
.nav-item:has(.dropdown)::after {
	content: '▼';
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
	font-size: 0.8em;
	transition: transform 0.3s;
}

.nav-item:hover::after {
	transform: translateY(-50%) rotate(180deg);
}

/* Active page indicator */
.nav-link:is(.active, [aria-current='page'])::before {
	content: '';
	position: absolute;
	bottom: -2px;
	left: 0;
	right: 0;
	height: 3px;
	background: #3498db;
	transform: scaleX(0);
	transition: transform 0.3s;
}

.nav-link:is(.active, [aria-current='page'])::before,
.nav-link:hover::before {
	transform: scaleX(1);
}
```

### 3. Loading States

```css
/* Skeleton loading effect */
.skeleton {
	position: relative;
	overflow: hidden;
	background: #eee;
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
		rgba(255, 255, 255, 0.5) 50%,
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

/* Loading dots */
.loading::after {
	content: '';
	animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
	0% {
		content: '';
	}
	25% {
		content: '.';
	}
	50% {
		content: '..';
	}
	75% {
		content: '...';
	}
	100% {
		content: '';
	}
}
```

## Performance Tips

1. **Pseudo-elements create real elements**: They impact render tree
2. **Complex selectors can be slow**: Keep specificity reasonable
3. **Avoid expensive properties**: Shadows, filters in pseudo-elements
4. **Use CSS containment**: Limit style recalculation scope

## Browser Compatibility

Most pseudo-classes and pseudo-elements have excellent support, but newer ones
require checking:

- `:has()` - Modern browsers only
- `:is()` / `:where()` - Good support
- `::marker` - Good support
- `:focus-visible` - Modern browsers

Master pseudo-classes and pseudo-elements to write cleaner HTML while achieving
sophisticated designs and interactions purely with CSS!

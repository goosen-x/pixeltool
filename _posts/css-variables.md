---
title: 'CSS Variables (Custom Properties): Dynamic Styling Made Easy'
excerpt:
  'Master CSS custom properties for dynamic, maintainable stylesheets. Learn how
  to create themes, responsive designs, and interactive components with CSS
  variables.'
coverImage: '/images/avatar.jpeg'
date: '2024-12-04T10:00:00.000Z'
author:
  name: Dmitry Borisenko
  picture: '/images/avatar.jpeg'
ogImage:
  url: '/images/avatar.jpeg'
---

CSS Custom Properties (commonly known as CSS Variables) revolutionize how we
write and maintain CSS. They bring the power of variables to CSS, enabling
dynamic styling, theming, and more maintainable code.

## Basic Syntax and Usage

### Declaring CSS Variables

```css
:root {
	/* Global variables */
	--primary-color: #3498db;
	--secondary-color: #2ecc71;
	--spacing-unit: 1rem;
	--border-radius: 8px;
}

.component {
	/* Scoped variables */
	--component-padding: calc(var(--spacing-unit) * 2);
	--component-bg: #f8f9fa;
}
```

### Using CSS Variables

```css
.button {
	background-color: var(--primary-color);
	padding: var(--spacing-unit);
	border-radius: var(--border-radius);

	/* With fallback value */
	color: var(--button-text-color, white);
}
```

## Variable Scope and Inheritance

### Global vs Local Scope

```css
:root {
	--global-color: blue;
}

.parent {
	--local-color: red;
	color: var(--local-color); /* red */
}

.child {
	/* Inherits from parent */
	background: var(--local-color); /* red */
	border-color: var(--global-color); /* blue */
}
```

### Overriding Variables

```css
:root {
	--spacing: 1rem;
}

.compact {
	--spacing: 0.5rem;
}

.spacious {
	--spacing: 2rem;
}

.element {
	padding: var(--spacing);
	/* Padding changes based on parent class */
}
```

## Dynamic Theming

### Light/Dark Theme Implementation

```css
:root {
	/* Light theme (default) */
	--bg-primary: #ffffff;
	--bg-secondary: #f8f9fa;
	--text-primary: #212529;
	--text-secondary: #6c757d;
	--border-color: #dee2e6;
	--shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] {
	/* Dark theme */
	--bg-primary: #1a1a1a;
	--bg-secondary: #2d2d2d;
	--text-primary: #ffffff;
	--text-secondary: #b0b0b0;
	--border-color: #404040;
	--shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Components automatically adapt */
body {
	background-color: var(--bg-primary);
	color: var(--text-primary);
	transition:
		background-color 0.3s ease,
		color 0.3s ease;
}

.card {
	background: var(--bg-secondary);
	border: 1px solid var(--border-color);
	box-shadow: var(--shadow);
	padding: 1.5rem;
	border-radius: 8px;
}

.text-muted {
	color: var(--text-secondary);
}
```

### Theme Switcher JavaScript

```javascript
// Toggle theme
const toggleTheme = () => {
	const currentTheme = document.documentElement.getAttribute('data-theme')
	const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
	document.documentElement.setAttribute('data-theme', newTheme)
	localStorage.setItem('theme', newTheme)
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.setAttribute('data-theme', savedTheme)
```

## Responsive Design with Variables

### Responsive Typography

```css
:root {
	--font-size-base: 16px;
	--font-size-scale: 1.2;

	/* Type scale */
	--font-size-sm: calc(var(--font-size-base) / var(--font-size-scale));
	--font-size-md: var(--font-size-base);
	--font-size-lg: calc(var(--font-size-base) * var(--font-size-scale));
	--font-size-xl: calc(var(--font-size-lg) * var(--font-size-scale));
	--font-size-xxl: calc(var(--font-size-xl) * var(--font-size-scale));
}

/* Responsive adjustments */
@media (max-width: 768px) {
	:root {
		--font-size-base: 14px;
	}
}

h1 {
	font-size: var(--font-size-xxl);
}
h2 {
	font-size: var(--font-size-xl);
}
h3 {
	font-size: var(--font-size-lg);
}
p {
	font-size: var(--font-size-md);
}
small {
	font-size: var(--font-size-sm);
}
```

### Responsive Spacing System

```css
:root {
	--spacing-base: 1rem;

	/* Spacing scale */
	--space-xs: calc(var(--spacing-base) * 0.25);
	--space-sm: calc(var(--spacing-base) * 0.5);
	--space-md: var(--spacing-base);
	--space-lg: calc(var(--spacing-base) * 1.5);
	--space-xl: calc(var(--spacing-base) * 2);
	--space-xxl: calc(var(--spacing-base) * 3);
}

@media (max-width: 768px) {
	:root {
		--spacing-base: 0.875rem;
	}
}

.section {
	padding: var(--space-xl) var(--space-lg);
}

.stack > * + * {
	margin-top: var(--space-md);
}
```

## Advanced Techniques

### 1. Computed Values with calc()

```css
:root {
	--grid-columns: 12;
	--grid-gap: 20px;
	--container-width: 1200px;
}

.grid-item {
	--columns-span: 4;
	width: calc(
		(var(--container-width) - (var(--grid-columns) - 1) * var(--grid-gap)) /
			var(--grid-columns) * var(--columns-span) + (var(--columns-span) - 1) *
			var(--grid-gap)
	);
}
```

### 2. Color Manipulation

```css
:root {
	--primary-h: 210;
	--primary-s: 100%;
	--primary-l: 50%;

	/* Base color */
	--primary: hsl(var(--primary-h), var(--primary-s), var(--primary-l));

	/* Variations */
	--primary-light: hsl(
		var(--primary-h),
		var(--primary-s),
		calc(var(--primary-l) + 20%)
	);
	--primary-dark: hsl(
		var(--primary-h),
		var(--primary-s),
		calc(var(--primary-l) - 20%)
	);
	--primary-alpha: hsla(
		var(--primary-h),
		var(--primary-s),
		var(--primary-l),
		0.2
	);
}

.button {
	background: var(--primary);
	border: 2px solid var(--primary-dark);
	box-shadow: 0 4px 6px var(--primary-alpha);
}

.button:hover {
	background: var(--primary-dark);
}
```

### 3. Dynamic Animations

```css
@keyframes pulse {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(var(--pulse-scale, 1.05));
	}
	100% {
		transform: scale(1);
	}
}

.pulse-sm {
	--pulse-scale: 1.02;
	animation: pulse 2s infinite;
}

.pulse-lg {
	--pulse-scale: 1.1;
	animation: pulse 2s infinite;
}
```

### 4. Component Configuration

```css
/* Configurable button component */
.btn {
	--btn-padding-y: 0.5rem;
	--btn-padding-x: 1rem;
	--btn-font-size: 1rem;
	--btn-border-radius: 0.25rem;
	--btn-bg: var(--primary-color);
	--btn-color: white;
	--btn-border-width: 2px;
	--btn-border-color: transparent;
	--btn-hover-bg: var(--primary-dark);

	padding: var(--btn-padding-y) var(--btn-padding-x);
	font-size: var(--btn-font-size);
	border-radius: var(--btn-border-radius);
	background: var(--btn-bg);
	color: var(--btn-color);
	border: var(--btn-border-width) solid var(--btn-border-color);
	transition: all 0.3s ease;
	cursor: pointer;
}

.btn:hover {
	background: var(--btn-hover-bg);
}

/* Variants */
.btn-lg {
	--btn-padding-y: 0.75rem;
	--btn-padding-x: 1.5rem;
	--btn-font-size: 1.125rem;
}

.btn-outline {
	--btn-bg: transparent;
	--btn-color: var(--primary-color);
	--btn-border-color: currentColor;
	--btn-hover-bg: var(--primary-color);
	--btn-hover-color: white;
}

.btn-outline:hover {
	color: var(--btn-hover-color);
}
```

## JavaScript Integration

### Reading CSS Variables

```javascript
// Get computed styles
const styles = getComputedStyle(document.documentElement)
const primaryColor = styles.getPropertyValue('--primary-color')

// Get from specific element
const element = document.querySelector('.component')
const elementStyles = getComputedStyle(element)
const spacing = elementStyles.getPropertyValue('--spacing')
```

### Setting CSS Variables

```javascript
// Set on root
document.documentElement.style.setProperty('--primary-color', '#e74c3c')

// Set on specific element
element.style.setProperty('--component-height', '200px')

// Dynamic updates
const updateThemeColor = hue => {
	document.documentElement.style.setProperty('--primary-h', hue)
}

// Reactive to user input
slider.addEventListener('input', e => {
	updateThemeColor(e.target.value)
})
```

### Responsive Variables with JavaScript

```javascript
// Update variables based on viewport
const updateCSSVariables = () => {
	const vw = window.innerWidth
	const vh = window.innerHeight

	document.documentElement.style.setProperty('--vw', `${vw}px`)
	document.documentElement.style.setProperty('--vh', `${vh}px`)

	// Custom breakpoint variable
	const breakpoint = vw < 768 ? 'mobile' : vw < 1024 ? 'tablet' : 'desktop'
	document.documentElement.style.setProperty('--device', `"${breakpoint}"`)
}

window.addEventListener('resize', updateCSSVariables)
updateCSSVariables()
```

## Real-World Examples

### 1. Design System Variables

```css
:root {
	/* Colors */
	--color-primary: #1a73e8;
	--color-secondary: #ea4335;
	--color-success: #34a853;
	--color-warning: #fbbc04;
	--color-error: #ea4335;

	/* Typography */
	--font-family-base:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	--font-family-mono: 'Fira Code', Monaco, monospace;
	--line-height-base: 1.6;
	--line-height-heading: 1.2;

	/* Shadows */
	--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
	--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
	--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);

	/* Z-index scale */
	--z-dropdown: 1000;
	--z-sticky: 1020;
	--z-fixed: 1030;
	--z-modal-backdrop: 1040;
	--z-modal: 1050;
	--z-popover: 1060;
	--z-tooltip: 1070;
}
```

### 2. Grid System with Variables

```css
.grid {
	--grid-columns: 12;
	--grid-gap: 1rem;

	display: grid;
	grid-template-columns: repeat(var(--grid-columns), 1fr);
	gap: var(--grid-gap);
}

.grid-item {
	grid-column: span var(--span, 1);
}

/* Usage */
.col-6 {
	--span: 6;
}
.col-4 {
	--span: 4;
}
.col-3 {
	--span: 3;
}

@media (max-width: 768px) {
	.grid {
		--grid-columns: 4;
	}

	.col-sm-full {
		--span: 4;
	}
	.col-sm-half {
		--span: 2;
	}
}
```

## Performance Considerations

1. **Variables are live**: Changes update everywhere instantly
2. **Inheritance works**: Children inherit parent values
3. **calc() is computed**: Complex calculations may impact performance
4. **Browser support**: Modern browsers fully support CSS variables

## Best Practices

1. **Naming conventions**: Use consistent prefixes (--color-, --space-, --font-)
2. **Provide fallbacks**: Always include fallback values for critical styles
3. **Document variables**: Comment complex calculations or non-obvious values
4. **Organize logically**: Group related variables together
5. **Start global**: Define system-wide variables in :root
6. **Component scope**: Use local variables for component-specific values

CSS Variables transform static stylesheets into dynamic, maintainable systems.
Master them to build flexible, themeable applications with ease!

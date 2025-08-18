---
title: 'CSS Animations: From Basics to Advanced Techniques'
excerpt:
  'Learn how to create stunning animations with CSS. From simple transitions to
  complex keyframe animations, performance optimization, and real-world
  examples.'
coverImage: '/images/avatar.jpeg'
date: '2024-12-06T10:00:00.000Z'
author:
  name: Dmitry Borisenko
  picture: '/images/avatar.jpeg'
ogImage:
  url: '/images/avatar.jpeg'
---

CSS animations bring life to web interfaces, creating engaging user experiences
without JavaScript. This guide covers everything from basic transitions to
advanced animation techniques.

## CSS Transitions

Transitions are the simplest form of CSS animation, perfect for hover effects
and state changes.

### Basic Transition Syntax

```css
.button {
	background: #3498db;
	color: white;
	padding: 10px 20px;
	transition: background 0.3s ease;
}

.button:hover {
	background: #2980b9;
}

/* Multiple properties */
.card {
	transform: translateY(0);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	transition:
		transform 0.3s ease,
		box-shadow 0.3s ease;
}

.card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
```

### Transition Properties

```css
.element {
	/* Shorthand */
	transition: property duration timing-function delay;

	/* Individual properties */
	transition-property: transform, opacity;
	transition-duration: 0.3s, 0.5s;
	transition-timing-function: ease-in-out, linear;
	transition-delay: 0s, 0.1s;
}
```

### Timing Functions

```css
.examples {
	/* Predefined */
	transition-timing-function: ease; /* slow-fast-slow */
	transition-timing-function: linear; /* constant speed */
	transition-timing-function: ease-in; /* slow start */
	transition-timing-function: ease-out; /* slow end */
	transition-timing-function: ease-in-out; /* slow start and end */

	/* Custom cubic-bezier */
	transition-timing-function: cubic-bezier(
		0.68,
		-0.55,
		0.265,
		1.55
	); /* Bounce effect */

	/* Steps */
	transition-timing-function: steps(4, end);
}
```

## CSS Keyframe Animations

Keyframe animations offer more control for complex animations.

### Basic @keyframes

```css
@keyframes slide-in {
	from {
		transform: translateX(-100%);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
}

.element {
	animation: slide-in 0.5s ease-out;
}
```

### Multiple Keyframes

```css
@keyframes bounce {
	0% {
		transform: translateY(0);
	}
	25% {
		transform: translateY(-20px);
	}
	50% {
		transform: translateY(0);
	}
	75% {
		transform: translateY(-10px);
	}
	100% {
		transform: translateY(0);
	}
}

.bouncing-element {
	animation: bounce 1s ease-in-out infinite;
}
```

### Animation Properties

```css
.element {
	/* Shorthand */
	animation: name duration timing-function delay iteration-count direction
		fill-mode play-state;

	/* Individual properties */
	animation-name: slide-in;
	animation-duration: 1s;
	animation-timing-function: ease-out;
	animation-delay: 0.5s;
	animation-iteration-count: infinite; /* or number */
	animation-direction: alternate; /* normal, reverse, alternate, alternate-reverse */
	animation-fill-mode: forwards; /* none, forwards, backwards, both */
	animation-play-state: running; /* running, paused */
}
```

## Practical Animation Examples

### 1. Loading Spinner

```css
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.spinner {
	width: 40px;
	height: 40px;
	border: 4px solid #f3f3f3;
	border-top: 4px solid #3498db;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}
```

### 2. Pulse Effect

```css
@keyframes pulse {
	0% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.1);
		opacity: 0.7;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}

.pulse-button {
	background: #e74c3c;
	color: white;
	padding: 15px 30px;
	border: none;
	border-radius: 50px;
	cursor: pointer;
	animation: pulse 2s ease-in-out infinite;
}
```

### 3. Text Animation

```css
@keyframes typing {
	from {
		width: 0;
	}
	to {
		width: 100%;
	}
}

@keyframes blink {
	50% {
		border-color: transparent;
	}
}

.typewriter {
	font-family: monospace;
	overflow: hidden;
	border-right: 3px solid;
	white-space: nowrap;
	animation:
		typing 3.5s steps(40, end),
		blink 0.75s step-end infinite;
}
```

### 4. Card Flip Animation

```css
.flip-card {
	width: 300px;
	height: 200px;
	perspective: 1000px;
}

.flip-card-inner {
	position: relative;
	width: 100%;
	height: 100%;
	transition: transform 0.6s;
	transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
	transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
	position: absolute;
	width: 100%;
	height: 100%;
	backface-visibility: hidden;
	border-radius: 10px;
}

.flip-card-front {
	background: #3498db;
	color: white;
}

.flip-card-back {
	background: #2ecc71;
	color: white;
	transform: rotateY(180deg);
}
```

### 5. Staggered Animation

```css
@keyframes fade-in-up {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.stagger-container .item {
	opacity: 0;
	animation: fade-in-up 0.5s ease forwards;
}

.stagger-container .item:nth-child(1) {
	animation-delay: 0.1s;
}
.stagger-container .item:nth-child(2) {
	animation-delay: 0.2s;
}
.stagger-container .item:nth-child(3) {
	animation-delay: 0.3s;
}
.stagger-container .item:nth-child(4) {
	animation-delay: 0.4s;
}

/* Or use CSS custom properties for dynamic delays */
.stagger-container .item {
	animation-delay: calc(var(--i) * 0.1s);
}
```

### 6. Morphing Shape

```css
@keyframes morph {
	0% {
		border-radius: 50%;
		background: #3498db;
		transform: rotate(0deg);
	}
	50% {
		border-radius: 0%;
		background: #e74c3c;
		transform: rotate(180deg) scale(0.5);
	}
	100% {
		border-radius: 50%;
		background: #3498db;
		transform: rotate(360deg) scale(1);
	}
}

.morph-shape {
	width: 100px;
	height: 100px;
	animation: morph 4s ease-in-out infinite;
}
```

## Advanced Techniques

### 1. Animation with CSS Variables

```css
.dynamic-animation {
  --rotation: 0deg;
  --scale: 1;
  transform: rotate(var(--rotation)) scale(var(--scale));
  transition: transform 0.3s ease;
}

/* Update via JavaScript */
element.style.setProperty('--rotation', '180deg');
element.style.setProperty('--scale', '1.5');
```

### 2. Scroll-Triggered Animations

```css
@keyframes slide-in-left {
	from {
		opacity: 0;
		transform: translateX(-100px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.scroll-element {
	opacity: 0;
}

.scroll-element.visible {
	animation: slide-in-left 0.6s ease forwards;
}

/* Intersection Observer in JavaScript triggers .visible class */
```

### 3. SVG Path Animation

```css
.path {
	stroke-dasharray: 1000;
	stroke-dashoffset: 1000;
	animation: draw 2s ease forwards;
}

@keyframes draw {
	to {
		stroke-dashoffset: 0;
	}
}
```

## Performance Optimization

### 1. Use Transform and Opacity

```css
/* Good - GPU accelerated */
.optimized {
	transform: translateX(100px);
	opacity: 0.5;
}

/* Avoid - Triggers layout */
.not-optimized {
	left: 100px;
	width: 200px;
}
```

### 2. Will-Change Property

```css
.will-animate {
	will-change: transform, opacity;
}

/* Remove after animation */
.animation-done {
	will-change: auto;
}
```

### 3. Reduce Paint Areas

```css
/* Isolate animations */
.animated-element {
	will-change: transform;
	transform: translateZ(0); /* Create new layer */
}
```

## Animation Best Practices

1. **Keep it subtle**: Animations should enhance, not distract
2. **Respect motion preferences**:
   ```css
   @media (prefers-reduced-motion: reduce) {
   	* {
   		animation-duration: 0.01ms !important;
   		animation-iteration-count: 1 !important;
   		transition-duration: 0.01ms !important;
   	}
   }
   ```
3. **Test performance**: Use DevTools to check for dropped frames
4. **Use appropriate durations**:
   - Micro-interactions: 100-300ms
   - Page transitions: 300-500ms
   - Complex animations: 500-1000ms
5. **Provide feedback**: Ensure animations communicate state changes

## Debugging Animations

```css
/* Slow down all animations for debugging */
* {
	animation-duration: 10s !important;
	transition-duration: 10s !important;
}
```

CSS animations are powerful tools for creating engaging web experiences. Use
them wisely to enhance usability and delight your users!

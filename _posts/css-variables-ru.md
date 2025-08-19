---
title: 'CSS Переменные (Custom Properties): Динамическая Стилизация'
excerpt:
  'Изучите CSS custom properties для создания динамических, поддерживаемых
  стилей. Узнайте, как создавать темы, отзывчивые дизайны и интерактивные
  компоненты с CSS переменными.'
coverImage: '/images/avatar.jpeg'
date: '2024-12-04T10:00:00.000Z'
author:
  name: Dmitry Borisenko
  picture: '/images/avatar.jpeg'
ogImage:
  url: '/images/avatar.jpeg'
---

CSS Custom Properties (известные как CSS Переменные) революционизируют способ
написания и поддержки CSS. Они привносят силу переменных в CSS, обеспечивая
динамическую стилизацию, темизацию и более поддерживаемый код.

## Базовый синтаксис и использование

### Объявление CSS переменных

```css
:root {
	/* Глобальные переменные */
	--primary-color: #3498db;
	--secondary-color: #2ecc71;
	--spacing-unit: 1rem;
	--border-radius: 8px;
}

.component {
	/* Локальные переменные */
	--component-padding: calc(var(--spacing-unit) * 2);
	--component-bg: #f8f9fa;
}
```

### Использование CSS переменных

```css
.button {
	background-color: var(--primary-color);
	padding: var(--spacing-unit);
	border-radius: var(--border-radius);

	/* С резервным значением */
	color: var(--button-text-color, white);
}
```

## Область видимости и наследование

### Глобальная vs Локальная область

```css
:root {
	--global-color: blue;
}

.parent {
	--local-color: red;
	color: var(--local-color); /* красный */
}

.child {
	/* Наследует от родителя */
	background: var(--local-color); /* красный */
	border-color: var(--global-color); /* синий */
}
```

### Переопределение переменных

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
	/* Отступы меняются в зависимости от родительского класса */
}
```

## Динамическая темизация

### Реализация светлой/темной темы

```css
:root {
	/* Светлая тема (по умолчанию) */
	--bg-primary: #ffffff;
	--bg-secondary: #f8f9fa;
	--text-primary: #212529;
	--text-secondary: #6c757d;
	--border-color: #dee2e6;
	--shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] {
	/* Темная тема */
	--bg-primary: #1a1a1a;
	--bg-secondary: #2d2d2d;
	--text-primary: #ffffff;
	--text-secondary: #b0b0b0;
	--border-color: #404040;
	--shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Компоненты автоматически адаптируются */
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
```

## Интеграция с JavaScript

### Чтение CSS переменных

```javascript
// Получение вычисленных стилей
const styles = getComputedStyle(document.documentElement)
const primaryColor = styles.getPropertyValue('--primary-color')

// Получение от конкретного элемента
const element = document.querySelector('.component')
const elementStyles = getComputedStyle(element)
const spacing = elementStyles.getPropertyValue('--spacing')
```

### Установка CSS переменных

```javascript
// Установка на корне
document.documentElement.style.setProperty('--primary-color', '#e74c3c')

// Установка на конкретном элементе
element.style.setProperty('--component-height', '200px')

// Динамические обновления
const updateThemeColor = hue => {
	document.documentElement.style.setProperty('--primary-h', hue)
}
```

## Продвинутые техники

### Манипуляции с цветом

```css
:root {
	--primary-h: 210;
	--primary-s: 100%;
	--primary-l: 50%;

	/* Базовый цвет */
	--primary: hsl(var(--primary-h), var(--primary-s), var(--primary-l));

	/* Вариации */
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
```

### Адаптивная типографика

```css
:root {
	--font-size-base: 16px;
	--font-size-scale: 1.2;

	/* Типографическая шкала */
	--font-size-sm: calc(var(--font-size-base) / var(--font-size-scale));
	--font-size-md: var(--font-size-base);
	--font-size-lg: calc(var(--font-size-base) * var(--font-size-scale));
	--font-size-xl: calc(var(--font-size-lg) * var(--font-size-scale));
}

@media (max-width: 768px) {
	:root {
		--font-size-base: 14px;
	}
}
```

## Лучшие практики

1. **Соглашения об именовании**: Используйте последовательные префиксы
   (--color-, --space-, --font-)
2. **Предоставляйте fallback**: Всегда включайте резервные значения для
   критичных стилей
3. **Документируйте переменные**: Комментируйте сложные вычисления
4. **Организуйте логично**: Группируйте связанные переменные вместе
5. **Начинайте глобально**: Определяйте системные переменные в :root

CSS Переменные превращают статичные стили в динамические, поддерживаемые
системы. Овладейте ими для создания гибких, темизируемых приложений!

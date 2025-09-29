# Widget Tips & Tutorials Guide

This guide explains how to add tips and interactive tutorials to widgets in the
portfolio project.

## Overview

The widget tips and tutorials system consists of:

1. **`WidgetTips`** - Displays helpful tips with categories and auto-rotation
2. **`WidgetTutorial`** - Interactive step-by-step tutorials with element
   highlighting
3. **`useWidgetTips`** - Hook for managing tips state and completion tracking

## Component Usage

### 1. Basic Tips Implementation

```tsx
import { WidgetTips } from '@/components/widgets'

const tips = [
	{
		id: 'basic-usage',
		title: 'Basic Usage',
		description: 'Enter your data and click calculate',
		category: 'basic'
	},
	{
		id: 'keyboard-shortcut',
		title: 'Quick Calculate',
		description: 'Press Ctrl/Cmd + Enter to calculate',
		category: 'shortcut'
	}
]

export default function YourWidget() {
	return (
		<div>
			<WidgetTips tips={tips} widgetId='your-widget-id' variant='inline' />
			{/* Your widget content */}
		</div>
	)
}
```

### 2. Tips with Actions

```tsx
const tips = [
	{
		id: 'advanced-features',
		title: 'Advanced Features',
		description: 'Unlock powerful features by enabling advanced mode',
		category: 'advanced',
		action: {
			label: 'Enable Advanced Mode',
			onClick: () => setAdvancedMode(true)
		}
	}
]
```

### 3. Interactive Tutorial

```tsx
import { WidgetTutorial } from '@/components/widgets'

const tutorialSteps = [
	{
		id: 'welcome',
		title: 'Welcome to the Widget',
		description: 'This tutorial will guide you through the features'
	},
	{
		id: 'input',
		title: 'Enter Your Data',
		description: 'Type your input in this field',
		element: '#input-field', // CSS selector
		position: 'top',
		action: {
			type: 'input',
			target: '#input-field',
			value: 'Sample text'
		}
	},
	{
		id: 'calculate',
		title: 'Calculate Result',
		description: 'Click this button to see the result',
		element: '#calculate-button',
		position: 'bottom',
		action: {
			type: 'click',
			target: '#calculate-button'
		}
	}
]

export default function YourWidget() {
	return (
		<div>
			<WidgetTutorial
				steps={tutorialSteps}
				widgetId='your-widget-id'
				onComplete={() => toast.success('Tutorial completed!')}
			/>
			{/* Your widget content */}
		</div>
	)
}
```

### 4. Using the Tips Hook

```tsx
import { useWidgetTips } from '@/lib/hooks/useWidgetTips'

export default function YourWidget() {
	const {
		completedTips,
		markTipAsCompleted,
		showNextTip,
		completionRate,
		resetTips
	} = useWidgetTips({
		widgetId: 'your-widget-id',
		tips: yourTips,
		onTipComplete: tipId => {
			console.log(`Tip ${tipId} completed`)
		}
	})

	return (
		<div>
			<div>Progress: {completionRate}%</div>
			<Button onClick={showNextTip}>Show Next Tip</Button>
			<Button onClick={resetTips}>Reset Progress</Button>
		</div>
	)
}
```

## Tip Categories

- **`basic`** - Essential features every user should know
- **`advanced`** - Power user features and complex functionality
- **`pro`** - Expert tips and hidden features
- **`shortcut`** - Keyboard shortcuts and quick actions

## Tutorial Step Properties

```tsx
interface TutorialStep {
	id: string // Unique identifier
	title: string // Step title
	description: string // Step description
	element?: string // CSS selector to highlight
	position?: 'top' | 'bottom' | 'left' | 'right' // Tooltip position
	action?: {
		type: 'click' | 'input' | 'hover' | 'keyboard'
		target?: string // CSS selector for click/input
		value?: string // Value for input action
		keys?: string[] // Keys for keyboard action
	}
	validation?: () => boolean // Custom validation function
	onComplete?: () => void // Callback when step completes
}
```

## Pre-built Tip Collections

Import ready-to-use tip collections:

```tsx
import {
	calculatorTips,
	converterTips,
	generatorTips,
	editorTips
} from '@/lib/hooks/useWidgetTips'
```

## Styling and Customization

### Tips Component Variants

- **`inline`** - Compact view, perfect for widget headers
- **`modal`** - Full-screen modal with navigation controls

### Custom Styling

```tsx
<WidgetTips
	tips={tips}
	widgetId='widget-id'
	className='custom-class'
	variant='inline'
/>
```

### Tutorial Highlighting

The tutorial automatically adds highlighting to elements:

```css
.tutorial-highlight {
	position: relative;
	z-index: 41 !important;
	box-shadow: 0 0 0 4px rgba(var(--primary), 0.3);
	animation: tutorial-pulse 2s infinite;
}
```

## Best Practices

1. **Tip Content**
   - Keep descriptions concise (max 100 characters)
   - Use action verbs in titles
   - Group related tips by category

2. **Tutorial Design**
   - Start with a welcome step
   - Limit to 5-7 steps per tutorial
   - Test element selectors thoroughly
   - Provide clear completion feedback

3. **Performance**
   - Tips are loaded on demand
   - Progress is saved to localStorage
   - Tutorials pause when user navigates away

4. **Accessibility**
   - All interactive elements are keyboard navigable
   - Tips auto-pause when focused
   - Screen reader friendly descriptions

## Implementation Examples

### BMI Calculator

```tsx
const bmiTips = [
	{
		id: 'units',
		title: 'Switch Units Easily',
		description: 'Toggle between metric and imperial units',
		category: 'basic'
	},
	{
		id: 'advanced',
		title: 'Advanced Metrics',
		description: 'Calculate body fat percentage',
		category: 'advanced',
		action: {
			label: 'Show Advanced',
			onClick: () => setShowAdvanced(true)
		}
	}
]
```

### ASCII Art Generator

```tsx
const tutorialSteps = [
	{
		id: 'tabs',
		title: 'Choose Input Type',
		description: 'Select Text, Image, or Patterns',
		element: '.tabs-list',
		position: 'bottom'
	},
	{
		id: 'generate',
		title: 'Generate ASCII Art',
		description: 'Click to create your art',
		element: 'button:contains("Generate")',
		action: {
			type: 'click',
			target: 'button:contains("Generate")'
		}
	}
]
```

## Keyboard Shortcuts

Tips component supports:

- **Left/Right Arrow** - Navigate between tips
- **Space** - Pause/resume auto-rotation
- **Escape** - Close tips

## Migration Checklist

- [ ] Define tip content for your widget
- [ ] Choose appropriate categories
- [ ] Add WidgetTips component
- [ ] Create tutorial steps (optional)
- [ ] Test element selectors
- [ ] Add completion tracking
- [ ] Test on mobile devices

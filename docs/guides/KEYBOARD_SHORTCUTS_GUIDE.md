# Widget Keyboard Shortcuts Guide

This guide explains how to implement keyboard shortcuts in widgets for improved
user experience and accessibility.

## Overview

The keyboard shortcuts system provides:

1. **`useWidgetKeyboard`** - Hook for managing keyboard shortcuts
2. **`WidgetKeyboardShortcuts`** - Component for displaying shortcuts
3. **`ShortcutHint`** - Inline component for showing shortcut hints

## Implementation

### 1. Basic Setup

```tsx
import {
	useWidgetKeyboard,
	commonWidgetShortcuts,
	type KeyboardShortcut
} from '@/lib/hooks/useWidgetKeyboard'
import { WidgetKeyboardShortcuts } from '@/components/widgets'

export default function YourWidget() {
	const shortcuts: KeyboardShortcut[] = [
		{
			key: 'Enter',
			ctrl: true,
			description: 'Submit form',
			action: () => handleSubmit()
		},
		{
			key: 'r',
			ctrl: true,
			shift: true,
			description: 'Reset form',
			action: () => handleReset()
		}
	]

	useWidgetKeyboard({
		shortcuts,
		widgetId: 'your-widget-id',
		enabled: true
	})

	return (
		<div>
			{/* Your widget content */}

			<WidgetKeyboardShortcuts
				shortcuts={shortcuts}
				variant='floating'
				position='bottom-right'
			/>
		</div>
	)
}
```

### 2. Using Common Shortcuts

```tsx
const shortcuts: KeyboardShortcut[] = [
	{
		...commonWidgetShortcuts.submit,
		action: handleCalculate
	},
	{
		...commonWidgetShortcuts.copy,
		action: copyResults,
		enabled: !!results // Conditionally enable
	},
	{
		...commonWidgetShortcuts.reset,
		action: reset
	}
]
```

### 3. Display Variants

#### Floating Button (Default)

```tsx
<WidgetKeyboardShortcuts
	shortcuts={shortcuts}
	variant='floating'
	position='bottom-right'
/>
```

#### Dialog Trigger

```tsx
<WidgetKeyboardShortcuts shortcuts={shortcuts} variant='dialog' />
```

#### Inline Display

```tsx
<WidgetKeyboardShortcuts
	shortcuts={shortcuts}
	variant='inline'
	className='mb-4'
/>
```

### 4. Inline Shortcut Hints

Show shortcuts next to buttons:

```tsx
import { ShortcutHint } from '@/components/widgets'
;<Button onClick={handleSubmit}>
	Submit
	<ShortcutHint
		shortcut={{
			key: 'Enter',
			ctrl: true,
			description: '',
			action: handleSubmit
		}}
		className='ml-2'
	/>
</Button>
```

## Shortcut Configuration

### KeyboardShortcut Interface

```tsx
interface KeyboardShortcut {
	key: string // Key to press (e.g., 'Enter', 'a', 'ArrowUp')
	ctrl?: boolean // Require Ctrl/Cmd key
	shift?: boolean // Require Shift key
	alt?: boolean // Require Alt key
	meta?: boolean // Require Meta/Windows key
	description: string // Description shown in shortcuts list
	action: () => void // Function to execute
	enabled?: boolean // Conditionally enable/disable
}
```

### Common Patterns

```tsx
// Submit/Calculate
{ key: 'Enter', ctrl: true, description: 'Submit', action: handleSubmit }

// Copy
{ key: 'c', ctrl: true, shift: true, description: 'Copy result', action: copyResult }

// Reset
{ key: 'r', ctrl: true, shift: true, description: 'Reset', action: reset }

// Focus search
{ key: '/', description: 'Focus search', action: () => searchInput.focus() }

// Navigate tabs
{ key: '1', ctrl: true, description: 'Go to tab 1', action: () => setTab(0) }
{ key: '2', ctrl: true, description: 'Go to tab 2', action: () => setTab(1) }

// Toggle settings
{ key: 's', ctrl: true, description: 'Toggle settings', action: toggleSettings }

// Help
{ key: '?', shift: true, description: 'Show help', action: showHelp }
```

## Pre-built Shortcut Collections

```tsx
import {
	calculatorShortcuts,
	converterShortcuts,
	generatorShortcuts,
	editorShortcuts
} from '@/lib/hooks/useWidgetKeyboard'

// Override actions
const shortcuts = calculatorShortcuts.map(shortcut => ({
	...shortcut,
	action:
		shortcut.key === 'Enter' && shortcut.ctrl
			? handleCalculate
			: shortcut.action
}))
```

## Advanced Features

### 1. Focus Management

```tsx
const { focusElement, focusNext, focusPrevious } = useWidgetKeyboard({
	shortcuts,
	widgetId: 'widget-id'
})

// Focus specific element
focusElement('#input-field')

// Navigate focus
const navigationShortcuts = [
	{ key: 'Tab', description: 'Next field', action: focusNext },
	{
		key: 'Tab',
		shift: true,
		description: 'Previous field',
		action: focusPrevious
	}
]
```

### 2. Conditional Shortcuts

```tsx
const shortcuts: KeyboardShortcut[] = [
	{
		key: 'd',
		ctrl: true,
		description: 'Download',
		action: handleDownload,
		enabled: !!downloadData // Only enable when data exists
	}
]
```

### 3. Custom Validation

```tsx
const shortcuts: KeyboardShortcut[] = [
	{
		key: 's',
		ctrl: true,
		description: 'Save',
		action: () => {
			if (validateForm()) {
				handleSave()
			} else {
				toast.error('Please fix errors before saving')
			}
		}
	}
]
```

## Best Practices

### 1. Shortcut Selection

- Use standard shortcuts when possible (Ctrl+C for copy, Ctrl+S for save)
- Avoid conflicts with browser shortcuts
- Keep shortcuts simple and memorable
- Group related shortcuts

### 2. Accessibility

- All shortcuts accessible via keyboard only
- Provide visual indicators for available shortcuts
- Include shortcut descriptions in UI
- Support screen readers

### 3. User Experience

- Show shortcut hints on hover
- Display "Shift + ?" to show all shortcuts
- Save user preferences
- Provide feedback when shortcuts are used

### 4. Performance

- Lazy load shortcut components
- Debounce rapid shortcut triggers
- Clean up event listeners properly

## Implementation Examples

### ASCII Art Generator

```tsx
const shortcuts: KeyboardShortcut[] = [
	{ key: 'Enter', ctrl: true, description: 'Generate ASCII', action: generate },
	{
		key: 'c',
		ctrl: true,
		shift: true,
		description: 'Copy ASCII',
		action: copy
	},
	{
		key: '1',
		ctrl: true,
		description: 'Text tab',
		action: () => setTab('text')
	},
	{
		key: '2',
		ctrl: true,
		description: 'Image tab',
		action: () => setTab('image')
	},
	{
		key: '3',
		ctrl: true,
		description: 'Patterns tab',
		action: () => setTab('patterns')
	}
]
```

### BMI Calculator

```tsx
const shortcuts: KeyboardShortcut[] = [
	{ key: 'Enter', ctrl: true, description: 'Calculate BMI', action: calculate },
	{ key: 'u', ctrl: true, description: 'Switch units', action: toggleUnits },
	{ key: 'e', ctrl: true, description: 'Load example', action: loadExample },
	{ key: 'a', ctrl: true, description: 'Advanced mode', action: toggleAdvanced }
]
```

## Troubleshooting

### Common Issues

1. **Shortcuts not working**
   - Check if `enabled` prop is true
   - Verify no input field has focus
   - Ensure no modal is blocking

2. **Conflicts with browser shortcuts**
   - Use Shift modifier for common keys
   - Choose alternative key combinations
   - Test across different browsers

3. **Performance issues**
   - Limit number of shortcuts
   - Use debouncing for expensive actions
   - Clean up listeners on unmount

## Checklist

- [ ] Define keyboard shortcuts array
- [ ] Implement action handlers
- [ ] Add useWidgetKeyboard hook
- [ ] Add WidgetKeyboardShortcuts component
- [ ] Add inline ShortcutHint to buttons
- [ ] Test shortcuts functionality
- [ ] Document shortcuts in widget
- [ ] Test on different keyboards/OS

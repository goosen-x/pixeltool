# Flexbox Generator - Keyboard Shortcuts Implementation Example

This is an example of how to implement keyboard shortcuts for Flexbox Generator
using the new automatic OS detection.

## Implementation Steps

### 1. Import the hook

```typescript
import { useWidgetKeyboard } from '@/lib/hooks/useWidgetKeyboard'
```

### 2. Add keyboard shortcuts (after your existing functions)

```typescript
// After copyToClipboard, copyTailwindToClipboard, resetProps functions...

// Add/Remove item functions
const addItem = useCallback(() => {
	setItemCount(prev => Math.min(prev + 1, 12))
	toast.success(locale === 'ru' ? 'Элемент добавлен' : 'Item added')
}, [locale])

const removeItem = useCallback(() => {
	setItemCount(prev => Math.max(prev - 1, 1))
	toast.success(locale === 'ru' ? 'Элемент удален' : 'Item removed')
}, [locale])

// Keyboard shortcuts
useWidgetKeyboard({
	widgetId: 'flexbox-generator',
	shortcuts: [
		{
			key: '1',
			primary: true, // Cmd on Mac, Ctrl on Windows
			description: 'Copy CSS',
			action: copyToClipboard
		},
		{
			key: '2',
			primary: true,
			description: 'Copy Tailwind',
			action: copyTailwindToClipboard
		},
		{
			key: 'r',
			primary: true,
			shift: true,
			description: 'Reset',
			action: resetProps
		},
		{
			key: 'a',
			primary: true,
			shift: true,
			description: 'Add Item',
			action: addItem
		},
		{
			key: 'd',
			primary: true,
			shift: true,
			description: 'Remove Item',
			action: removeItem
		}
	]
})
```

### 3. Update toast messages for better feedback

```typescript
const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(generateCSS())
		toast.success(
			locale === 'ru'
				? 'CSS скопирован в буфер обмена'
				: 'CSS copied to clipboard'
		)
	} catch (err) {
		toast.error(t('toast.copyError'))
	}
}

const copyTailwindToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(generateTailwind())
		setCopiedTailwind(true)
		setTimeout(() => setCopiedTailwind(false), 2000)
		toast.success(
			locale === 'ru'
				? 'Tailwind классы скопированы'
				: 'Tailwind classes copied'
		)
	} catch (err) {
		toast.error(t('toast.copyError'))
	}
}

const resetProps = () => {
	setProps(defaultProps)
	toast.success(locale === 'ru' ? 'Настройки сброшены' : 'Settings reset')
}
```

## That's it!

No need to:

- Detect OS manually
- Add useState for isMac
- Add useEffect for OS detection
- Use conditional logic for modifiers

The `useWidgetKeyboard` hook now handles all OS detection automatically!

## Shortcuts Summary

- **Cmd/Ctrl + 1** - Copy CSS
- **Cmd/Ctrl + 2** - Copy Tailwind
- **Cmd/Ctrl + Shift + R** - Reset settings
- **Cmd/Ctrl + Shift + A** - Add item
- **Cmd/Ctrl + Shift + D** - Remove item

These will automatically use Cmd on macOS and Ctrl on Windows/Linux.

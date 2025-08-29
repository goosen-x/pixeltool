# Keyboard Shortcuts Implementation Guide for PixelTool

This document outlines all considerations, issues, and best practices when
implementing keyboard shortcuts in the PixelTool project.

## 🚨 Known Issues and Solutions

### 1. Browser Shortcut Conflicts

**Problem**: Many keyboard combinations are already used by browsers and OS.

**Conflicting Shortcuts to Avoid**:

- `Ctrl/Cmd + R` → Reload page
- `Ctrl/Cmd + P` → Print
- `Ctrl/Cmd + L` → Address bar
- `Ctrl/Cmd + U` → View source
- `Ctrl/Cmd + S` → Save page
- `Ctrl/Cmd + D` → Bookmark
- `Ctrl/Cmd + F` → Find
- `Ctrl/Cmd + T` → New tab
- `Ctrl/Cmd + W` → Close tab
- `Ctrl/Cmd + N` → New window
- `Ctrl/Cmd + O` → Open file
- `Ctrl/Cmd + A` → Select all

**Safe Patterns**:

```
✅ Ctrl/Cmd + Shift + [Letter]
✅ Ctrl/Cmd + [Number 1-9]
✅ Alt/Option + [Letter]
✅ Function keys (F1-F12)
```

### 2. macOS vs Windows/Linux Compatibility

**Problem**: macOS uses `Cmd` (meta key) while Windows/Linux use `Ctrl`.

**Solution**: Use `primary` modifier in shortcuts - it's automatically converted
to `meta` on Mac and `ctrl` on Windows/Linux by the updated `useWidgetKeyboard`
hook.

**Implementation Pattern**:

```typescript
// Old way (manual detection):
const [isMac, setIsMac] = useState(false)
useEffect(() => {
	setIsMac(/Mac/.test(navigator.userAgent))
}, [])
shortcuts: [
	{
		key: '1',
		...(isMac ? { meta: true } : { ctrl: true })
	}
]

// New way (automatic):
shortcuts: [
	{
		key: '1',
		primary: true, // Automatically becomes cmd on Mac, ctrl on Windows
		description: 'Copy result',
		action: handleCopy
	}
]
```

**No more OS detection needed in components!**

### 3. Notification Spam

**Problem**: Generic "Cmd + Shift + P executed" messages are not helpful.

**Solution**:

- Remove generic notifications from `useWidgetKeyboard` hook
- Add specific, localized messages in each action:

```typescript
// ❌ Bad
toast.success(`${shortcut} executed`)

// ✅ Good
toast.success(
	locale === 'ru'
		? 'CSS значение скопировано в буфер обмена'
		: 'CSS value copied to clipboard'
)
```

### 4. UI/UX Issues

**Problems Found**:

- "Show more" button text hard to see on hover
- Widget description shown in shortcuts section
- Poor organization of sidebar sections

**Solutions Applied**:

- Changed button variant from `ghost` to `outline`
- Removed widget descriptions from shortcuts
- Reordered sidebar: Info → Shortcuts → Use Case → Stats → Actions

### 5. Configuration Management

**Central Configuration**: `/lib/constants/widgetShortcuts.ts`

```typescript
export const widgetShortcuts: Record<string, WidgetShortcutConfig> = {
	'widget-name': {
		shortcuts: [
			'⌘+1 Copy CSS', // Primary action
			'⌘+2 Copy Alternative', // Secondary action
			'⌘+⇧+R Reset', // Reset with Shift
			'⌘+⇧+U Toggle Units' // Toggle with Shift
		],
		description: 'Optional description' // Often not needed
	}
}
```

## 📋 Implementation Checklist

When adding shortcuts to a widget:

- [ ] **1. Plan shortcuts**
  - Identify primary actions (copy, generate, calculate)
  - Choose non-conflicting key combinations
  - Keep it under 6-8 shortcuts max

- [ ] **2. Update configuration**
  - Add to `/lib/constants/widgetShortcuts.ts`
  - Use OS-agnostic symbols (⌘, ⇧)
  - Write concise descriptions (2-4 words)

- [ ] **3. Implement in widget**

  ```typescript
  // Import hook
  import { useWidgetKeyboard } from '@/lib/hooks/useWidgetKeyboard'

  // Define shortcuts (no OS detection needed!)
  useWidgetKeyboard({
  	widgetId: 'widget-name',
  	shortcuts: [
  		{
  			key: '1',
  			primary: true, // Auto cmd/ctrl
  			description: 'Copy result',
  			action: handleCopy
  		},
  		{
  			key: 'r',
  			primary: true,
  			shift: true,
  			description: 'Reset',
  			action: resetForm
  		}
  	]
  })
  ```

- [ ] **4. Add localized feedback**
  - Success messages in both EN/RU
  - Specific about what happened
  - Consistent terminology

- [ ] **5. Test thoroughly**
  - Test on Mac (Cmd key)
  - Test on Windows (Ctrl key)
  - Verify no browser conflicts
  - Check all toast messages

## 🎯 Best Practices

### 1. Consistency Across Widgets

| Action         | Shortcut | Example                 |
| -------------- | -------- | ----------------------- |
| Primary Copy   | `⌘+1`    | Copy main result        |
| Secondary Copy | `⌘+2`    | Copy alternative format |
| Tertiary Copy  | `⌘+3`    | Copy additional format  |
| Reset          | `⌘+⇧+R`  | Reset form/state        |
| Generate       | `⌘+G`    | Generate new result     |
| Toggle         | `⌘+⇧+T`  | Toggle feature          |
| Switch Mode    | `⌘+⇧+M`  | Switch between modes    |

### 2. Action Implementation Patterns

**Copy Action**:

```typescript
const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(result)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
		toast.success(
			locale === 'ru'
				? 'Результат скопирован в буфер обмена'
				: 'Result copied to clipboard'
		)
	} catch (err) {
		toast.error(t('toast.copyError'))
	}
}
```

**Toggle Action**:

```typescript
const toggleFeature = useCallback(() => {
	const newState = !featureEnabled
	setFeatureEnabled(newState)
	toast.info(
		locale === 'ru'
			? `Функция ${newState ? 'включена' : 'выключена'}`
			: `Feature ${newState ? 'enabled' : 'disabled'}`
	)
}, [featureEnabled, locale])
```

**Reset Action**:

```typescript
const resetForm = useCallback(() => {
	setField1(defaultValue1)
	setField2(defaultValue2)
	// ... reset all fields
	toast.success(locale === 'ru' ? 'Форма сброшена' : 'Form reset')
}, [locale])
```

### 3. Right Sidebar Display

- Show max 4 shortcuts initially
- Expandable list for additional shortcuts
- Clear visual hierarchy
- No redundant descriptions

## ⚠️ Common Pitfalls

1. **Don't override critical browser shortcuts** - Users expect Ctrl+S, Ctrl+F,
   etc to work
2. **Don't use single letters without modifiers** - Interferes with typing
3. **Don't forget mobile users** - Shortcuts are desktop-only
4. **Don't make shortcuts mandatory** - All actions must be available via UI
5. **Don't use Ctrl+C/V/X** - Reserved for system copy/paste/cut

## 🔍 Debugging Tips

```javascript
// Debug shortcut detection
useEffect(() => {
	const handleKeyDown = e => {
		console.log({
			key: e.key,
			ctrl: e.ctrlKey,
			meta: e.metaKey,
			shift: e.shiftKey,
			alt: e.altKey
		})
	}
	window.addEventListener('keydown', handleKeyDown)
	return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

## 📝 Examples from Project

### CSS Clamp Calculator

- `⌘+1` - Copy CSS
- `⌘+2` - Copy Tailwind
- `⌘+⇧+R` - Reset
- `⌘+⇧+U` - Switch Units
- `⌘+⇧+P` - Switch Property
- `⌘+⇧+E` - Load Example

### Random Number Generator

- `⌘+G` - Generate
- `⌘+R` - Regenerate
- `⌘+⇧+C` - Copy Result
- `⌘+D` - Download
- `U` - Toggle Unique

## 🆕 Latest Updates (2025-08-29)

### Type Safety for Widget Shortcuts

The `widgetShortcuts` configuration is now fully type-safe:

1. **Type-safe widget IDs** - Only valid widget IDs from `widgets.ts` are
   allowed
2. **Autocomplete support** - TypeScript suggests valid widget IDs when adding
   shortcuts
3. **Build-time validation** - Catches typos and invalid widget references
4. **Helper utilities** - Type guards and validation functions

**Example:**

```typescript
import type { WidgetId } from '@/lib/constants/widgetShortcuts'

// TypeScript knows all valid widget IDs
const shortcuts = widgetShortcuts['css-clamp-calculator'] // ✅ Valid
const invalid = widgetShortcuts['typo-widget'] // ❌ TypeScript error

// Type guard for runtime checks
if (isValidWidgetId(someString)) {
	// TypeScript knows someString is a valid WidgetId here
	const config = widgetShortcuts[someString]
}
```

**Benefits:**

- No more typos in widget IDs
- Refactoring safety when renaming widgets
- Better IDE support with autocomplete
- Compile-time validation

## 🆕 Latest Updates (2025-08-29)

### Automatic OS Detection in `useWidgetKeyboard`

The hook now automatically detects the operating system and applies the correct
modifiers. This means:

1. **No more manual OS detection** in components
2. **Use `primary: true`** instead of conditional `ctrl`/`meta`
3. **Cleaner, simpler code** in widgets

**Migration Example:**

```typescript
// Before:
const [isMac, setIsMac] = useState(false)
// ... useEffect to detect OS ...
{
  key: '1',
  ...(isMac ? { meta: true } : { ctrl: true })
}

// After:
{
  key: '1',
  primary: true  // That's it!
}
```

The hook handles all OS detection internally and applies the correct modifier
based on the platform.

---

Created: 2025-08-29 Updated: 2025-08-29 - Added automatic OS detection

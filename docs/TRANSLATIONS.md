# Translation System Documentation

This project uses a type-safe translation system built on top of `next-intl`
with additional validation and type generation.

## Overview

The translation system provides:

- **Type Safety**: Auto-generated TypeScript types from translation JSON files
- **Validation**: Runtime and build-time validation of translation completeness
- **Safe Access**: Utilities to safely access translations with fallbacks
- **Structure Enforcement**: Ensures consistent structure across all language
  files

## File Structure

```
/messages
  en.json         # English translations
  ru.json         # Russian translations
/types
  translations.ts          # Manual type definitions
  generated-translations.ts # Auto-generated types (DO NOT EDIT)
/scripts
  validate-translations.ts  # Translation validation script
  generate-translation-types.ts # Type generation script
/lib
  /hooks
    useTypedTranslations.ts # Type-safe translation hooks
  /utils
    safe-translations.ts    # Safe translation utilities
```

## Widget Translation Structure

Each widget requires translations in two places:

1. **Brief Definition** (in `widgets` section):

```json
{
	"widgets": {
		"myWidget": {
			"title": "My Widget",
			"description": "Short description",
			"useCase": "When to use this widget"
		}
	}
}
```

2. **Full Definition** (later in the file with all widget-specific fields):

```json
{
	"widgets": {
		"myWidget": {
			"title": "My Widget",
			"description": "Short description",
			"useCase": "When to use this widget",
			"input": "Input Label",
			"output": "Output Label"
			// ... other widget-specific fields
		}
	}
}
```

## Adding a New Widget

### 1. Add Widget Constant

First, add your widget to `/lib/constants/widgets.ts`:

```typescript
{
  id: 'my-widget',
  icon: MyIcon,
  category: 'webdev',
  translationKey: 'myWidget', // Must match the key in translations
  path: 'my-widget',
  gradient: 'from-blue-500 to-purple-600',
}
```

### 2. Add Translations

Add translations to both `en.json` and `ru.json`:

```json
// In widgets section
"myWidget": {
  "title": "My Widget",
  "description": "Widget description",
  "useCase": "Use case description",
  // Add all widget-specific fields here
  "input": "Input",
  "output": "Output",
  // ... other fields
}
```

### 3. Use Type-Safe Translations

In your widget component:

```typescript
import { useWidgetTranslations } from '@/lib/hooks/useTypedTranslations'

export function MyWidget() {
  const { t, title, description, useCase } = useWidgetTranslations('myWidget')

  return (
    <div>
      <h1>{title()}</h1>
      <p>{description()}</p>
      <label>{t('input')}</label>
    </div>
  )
}
```

## Available Commands

### Validate Translations

Check for missing translations and structural issues:

```bash
npm run validate:translations
```

### Generate Types

Generate TypeScript types from translation files:

```bash
npm run generate:types
```

### Check All

Run both type generation and validation:

```bash
npm run translations:check
```

## Validation Rules

The validation script checks for:

1. **Required Fields**: All widgets must have `title`, `description`, and
   `useCase`
2. **Language Parity**: All keys in English must exist in Russian
3. **No Duplicates**: Warns about widgets defined multiple times
4. **Structure Consistency**: Ensures both languages have the same structure

## Safe Translation Access

Use the provided utilities for safe translation access:

```typescript
import {
	safeTranslation,
	getWidgetTranslation
} from '@/lib/utils/safe-translations'

// Safe access with fallback
const title = safeTranslation(
	translations,
	'widgets.myWidget.title',
	'Default Title'
)

// Get validated widget translation
const widget = getWidgetTranslation(translations, 'myWidget')
if (widget) {
	console.log(widget.title, widget.description, widget.useCase)
}
```

## Best Practices

1. **Always run validation** after adding/modifying translations:

   ```bash
   npm run translations:check
   ```

2. **Use type-safe hooks** instead of raw `useTranslations`:

   ```typescript
   // Good
   const { t } = useWidgetTranslations('myWidget')

   // Avoid
   const t = useTranslations('widgets.myWidget')
   ```

3. **Add translations for both languages** at the same time to avoid validation
   errors

4. **Use meaningful keys** that describe the content, not the UI element:

   ```json
   // Good
   "invalidEmailError": "Please enter a valid email address"

   // Avoid
   "redText": "Please enter a valid email address"
   ```

5. **Keep translations DRY** by using the common sections for shared UI elements

## Common Issues

### MISSING_MESSAGE Error

This occurs when a translation key is not found. Check:

1. The widget is defined in the correct section
2. The key exists in both language files
3. There are no typos in the translation key

### Duplicate Widget Definitions

If a widget appears in multiple places:

1. Keep the full definition with all fields
2. Remove any duplicate brief definitions

### Type Errors

If TypeScript complains about translation types:

1. Run `npm run generate:types` to update generated types
2. Ensure your widget name is added to the type definitions

## Future Improvements

1. **Automatic Translation Generation**: Script to scaffold all required
   translations for a new widget
2. **Translation Coverage Report**: Visual report showing translation completion
   percentage
3. **Hot Reload for Translations**: Automatically reload translations in
   development
4. **Translation Key Autocomplete**: VSCode extension for translation key
   suggestions

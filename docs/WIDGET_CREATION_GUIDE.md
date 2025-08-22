# 📘 Widget Creation Guide

This guide covers everything you need to know about creating new widgets for
PixelTool.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Step-by-Step Guide](#step-by-step-guide)
3. [Widget Structure](#widget-structure)
4. [Required Components](#required-components)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)
7. [Testing Checklist](#testing-checklist)

## 🎯 Overview

Each widget in PixelTool follows a consistent structure and pattern to ensure:

- Consistent user experience
- Proper internationalization (i18n)
- Analytics tracking
- Keyboard accessibility
- Mobile responsiveness
- Dark mode support

## 📝 Step-by-Step Guide

### 1. Define Widget Metadata

Add your widget to `/lib/constants/widgets.ts`:

```typescript
export const widgets: Widget[] = [
	// ... existing widgets
	{
		id: 'my-new-widget',
		path: 'my-new-widget',
		translationKey: 'myNewWidget',
		icon: MyIcon, // Import from lucide-react
		gradient: 'from-blue-500 to-purple-600',
		category: 'generator', // css, converter, generator, calculator, etc.
		tags: ['tag1', 'tag2', 'tag3'], // For search
		isNew: true, // Optional: shows "New" badge
		isBeta: false // Optional: shows "Beta" badge
	}
]
```

### 2. Add Translations

#### English (`/messages/en.json`):

```json
{
	"widgets": {
		"myNewWidget": {
			"title": "My New Widget",
			"description": "Brief description of what the widget does",
			"useCase": "Use this widget when you need to...",

			// Input fields
			"inputs": {
				"fieldName": "Field Label",
				"placeholder": "Enter value here..."
			},

			// Actions/buttons
			"actions": {
				"generate": "Generate",
				"clear": "Clear",
				"copy": "Copy",
				"download": "Download"
			},

			// Results/output
			"results": {
				"title": "Results",
				"empty": "No results yet"
			},

			// Validation messages
			"validation": {
				"required": "This field is required",
				"invalid": "Invalid input"
			},

			// Toast messages
			"toast": {
				"success": "Operation successful!",
				"error": "Something went wrong"
			},

			// Settings/options
			"settings": {
				"option1": "Option 1",
				"option2": "Option 2"
			},

			// Info/help text
			"info": {
				"howToUse": "How to use this widget...",
				"tips": "Pro tip: ..."
			}
		}
	}
}
```

#### Russian (`/messages/ru.json`):

```json
{
	"widgets": {
		"myNewWidget": {
			"title": "Мой Новый Виджет",
			"description": "Краткое описание функциональности виджета",
			"useCase": "Используйте этот виджет когда вам нужно..."
			// ... остальные переводы
		}
	}
}
```

### 3. Create Widget Page Component

Create `/app/[locale]/(tools)/tools/my-new-widget/page.tsx`:

```typescript
'use client'

import { useTranslations } from 'next-intl'
import { useState, useCallback } from 'react'
import { WidgetContainer, WidgetInput, WidgetResult } from '@/components/widgets/base'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useWidgetCreation } from '@/lib/hooks/widgets/useWidgetCreation'
import { MyIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function MyNewWidgetPage() {
  const t = useTranslations('widgets.myNewWidget')

  // Use the widget creation hook
  const widget = useWidgetCreation({
    widgetId: 'my-new-widget',
    enableKeyboard: true,
    enableAnalytics: true,
    enableFavorites: true,
    defaultState: {
      inputs: {
        fieldName: ''
      }
    },
    validationRules: {
      fieldName: (value) => {
        if (!value) return t('validation.required')
        if (value.length < 3) return t('validation.tooShort')
        return true
      }
    }
  })

  // Widget-specific logic
  const handleGenerate = useCallback(() => {
    // Validate inputs
    if (!widget.validateAllInputs()) {
      return
    }

    widget.setLoading(true)

    try {
      // Your widget logic here
      const result = processInput(widget.inputs.fieldName)
      widget.setResult(result)
      toast.success(t('toast.success'))
    } catch (error) {
      widget.setError(t('toast.error'))
      toast.error(t('toast.error'))
    } finally {
      widget.setLoading(false)
    }
  }, [widget, t])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to generate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleGenerate()
      }
      // Escape to clear
      if (e.key === 'Escape') {
        e.preventDefault()
        widget.reset()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleGenerate, widget])

  return (
    <WidgetContainer
      title={t('title')}
      description={t('description')}
      icon={MyIcon}
      gradient="from-blue-500 to-purple-600"
    >
      {/* Input Section */}
      <WidgetInput>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fieldName">{t('inputs.fieldName')}</Label>
            <Input
              id="fieldName"
              type="text"
              value={widget.inputs.fieldName}
              onChange={(e) => widget.updateInput('fieldName', e.target.value)}
              placeholder={t('inputs.placeholder')}
              disabled={widget.isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={widget.isLoading}
              className="flex-1"
            >
              <MyIcon className="w-4 h-4 mr-2" />
              {t('actions.generate')}
            </Button>

            <Button
              onClick={widget.reset}
              variant="outline"
              disabled={widget.isLoading}
            >
              {t('actions.clear')}
            </Button>
          </div>
        </div>
      </WidgetInput>

      {/* Result Section */}
      {widget.result && (
        <WidgetResult>
          <Card className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">{t('results.title')}</h3>
              <div className="font-mono text-sm bg-muted p-3 rounded">
                {widget.result}
              </div>

              {/* Result Actions */}
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => widget.copyToClipboard(widget.result)}
                  size="sm"
                  variant="outline"
                >
                  {t('actions.copy')}
                </Button>

                <Button
                  onClick={() => widget.downloadAsFile(
                    widget.result,
                    'result.txt'
                  )}
                  size="sm"
                  variant="outline"
                >
                  {t('actions.download')}
                </Button>
              </div>
            </div>
          </Card>
        </WidgetResult>
      )}

      {/* Error Display */}
      {widget.error && (
        <Card className="p-4 border-destructive">
          <p className="text-destructive">{widget.error}</p>
        </Card>
      )}

      {/* Info Section */}
      <Card className="p-4 bg-muted/50">
        <h4 className="font-semibold mb-2">{t('info.howToUse')}</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• {t('info.step1')}</li>
          <li>• {t('info.step2')}</li>
          <li>• {t('info.step3')}</li>
        </ul>

        <div className="mt-4 text-sm text-muted-foreground">
          <p className="font-semibold">Keyboard Shortcuts:</p>
          <div className="flex gap-4 mt-1">
            <kbd className="px-2 py-1 text-xs bg-background border rounded">
              Ctrl + Enter
            </kbd>
            <span>{t('shortcuts.generate')}</span>
          </div>
        </div>
      </Card>
    </WidgetContainer>
  )
}

// Helper function for your widget logic
function processInput(input: string): string {
  // Your widget-specific logic here
  return input.toUpperCase() // Example
}
```

### 4. Generate TypeScript Types

After adding translations, run:

```bash
npm run generate:types
```

### 5. Add SEO Metadata (Optional)

For better SEO, add metadata generation:

```typescript
import { Metadata } from 'next'

export async function generateMetadata({
	params
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params

	return {
		title: locale === 'ru' ? 'Мой Новый Виджет' : 'My New Widget',
		description:
			locale === 'ru'
				? 'Описание виджета для SEO'
				: 'Widget description for SEO',
		keywords: ['keyword1', 'keyword2']
	}
}
```

## 🏗️ Widget Structure

### Base Components

Use these pre-built components for consistency:

- `WidgetContainer` - Main wrapper with title, icon, gradient
- `WidgetInput` - Input section wrapper
- `WidgetResult` - Result section wrapper
- `WidgetSettings` - Settings/options wrapper
- `WidgetInfo` - Information/help section

### Common UI Patterns

1. **Input with Label**:

```tsx
<div>
	<Label htmlFor='input-id'>{t('label')}</Label>
	<Input
		id='input-id'
		value={value}
		onChange={e => setValue(e.target.value)}
		placeholder={t('placeholder')}
	/>
</div>
```

2. **Toggle Options**:

```tsx
<div className='flex items-center space-x-2'>
	<Switch id='option-id' checked={enabled} onCheckedChange={setEnabled} />
	<Label htmlFor='option-id'>{t('option')}</Label>
</div>
```

3. **Select Dropdown**:

```tsx
<Select value={selected} onValueChange={setSelected}>
	<SelectTrigger>
		<SelectValue placeholder={t('selectPlaceholder')} />
	</SelectTrigger>
	<SelectContent>
		<SelectItem value='option1'>{t('option1')}</SelectItem>
		<SelectItem value='option2'>{t('option2')}</SelectItem>
	</SelectContent>
</Select>
```

## ✅ Required Components

Every widget MUST have:

1. **Translations** - Both EN and RU
2. **Icon** - From lucide-react
3. **Gradient** - Unique color combination
4. **Category** - For organization
5. **Tags** - For search (min 2-3)
6. **Mobile Support** - Responsive design
7. **Dark Mode** - Proper color support
8. **Loading States** - User feedback
9. **Error Handling** - Graceful failures
10. **Keyboard Support** - Common shortcuts

## 🎨 Best Practices

### 1. Performance

- Use `useCallback` for event handlers
- Implement debouncing for real-time inputs
- Lazy load heavy dependencies
- Optimize re-renders with `React.memo`

### 2. Accessibility

- Proper ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

### 3. User Experience

- Instant feedback (loading states)
- Clear error messages
- Helpful placeholders
- Tooltips for complex features
- Remember user preferences

### 4. Code Quality

- TypeScript for type safety
- Consistent naming conventions
- Extract reusable logic to hooks
- Add comments for complex logic
- Follow ESLint rules

## 🔄 Common Patterns

### 1. Real-time Processing

```typescript
const [input, setInput] = useState('')
const [result, setResult] = useState('')

useEffect(() => {
	const timeoutId = setTimeout(() => {
		if (input) {
			const processed = processInput(input)
			setResult(processed)
		}
	}, 300) // Debounce 300ms

	return () => clearTimeout(timeoutId)
}, [input])
```

### 2. File Upload

```typescript
const handleFileUpload = useCallback(
	(e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = e => {
			const content = e.target?.result as string
			processFile(content)
		}
		reader.readAsText(file)
	},
	[]
)
```

### 3. Copy with Feedback

```typescript
const handleCopy = useCallback(async () => {
	try {
		await navigator.clipboard.writeText(result)
		toast.success(t('copied'))

		// Visual feedback
		setIsCopied(true)
		setTimeout(() => setIsCopied(false), 2000)
	} catch (error) {
		toast.error(t('copyFailed'))
	}
}, [result, t])
```

## 🧪 Testing Checklist

Before submitting your widget:

### Functionality

- [ ] Core feature works correctly
- [ ] Edge cases handled
- [ ] Input validation works
- [ ] Error states display properly
- [ ] Loading states show/hide correctly

### UI/UX

- [ ] Responsive on mobile
- [ ] Works in dark mode
- [ ] Keyboard shortcuts work
- [ ] Animations are smooth
- [ ] Focus states visible

### Internationalization

- [ ] All text uses translations
- [ ] No hardcoded strings
- [ ] Both EN and RU work
- [ ] Date/number formatting respects locale

### Performance

- [ ] No console errors
- [ ] No memory leaks
- [ ] Fast initial load
- [ ] Smooth interactions

### Analytics

- [ ] Widget view tracked
- [ ] Key actions tracked
- [ ] Errors tracked

### Code Quality

- [ ] TypeScript errors fixed
- [ ] ESLint warnings resolved
- [ ] Code formatted properly
- [ ] No commented code
- [ ] Meaningful variable names

## 📚 Examples

Look at these well-implemented widgets for reference:

- `/tools/password-generator` - Complex state management
- `/tools/qr-generator` - File download example
- `/tools/json-formatter` - Real-time processing
- `/tools/color-converter` - Multiple input formats
- `/tools/timer-countdown` - Animation examples

## 🚀 Quick Start Template

Copy this template to get started quickly:

```bash
# 1. Copy template
cp app/[locale]/(tools)/tools/_template app/[locale]/(tools)/tools/my-widget

# 2. Add to widgets.ts
# 3. Add translations
# 4. Generate types
npm run generate:types

# 5. Test
npm run dev
```

## 💡 Tips

1. **Start Simple** - Get basic functionality working first
2. **Test Early** - Check mobile and dark mode frequently
3. **Use Existing Hooks** - Don't reinvent the wheel
4. **Follow Patterns** - Consistency is key
5. **Ask for Help** - Check similar widgets or ask team

Remember: Every widget should feel like part of the same application!

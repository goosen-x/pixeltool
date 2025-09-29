# Social Sharing Migration Guide

This guide explains how to add social sharing functionality to existing widgets
in the portfolio project.

## Components Overview

The social sharing functionality is implemented through three main components:

1. **`SocialShareButtons`** - Core component with share buttons
2. **`WidgetShareSection`** - Wrapper component for widgets
3. **`useWidgetShare`** - Hook for sharing functionality

## Migration Steps

### 1. Basic Implementation (Inline Style)

Add the `WidgetShareSection` component at the end of your widget page:

```tsx
import { WidgetShareSection } from '@/components/widgets'

export default function YourWidgetPage() {
	return (
		<div>
			{/* Your widget content */}

			<WidgetShareSection
				widgetTitle='Your Widget Title'
				widgetDescription='Short description of what your widget does'
				hashtags={['tag1', 'tag2', 'tag3']}
				variant='inline'
			/>
		</div>
	)
}
```

### 2. Card Implementation

For a more prominent display, use the card variant:

```tsx
<WidgetShareSection
	widgetTitle='Your Widget Title'
	widgetDescription='Short description of what your widget does'
	hashtags={['tag1', 'tag2', 'tag3']}
	variant='card'
/>
```

### 3. Using WidgetLayout (Recommended)

The easiest way is to wrap your widget with `WidgetLayout`:

```tsx
import { WidgetLayout } from '@/components/widgets'

export default function YourWidgetPage() {
	return <WidgetLayout>{/* Your widget content */}</WidgetLayout>
}
```

This automatically adds sharing based on widget metadata from
`lib/constants/widgets.ts`.

### 4. Custom Share Data

Override default sharing data:

```tsx
<WidgetLayout
	customShareData={{
		title: 'Custom Title',
		description: 'Custom description',
		hashtags: ['custom', 'tags']
	}}
>
	{/* Your widget content */}
</WidgetLayout>
```

### 5. Advanced Usage with Hook

For custom implementations, use the `useWidgetShare` hook:

```tsx
import { useWidgetShare } from '@/lib/hooks/useWidgetShare'
import { SocialShareButtons } from '@/components/widgets'

export default function YourWidgetPage() {
	const { shareNative, copyLink, shareToPlatform, canShare } = useWidgetShare({
		title: 'Widget Title',
		description: 'Widget description'
	})

	return (
		<div>
			{/* Your widget content */}

			<SocialShareButtons
				data={{
					title: 'Widget Title',
					description: 'Widget description',
					hashtags: ['tag1', 'tag2']
				}}
				onShare={platform => {
					// Custom tracking or analytics
					console.log(`Shared on ${platform}`)
				}}
			/>
		</div>
	)
}
```

## Examples

### BMI Calculator Implementation

```tsx
<WidgetShareSection
	widgetTitle='BMI Calculator'
	widgetDescription='Calculate your Body Mass Index with health insights'
	hashtags={['bmi', 'health', 'fitness', 'calculator']}
	variant='inline'
/>
```

### ASCII Art Generator Implementation

```tsx
<WidgetShareSection
	widgetTitle='ASCII Art Generator'
	widgetDescription='Convert text and images to ASCII art'
	hashtags={['asciiart', 'textart', 'developertools', 'webdev']}
/>
```

## Supported Platforms

The sharing component supports:

- Twitter/X
- Facebook
- LinkedIn
- WhatsApp
- Telegram
- Reddit
- Email
- Copy Link

## Best Practices

1. **Title**: Keep it concise and descriptive (max 60 chars)
2. **Description**: Explain the widget's purpose (max 160 chars)
3. **Hashtags**: Use 3-5 relevant hashtags without the # symbol
4. **Placement**: Add sharing at the bottom of the widget, after WidgetInfo
5. **Variant**: Use "inline" for tool pages, "card" for content pages

## Keyboard Shortcuts

The sharing functionality includes a keyboard shortcut:

- **Ctrl/Cmd + Shift + S**: Opens native share dialog (if supported)

## Checklist for Migration

- [ ] Import WidgetShareSection or WidgetLayout
- [ ] Add component with appropriate props
- [ ] Choose correct variant (inline/card)
- [ ] Add relevant hashtags
- [ ] Test sharing on different platforms
- [ ] Verify mobile responsiveness

## Migration Priority

Prioritize widgets by usage/popularity:

1. High-traffic tools (Password Generator, UUID Generator, etc.)
2. Calculator tools (Loan, Percentage, etc.)
3. Developer tools (JSON Formatter, Base64 Encoder, etc.)
4. Creative tools (Text Generators, Color Tools, etc.)
5. Utility tools (Timer, World Time, etc.)

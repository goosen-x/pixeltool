import type { Widget } from './widgets'

// Universal widget shortcuts configuration
export interface WidgetShortcutConfig {
	shortcuts: string[]
	description?: string
}

// Extract widget IDs from widgets array for type safety
export type WidgetId = Widget['id']

// Type-safe widget shortcuts mapping
export const widgetShortcuts: Partial<Record<WidgetId, WidgetShortcutConfig>> =
	{
		// Health & Lifestyle
		'dice-roller': {
			shortcuts: ['Space Roll Dice', '1-6 Set Dice Count'],
			description: '🎲 Uses crypto.getRandomValues() for true randomness'
		},
		'random-number-generator': {
			shortcuts: [
				'⌘+G Generate',
				'⌘+R Regenerate',
				'⌘+1 Copy Result',
				'⌘+D Download',
				'U Toggle Unique'
			],
			description: '🔢 Cryptographically secure random number generation'
		},
		'bmi-calculator': {
			shortcuts: [
				'⌘+Enter Calculate',
				'⌘+⇧+X Reset Form',
				'⌘+1 Copy Result',
				'⌘+E Load Example',
				'⌘+A Toggle Advanced',
				'⌘+U Switch Units'
			],
			description: '🏥 Advanced BMI and health metrics calculator'
		},
		'team-randomizer': {
			shortcuts: ['⌘+Enter Generate Teams', '⌘+⇧+X Reset', '⌘+1 Copy Result'],
			description: '👥 Fair team distribution with Fisher-Yates algorithm'
		},
		'draw-lots': {
			shortcuts: ['Space Draw Card', '⌘+⇧+X Reset', 'Enter Reveal Card'],
			description: '🎴 Digital drawing lots with 3D card animations'
		},
		'coin-flip': {
			shortcuts: ['Space Flip Coin', '⌘+T Change Coin Type', '⌘+⇧+X Reset'],
			description: '🪙 3D coin flip with multiple currency types'
		},

		'timer-countdown': {
			shortcuts: ['Space Start/Pause', '⌘+⇧+X Reset', '⌘+M Change Mode'],
			description: '⏱️ Multi-mode timer: countdown, stopwatch, Pomodoro'
		},

		// Web Development
		'css-clamp-calculator': {
			shortcuts: [
				'⌘+1 Copy CSS',
				'⌘+2 Copy Tailwind',
				'⌘+0 Reset',
				'⌘+⇧+U Switch Units',
				'⌘+⇧+P Switch Property'
			],
			description:
				'📐 Generate fluid CSS clamp() values for responsive typography'
		},
		'css-gradient-generator': {
			shortcuts: [
				'⌘+G Generate Random',
				'⌘+⇧+X Reset',
				'⌘+1 Copy CSS',
				'⌘+E Export',
				'⌘+⇧+Y Add Color Stop'
			],
			description: '🎨 CSS gradient generator with presets'
		},
		'json-tools': {
			shortcuts: [
				'⌘+⇧+F Format JSON',
				'⌘+M Minify JSON',
				'⌘+1 Copy Result',
				'⌘+2 Download',
				'⌘+⇧+L Clear Input'
			],
			description: '🔧 JSON formatter, validator and analyzer'
		},
		'text-case-converter': {
			shortcuts: ['⌘+Enter Convert', '⌘+1 Copy Result', '⌘+⇧+X Reset'],
			description: '🔤 Convert text between different case formats'
		},
		'css-box-shadow-generator': {
			shortcuts: [
				'⌘+G Generate Random',
				'⌘+⇧+X Reset',
				'⌘+1 Copy CSS',
				'⌘+L Add Layer'
			],
			description: '🎯 CSS box shadow generator with layers'
		},
		'flexbox-generator': {
			shortcuts: [
				'⌘+1 Copy CSS',
				'⌘+2 Copy Tailwind',
				'⌘+⇧+X Reset',
				'⌘+⇧+Y Add Item',
				'⌘+⇧+X Remove Item'
			],
			description: '📦 Interactive flexbox layout generator'
		},
		'grid-generator': {
			shortcuts: [
				'⌘+1 Copy CSS',
				'⌘+2 Copy Tailwind',
				'⌘+⇧+X Reset',
				'⌘+⇧+Y Add Column',
				'⌘+⇧+X Remove Column'
			],
			description: '🔲 CSS Grid layout generator'
		},
		'regex-tester': {
			shortcuts: [
				'⌘+Enter Test Pattern',
				'⌘+1 Copy Result',
				'⌘+F Find Matches',
				'⌘+⇧+X Reset'
			],
			description: '🔍 Regular expression tester with real-time matching'
		},
		'js-css-compressor': {
			shortcuts: [
				'⌘+Enter Compress',
				'⌘+1 Copy Result',
				'⌘+2 Download',
				'⌘+⇧+L Clear'
			],
			description: '📦 Minify JavaScript and CSS code'
		},
		'pixel-rem-converter': {
			shortcuts: [
				'⌘+Enter Convert',
				'⌘+S Swap Units',
				'⌘+1 Copy Result',
				'⌘+⇧+X Reset'
			],
			description: '📏 Convert between pixels and rem units'
		},
		'color-converter': {
			shortcuts: [
				'⌘+Enter Convert',
				'⌘+1 Copy Result',
				'⌘+F Change Format',
				'⌘+⇧+X Reset'
			],
			description: '🎨 Convert colors between formats (HEX, RGB, HSL)'
		},
		'html-xml-parser': {
			shortcuts: [
				'⌘+⇧+F Format',
				'⌘+V Validate',
				'⌘+1 Copy Result',
				'⌘+⇧+L Clear'
			],
			description: '📝 Parse and format HTML/XML documents'
		},
		'text-diff-tool': {
			shortcuts: [
				'⌘+Enter Compare',
				'⌘+S Switch Sides',
				'⌘+1 Copy Diff',
				'⌘+⇧+X Reset'
			],
			description: '📊 Compare text differences side by side'
		},

		// Business & Finance
		'percentage-calculator': {
			shortcuts: [
				'⌘+Enter Calculate',
				'⌘+⇧+X Reset',
				'⌘+1 Copy Result',
				'⌘+E Load Example'
			],
			description: '💯 Calculate percentages with multiple modes'
		},
		'compound-interest-calculator': {
			shortcuts: [
				'⌘+Enter Calculate',
				'⌘+⇧+X Reset',
				'⌘+1 Copy Result',
				'⌘+G Generate Chart'
			],
			description: '💰 Compound interest with visualization'
		},
		'loan-calculator': {
			shortcuts: [
				'⌘+Enter Calculate',
				'⌘+⇧+X Reset',
				'⌘+1 Copy Result',
				'⌘+P Payment Schedule'
			],
			description: '🏦 Loan amortization calculator'
		},
		'currency-converter': {
			shortcuts: [
				'⌘+Enter Convert',
				'⌘+S Swap Currencies',
				'⌘+1 Copy Result',
				'⌘+⇧+X Reset'
			],
			description: '💱 Real-time currency conversion'
		},
		'tip-calculator': {
			shortcuts: [
				'⌘+Enter Calculate',
				'⌘+1 Copy Result',
				'⌘+⇧+X Reset',
				'⌘+S Split Bill'
			],
			description: '💵 Calculate tips and split bills'
		},
		'temperature-converter': {
			shortcuts: [
				'⌘+Enter Convert',
				'⌘+S Swap Units',
				'⌘+1 Copy Result',
				'⌘+⇧+X Reset'
			],
			description: '🌡️ Convert between temperature scales'
		},
		'fuel-consumption-calculator': {
			shortcuts: [
				'⌘+Enter Calculate',
				'⌘+U Switch Units',
				'⌘+1 Copy Result',
				'⌘+⇧+X Reset'
			],
			description: '⛽ Calculate fuel consumption and costs'
		},

		// Content Creation
		'special-symbols-picker': {
			shortcuts: [
				'⌘+1 Copy Symbol',
				'⌘+F Search',
				'Tab Navigate Categories',
				'⌘+H Add to History'
			],
			description: '🔣 Browse and copy special Unicode symbols'
		},
		'fancy-text-generator': {
			shortcuts: [
				'⌘+G Generate All',
				'⌘+1 Copy Style',
				'⌘+⇧+X Reset',
				'⌘+F Toggle Favorites'
			],
			description: '✨ Transform text into stylish Unicode fonts'
		},
		'emoji-list': {
			shortcuts: [
				'⌘+1 Copy Emoji',
				'⌘+F Search',
				'Tab Navigate Categories',
				'⌘+⇧+X Recent'
			],
			description: '😀 Browse and copy emojis with search'
		},
		'text-emoticons': {
			shortcuts: [
				'⌘+1 Copy Emoticon',
				'⌘+F Search',
				'⌘+⇧+X Random',
				'⌘+H History'
			],
			description: '(◕‿◕) Classic text emoticons collection'
		},
		'text-counter': {
			shortcuts: [
				'⌘+Enter Analyze',
				'⌘+1 Copy Stats',
				'⌘+⇧+X Reset',
				'⌘+2 Detailed View'
			],
			description: '📊 Count characters, words, and analyze text'
		},
		'utm-link-builder': {
			shortcuts: [
				'⌘+Enter Build URL',
				'⌘+1 Copy URL',
				'⌘+⇧+X Reset',
				'⌘+S Shorten URL'
			],
			description: '🔗 Build UTM tracking links for campaigns'
		},
		'seo-markdown-generator': {
			shortcuts: [
				'⌘+Enter Generate',
				'⌘+1 Copy Markdown',
				'⌘+P Preview',
				'⌘+⇧+X Reset'
			],
			description: '📝 Generate SEO-optimized markdown content'
		},
		'social-media-formatter': {
			shortcuts: [
				'⌘+Enter Format',
				'⌘+1 Copy Result',
				'⌘+P Preview',
				'⌘+⇧+X Reset'
			],
			description: '📱 Format text for different social platforms'
		},
		'random-list-generator': {
			shortcuts: [
				'⌘+G Generate',
				'⌘+⇧+X Regenerate',
				'⌘+1 Copy List',
				'⌘+S Sort'
			],
			description: '📋 Generate random lists from templates'
		},

		// Multimedia
		'qr-code-generator': {
			shortcuts: [
				'⌘+G Generate QR',
				'⌘+2 Download',
				'⌘+1 Copy Image',
				'⌘+⇧+X Reset'
			],
			description: '📱 Generate QR codes with customization'
		},
		'youtube-thumbnail-downloader': {
			shortcuts: [
				'⌘+Enter Download',
				'⌘+Q Change Quality',
				'⌘+1 Copy URL',
				'⌘+⇧+X Reset'
			],
			description: '📹 Download YouTube video thumbnails'
		},
		'image-size-checker': {
			shortcuts: [
				'⌘+U Upload Image',
				'⌘+1 Copy Dimensions',
				'⌘+⇧+X Reset',
				'⌘+2 Download Info'
			],
			description: '📐 Check image dimensions and metadata'
		},
		'svg-base64-encoder': {
			shortcuts: [
				'⌘+Enter Encode',
				'⌘+2 Decode',
				'⌘+1 Copy Result',
				'⌘+⇧+X Reset'
			],
			description: '🎨 Convert SVG to Base64 and vice versa'
		},
		'text-to-speech': {
			shortcuts: [
				'Space Play/Pause',
				'⌘+S Stop',
				'⌘+2 Download Audio',
				'⌘+V Change Voice'
			],
			description: '🔊 Convert text to speech with voices'
		},

		// Analytics & Data
		'system-info': {
			shortcuts: [
				'⌘+⇧+X Refresh',
				'⌘+1 Copy Info',
				'⌘+E Export',
				'⌘+2 Detailed View'
			],
			description: '💻 View system and browser information'
		},
		'internet-speed-test': {
			shortcuts: [
				'Space Start Test',
				'⌘+⇧+X Reset',
				'⌘+1 Copy Results',
				'⌘+H History'
			],
			description: '🚀 Test internet connection speed'
		},
		'analytics-dashboard': {
			shortcuts: [
				'⌘+⇧+X Refresh Data',
				'⌘+P Change Period',
				'⌘+E Export',
				'⌘+F Filter'
			],
			description: '📊 View website analytics and metrics'
		},

		// Security & Privacy
		'password-generator': {
			shortcuts: [
				'⌘+G Generate',
				'⌘+1 Copy Password',
				'⌘+⇧+X Regenerate',
				'⌘+S Save Settings'
			],
			description: '🔐 Generate secure passwords with options'
		},
		'uuid-generator': {
			shortcuts: [
				'⌘+G Generate',
				'⌘+1 Copy UUID',
				'⌘+B Bulk Generate',
				'⌘+F Change Format'
			],
			description: '🆔 Generate UUIDs in various formats'
		},
		'base64-encoder': {
			shortcuts: [
				'⌘+E Encode',
				'⌘+2 Decode',
				'⌘+1 Copy Result',
				'⌘+F File Mode'
			],
			description: '🔤 Encode and decode Base64 strings'
		},
		'jwt-decoder': {
			shortcuts: ['⌘+2 Decode', '⌘+V Verify', '⌘+1 Copy JSON', '⌘+⇧+X Reset'],
			description: '🔑 Decode and verify JWT tokens'
		}
	}

// Helper function to get shortcuts with proper modifier keys
export function getWidgetShortcuts(
	pathname: string,
	isMac: boolean
): WidgetShortcutConfig | null {
	const widgetPath = pathname.split('/').pop()
	if (!widgetPath) {
		return null
	}

	// Type assertion to ensure widgetPath is a valid WidgetId
	const config = widgetShortcuts[widgetPath as WidgetId]
	if (!config) {
		return null
	}

	const modifierKey = isMac ? '⌘' : 'Ctrl'
	const shiftKey = isMac ? '⇧' : 'Shift'

	// Replace modifier keys in shortcuts
	const shortcuts = config.shortcuts.map(shortcut =>
		shortcut.replace(/⌘/g, modifierKey).replace(/⇧/g, shiftKey)
	)

	return {
		...config,
		shortcuts
	}
}

// Type guard to check if a string is a valid widget ID
export function isValidWidgetId(id: string): id is WidgetId {
	return id in widgetShortcuts
}

// Get all widget IDs that have shortcuts defined
export function getWidgetsWithShortcuts(): WidgetId[] {
	return Object.keys(widgetShortcuts) as WidgetId[]
}

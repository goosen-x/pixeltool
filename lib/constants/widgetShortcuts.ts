// Universal widget shortcuts configuration
export interface WidgetShortcutConfig {
	shortcuts: string[]
	description: string
}

// Define shortcuts for all widgets
export const widgetShortcuts: Record<string, WidgetShortcutConfig> = {
	// Health & Lifestyle
	'dice-roller': {
		shortcuts: ['Space Roll Dice', '1-6 Set Dice Count'],
		description: '🎲 Uses crypto.getRandomValues() for true randomness'
	},
	'random-number-generator': {
		shortcuts: [
			'⌘+G Generate',
			'⌘+R Regenerate',
			'⌘+⇧+C Copy Result',
			'⌘+D Download',
			'U Toggle Unique'
		],
		description: '🔢 Cryptographically secure random number generation'
	},
	'bmi-calculator': {
		shortcuts: [
			'⌘+Enter Calculate',
			'⌘+⇧+R Reset Form',
			'⌘+⇧+C Copy Result',
			'⌘+E Load Example',
			'⌘+A Toggle Advanced',
			'⌘+U Switch Units'
		],
		description: '🏥 Advanced BMI and health metrics calculator'
	},
	'team-randomizer': {
		shortcuts: ['⌘+G Generate Teams', '⌘+R Reset', '⌘+⇧+C Copy Result'],
		description: '👥 Fair team distribution with Fisher-Yates algorithm'
	},
	'draw-lots': {
		shortcuts: ['Space Draw Card', '⌘+R Reset', 'Enter Reveal Card'],
		description: '🎴 Digital drawing lots with 3D card animations'
	},
	'coin-flip': {
		shortcuts: ['Space Flip Coin', '⌘+T Change Coin Type', '⌘+R Reset'],
		description: '🪙 3D coin flip with multiple currency types'
	},
	'age-calculator': {
		shortcuts: ['⌘+Enter Calculate', '⌘+R Reset', '⌘+⇧+C Copy Result'],
		description: '📅 Detailed age calculation with zodiac and life stages'
	},
	'timer-countdown': {
		shortcuts: ['Space Start/Pause', '⌘+R Reset', '⌘+M Change Mode'],
		description: '⏱️ Multi-mode timer: countdown, stopwatch, Pomodoro'
	},

	// Web Development
	'css-clamp-calculator': {
		shortcuts: [
			'⌘+⇧+C Copy CSS',
			'⌘+⇧+T Copy Tailwind',
			'⌘+R Reset',
			'⌘+U Switch Units',
			'⌘+P Switch Property',
			'⌘+L Load Example'
		],
		description: '📐 Generate fluid CSS clamp() values for responsive typography'
	},
	'css-gradient-generator': {
		shortcuts: [
			'⌘+G Generate Random',
			'⌘+R Reset',
			'⌘+⇧+C Copy CSS',
			'⌘+E Export',
			'⌘+A Add Color Stop'
		],
		description: '🎨 CSS gradient generator with presets'
	},
	'json-tools': {
		shortcuts: [
			'⌘+⇧+F Format JSON',
			'⌘+M Minify JSON',
			'⌘+⇧+C Copy Result',
			'⌘+D Download',
			'⌘+K Clear Input'
		],
		description: '🔧 JSON formatter, validator and analyzer'
	},
	'text-case-converter': {
		shortcuts: ['⌘+Enter Convert', '⌘+⇧+C Copy Result', '⌘+⇧+R Reset'],
		description: '🔤 Convert text between different case formats'
	},
	'css-box-shadow-generator': {
		shortcuts: [
			'⌘+G Generate Random',
			'⌘+R Reset',
			'⌘+⇧+C Copy CSS',
			'⌘+L Add Layer'
		],
		description: '🎯 CSS box shadow generator with layers'
	},
	'flexbox-generator': {
		shortcuts: [
			'⌘+⇧+C Copy CSS',
			'⌘+R Reset',
			'⌘+A Add Item',
			'⌘+⇧+R Remove Item'
		],
		description: '📦 Interactive flexbox layout generator'
	},
	'grid-generator': {
		shortcuts: [
			'⌘+⇧+C Copy CSS',
			'⌘+R Reset',
			'⌘+A Add Area',
			'⌘+G Generate Template'
		],
		description: '🔲 CSS Grid layout generator'
	},
	'regex-tester': {
		shortcuts: [
			'⌘+Enter Test Pattern',
			'⌘+⇧+C Copy Result',
			'⌘+F Find Matches',
			'⌘+R Reset'
		],
		description: '🔍 Regular expression tester with real-time matching'
	},
	'js-css-compressor': {
		shortcuts: [
			'⌘+Enter Compress',
			'⌘+⇧+C Copy Result',
			'⌘+D Download',
			'⌘+K Clear'
		],
		description: '📦 Minify JavaScript and CSS code'
	},
	'pixel-rem-converter': {
		shortcuts: [
			'⌘+Enter Convert',
			'⌘+S Swap Units',
			'⌘+⇧+C Copy Result',
			'⌘+R Reset'
		],
		description: '📏 Convert between pixels and rem units'
	},
	'color-converter': {
		shortcuts: [
			'⌘+Enter Convert',
			'⌘+⇧+C Copy Result',
			'⌘+F Change Format',
			'⌘+R Reset'
		],
		description: '🎨 Convert colors between formats (HEX, RGB, HSL)'
	},
	'html-xml-parser': {
		shortcuts: [
			'⌘+⇧+F Format',
			'⌘+V Validate',
			'⌘+⇧+C Copy Result',
			'⌘+K Clear'
		],
		description: '📝 Parse and format HTML/XML documents'
	},
	'text-diff-tool': {
		shortcuts: [
			'⌘+Enter Compare',
			'⌘+S Switch Sides',
			'⌘+⇧+C Copy Diff',
			'⌘+R Reset'
		],
		description: '📊 Compare text differences side by side'
	},

	// Business & Finance
	'percentage-calculator': {
		shortcuts: [
			'⌘+Enter Calculate',
			'⌘+⇧+R Reset',
			'⌘+⇧+C Copy Result',
			'⌘+E Load Example'
		],
		description: '💯 Calculate percentages with multiple modes'
	},
	'compound-interest-calculator': {
		shortcuts: [
			'⌘+Enter Calculate',
			'⌘+⇧+R Reset',
			'⌘+⇧+C Copy Result',
			'⌘+G Generate Chart'
		],
		description: '💰 Compound interest with visualization'
	},
	'loan-calculator': {
		shortcuts: [
			'⌘+Enter Calculate',
			'⌘+⇧+R Reset',
			'⌘+⇧+C Copy Result',
			'⌘+P Payment Schedule'
		],
		description: '🏦 Loan amortization calculator'
	},
	'currency-converter': {
		shortcuts: [
			'⌘+Enter Convert',
			'⌘+S Swap Currencies',
			'⌘+⇧+C Copy Result',
			'⌘+R Reset'
		],
		description: '💱 Real-time currency conversion'
	},
	'tip-calculator': {
		shortcuts: [
			'⌘+Enter Calculate',
			'⌘+⇧+C Copy Result',
			'⌘+R Reset',
			'⌘+S Split Bill'
		],
		description: '💵 Calculate tips and split bills'
	},
	'temperature-converter': {
		shortcuts: [
			'⌘+Enter Convert',
			'⌘+S Swap Units',
			'⌘+⇧+C Copy Result',
			'⌘+R Reset'
		],
		description: '🌡️ Convert between temperature scales'
	},
	'fuel-consumption-calculator': {
		shortcuts: [
			'⌘+Enter Calculate',
			'⌘+U Switch Units',
			'⌘+⇧+C Copy Result',
			'⌘+R Reset'
		],
		description: '⛽ Calculate fuel consumption and costs'
	},

	// Content Creation
	'special-symbols-picker': {
		shortcuts: [
			'⌘+⇧+C Copy Symbol',
			'⌘+F Search',
			'Tab Navigate Categories',
			'⌘+H Add to History'
		],
		description: '🔣 Browse and copy special Unicode symbols'
	},
	'fancy-text-generator': {
		shortcuts: [
			'⌘+G Generate All',
			'⌘+⇧+C Copy Style',
			'⌘+R Reset',
			'⌘+F Toggle Favorites'
		],
		description: '✨ Transform text into stylish Unicode fonts'
	},
	'emoji-list': {
		shortcuts: [
			'⌘+⇧+C Copy Emoji',
			'⌘+F Search',
			'Tab Navigate Categories',
			'⌘+R Recent'
		],
		description: '😀 Browse and copy emojis with search'
	},
	'text-emoticons': {
		shortcuts: [
			'⌘+⇧+C Copy Emoticon',
			'⌘+F Search',
			'⌘+R Random',
			'⌘+H History'
		],
		description: '(◕‿◕) Classic text emoticons collection'
	},
	'text-counter': {
		shortcuts: [
			'⌘+Enter Analyze',
			'⌘+⇧+C Copy Stats',
			'⌘+R Reset',
			'⌘+D Detailed View'
		],
		description: '📊 Count characters, words, and analyze text'
	},
	'utm-link-builder': {
		shortcuts: [
			'⌘+Enter Build URL',
			'⌘+⇧+C Copy URL',
			'⌘+R Reset',
			'⌘+S Shorten URL'
		],
		description: '🔗 Build UTM tracking links for campaigns'
	},
	'seo-markdown-generator': {
		shortcuts: [
			'⌘+Enter Generate',
			'⌘+⇧+C Copy Markdown',
			'⌘+P Preview',
			'⌘+R Reset'
		],
		description: '📝 Generate SEO-optimized markdown content'
	},
	'social-media-formatter': {
		shortcuts: [
			'⌘+Enter Format',
			'⌘+⇧+C Copy Result',
			'⌘+P Preview',
			'⌘+R Reset'
		],
		description: '📱 Format text for different social platforms'
	},
	'random-list-generator': {
		shortcuts: [
			'⌘+G Generate',
			'⌘+R Regenerate',
			'⌘+⇧+C Copy List',
			'⌘+S Sort'
		],
		description: '📋 Generate random lists from templates'
	},

	// Multimedia
	'qr-code-generator': {
		shortcuts: [
			'⌘+G Generate QR',
			'⌘+D Download',
			'⌘+⇧+C Copy Image',
			'⌘+R Reset'
		],
		description: '📱 Generate QR codes with customization'
	},
	'youtube-thumbnail-downloader': {
		shortcuts: [
			'⌘+Enter Download',
			'⌘+Q Change Quality',
			'⌘+⇧+C Copy URL',
			'⌘+R Reset'
		],
		description: '📹 Download YouTube video thumbnails'
	},
	'image-size-checker': {
		shortcuts: [
			'⌘+U Upload Image',
			'⌘+⇧+C Copy Dimensions',
			'⌘+R Reset',
			'⌘+D Download Info'
		],
		description: '📐 Check image dimensions and metadata'
	},
	'svg-base64-encoder': {
		shortcuts: [
			'⌘+Enter Encode',
			'⌘+D Decode',
			'⌘+⇧+C Copy Result',
			'⌘+R Reset'
		],
		description: '🎨 Convert SVG to Base64 and vice versa'
	},
	'text-to-speech': {
		shortcuts: [
			'Space Play/Pause',
			'⌘+S Stop',
			'⌘+D Download Audio',
			'⌘+V Change Voice'
		],
		description: '🔊 Convert text to speech with voices'
	},

	// Analytics & Data
	'system-info': {
		shortcuts: [
			'⌘+R Refresh',
			'⌘+⇧+C Copy Info',
			'⌘+E Export',
			'⌘+D Detailed View'
		],
		description: '💻 View system and browser information'
	},
	'world-time': {
		shortcuts: [
			'⌘+A Add City',
			'⌘+R Refresh',
			'⌘+F Search',
			'⌘+T Toggle Format'
		],
		description: '🌍 Track time across multiple time zones'
	},
	'internet-speed-test': {
		shortcuts: [
			'Space Start Test',
			'⌘+R Reset',
			'⌘+⇧+C Copy Results',
			'⌘+H History'
		],
		description: '🚀 Test internet connection speed'
	},
	'analytics-dashboard': {
		shortcuts: [
			'⌘+R Refresh Data',
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
			'⌘+⇧+C Copy Password',
			'⌘+R Regenerate',
			'⌘+S Save Settings'
		],
		description: '🔐 Generate secure passwords with options'
	},
	'uuid-generator': {
		shortcuts: [
			'⌘+G Generate',
			'⌘+⇧+C Copy UUID',
			'⌘+B Bulk Generate',
			'⌘+F Change Format'
		],
		description: '🆔 Generate UUIDs in various formats'
	},
	'base64-encoder': {
		shortcuts: [
			'⌘+E Encode',
			'⌘+D Decode',
			'⌘+⇧+C Copy Result',
			'⌘+F File Mode'
		],
		description: '🔤 Encode and decode Base64 strings'
	},
	'jwt-decoder': {
		shortcuts: ['⌘+D Decode', '⌘+V Verify', '⌘+⇧+C Copy JSON', '⌘+R Reset'],
		description: '🔑 Decode and verify JWT tokens'
	}
}

// Helper function to get shortcuts with proper modifier keys
export function getWidgetShortcuts(
	pathname: string,
	isMac: boolean
): WidgetShortcutConfig | null {
	const widgetPath = pathname.split('/').pop()
	if (!widgetPath || !widgetShortcuts[widgetPath]) {
		return null
	}

	const config = widgetShortcuts[widgetPath]
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

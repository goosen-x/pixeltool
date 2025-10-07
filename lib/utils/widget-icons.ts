// Map of widget icons to emojis for OG images
export const widgetIconEmojis: Record<string, string> = {
	// Layout & Spacing
	'box-shadow-generator': '📦',
	'border-radius-generator': '🔲',
	'flexbox-playground': '📐',
	'grid-generator': '⚡',
	'spacing-calculator': '📏',

	// Color & Design
	'color-converter': '🎨',
	'gradient-generator': '🌈',
	'palette-generator': '🎯',
	'color-contrast-checker': '👁️',
	'image-compressor': '🖼️',
	'css-gradient-generator': '🌅',

	// Text & Content
	'text-shadow-generator': '✨',
	'lorem-ipsum-generator': '📝',
	'text-counter': '🔤',
	'markdown-editor': '✏️',
	'fancy-text-generator': '🎪',
	'lorem-generator': '📄',

	// Tools & Utilities
	'qr-generator': '📱',
	'qr-code-generator': '📲',
	'password-generator': '🔐',
	'uuid-generator': '🆔',
	'base64-encoder': '🔒',
	'url-shortener': '🔗',
	'json-formatter': '{ }',
	'regex-tester': '🔍',
	'json-tools': '🛠️',

	// Developer Tools
	'css-unit-converter': '📊',
	'javascript-minifier': '🗜️',
	'html-formatter': '</>',
	'code-formatter': '💻',
	'meta-tags-generator': '🏷️',
	'opengraph-validator': '🔎',

	// Math & Numbers
	'percentage-calculator': '%',
	'tip-calculator': '💵',
	'loan-calculator': '💰',
	'bmi-calculator': '⚖️',
	'currency-converter': '💱',

	// Games & Fun
	'dice-roller': '🎲',
	'coin-flip': '🪙',
	'random-picker': '🎰',
	'bingo-generator': '🎱',
	'emoji-list': '😊',

	// Time & Date
	'timer-countdown': '⏰',
	stopwatch: '⏱️',
	'world-clock': '🌍',
	'date-calculator': '📆',

	// Analytics & SEO
	'analytics-dashboard': '📊',
	'seo-analyzer': '🔍',
	'keyword-density': '🔑',
	'robots-txt-generator': '🤖',
	'sitemap-generator': '🗺️',

	// Converters
	'unit-converter': '🔄',
	'temperature-converter': '🌡️',
	'data-size-converter': '💾',
	'number-base-converter': '🔢',

	// Security & Privacy
	'hash-generator': '#️⃣',
	'jwt-decoder': '🔓',
	'encryption-tool': '🔐',
	'privacy-policy-generator': '📋',

	// Social Media
	'instagram-bio-generator': '📸',
	'twitter-card-generator': '🐦',
	'hashtag-generator': '#️⃣',
	'social-media-scheduler': '📱',

	// Business Tools
	'invoice-generator': '🧾',
	'receipt-generator': '🧾',
	'business-card-maker': '💼',
	'email-signature-generator': '✉️',

	// Default
	default: '🛠️'
}

export function getWidgetEmoji(widgetKey: string): string {
	return widgetIconEmojis[widgetKey] || widgetIconEmojis.default
}

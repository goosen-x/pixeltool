export interface DeviceSpec {
	width: number
	height: number
	devicePixelRatio: number
	brand: string
	model: string
	screenSize: string
	ppi: number
}

export interface SystemInfo {
	architecture: string
	platform: string
	userAgent: string
	language: string
	languages: string[]
	cookieEnabled: boolean
	onlineStatus: boolean
	screenWidth: number
	screenHeight: number
	availWidth: number
	availHeight: number
	colorDepth: number
	pixelDepth: number
	devicePixelRatio: number
	orientation: string
	touchSupport: boolean
	maxTouchPoints: number
	timezone: string
	hostname: string
	protocol: string
	port: string
	doNotTrack: string
	javaEnabled: boolean
	webdriver: boolean
	cookieSupport: boolean
	localStorage: boolean
	sessionStorage: boolean
	indexedDB: boolean
}

export interface DeviceInfo {
	brand?: string
	model?: string
	type: 'desktop' | 'tablet' | 'mobile' | 'unknown'
	os: string
	osVersion?: string
	browser: string
	browserVersion?: string
	isRetina: boolean
	actualResolution: string
	logicalResolution: string
	screenSize?: string
	ppi?: number
}

// Device specifications database for device detection
export const deviceDatabase: DeviceSpec[] = [
	// iPhone
	{
		width: 390,
		height: 844,
		devicePixelRatio: 3,
		brand: 'Apple',
		model: 'iPhone 12/13 mini',
		screenSize: '5.4"',
		ppi: 476
	},
	{
		width: 393,
		height: 852,
		devicePixelRatio: 3,
		brand: 'Apple',
		model: 'iPhone 14/15',
		screenSize: '6.1"',
		ppi: 460
	},
	{
		width: 414,
		height: 896,
		devicePixelRatio: 2,
		brand: 'Apple',
		model: 'iPhone 11/XR',
		screenSize: '6.1"',
		ppi: 326
	},
	{
		width: 414,
		height: 896,
		devicePixelRatio: 3,
		brand: 'Apple',
		model: 'iPhone 11 Pro Max/XS Max',
		screenSize: '6.5"',
		ppi: 458
	},
	{
		width: 375,
		height: 812,
		devicePixelRatio: 3,
		brand: 'Apple',
		model: 'iPhone X/XS/11 Pro',
		screenSize: '5.8"',
		ppi: 458
	},
	{
		width: 375,
		height: 667,
		devicePixelRatio: 2,
		brand: 'Apple',
		model: 'iPhone 6/6s/7/8',
		screenSize: '4.7"',
		ppi: 326
	},
	{
		width: 414,
		height: 736,
		devicePixelRatio: 3,
		brand: 'Apple',
		model: 'iPhone 6/6s/7/8 Plus',
		screenSize: '5.5"',
		ppi: 401
	},

	// iPad
	{
		width: 820,
		height: 1180,
		devicePixelRatio: 2,
		brand: 'Apple',
		model: 'iPad Air (4th gen)',
		screenSize: '10.9"',
		ppi: 264
	},
	{
		width: 834,
		height: 1194,
		devicePixelRatio: 2,
		brand: 'Apple',
		model: 'iPad Pro 11"',
		screenSize: '11"',
		ppi: 264
	},
	{
		width: 1024,
		height: 1366,
		devicePixelRatio: 2,
		brand: 'Apple',
		model: 'iPad Pro 12.9"',
		screenSize: '12.9"',
		ppi: 264
	},
	{
		width: 768,
		height: 1024,
		devicePixelRatio: 2,
		brand: 'Apple',
		model: 'iPad (9th gen)',
		screenSize: '10.2"',
		ppi: 264
	},

	// Samsung Galaxy
	{
		width: 360,
		height: 740,
		devicePixelRatio: 3,
		brand: 'Samsung',
		model: 'Galaxy S20/S21',
		screenSize: '6.2"',
		ppi: 563
	},
	{
		width: 384,
		height: 854,
		devicePixelRatio: 2.75,
		brand: 'Samsung',
		model: 'Galaxy S22',
		screenSize: '6.1"',
		ppi: 425
	},
	{
		width: 360,
		height: 780,
		devicePixelRatio: 3,
		brand: 'Samsung',
		model: 'Galaxy S10',
		screenSize: '6.1"',
		ppi: 550
	},
	{
		width: 412,
		height: 915,
		devicePixelRatio: 2.625,
		brand: 'Samsung',
		model: 'Galaxy Note 20',
		screenSize: '6.7"',
		ppi: 393
	},

	// Google Pixel
	{
		width: 393,
		height: 851,
		devicePixelRatio: 2.75,
		brand: 'Google',
		model: 'Pixel 5',
		screenSize: '6.0"',
		ppi: 432
	},
	{
		width: 411,
		height: 731,
		devicePixelRatio: 2.625,
		brand: 'Google',
		model: 'Pixel 4',
		screenSize: '5.7"',
		ppi: 444
	},

	// Common desktop resolutions
	{
		width: 1920,
		height: 1080,
		devicePixelRatio: 1,
		brand: '',
		model: 'Full HD Monitor',
		screenSize: '21.5"-27"',
		ppi: 82
	},
	{
		width: 2560,
		height: 1440,
		devicePixelRatio: 1,
		brand: '',
		model: 'QHD Monitor',
		screenSize: '27"-32"',
		ppi: 109
	},
	{
		width: 3840,
		height: 2160,
		devicePixelRatio: 1,
		brand: '',
		model: '4K Monitor',
		screenSize: '27"-43"',
		ppi: 163
	}
]

// Windows NT version mapping
export const windowsVersions: Record<string, string> = {
	'10.0': '10/11',
	'6.3': '8.1',
	'6.2': '8',
	'6.1': '7',
	'6.0': 'Vista',
	'5.2': 'XP 64-bit',
	'5.1': 'XP'
}

// System detection utilities
export function getArchitecture(): string {
	if (typeof navigator === 'undefined') return 'Unknown'

	const userAgent = navigator.userAgent.toLowerCase()
	const platform = navigator.platform.toLowerCase()

	// Check for explicit 64-bit indicators
	if (
		userAgent.includes('win64') ||
		userAgent.includes('x64') ||
		userAgent.includes('x86_64')
	) {
		return '64-bit'
	}

	// Check for 32-bit indicators
	if (
		userAgent.includes('win32') ||
		userAgent.includes('i386') ||
		userAgent.includes('i686')
	) {
		return '32-bit'
	}

	// Platform-specific checks
	if (platform.includes('win64') || platform.includes('x86_64')) {
		return '64-bit'
	}

	if (platform.includes('win32') || platform.includes('i386')) {
		return '32-bit'
	}

	// Modern browsers on 64-bit systems
	if (
		userAgent.includes('chrome') ||
		userAgent.includes('firefox') ||
		userAgent.includes('edge')
	) {
		return '64-bit (assumed)'
	}

	// ARM-based systems (Apple Silicon, mobile)
	if (platform.includes('arm') || userAgent.includes('arm')) {
		return 'ARM 64-bit'
	}

	return 'Unknown'
}

export function detectDevice(info: SystemInfo): DeviceInfo {
	const userAgent = info.userAgent.toLowerCase()
	let type: DeviceInfo['type'] = 'unknown'
	let os = 'Unknown'
	let osVersion = undefined
	let browser = 'Unknown'
	let browserVersion = undefined

	// Detect OS with versions
	if (userAgent.includes('windows')) {
		os = 'Windows'
		const match = userAgent.match(/windows nt ([\d.]+)/)
		if (match) {
			const version = match[1]
			osVersion = windowsVersions[version] || version
		}
	} else if (userAgent.includes('mac')) {
		os = 'macOS'
		const match = userAgent.match(/mac os x ([\d_.]+)/)
		if (match) {
			osVersion = match[1].replace(/_/g, '.')
		}
	} else if (userAgent.includes('linux')) {
		os = 'Linux'
	} else if (userAgent.includes('android')) {
		os = 'Android'
		const match = userAgent.match(/android ([\d.]+)/)
		if (match) osVersion = match[1]
	} else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
		os = 'iOS'
		const match = userAgent.match(/os ([\d_]+)/)
		if (match) osVersion = match[1].replace(/_/g, '.')
	}

	// Detect browser with versions
	if (userAgent.includes('edg/')) {
		browser = 'Edge'
		const match = userAgent.match(/edg\/([\d.]+)/)
		if (match) browserVersion = match[1]
	} else if (userAgent.includes('chrome/') && !userAgent.includes('edge')) {
		browser = 'Chrome'
		const match = userAgent.match(/chrome\/([\d.]+)/)
		if (match) browserVersion = match[1]
	} else if (userAgent.includes('firefox/')) {
		browser = 'Firefox'
		const match = userAgent.match(/firefox\/([\d.]+)/)
		if (match) browserVersion = match[1]
	} else if (userAgent.includes('safari/') && !userAgent.includes('chrome')) {
		browser = 'Safari'
		const match = userAgent.match(/version\/([\d.]+)/)
		if (match) browserVersion = match[1]
	} else if (userAgent.includes('opera') || userAgent.includes('opr/')) {
		browser = 'Opera'
		const match = userAgent.match(/(opera|opr)\/([\d.]+)/)
		if (match) browserVersion = match[2]
	}

	// Detect device type
	if (
		userAgent.includes('mobile') ||
		userAgent.includes('android') ||
		userAgent.includes('iphone')
	) {
		type = 'mobile'
	} else if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
		type = 'tablet'
	} else {
		type = 'desktop'
	}

	const isRetina = info.devicePixelRatio > 1
	const logicalWidth = Math.max(info.screenWidth, info.screenHeight)
	const logicalHeight = Math.min(info.screenWidth, info.screenHeight)
	const actualWidth = logicalWidth * info.devicePixelRatio
	const actualHeight = logicalHeight * info.devicePixelRatio

	// Try to match device from database
	const matchedDevice = deviceDatabase.find(
		device =>
			Math.abs(device.width - logicalWidth) <= 2 &&
			Math.abs(device.height - logicalHeight) <= 2 &&
			Math.abs(device.devicePixelRatio - info.devicePixelRatio) < 0.1
	)

	return {
		type,
		os,
		osVersion,
		browser,
		browserVersion,
		isRetina,
		actualResolution: `${actualWidth} × ${actualHeight}`,
		logicalResolution: `${logicalWidth} × ${logicalHeight}`,
		brand: matchedDevice?.brand,
		model: matchedDevice?.model,
		screenSize: matchedDevice?.screenSize,
		ppi: matchedDevice?.ppi
	}
}

export function detectSystemInfo(): SystemInfo | null {
	if (typeof window === 'undefined') return null

	return {
		architecture: getArchitecture(),
		platform: navigator.platform,
		userAgent: navigator.userAgent,
		language: navigator.language,
		languages: navigator.languages
			? Array.from(navigator.languages)
			: [navigator.language],
		cookieEnabled: navigator.cookieEnabled,
		onlineStatus: navigator.onLine,
		screenWidth: screen.width,
		screenHeight: screen.height,
		availWidth: screen.availWidth,
		availHeight: screen.availHeight,
		colorDepth: screen.colorDepth,
		pixelDepth: screen.pixelDepth,
		devicePixelRatio: window.devicePixelRatio || 1,
		orientation: screen.orientation?.type || 'unknown',
		touchSupport: 'ontouchstart' in window,
		maxTouchPoints: navigator.maxTouchPoints || 0,
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		hostname: window.location.hostname,
		protocol: window.location.protocol,
		port:
			window.location.port ||
			(window.location.protocol === 'https:' ? '443' : '80'),
		doNotTrack: navigator.doNotTrack || 'unknown',
		javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
		webdriver: (navigator as any).webdriver || false,
		cookieSupport: navigator.cookieEnabled,
		localStorage: typeof Storage !== 'undefined',
		sessionStorage: typeof Storage !== 'undefined',
		indexedDB: typeof indexedDB !== 'undefined'
	}
}

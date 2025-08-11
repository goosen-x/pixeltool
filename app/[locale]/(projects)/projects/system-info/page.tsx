'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
	Monitor, 
	Smartphone, 
	Cpu, 
	Eye, 
	Copy, 
	RefreshCw, 
	Globe,
	HardDrive,
	Wifi,
	Shield,
	Chrome,
	Check,
	X,
	CircuitBoard,
	Gauge,
	Languages,
	Clock,
	Server,
	Database,
	Cookie,
	Fingerprint
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface SystemInfo {
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

interface DeviceInfo {
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

const deviceDatabase = [
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

export default function SystemInfoPage() {
	const t = useTranslations('widgets.systemInfo')
	const [mounted, setMounted] = useState(false)
	const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
	const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
	const [activeTab, setActiveTab] = useState('overview')
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [copiedItem, setCopiedItem] = useState<string | null>(null)

	useEffect(() => {
		setMounted(true)
		detectSystemInfo()
	}, [])

	const detectSystemInfo = () => {
		if (typeof window === 'undefined') return

		const info: SystemInfo = {
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

		const device = detectDevice(info)

		setSystemInfo(info)
		setDeviceInfo(device)
	}

	const getArchitecture = (): string => {
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

	const detectDevice = (info: SystemInfo): DeviceInfo => {
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
				// Map Windows NT versions to user-friendly names
				const windowsVersions: Record<string, string> = {
					'10.0': '10/11',
					'6.3': '8.1',
					'6.2': '8',
					'6.1': '7',
					'6.0': 'Vista',
					'5.2': 'XP 64-bit',
					'5.1': 'XP'
				}
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

	const copyToClipboard = async (text: string, label: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedItem(label)
			toast.success(t('toast.copied', { item: label }))
			setTimeout(() => setCopiedItem(null), 2000)
		} catch (error) {
			toast.error(t('toast.copyError'))
		}
	}

	const refresh = async () => {
		setIsRefreshing(true)
		await new Promise(resolve => setTimeout(resolve, 500))
		detectSystemInfo()
		setIsRefreshing(false)
		toast.success(t('toast.refreshed'))
	}

	if (!mounted || !systemInfo || !deviceInfo) {
		return null
	}

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Quick Actions */}
			<div className="flex justify-end">
				<Button 
					onClick={refresh} 
					variant='outline' 
					size='sm' 
					className={`transition-all duration-300 ${isRefreshing ? 'scale-105' : 'hover:scale-105'}`}
					disabled={isRefreshing}
				>
					<RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
					{t('refresh')}
				</Button>
			</div>

			{/* Hero Cards with Gradient Backgrounds */}
			<div className='grid lg:grid-cols-3 gap-6'>
				{/* Architecture Card */}
				<Card className='relative overflow-hidden group hover:shadow-xl transition-all duration-300'>
					<div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 group-hover:from-blue-500/20 group-hover:to-blue-600/10 transition-all duration-300' />
					<CardContent className='relative p-6'>
						<div className='mb-4 p-3 bg-blue-500/10 rounded-xl w-fit mx-auto'>
							<CircuitBoard className='w-8 h-8 text-blue-600' />
						</div>
						<h3 className='font-semibold text-lg mb-3 text-center'>{t('architecture.title')}</h3>
						<div className='text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent'>
							{systemInfo.architecture}
						</div>
						<p className='text-sm text-muted-foreground text-center'>
							{systemInfo.architecture.includes('64')
								? t('architecture.supports64bit')
								: t('architecture.supports32bit')}
						</p>
						{systemInfo.architecture.includes('64') && (
							<div className='mt-4 flex justify-center'>
								<Badge variant='default' className='bg-blue-600'>
									{t('architecture.recommended')}
								</Badge>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Display Card */}
				<Card className='relative overflow-hidden group hover:shadow-xl transition-all duration-300'>
					<div className='absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5 group-hover:from-green-500/20 group-hover:to-green-600/10 transition-all duration-300' />
					<CardContent className='relative p-6'>
						<div className='mb-4 p-3 bg-green-500/10 rounded-xl w-fit mx-auto'>
							<Monitor className='w-8 h-8 text-green-600' />
						</div>
						<h3 className='font-semibold text-lg mb-3 text-center'>{t('display.title')}</h3>
						<div className='text-3xl font-bold text-center mb-3 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent'>
							{deviceInfo.logicalResolution}
						</div>
						<p className='text-sm text-muted-foreground text-center'>
							{deviceInfo.isRetina
								? t('display.retina', { resolution: deviceInfo.actualResolution })
								: t('display.standard')}
						</p>
						{deviceInfo.isRetina && (
							<div className='mt-4 flex justify-center'>
								<Badge variant='default' className='bg-green-600'>
									{systemInfo.devicePixelRatio}x Retina
								</Badge>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Device Card */}
				<Card className='relative overflow-hidden group hover:shadow-xl transition-all duration-300'>
					<div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5 group-hover:from-purple-500/20 group-hover:to-purple-600/10 transition-all duration-300' />
					<CardContent className='relative p-6'>
						<div className='mb-4 p-3 bg-purple-500/10 rounded-xl w-fit mx-auto'>
							<Smartphone className='w-8 h-8 text-purple-600' />
						</div>
						<h3 className='font-semibold text-lg mb-3 text-center'>{t('device.title')}</h3>
						<div className='text-xl font-bold text-center mb-3 bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent'>
							{deviceInfo.brand && deviceInfo.model
								? `${deviceInfo.brand} ${deviceInfo.model}`
								: t(`device.type.${deviceInfo.type}`)}
						</div>
						<p className='text-sm text-muted-foreground text-center'>
							{deviceInfo.screenSize
								? t('device.screenSize', { size: deviceInfo.screenSize })
								: `${deviceInfo.os} • ${deviceInfo.browser}`}
						</p>
						{deviceInfo.type === 'mobile' && (
							<div className='mt-4 flex justify-center'>
								<Badge variant='default' className='bg-purple-600'>
									{t('device.touchEnabled')}
								</Badge>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Detailed Information Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
				<TabsList className='grid grid-cols-5 w-full p-1 h-auto'>
					<TabsTrigger value='overview' className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
						<Eye className='w-4 h-4 mr-2' />
						{t('tabs.overview')}
					</TabsTrigger>
					<TabsTrigger value='hardware' className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
						<CircuitBoard className='w-4 h-4 mr-2' />
						{t('tabs.hardware')}
					</TabsTrigger>
					<TabsTrigger value='display' className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
						<Monitor className='w-4 h-4 mr-2' />
						{t('tabs.display')}
					</TabsTrigger>
					<TabsTrigger value='browser' className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
						<Chrome className='w-4 h-4 mr-2' />
						{t('tabs.browser')}
					</TabsTrigger>
					<TabsTrigger value='features' className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
						<Shield className='w-4 h-4 mr-2' />
						{t('tabs.features')}
					</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value='overview' className='space-y-6 mt-6'>
					<div className='grid gap-6 md:grid-cols-2'>
						{/* System Overview Card */}
						<Card className='overflow-hidden'>
							<CardHeader className='bg-gradient-to-r from-primary/10 to-primary/5'>
								<CardTitle className='flex items-center gap-2'>
									<Globe className='w-5 h-5' />
									{t('overview.systemOverview')}
								</CardTitle>
							</CardHeader>
							<CardContent className='pt-6 space-y-4'>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>{t('overview.os')}</span>
									<div className='flex items-center gap-2'>
										<Badge variant='secondary'>
											{deviceInfo.os} {deviceInfo.osVersion || ''}
										</Badge>
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>{t('overview.browser')}</span>
									<div className='flex items-center gap-2'>
										<Badge variant='secondary'>
											{deviceInfo.browser} {deviceInfo.browserVersion?.split('.')[0] || ''}
										</Badge>
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>{t('overview.platform')}</span>
									<Badge variant='outline'>{systemInfo.platform}</Badge>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>{t('overview.language')}</span>
									<Badge variant='outline'>{systemInfo.language}</Badge>
								</div>
							</CardContent>
						</Card>

						{/* Network Info Card */}
						<Card className='overflow-hidden'>
							<CardHeader className='bg-gradient-to-r from-blue-500/10 to-blue-600/5'>
								<CardTitle className='flex items-center gap-2'>
									<Wifi className='w-5 h-5' />
									{t('overview.networkInfo')}
								</CardTitle>
							</CardHeader>
							<CardContent className='pt-6 space-y-4'>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>{t('overview.status')}</span>
									<Badge variant={systemInfo.onlineStatus ? 'default' : 'secondary'}>
										{systemInfo.onlineStatus ? t('overview.online') : t('overview.offline')}
									</Badge>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>{t('overview.hostname')}</span>
									<code className='text-xs bg-muted px-2 py-1 rounded'>{systemInfo.hostname}</code>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>{t('overview.protocol')}</span>
									<Badge variant={systemInfo.protocol === 'https:' ? 'default' : 'secondary'}>
										{systemInfo.protocol}
									</Badge>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>{t('overview.timezone')}</span>
									<Badge variant='outline'>{systemInfo.timezone}</Badge>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Quick Stats Grid */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						<Card className='p-4 text-center hover:shadow-md transition-shadow'>
							<Gauge className='w-8 h-8 mx-auto mb-2 text-orange-500' />
							<p className='text-sm font-medium text-muted-foreground'>{t('overview.pixelRatio')}</p>
							<p className='text-2xl font-bold'>{systemInfo.devicePixelRatio}x</p>
						</Card>
						<Card className='p-4 text-center hover:shadow-md transition-shadow'>
							<Languages className='w-8 h-8 mx-auto mb-2 text-green-500' />
							<p className='text-sm font-medium text-muted-foreground'>{t('overview.languages')}</p>
							<p className='text-2xl font-bold'>{systemInfo.languages.length}</p>
						</Card>
						<Card className='p-4 text-center hover:shadow-md transition-shadow'>
							<HardDrive className='w-8 h-8 mx-auto mb-2 text-blue-500' />
							<p className='text-sm font-medium text-muted-foreground'>{t('overview.colorDepth')}</p>
							<p className='text-2xl font-bold'>{systemInfo.colorDepth} bit</p>
						</Card>
						<Card className='p-4 text-center hover:shadow-md transition-shadow'>
							<Fingerprint className='w-8 h-8 mx-auto mb-2 text-purple-500' />
							<p className='text-sm font-medium text-muted-foreground'>{t('overview.touchPoints')}</p>
							<p className='text-2xl font-bold'>{systemInfo.maxTouchPoints || 0}</p>
						</Card>
					</div>
				</TabsContent>

				{/* Hardware Tab */}
				<TabsContent value='hardware' className='space-y-6 mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>{t('hardware.processorInfo')}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='group relative p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl hover:from-muted/50 hover:to-muted/30 transition-all'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='font-medium'>{t('hardware.architecture')}</p>
											<p className='text-sm text-muted-foreground'>{t('hardware.architectureDesc')}</p>
										</div>
										<div className='flex items-center gap-2'>
											<Badge variant={systemInfo.architecture.includes('64') ? 'default' : 'secondary'}>
												{systemInfo.architecture}
											</Badge>
											<Button
												onClick={() => copyToClipboard(systemInfo.architecture, t('hardware.architecture'))}
												size='icon'
												variant='ghost'
												className='opacity-0 group-hover:opacity-100 transition-opacity'
											>
												{copiedItem === t('hardware.architecture') ? (
													<Check className='w-4 h-4 text-green-500' />
												) : (
													<Copy className='w-4 h-4' />
												)}
											</Button>
										</div>
									</div>
								</div>

								<div className='group relative p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl hover:from-muted/50 hover:to-muted/30 transition-all'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='font-medium'>{t('hardware.platform')}</p>
											<p className='text-sm text-muted-foreground'>{t('hardware.platformDesc')}</p>
										</div>
										<div className='flex items-center gap-2'>
											<Badge variant='outline'>{systemInfo.platform}</Badge>
											<Button
												onClick={() => copyToClipboard(systemInfo.platform, t('hardware.platform'))}
												size='icon'
												variant='ghost'
												className='opacity-0 group-hover:opacity-100 transition-opacity'
											>
												{copiedItem === t('hardware.platform') ? (
													<Check className='w-4 h-4 text-green-500' />
												) : (
													<Copy className='w-4 h-4' />
												)}
											</Button>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Architecture Explanation */}
					<Card className='overflow-hidden'>
						<div className='bg-gradient-to-r from-blue-500/10 to-blue-600/5 p-6'>
							<h4 className='font-semibold text-lg mb-4'>{t('hardware.whatIsArchitecture')}</h4>
							<div className='grid md:grid-cols-2 gap-6'>
								<div className='space-y-3'>
									<div className='flex items-start gap-3'>
										<div className='mt-1 p-1 bg-blue-500/20 rounded'>
											<Check className='w-4 h-4 text-blue-600' />
										</div>
										<div>
											<h5 className='font-medium text-blue-900 dark:text-blue-100'>{t('hardware.64bit.title')}</h5>
											<ul className='mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-200'>
												<li>• {t('hardware.64bit.memory')}</li>
												<li>• {t('hardware.64bit.performance')}</li>
												<li>• {t('hardware.64bit.compatibility')}</li>
												<li>• {t('hardware.64bit.security')}</li>
											</ul>
										</div>
									</div>
								</div>
								<div className='space-y-3'>
									<div className='flex items-start gap-3'>
										<div className='mt-1 p-1 bg-orange-500/20 rounded'>
											<X className='w-4 h-4 text-orange-600' />
										</div>
										<div>
											<h5 className='font-medium text-orange-900 dark:text-orange-100'>{t('hardware.32bit.title')}</h5>
											<ul className='mt-2 space-y-1 text-sm text-orange-700 dark:text-orange-200'>
												<li>• {t('hardware.32bit.memory')}</li>
												<li>• {t('hardware.32bit.performance')}</li>
												<li>• {t('hardware.32bit.compatibility')}</li>
												<li>• {t('hardware.32bit.deprecated')}</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</TabsContent>

				{/* Display Tab */}
				<TabsContent value='display' className='space-y-6 mt-6'>
					<div className='grid gap-6'>
						{/* Resolution Comparison */}
						<div className='grid md:grid-cols-2 gap-6'>
							<Card className='overflow-hidden'>
								<CardHeader className='bg-gradient-to-r from-green-500/10 to-green-600/5'>
									<CardTitle className='text-base'>{t('display.logical')}</CardTitle>
								</CardHeader>
								<CardContent className='pt-6'>
									<div className='text-center'>
										<p className='text-3xl font-bold text-green-600 mb-2'>
											{deviceInfo.logicalResolution}
										</p>
										<p className='text-sm text-muted-foreground'>{t('display.cssPixels')}</p>
									</div>
								</CardContent>
							</Card>

							<Card className='overflow-hidden'>
								<CardHeader className='bg-gradient-to-r from-blue-500/10 to-blue-600/5'>
									<CardTitle className='text-base'>{t('display.physical')}</CardTitle>
								</CardHeader>
								<CardContent className='pt-6'>
									<div className='text-center'>
										<p className='text-3xl font-bold text-blue-600 mb-2'>
											{deviceInfo.actualResolution}
										</p>
										<p className='text-sm text-muted-foreground'>{t('display.actualPixels')}</p>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Display Properties */}
						<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
							<Card className='p-4 text-center'>
								<Gauge className='w-6 h-6 mx-auto mb-2 text-orange-500' />
								<p className='text-xs font-medium text-muted-foreground mb-1'>{t('display.pixelRatio')}</p>
								<p className='text-xl font-bold'>{systemInfo.devicePixelRatio}x</p>
								<Badge variant='outline' className='mt-2 text-xs'>
									{deviceInfo.isRetina ? 'Retina' : 'Standard'}
								</Badge>
							</Card>

							<Card className='p-4 text-center'>
								<Monitor className='w-6 h-6 mx-auto mb-2 text-purple-500' />
								<p className='text-xs font-medium text-muted-foreground mb-1'>{t('display.colorDepth')}</p>
								<p className='text-xl font-bold'>{systemInfo.colorDepth} bit</p>
								<Badge variant='outline' className='mt-2 text-xs'>
									{Math.pow(2, systemInfo.colorDepth).toLocaleString()}
								</Badge>
							</Card>

							<Card className='p-4 text-center'>
								<Smartphone className='w-6 h-6 mx-auto mb-2 text-green-500' />
								<p className='text-xs font-medium text-muted-foreground mb-1'>{t('display.orientation')}</p>
								<p className='text-sm font-bold'>{systemInfo.orientation.split('-')[0]}</p>
								<Badge variant='outline' className='mt-2 text-xs'>
									{systemInfo.orientation}
								</Badge>
							</Card>

							{deviceInfo.ppi && (
								<Card className='p-4 text-center'>
									<CircuitBoard className='w-6 h-6 mx-auto mb-2 text-blue-500' />
									<p className='text-xs font-medium text-muted-foreground mb-1'>{t('display.density')}</p>
									<p className='text-xl font-bold'>{deviceInfo.ppi}</p>
									<Badge variant='outline' className='mt-2 text-xs'>PPI</Badge>
								</Card>
							)}
						</div>

						{/* Screen Size Info */}
						{deviceInfo.screenSize && (
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>{t('display.screenInfo')}</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='flex items-center justify-between'>
										<span className='text-sm font-medium'>{t('display.screenSize')}</span>
										<Badge variant='secondary'>{deviceInfo.screenSize}</Badge>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</TabsContent>

				{/* Browser Tab */}
				<TabsContent value='browser' className='space-y-6 mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>{t('browser.information')}</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Browser & OS Info */}
							<div className='grid md:grid-cols-2 gap-4'>
								<div className='p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl'>
									<div className='flex items-center gap-3 mb-3'>
										<Chrome className='w-5 h-5 text-blue-500' />
										<p className='font-medium'>{t('browser.browser')}</p>
									</div>
									<p className='text-xl font-bold'>{deviceInfo.browser}</p>
									{deviceInfo.browserVersion && (
										<p className='text-sm text-muted-foreground mt-1'>
											{t('browser.version')}: {deviceInfo.browserVersion}
										</p>
									)}
								</div>

								<div className='p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl'>
									<div className='flex items-center gap-3 mb-3'>
										<Server className='w-5 h-5 text-green-500' />
										<p className='font-medium'>{t('browser.os')}</p>
									</div>
									<p className='text-xl font-bold'>{deviceInfo.os}</p>
									{deviceInfo.osVersion && (
										<p className='text-sm text-muted-foreground mt-1'>
											{t('browser.version')}: {deviceInfo.osVersion}
										</p>
									)}
								</div>
							</div>

							{/* Languages */}
							<div className='p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl'>
								<div className='flex items-center gap-3 mb-3'>
									<Languages className='w-5 h-5 text-purple-500' />
									<p className='font-medium'>{t('browser.languages')}</p>
								</div>
								<div className='flex flex-wrap gap-2'>
									{systemInfo.languages.map((lang, index) => (
										<Badge key={index} variant='secondary'>
											{lang}
										</Badge>
									))}
								</div>
							</div>

							{/* User Agent */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<p className='font-medium'>User Agent</p>
									<Button
										onClick={() => copyToClipboard(systemInfo.userAgent, 'User Agent')}
										size='sm'
										variant='ghost'
									>
										{copiedItem === 'User Agent' ? (
											<Check className='w-4 h-4 text-green-500' />
										) : (
											<Copy className='w-4 h-4' />
										)}
									</Button>
								</div>
								<code className='block p-3 bg-muted/30 rounded-lg text-xs overflow-x-auto'>
									{systemInfo.userAgent}
								</code>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Features Tab */}
				<TabsContent value='features' className='space-y-6 mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>{t('features.browserFeatures')}</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Storage Support */}
							<div>
								<h4 className='font-medium mb-3 flex items-center gap-2'>
									<Database className='w-4 h-4' />
									{t('features.storage')}
								</h4>
								<div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
									<div className='flex items-center gap-2 p-3 bg-muted/30 rounded-lg'>
										{systemInfo.cookieEnabled ? (
											<Check className='w-4 h-4 text-green-500' />
										) : (
											<X className='w-4 h-4 text-red-500' />
										)}
										<span className='text-sm'>Cookies</span>
									</div>
									<div className='flex items-center gap-2 p-3 bg-muted/30 rounded-lg'>
										{systemInfo.localStorage ? (
											<Check className='w-4 h-4 text-green-500' />
										) : (
											<X className='w-4 h-4 text-red-500' />
										)}
										<span className='text-sm'>LocalStorage</span>
									</div>
									<div className='flex items-center gap-2 p-3 bg-muted/30 rounded-lg'>
										{systemInfo.sessionStorage ? (
											<Check className='w-4 h-4 text-green-500' />
										) : (
											<X className='w-4 h-4 text-red-500' />
										)}
										<span className='text-sm'>SessionStorage</span>
									</div>
									<div className='flex items-center gap-2 p-3 bg-muted/30 rounded-lg'>
										{systemInfo.indexedDB ? (
											<Check className='w-4 h-4 text-green-500' />
										) : (
											<X className='w-4 h-4 text-red-500' />
										)}
										<span className='text-sm'>IndexedDB</span>
									</div>
								</div>
							</div>

							{/* Privacy Settings */}
							<div>
								<h4 className='font-medium mb-3 flex items-center gap-2'>
									<Shield className='w-4 h-4' />
									{t('features.privacy')}
								</h4>
								<div className='grid md:grid-cols-2 gap-4'>
									<div className='p-4 bg-muted/30 rounded-lg'>
										<p className='text-sm font-medium mb-1'>Do Not Track</p>
										<Badge variant={systemInfo.doNotTrack === '1' ? 'default' : 'secondary'}>
											{systemInfo.doNotTrack === '1'
												? t('features.enabled')
												: systemInfo.doNotTrack === '0'
													? t('features.disabled')
													: t('features.notSet')}
										</Badge>
									</div>
									<div className='p-4 bg-muted/30 rounded-lg'>
										<p className='text-sm font-medium mb-1'>WebDriver</p>
										<Badge variant={systemInfo.webdriver ? 'destructive' : 'default'}>
											{systemInfo.webdriver ? t('features.detected') : t('features.notDetected')}
										</Badge>
									</div>
								</div>
							</div>

							{/* Touch Support */}
							<div>
								<h4 className='font-medium mb-3 flex items-center gap-2'>
									<Fingerprint className='w-4 h-4' />
									{t('features.touch')}
								</h4>
								<div className='grid md:grid-cols-2 gap-4'>
									<div className='p-4 bg-muted/30 rounded-lg'>
										<p className='text-sm font-medium mb-1'>{t('features.touchSupport')}</p>
										<Badge variant={systemInfo.touchSupport ? 'default' : 'secondary'}>
											{systemInfo.touchSupport ? t('features.supported') : t('features.notSupported')}
										</Badge>
									</div>
									{systemInfo.touchSupport && (
										<div className='p-4 bg-muted/30 rounded-lg'>
											<p className='text-sm font-medium mb-1'>{t('features.multitouch')}</p>
											<Badge variant='default'>
												{systemInfo.maxTouchPoints} {t('features.points')}
											</Badge>
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
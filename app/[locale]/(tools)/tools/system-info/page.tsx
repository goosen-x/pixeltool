'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Monitor,
	Smartphone,
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
	Server,
	Database,
	Fingerprint
} from 'lucide-react'
import { useSystemInfo } from '@/lib/hooks/widgets'
import { useTranslations, useLocale } from 'next-intl'

export default function SystemInfoPage() {
	const t = useTranslations('widgets.systemInfo')
	const locale = useLocale()

	const {
		mounted,
		systemInfo,
		deviceInfo,
		activeTab,
		isRefreshing,
		copiedItem,
		setActiveTab,
		copyToClipboard,
		refresh,
		getDeviceName
	} = useSystemInfo({
		translations: {
			copied:
				locale === 'ru'
					? '__ITEM__ скопировано в буфер обмена'
					: '__ITEM__ copied to clipboard',
			copyError: t('toast.copyError'),
			refreshed: t('toast.refreshed')
		}
	})

	if (!mounted || !systemInfo || !deviceInfo) {
		return null
	}

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Quick Actions */}
			<div className='flex justify-end'>
				<Button
					onClick={refresh}
					variant='outline'
					size='sm'
					className={`transition-all duration-300 ${isRefreshing ? 'scale-105' : 'hover:scale-105'}`}
					disabled={isRefreshing}
				>
					<RefreshCw
						className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
					/>
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
						<h3 className='font-semibold text-lg mb-3 text-center'>
							{t('architecture.title')}
						</h3>
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
						<h3 className='font-semibold text-lg mb-3 text-center'>
							{t('display.title')}
						</h3>
						<div className='text-3xl font-bold text-center mb-3 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent'>
							{deviceInfo.logicalResolution}
						</div>
						<p className='text-sm text-muted-foreground text-center'>
							{deviceInfo.isRetina
								? t('display.retina', {
										resolution: deviceInfo.actualResolution
									})
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
						<h3 className='font-semibold text-lg mb-3 text-center'>
							{t('device.title')}
						</h3>
						<div className='text-xl font-bold text-center mb-3 bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent'>
							{deviceInfo.brand && deviceInfo.model
								? getDeviceName()
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
			<Tabs value={activeTab} onValueChange={setActiveTab} className='mt-8'>
				<TabsList className='grid grid-cols-5 w-full p-1 h-auto'>
					<TabsTrigger
						value='overview'
						className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
					>
						<Eye className='w-4 h-4 mr-2' />
						{t('tabs.overview')}
					</TabsTrigger>
					<TabsTrigger
						value='hardware'
						className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
					>
						<CircuitBoard className='w-4 h-4 mr-2' />
						{t('tabs.hardware')}
					</TabsTrigger>
					<TabsTrigger
						value='display'
						className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
					>
						<Monitor className='w-4 h-4 mr-2' />
						{t('tabs.display')}
					</TabsTrigger>
					<TabsTrigger
						value='browser'
						className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
					>
						<Chrome className='w-4 h-4 mr-2' />
						{t('tabs.browser')}
					</TabsTrigger>
					<TabsTrigger
						value='features'
						className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
					>
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
									<span className='text-sm font-medium'>
										{t('overview.os')}
									</span>
									<div className='flex items-center gap-2'>
										<Badge variant='secondary'>
											{deviceInfo.os} {deviceInfo.osVersion || ''}
										</Badge>
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>
										{t('overview.browser')}
									</span>
									<div className='flex items-center gap-2'>
										<Badge variant='secondary'>
											{deviceInfo.browser}{' '}
											{deviceInfo.browserVersion?.split('.')[0] || ''}
										</Badge>
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>
										{t('overview.platform')}
									</span>
									<Badge variant='outline'>{systemInfo.platform}</Badge>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>
										{t('overview.language')}
									</span>
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
									<span className='text-sm font-medium'>
										{t('overview.status')}
									</span>
									<Badge
										variant={systemInfo.onlineStatus ? 'default' : 'secondary'}
									>
										{systemInfo.onlineStatus
											? t('overview.online')
											: t('overview.offline')}
									</Badge>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>
										{t('overview.hostname')}
									</span>
									<code className='inline-code'>{systemInfo.hostname}</code>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>
										{t('overview.protocol')}
									</span>
									<Badge
										variant={
											systemInfo.protocol === 'https:' ? 'default' : 'secondary'
										}
									>
										{systemInfo.protocol}
									</Badge>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>
										{t('overview.timezone')}
									</span>
									<Badge variant='outline'>{systemInfo.timezone}</Badge>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Quick Stats Grid */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						<Card className='p-4 text-center hover:shadow-md transition-shadow'>
							<Gauge className='w-8 h-8 mx-auto mb-2 text-orange-500' />
							<p className='text-sm font-medium text-muted-foreground'>
								{t('overview.pixelRatio')}
							</p>
							<p className='text-2xl font-bold'>
								{systemInfo.devicePixelRatio}x
							</p>
						</Card>
						<Card className='p-4 text-center hover:shadow-md transition-shadow'>
							<Languages className='w-8 h-8 mx-auto mb-2 text-green-500' />
							<p className='text-sm font-medium text-muted-foreground'>
								{t('overview.languages')}
							</p>
							<p className='text-2xl font-bold'>
								{systemInfo.languages.length}
							</p>
						</Card>
						<Card className='p-4 text-center hover:shadow-md transition-shadow'>
							<HardDrive className='w-8 h-8 mx-auto mb-2 text-blue-500' />
							<p className='text-sm font-medium text-muted-foreground'>
								{t('overview.colorDepth')}
							</p>
							<p className='text-2xl font-bold'>{systemInfo.colorDepth} bit</p>
						</Card>
						<Card className='p-4 text-center hover:shadow-md transition-shadow'>
							<Fingerprint className='w-8 h-8 mx-auto mb-2 text-purple-500' />
							<p className='text-sm font-medium text-muted-foreground'>
								{t('overview.touchPoints')}
							</p>
							<p className='text-2xl font-bold'>
								{systemInfo.maxTouchPoints || 0}
							</p>
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
											<p className='font-medium'>
												{t('hardware.architecture')}
											</p>
											<p className='text-sm text-muted-foreground'>
												{t('hardware.architectureDesc')}
											</p>
										</div>
										<div className='flex items-center gap-2'>
											<Badge
												variant={
													systemInfo.architecture.includes('64')
														? 'default'
														: 'secondary'
												}
											>
												{systemInfo.architecture}
											</Badge>
											<Button
												onClick={() =>
													copyToClipboard(
														systemInfo.architecture,
														t('hardware.architecture')
													)
												}
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
											<p className='text-sm text-muted-foreground'>
												{t('hardware.platformDesc')}
											</p>
										</div>
										<div className='flex items-center gap-2'>
											<Badge variant='outline'>{systemInfo.platform}</Badge>
											<Button
												onClick={() =>
													copyToClipboard(
														systemInfo.platform,
														t('hardware.platform')
													)
												}
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
							<h4 className='font-semibold text-lg mb-4'>
								{t('hardware.whatIsArchitecture')}
							</h4>
							<div className='grid md:grid-cols-2 gap-6'>
								<div className='space-y-3'>
									<div className='flex items-start gap-3'>
										<div className='mt-1 p-1 bg-blue-500/20 rounded'>
											<Check className='w-4 h-4 text-blue-600' />
										</div>
										<div>
											<h5 className='font-medium text-blue-900 dark:text-blue-100'>
												{t('hardware.64bit.title')}
											</h5>
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
										<div className='mt-1 p-1 bg-blue-500/20 rounded'>
											<X className='w-4 h-4 text-blue-600' />
										</div>
										<div>
											<h5 className='font-medium text-blue-900 dark:text-blue-100'>
												{t('hardware.32bit.title')}
											</h5>
											<ul className='mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-200'>
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
									<CardTitle className='text-base'>
										{t('display.logical')}
									</CardTitle>
								</CardHeader>
								<CardContent className='pt-6'>
									<div className='text-center'>
										<p className='text-3xl font-bold text-green-600 mb-2'>
											{deviceInfo.logicalResolution}
										</p>
										<p className='text-sm text-muted-foreground'>
											{t('display.cssPixels')}
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className='overflow-hidden'>
								<CardHeader className='bg-gradient-to-r from-blue-500/10 to-blue-600/5'>
									<CardTitle className='text-base'>
										{t('display.physical')}
									</CardTitle>
								</CardHeader>
								<CardContent className='pt-6'>
									<div className='text-center'>
										<p className='text-3xl font-bold text-blue-600 mb-2'>
											{deviceInfo.actualResolution}
										</p>
										<p className='text-sm text-muted-foreground'>
											{t('display.actualPixels')}
										</p>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Display Properties */}
						<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
							<Card className='p-4 text-center'>
								<Gauge className='w-6 h-6 mx-auto mb-2 text-orange-500' />
								<p className='text-xs font-medium text-muted-foreground mb-1'>
									{t('display.pixelRatio')}
								</p>
								<p className='text-xl font-bold'>
									{systemInfo.devicePixelRatio}x
								</p>
								<Badge variant='outline' className='mt-2 text-xs'>
									{deviceInfo.isRetina ? 'Retina' : 'Standard'}
								</Badge>
							</Card>

							<Card className='p-4 text-center'>
								<Monitor className='w-6 h-6 mx-auto mb-2 text-purple-500' />
								<p className='text-xs font-medium text-muted-foreground mb-1'>
									{t('display.colorDepth')}
								</p>
								<p className='text-xl font-bold'>{systemInfo.colorDepth} bit</p>
								<Badge variant='outline' className='mt-2 text-xs'>
									{Math.pow(2, systemInfo.colorDepth).toLocaleString()}
								</Badge>
							</Card>

							<Card className='p-4 text-center'>
								<Smartphone className='w-6 h-6 mx-auto mb-2 text-green-500' />
								<p className='text-xs font-medium text-muted-foreground mb-1'>
									{t('display.orientation')}
								</p>
								<p className='text-sm font-bold'>
									{systemInfo.orientation.split('-')[0]}
								</p>
								<Badge variant='outline' className='mt-2 text-xs'>
									{systemInfo.orientation}
								</Badge>
							</Card>

							{deviceInfo.ppi && (
								<Card className='p-4 text-center'>
									<CircuitBoard className='w-6 h-6 mx-auto mb-2 text-blue-500' />
									<p className='text-xs font-medium text-muted-foreground mb-1'>
										{t('display.density')}
									</p>
									<p className='text-xl font-bold'>{deviceInfo.ppi}</p>
									<Badge variant='outline' className='mt-2 text-xs'>
										PPI
									</Badge>
								</Card>
							)}
						</div>

						{/* Screen Size Info */}
						{deviceInfo.screenSize && (
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>
										{t('display.screenInfo')}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='flex items-center justify-between'>
										<span className='text-sm font-medium'>
											{t('display.screenSize')}
										</span>
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
										onClick={() =>
											copyToClipboard(systemInfo.userAgent, 'User Agent')
										}
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
								<code className='inline-code block p-3 overflow-x-auto'>
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
										<Badge
											variant={
												systemInfo.doNotTrack === '1' ? 'default' : 'secondary'
											}
										>
											{systemInfo.doNotTrack === '1'
												? t('features.enabled')
												: systemInfo.doNotTrack === '0'
													? t('features.disabled')
													: t('features.notSet')}
										</Badge>
									</div>
									<div className='p-4 bg-muted/30 rounded-lg'>
										<p className='text-sm font-medium mb-1'>WebDriver</p>
										<Badge
											variant={systemInfo.webdriver ? 'destructive' : 'default'}
										>
											{systemInfo.webdriver
												? t('features.detected')
												: t('features.notDetected')}
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
										<p className='text-sm font-medium mb-1'>
											{t('features.touchSupport')}
										</p>
										<Badge
											variant={
												systemInfo.touchSupport ? 'default' : 'secondary'
											}
										>
											{systemInfo.touchSupport
												? t('features.supported')
												: t('features.notSupported')}
										</Badge>
									</div>
									{systemInfo.touchSupport && (
										<div className='p-4 bg-muted/30 rounded-lg'>
											<p className='text-sm font-medium mb-1'>
												{t('features.multitouch')}
											</p>
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

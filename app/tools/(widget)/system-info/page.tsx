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

export default function SystemInfoPage() {
	const locale = 'ru'

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
			copyError: 'Ошибка при копировании',
			refreshed: 'Данные обновлены'
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
					Обновить
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
							Архитектура
						</h3>
						<div className='text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent'>
							{systemInfo.architecture}
						</div>
						<p className='text-sm text-muted-foreground text-center'>
							{systemInfo.architecture.includes('64')
								? 'Поддержка 64-битных приложений'
								: 'Поддержка 32-битных приложений'}
						</p>
						{systemInfo.architecture.includes('64') && (
							<div className='mt-4 flex justify-center'>
								<Badge variant='default' className='bg-blue-600'>
									Рекомендуется
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
						<h3 className='font-semibold text-lg mb-3 text-center'>Дисплей</h3>
						<div className='text-3xl font-bold text-center mb-3 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent'>
							{deviceInfo.logicalResolution}
						</div>
						<p className='text-sm text-muted-foreground text-center'>
							{deviceInfo.isRetina
								? `Retina дисплей (${deviceInfo.actualResolution})`
								: 'Стандартный дисплей'}
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
							Устройство
						</h3>
						<div className='text-xl font-bold text-center mb-3 bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent'>
							{deviceInfo.brand && deviceInfo.model
								? getDeviceName()
								: deviceInfo.type === 'mobile'
									? 'Мобильное устройство'
									: deviceInfo.type === 'tablet'
										? 'Планшет'
										: 'Настольный компьютер'}
						</div>
						<p className='text-sm text-muted-foreground text-center'>
							{deviceInfo.screenSize
								? `Размер экрана: ${deviceInfo.screenSize}`
								: `${deviceInfo.os} • ${deviceInfo.browser}`}
						</p>
						{deviceInfo.type === 'mobile' && (
							<div className='mt-4 flex justify-center'>
								<Badge variant='default' className='bg-purple-600'>
									Сенсорный экран
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
						className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground '
					>
						<Eye className='w-4 h-4 mr-2 hidden md:inline' />
						Обзор
					</TabsTrigger>
					<TabsTrigger
						value='hardware'
						className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
					>
						<CircuitBoard className='w-4 h-4 mr-2 hidden md:inline' />
						Железо
					</TabsTrigger>
					<TabsTrigger
						value='display'
						className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
					>
						<Monitor className='w-4 h-4 mr-2 hidden md:inline' />
						Дисплей
					</TabsTrigger>
					<TabsTrigger
						value='browser'
						className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
					>
						<Chrome className='w-4 h-4 mr-2 hidden md:inline' />
						Браузер
					</TabsTrigger>
					<TabsTrigger
						value='features'
						className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
					>
						<Shield className='w-4 h-4 mr-2 hidden md:inline' />
						Прочее
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
									Обзор системы
								</CardTitle>
							</CardHeader>
							<CardContent className='pt-6 space-y-4'>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>
										Операционная система
									</span>
									<div className='flex items-center gap-2'>
										<Badge variant='secondary'>
											{deviceInfo.os} {deviceInfo.osVersion || ''}
										</Badge>
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>Браузер</span>
									<div className='flex items-center gap-2'>
										<Badge variant='secondary'>
											{deviceInfo.browser}{' '}
											{deviceInfo.browserVersion?.split('.')[0] || ''}
										</Badge>
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>Платформа</span>
									<Badge variant='outline'>{systemInfo.platform}</Badge>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>Язык</span>
									<Badge variant='outline'>{systemInfo.language}</Badge>
								</div>
							</CardContent>
						</Card>

						{/* Network Info Card */}
						<Card className='overflow-hidden'>
							<CardHeader className='bg-gradient-to-r from-blue-500/10 to-blue-600/5'>
								<CardTitle className='flex items-center gap-2'>
									<Wifi className='w-5 h-5' />
									Сетевая информация
								</CardTitle>
							</CardHeader>
							<CardContent className='pt-6 space-y-4'>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>Статус</span>
									<Badge
										variant={systemInfo.onlineStatus ? 'default' : 'secondary'}
									>
										{systemInfo.onlineStatus ? 'Онлайн' : 'Офлайн'}
									</Badge>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>Имя хоста</span>
									<code className='inline-code'>{systemInfo.hostname}</code>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>Протокол</span>
									<Badge
										variant={
											systemInfo.protocol === 'https:' ? 'default' : 'secondary'
										}
									>
										{systemInfo.protocol}
									</Badge>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>Часовой пояс</span>
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
								Соотношение пикселей
							</p>
							<p className='text-2xl font-bold'>
								{systemInfo.devicePixelRatio}x
							</p>
						</Card>
						<Card className='p-4 text-center hover:shadow-md transition-shadow'>
							<Languages className='w-8 h-8 mx-auto mb-2 text-green-500' />
							<p className='text-sm font-medium text-muted-foreground'>Языки</p>
							<p className='text-2xl font-bold'>
								{systemInfo.languages.length}
							</p>
						</Card>
						<Card className='p-4 text-center hover:shadow-md transition-shadow'>
							<HardDrive className='w-8 h-8 mx-auto mb-2 text-blue-500' />
							<p className='text-sm font-medium text-muted-foreground'>
								Глубина цвета
							</p>
							<p className='text-2xl font-bold'>{systemInfo.colorDepth} bit</p>
						</Card>
						<Card className='p-4 text-center hover:shadow-md transition-shadow'>
							<Fingerprint className='w-8 h-8 mx-auto mb-2 text-purple-500' />
							<p className='text-sm font-medium text-muted-foreground'>
								Точки касания
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
							<CardTitle>Информация о процессоре</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='group relative p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl hover:from-muted/50 hover:to-muted/30 transition-all'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='font-medium'>Архитектура</p>
											<p className='text-sm text-muted-foreground'>
												Тип архитектуры процессора
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
														'Архитектура'
													)
												}
												size='icon'
												variant='ghost'
												className='opacity-0 group-hover:opacity-100 transition-opacity'
											>
												{copiedItem === 'Архитектура' ? (
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
											<p className='font-medium'>Платформа</p>
											<p className='text-sm text-muted-foreground'>
												Операционная система и окружение
											</p>
										</div>
										<div className='flex items-center gap-2'>
											<Badge variant='outline'>{systemInfo.platform}</Badge>
											<Button
												onClick={() =>
													copyToClipboard(systemInfo.platform, 'Платформа')
												}
												size='icon'
												variant='ghost'
												className='opacity-0 group-hover:opacity-100 transition-opacity'
											>
												{copiedItem === 'Платформа' ? (
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
								Что такое архитектура процессора?
							</h4>
							<div className='grid md:grid-cols-2 gap-6'>
								<div className='space-y-3'>
									<div className='flex items-start gap-3'>
										<div className='mt-1 p-1 bg-blue-500/20 rounded'>
											<Check className='w-4 h-4 text-blue-600' />
										</div>
										<div>
											<h5 className='font-medium text-blue-900 dark:text-blue-100'>
												64-битная архитектура
											</h5>
											<ul className='mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-200'>
												<li>• Поддержка более 4 ГБ ОЗУ</li>
												<li>• Повышенная производительность</li>
												<li>• Совместимость с современными приложениями</li>
												<li>• Улучшенная безопасность</li>
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
												32-битная архитектура
											</h5>
											<ul className='mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-200'>
												<li>• Ограничение памяти до 4 ГБ</li>
												<li>• Сниженная производительность</li>
												<li>• Ограниченная совместимость</li>
												<li>• Устаревшая технология</li>
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
										Логическое разрешение
									</CardTitle>
								</CardHeader>
								<CardContent className='pt-6'>
									<div className='text-center'>
										<p className='text-3xl font-bold text-green-600 mb-2'>
											{deviceInfo.logicalResolution}
										</p>
										<p className='text-sm text-muted-foreground'>CSS пиксели</p>
									</div>
								</CardContent>
							</Card>

							<Card className='overflow-hidden'>
								<CardHeader className='bg-gradient-to-r from-blue-500/10 to-blue-600/5'>
									<CardTitle className='text-base'>
										Физическое разрешение
									</CardTitle>
								</CardHeader>
								<CardContent className='pt-6'>
									<div className='text-center'>
										<p className='text-3xl font-bold text-blue-600 mb-2'>
											{deviceInfo.actualResolution}
										</p>
										<p className='text-sm text-muted-foreground'>
											Реальные пиксели
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
									Соотношение пикселей
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
									Глубина цвета
								</p>
								<p className='text-xl font-bold'>{systemInfo.colorDepth} bit</p>
								<Badge variant='outline' className='mt-2 text-xs'>
									{Math.pow(2, systemInfo.colorDepth).toLocaleString()}
								</Badge>
							</Card>

							<Card className='p-4 text-center'>
								<Smartphone className='w-6 h-6 mx-auto mb-2 text-green-500' />
								<p className='text-xs font-medium text-muted-foreground mb-1'>
									Ориентация
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
										Плотность пикселей
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
										Информация об экране
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='flex items-center justify-between'>
										<span className='text-sm font-medium'>Размер экрана</span>
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
							<CardTitle>Информация о браузере</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Browser & OS Info */}
							<div className='grid md:grid-cols-2 gap-4'>
								<div className='p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl'>
									<div className='flex items-center gap-3 mb-3'>
										<Chrome className='w-5 h-5 text-blue-500' />
										<p className='font-medium'>Браузер</p>
									</div>
									<p className='text-xl font-bold'>{deviceInfo.browser}</p>
									{deviceInfo.browserVersion && (
										<p className='text-sm text-muted-foreground mt-1'>
											Версия: {deviceInfo.browserVersion}
										</p>
									)}
								</div>

								<div className='p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl'>
									<div className='flex items-center gap-3 mb-3'>
										<Server className='w-5 h-5 text-green-500' />
										<p className='font-medium'>Операционная система</p>
									</div>
									<p className='text-xl font-bold'>{deviceInfo.os}</p>
									{deviceInfo.osVersion && (
										<p className='text-sm text-muted-foreground mt-1'>
											Версия: {deviceInfo.osVersion}
										</p>
									)}
								</div>
							</div>

							{/* Languages */}
							<div className='p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl'>
								<div className='flex items-center gap-3 mb-3'>
									<Languages className='w-5 h-5 text-purple-500' />
									<p className='font-medium'>Языки</p>
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
							<CardTitle>Возможности браузера</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Storage Support */}
							<div>
								<h4 className='font-medium mb-3 flex items-center gap-2'>
									<Database className='w-4 h-4' />
									Хранилище
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
									Приватность
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
												? 'Включено'
												: systemInfo.doNotTrack === '0'
													? 'Отключено'
													: 'Не установлено'}
										</Badge>
									</div>
									<div className='p-4 bg-muted/30 rounded-lg'>
										<p className='text-sm font-medium mb-1'>WebDriver</p>
										<Badge
											variant={systemInfo.webdriver ? 'destructive' : 'default'}
										>
											{systemInfo.webdriver ? 'Обнаружен' : 'Не обнаружен'}
										</Badge>
									</div>
								</div>
							</div>

							{/* Touch Support */}
							<div>
								<h4 className='font-medium mb-3 flex items-center gap-2'>
									<Fingerprint className='w-4 h-4' />
									Сенсорное управление
								</h4>
								<div className='grid md:grid-cols-2 gap-4'>
									<div className='p-4 bg-muted/30 rounded-lg'>
										<p className='text-sm font-medium mb-1'>
											Поддержка сенсора
										</p>
										<Badge
											variant={
												systemInfo.touchSupport ? 'default' : 'secondary'
											}
										>
											{systemInfo.touchSupport
												? 'Поддерживается'
												: 'Не поддерживается'}
										</Badge>
									</div>
									{systemInfo.touchSupport && (
										<div className='p-4 bg-muted/30 rounded-lg'>
											<p className='text-sm font-medium mb-1'>Мультитач</p>
											<Badge variant='default'>
												{systemInfo.maxTouchPoints} точек
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

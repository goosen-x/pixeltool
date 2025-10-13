'use client'

import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Download,
	Copy,
	Link,
	Wifi,
	Smartphone,
	QrCode,
	Settings
} from 'lucide-react'
import { toast } from 'sonner'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
type QRType = 'url' | 'appstore' | 'wifi'

interface WifiConfig {
	ssid: string
	password: string
	security: 'WPA' | 'WEP' | 'nopass'
	hidden: boolean
}

interface AppStoreConfig {
	platform: 'ios' | 'android' | 'universal'
	appId: string
	androidId?: string
}

export default function QRGeneratorPage() {
	const widget = getWidgetById('qr-generator')!
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [mounted, setMounted] = useState(false)
	const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false)
	const [qrType, setQrType] = useState<QRType>('url')
	const [url, setUrl] = useState('https://example.com')
	const [qrSize, setQrSize] = useState(256)
	const [darkColor, setDarkColor] = useState('#000000')
	const [lightColor, setLightColor] = useState('#FFFFFF')
	const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>(
		'M'
	)

	// WiFi settings
	const [wifiConfig, setWifiConfig] = useState<WifiConfig>({
		ssid: '',
		password: '',
		security: 'WPA',
		hidden: false
	})

	// App Store settings
	const [appStoreConfig, setAppStoreConfig] = useState<AppStoreConfig>({
		platform: 'universal',
		appId: '',
		androidId: ''
	})

	const generateQRData = (): string => {
		switch (qrType) {
			case 'url':
				return url
			case 'wifi':
				const { ssid, password, security, hidden } = wifiConfig
				return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};`
			case 'appstore':
				const { platform, appId, androidId } = appStoreConfig
				if (platform === 'ios') {
					return `https://apps.apple.com/app/id${appId}`
				} else if (platform === 'android') {
					return `https://play.google.com/store/apps/details?id=${androidId || appId}`
				} else {
					// Universal link using our own redirect API
					const baseUrl = window.location.origin
					const appData = []
					if (appId) appData.push(`ios:${appId}`)
					if (androidId) appData.push(`android:${androidId}`)
					return `${baseUrl}/api/app-redirect/${appData.join(',')}`
				}
			default:
				return ''
		}
	}

	const generateQR = async () => {
		if (!mounted) return

		const canvas = canvasRef.current
		if (!canvas) return

		const data = generateQRData()
		if (!data) {
			toast.error('Введите данные для генерации QR-кода')
			return
		}

		try {
			await QRCode.toCanvas(canvas, data, {
				width: qrSize,
				color: {
					dark: darkColor,
					light: lightColor
				},
				errorCorrectionLevel: errorCorrection,
				margin: 2
			})
			setHasGeneratedOnce(true)
			// Don't show success toast on every update
		} catch (err) {
			console.error(err)
			toast.error('Ошибка генерации QR-кода')
		}
	}

	const downloadQR = () => {
		const canvas = canvasRef.current
		if (!canvas) return

		const link = document.createElement('a')
		link.download = `qr-code-${Date.now()}.png`
		link.href = canvas.toDataURL()
		link.click()
		toast.success('QR-код скачан')
	}

	const copyQRAsImage = async () => {
		const canvas = canvasRef.current
		if (!canvas) return

		try {
			const blob = await new Promise<Blob>(resolve => {
				canvas.toBlob(blob => resolve(blob!), 'image/png')
			})

			await navigator.clipboard.write([
				new ClipboardItem({ 'image/png': blob })
			])
			toast.success('QR-код скопирован в буфер обмена')
		} catch (err) {
			toast.error('Ошибка копирования QR-кода')
		}
	}

	// Set mounted state
	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		generateQR()
	}, [
		mounted,
		qrType,
		url,
		qrSize,
		darkColor,
		lightColor,
		errorCorrection,
		wifiConfig,
		appStoreConfig
	])

	// Keyboard shortcuts
	return (
		<WidgetSEOWrapper widget={widget}>
			<div className='grid lg:grid-cols-3 gap-6'>
				{/* Settings */}
				<div className='lg:col-span-2'>
					<WidgetSection
						icon={<Settings className='w-5 h-5' />}
						title='Настройки'
					>
						<Tabs value={qrType} onValueChange={v => setQrType(v as QRType)}>
							<TabsList className='grid w-full grid-cols-3'>
								<TabsTrigger value='url'>
									<Link className='w-4 h-4 mr-2' />
									URL
								</TabsTrigger>
								<TabsTrigger value='appstore'>
									<Smartphone className='w-4 h-4 mr-2' />
									App Store
								</TabsTrigger>
								<TabsTrigger value='wifi'>
									<Wifi className='w-4 h-4 mr-2' />
									Wi-Fi
								</TabsTrigger>
							</TabsList>

							<TabsContent value='url' className='space-y-4'>
								<div>
									<Label htmlFor='url'>URL-адрес</Label>
									<Input
										id='url'
										type='url'
										placeholder='https://example.com'
										value={url}
										onChange={e => setUrl(e.target.value)}
									/>
								</div>
							</TabsContent>

							<TabsContent value='appstore' className='space-y-4'>
								<div>
									<Label>Платформа</Label>
									<Select
										value={appStoreConfig.platform}
										onValueChange={v =>
											setAppStoreConfig({
												...appStoreConfig,
												platform: v as 'ios' | 'android' | 'universal'
											})
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='universal'>
												<div className='flex items-center gap-2'>
													<Smartphone className='w-4 h-4' />
													Универсальная
												</div>
											</SelectItem>
											<SelectItem value='ios'>
												<div className='flex items-center gap-2'>
													<Smartphone className='w-4 h-4' />
													App Store (iOS)
												</div>
											</SelectItem>
											<SelectItem value='android'>
												<div className='flex items-center gap-2'>
													<Smartphone className='w-4 h-4' />
													Google Play
												</div>
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{appStoreConfig.platform === 'universal' ? (
									<>
										<div className='grid grid-cols-2 gap-4'>
											<div>
												<Label htmlFor='iosId'>iOS App ID</Label>
												<Input
													id='iosId'
													placeholder='363590051'
													value={appStoreConfig.appId}
													onChange={e =>
														setAppStoreConfig({
															...appStoreConfig,
															appId: e.target.value
														})
													}
												/>
												<p className='text-xs text-muted-foreground mt-1'>
													Найдите в URL App Store после /id/
												</p>
											</div>
											<div>
												<Label htmlFor='androidId'>Android Package ID</Label>
												<Input
													id='androidId'
													placeholder='com.netflix.mediaclient'
													value={appStoreConfig.androidId || ''}
													onChange={e =>
														setAppStoreConfig({
															...appStoreConfig,
															androidId: e.target.value
														})
													}
												/>
												<p className='text-xs text-muted-foreground mt-1'>
													Например: com.example.app
												</p>
											</div>
										</div>
										<div className='p-3 bg-muted rounded-lg'>
											<p className='text-xs text-muted-foreground'>
												Создаст универсальную ссылку, которая откроет правильное
												приложение
											</p>
										</div>
									</>
								) : (
									<div>
										<Label htmlFor='appId'>App ID</Label>
										<Input
											id='appId'
											placeholder={
												appStoreConfig.platform === 'ios'
													? '363590051'
													: 'com.example.app'
											}
											value={
												appStoreConfig.platform === 'ios'
													? appStoreConfig.appId
													: appStoreConfig.androidId || appStoreConfig.appId
											}
											onChange={e => {
												if (appStoreConfig.platform === 'ios') {
													setAppStoreConfig({
														...appStoreConfig,
														appId: e.target.value
													})
												} else {
													setAppStoreConfig({
														...appStoreConfig,
														androidId: e.target.value
													})
												}
											}}
										/>
										<p className='text-xs text-muted-foreground mt-1'>
											{appStoreConfig.platform === 'ios'
												? 'Найдите в URL App Store после /id/'
												: 'Например: com.example.app'}
										</p>
									</div>
								)}
							</TabsContent>

							<TabsContent value='wifi' className='space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='ssid'>Название сети</Label>
										<Input
											id='ssid'
											placeholder='Название Wi-Fi сети'
											value={wifiConfig.ssid}
											onChange={e =>
												setWifiConfig({ ...wifiConfig, ssid: e.target.value })
											}
										/>
									</div>
									<div>
										<Label htmlFor='password'>Пароль</Label>
										<Input
											id='password'
											type='password'
											placeholder='Пароль от Wi-Fi'
											value={wifiConfig.password}
											onChange={e =>
												setWifiConfig({
													...wifiConfig,
													password: e.target.value
												})
											}
										/>
									</div>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label>Тип безопасности</Label>
										<Select
											value={wifiConfig.security}
											onValueChange={v =>
												setWifiConfig({
													...wifiConfig,
													security: v as 'WPA' | 'WEP' | 'nopass'
												})
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='WPA'>WPA/WPA2</SelectItem>
												<SelectItem value='WEP'>WEP</SelectItem>
												<SelectItem value='nopass'>Без пароля</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label htmlFor='hidden' className='block mb-2'>
											Скрытая сеть
										</Label>
										<div className='flex items-center h-10'>
											<Switch
												id='hidden'
												checked={wifiConfig.hidden}
												onCheckedChange={checked =>
													setWifiConfig({ ...wifiConfig, hidden: checked })
												}
											/>
										</div>
									</div>
								</div>
							</TabsContent>
						</Tabs>

						<div className='mt-6 space-y-4'>
							<h3 className='text-lg font-semibold'>Настройки QR-кода</h3>

							<div className='grid grid-cols-3 gap-4'>
								<div>
									<Label htmlFor='darkColor'>Темный цвет</Label>
									<div className='flex gap-2'>
										<Input
											id='darkColor'
											type='color'
											value={darkColor}
											onChange={e => setDarkColor(e.target.value)}
											className='w-16 h-10 p-1'
										/>
										<Input
											value={darkColor}
											onChange={e => setDarkColor(e.target.value)}
											placeholder='#000000'
										/>
									</div>
								</div>
								<div>
									<Label htmlFor='lightColor'>Светлый цвет</Label>
									<div className='flex gap-2'>
										<Input
											id='lightColor'
											type='color'
											value={lightColor}
											onChange={e => setLightColor(e.target.value)}
											className='w-16 h-10 p-1'
										/>
										<Input
											value={lightColor}
											onChange={e => setLightColor(e.target.value)}
											placeholder='#FFFFFF'
										/>
									</div>
								</div>
								<div>
									<Label>Коррекция ошибок</Label>
									<Select
										value={errorCorrection}
										onValueChange={v =>
											setErrorCorrection(v as 'L' | 'M' | 'Q' | 'H')
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='L'>Низкий (7%)</SelectItem>
											<SelectItem value='M'>Средний (15%)</SelectItem>
											<SelectItem value='Q'>Высокий (25%)</SelectItem>
											<SelectItem value='H'>Очень высокий (30%)</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</WidgetSection>
				</div>

				{/* Preview */}
				<div className='relative'>
					<div className='absolute top-0 right-2 flex gap-2 z-10'>
						<Button variant='outline' size='icon' onClick={downloadQR}>
							<Download className='w-4 h-4' />
						</Button>
						<Button variant='outline' size='icon' onClick={copyQRAsImage}>
							<Copy className='w-4 h-4' />
						</Button>
					</div>
					<div className='flex items-center justify-center p-6 pt-16 bg-white dark:bg-white rounded-lg'>
						{!hasGeneratedOnce && (
							<div
								className='absolute grid grid-cols-8 gap-[2px] p-2 bg-white rounded'
								style={{
									width: `${qrSize}px`,
									height: `${qrSize}px`
								}}
							>
								{[...Array(64)].map((_, index) => {
									// Deterministic pattern based on index
									const row = Math.floor(index / 8)
									const col = index % 8
									const isCornerPattern =
										// Top-left corner
										(row < 3 && col < 3) ||
										// Top-right corner
										(row < 3 && col >= 5) ||
										// Bottom-left corner
										(row >= 5 && col < 3)

									// Create a checkered pattern for the middle
									const isCheckerPattern = (row + col) % 2 === 0

									const shouldBeDark =
										isCornerPattern ||
										(row >= 3 &&
											row < 5 &&
											col >= 3 &&
											col < 5 &&
											isCheckerPattern)

									return (
										<Skeleton
											key={index}
											className={`rounded-sm ${
												shouldBeDark ? 'opacity-100' : 'opacity-30'
											}`}
										/>
									)
								})}
							</div>
						)}
						<canvas
							ref={canvasRef}
							width={qrSize}
							height={qrSize}
							className='block'
							style={{
								imageRendering: 'pixelated',
								width: `${qrSize}px`,
								height: `${qrSize}px`,
								visibility: hasGeneratedOnce ? 'visible' : 'hidden'
							}}
						/>
					</div>
				</div>
			</div>
		</WidgetSEOWrapper>
	)
}

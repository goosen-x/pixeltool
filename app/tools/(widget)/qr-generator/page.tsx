'use client'

import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Download, Copy, Smartphone } from 'lucide-react'
import { toast } from 'sonner'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { QrGeneratorSeo } from './QrGeneratorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
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
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: что кодируем — слева, что делаем с готовым
				    кодом — справа. Вкладки во всю ширину убраны: три варианта
				    помещаются «таблетками» и не занимают отдельную строку. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{(
							[
								{ key: 'url', label: 'Ссылка' },
								{ key: 'appstore', label: 'Приложение' },
								{ key: 'wifi', label: 'Wi-Fi' }
							] as { key: QRType; label: string }[]
						).map(item => (
							<button
								key={item.key}
								type='button'
								onClick={() => setQrType(item.key)}
								aria-pressed={qrType === item.key}
								className={toolPill(qrType === item.key)}
							>
								{item.label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyQRAsImage}
							title='Скопировать картинку'
							className={toolIconButton}
						>
							<Copy className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={downloadQR}
							title='Скачать PNG'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='grid md:grid-cols-2'>
					{/* Поля слева, готовый код справа — как две панели base64:
					    одна карточка, разделённая линией, а не два острова. */}
					<div className='space-y-4 px-5 py-6 sm:px-6 md:border-r'>
						{qrType === 'url' && (
							<div>
								<Label htmlFor='url'>Ссылка</Label>
								<Input
									id='url'
									type='url'
									placeholder='https://example.com'
									value={url}
									onChange={e => setUrl(e.target.value)}
								/>
							</div>
						)}

						{qrType === 'appstore' && (
							<div className='space-y-4'>
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
										<div className='grid md:grid-cols-2 gap-4'>
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
							</div>
						)}

						{qrType === 'wifi' && (
							<div className='space-y-4'>
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
										<Label htmlFor='hidden' className='mb-2 block'>
											Скрытая сеть
										</Label>
										<div className='flex h-10 items-center'>
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
							</div>
						)}
					</div>

					{/* Готовый код. Белая подложка обязательна и в тёмной теме:
					    сканеры ждут тёмный рисунок на светлом фоне. */}
					<div className='relative flex items-center justify-center bg-white p-6 dark:bg-white'>
						{!hasGeneratedOnce && (
							<div
								className='absolute grid grid-cols-8 gap-[2px] rounded bg-white p-2'
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

				{/* Полоса оформления. Раньше это был блок с заголовком «Настройки
				    QR-кода» и тремя выпадающими списками — половина экрана на то,
				    что трогают редко. */}
				<div className={toolFooterBar}>
					<div className='flex items-center gap-2'>
						<Label
							htmlFor='darkColor'
							className='text-sm text-muted-foreground'
						>
							Цвет кода
						</Label>
						<Input
							id='darkColor'
							type='color'
							value={darkColor}
							onChange={e => setDarkColor(e.target.value)}
							className='h-8 w-10 cursor-pointer p-1'
						/>
						<Input
							value={darkColor}
							onChange={e => setDarkColor(e.target.value)}
							placeholder='#000000'
							className='h-8 w-24 font-mono text-xs'
						/>
					</div>

					<div className='flex items-center gap-2'>
						<Label
							htmlFor='lightColor'
							className='text-sm text-muted-foreground'
						>
							Фон
						</Label>
						<Input
							id='lightColor'
							type='color'
							value={lightColor}
							onChange={e => setLightColor(e.target.value)}
							className='h-8 w-10 cursor-pointer p-1'
						/>
						<Input
							value={lightColor}
							onChange={e => setLightColor(e.target.value)}
							placeholder='#FFFFFF'
							className='h-8 w-24 font-mono text-xs'
						/>
					</div>

					<div className='flex flex-wrap items-center gap-1.5 sm:ml-auto'>
						<span className='mr-1 text-sm text-muted-foreground'>
							Запас на повреждения
						</span>
						{(
							[
								{ value: 'L', label: '7%' },
								{ value: 'M', label: '15%' },
								{ value: 'Q', label: '25%' },
								{ value: 'H', label: '30%' }
							] as { value: 'L' | 'M' | 'Q' | 'H'; label: string }[]
						).map(item => (
							<button
								key={item.value}
								type='button'
								onClick={() => setErrorCorrection(item.value)}
								aria-pressed={errorCorrection === item.value}
								title={`Уровень ${item.value}: код читается, даже если повреждено до ${item.label} площади`}
								className={toolPill(errorCorrection === item.value)}
							>
								{item.label}
							</button>
						))}
					</div>
				</div>
			</Card>
			<ToolScreenshot slug='qr-generator' />
			<QrGeneratorSeo />
		</WidgetSEOWrapper>
	)
}

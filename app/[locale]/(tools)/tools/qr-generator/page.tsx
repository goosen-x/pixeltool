'use client'

import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import {
	WidgetPrimaryButton,
	WidgetSecondaryButton,
	WidgetIconButton,
	WidgetButtonGroup
} from '@/components/tools/WidgetButtons'
import {
	WidgetInput,
	WidgetTextarea,
	WidgetCodeInput
} from '@/components/tools/WidgetInputs'
import { KeyboardShortcuts } from '@/components/tools/KeyboardShortcuts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Download, Copy, Link, Wifi, Smartphone, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

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
	const t = useTranslations('widgets.qrGenerator')
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [qrType, setQrType] = useState<QRType>('url')
	const [url, setUrl] = useState('')
	const [qrSize, setQrSize] = useState(256)
	const [darkColor, setDarkColor] = useState('#000000')
	const [lightColor, setLightColor] = useState('#FFFFFF')
	const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M')
	
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
		const canvas = canvasRef.current
		if (!canvas) return

		const data = generateQRData()
		if (!data) {
			toast.error(t('toast.emptyData'))
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
			toast.success(t('toast.generated'))
		} catch (err) {
			console.error(err)
			toast.error(t('toast.generateError'))
		}
	}

	const downloadQR = () => {
		const canvas = canvasRef.current
		if (!canvas) return

		const link = document.createElement('a')
		link.download = `qr-code-${Date.now()}.png`
		link.href = canvas.toDataURL()
		link.click()
		toast.success(t('toast.downloaded'))
	}

	const copyQRAsImage = async () => {
		const canvas = canvasRef.current
		if (!canvas) return

		try {
			const blob = await new Promise<Blob>((resolve) => {
				canvas.toBlob((blob) => resolve(blob!), 'image/png')
			})
			
			await navigator.clipboard.write([
				new ClipboardItem({ 'image/png': blob })
			])
			toast.success(t('toast.copied'))
		} catch (err) {
			toast.error(t('toast.copyError'))
		}
	}

	useEffect(() => {
		generateQR()
	}, [qrType, url, qrSize, darkColor, lightColor, errorCorrection, wifiConfig, appStoreConfig])

	// Keyboard shortcuts
	const shortcuts = [
		{
			key: 'd',
			meta: true,
			action: downloadQR,
			description: t('download')
		},
		{
			key: 'c',
			meta: true,
			action: copyQRAsImage,
			description: t('copy')
		}
	]

	return (
		<WidgetLayout>
			<KeyboardShortcuts shortcuts={shortcuts} />
			{/* Hero Section */}
			<WidgetHero 
				title={t('title')}
				description={t('description')}
			/>

			<WidgetGrid>
				{/* Settings */}
				<WidgetCard fullWidth className="lg:col-span-2">
					<WidgetSection>
						<Tabs value={qrType} onValueChange={(v) => setQrType(v as QRType)}>
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="url">
									<Link className="w-4 h-4 mr-2" />
									{t('types.url')}
								</TabsTrigger>
								<TabsTrigger value="appstore">
									<Smartphone className="w-4 h-4 mr-2" />
									{t('types.appStore')}
								</TabsTrigger>
								<TabsTrigger value="wifi">
									<Wifi className="w-4 h-4 mr-2" />
									{t('types.wifi')}
								</TabsTrigger>
							</TabsList>

							<TabsContent value="url" className="space-y-4">
								<div>
									<Label htmlFor="url">{t('url.label')}</Label>
									<WidgetWidgetInput
										id="url"
										type="url"
										placeholder={t('url.placeholder')}
										value={url}
										onChange={(e) => setUrl(e.target.value)}
									/>
								</div>
							</TabsContent>

							<TabsContent value="appstore" className="space-y-4">
								<div>
									<Label>{t('appStore.platform')}</Label>
									<Select
										value={appStoreConfig.platform}
										onValueChange={(v) => setAppStoreConfig({ ...appStoreConfig, platform: v as 'ios' | 'android' | 'universal' })}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="universal">
												<div className="flex items-center gap-2">
													<Smartphone className="w-4 h-4" />
													{t('appStore.universal')}
												</div>
											</SelectItem>
											<SelectItem value="ios">
												<div className="flex items-center gap-2">
													<Smartphone className="w-4 h-4" />
													App Store (iOS)
												</div>
											</SelectItem>
											<SelectItem value="android">
												<div className="flex items-center gap-2">
													<Smartphone className="w-4 h-4" />
													Google Play
												</div>
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								
								{appStoreConfig.platform === 'universal' ? (
									<>
										<div>
											<Label htmlFor="iosId">{t('appStore.iosAppId')}</Label>
											<WidgetInput
												id="iosId"
												placeholder="363590051"
												value={appStoreConfig.appId}
												onChange={(e) => setAppStoreConfig({ ...appStoreConfig, appId: e.target.value })}
											/>
											<p className="text-xs text-muted-foreground mt-1">
												{t('appStore.iosHint')}
											</p>
										</div>
										<div>
											<Label htmlFor="androidId">{t('appStore.androidAppId')}</Label>
											<WidgetInput
												id="androidId"
												placeholder="com.netflix.mediaclient"
												value={appStoreConfig.androidId || ''}
												onChange={(e) => setAppStoreConfig({ ...appStoreConfig, androidId: e.target.value })}
											/>
											<p className="text-xs text-muted-foreground mt-1">
												{t('appStore.androidHint')}
											</p>
										</div>
										<div className="p-3 bg-muted rounded-lg">
											<p className="text-xs text-muted-foreground">
												{t('appStore.universalHint')}
											</p>
										</div>
									</>
								) : (
									<div>
										<Label htmlFor="appId">{t('appStore.appId')}</Label>
										<WidgetInput
											id="appId"
											placeholder={appStoreConfig.platform === 'ios' ? '363590051' : 'com.example.app'}
											value={appStoreConfig.platform === 'ios' ? appStoreConfig.appId : (appStoreConfig.androidId || appStoreConfig.appId)}
											onChange={(e) => {
												if (appStoreConfig.platform === 'ios') {
													setAppStoreConfig({ ...appStoreConfig, appId: e.target.value })
												} else {
													setAppStoreConfig({ ...appStoreConfig, androidId: e.target.value })
												}
											}}
										/>
										<p className="text-xs text-muted-foreground mt-1">
											{appStoreConfig.platform === 'ios' 
												? t('appStore.iosHint') 
												: t('appStore.androidHint')
											}
										</p>
									</div>
								)}
							</TabsContent>

							<TabsContent value="wifi" className="space-y-4">
								<div>
									<Label htmlFor="ssid">{t('wifi.networkName')}</Label>
									<WidgetInput
										id="ssid"
										placeholder={t('wifi.networkNamePlaceholder')}
										value={wifiConfig.ssid}
										onChange={(e) => setWifiConfig({ ...wifiConfig, ssid: e.target.value })}
									/>
								</div>
								<div>
									<Label htmlFor="password">{t('wifi.password')}</Label>
									<WidgetInput
										id="password"
										type="password"
										placeholder={t('wifi.passwordPlaceholder')}
										value={wifiConfig.password}
										onChange={(e) => setWifiConfig({ ...wifiConfig, password: e.target.value })}
									/>
								</div>
								<div>
									<Label>{t('wifi.security')}</Label>
									<Select
										value={wifiConfig.security}
										onValueChange={(v) => setWifiConfig({ ...wifiConfig, security: v as 'WPA' | 'WEP' | 'nopass' })}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="WPA">WPA/WPA2</SelectItem>
											<SelectItem value="WEP">WEP</SelectItem>
											<SelectItem value="nopass">{t('wifi.noPassword')}</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex items-center justify-between">
									<Label htmlFor="hidden">{t('wifi.hidden')}</Label>
									<Switch
										id="hidden"
										checked={wifiConfig.hidden}
										onCheckedChange={(checked) => setWifiConfig({ ...wifiConfig, hidden: checked })}
									/>
								</div>
							</TabsContent>
						</Tabs>

						<div className="mt-6 space-y-4">
							<h3 className="text-lg font-semibold">{t('qrSettings')}</h3>
							
							<div>
								<Label>{t('size')}: {qrSize}px</Label>
								<Slider
									value={[qrSize]}
									onValueChange={([value]) => setQrSize(value)}
									min={128}
									max={512}
									step={32}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="darkColor">{t('darkColor')}</Label>
									<div className="flex gap-2">
										<WidgetInput
											id="darkColor"
											type="color"
											value={darkColor}
											onChange={(e) => setDarkColor(e.target.value)}
											className="w-16 h-10 p-1"
										/>
										<WidgetInput
											value={darkColor}
											onChange={(e) => setDarkColor(e.target.value)}
											placeholder="#000000"
										/>
									</div>
								</div>
								<div>
									<Label htmlFor="lightColor">{t('lightColor')}</Label>
									<div className="flex gap-2">
										<WidgetInput
											id="lightColor"
											type="color"
											value={lightColor}
											onChange={(e) => setLightColor(e.target.value)}
											className="w-16 h-10 p-1"
										/>
										<WidgetInput
											value={lightColor}
											onChange={(e) => setLightColor(e.target.value)}
											placeholder="#FFFFFF"
										/>
									</div>
								</div>
							</div>

							<div>
								<Label>{t('errorCorrection')}</Label>
								<Select
									value={errorCorrection}
									onValueChange={(v) => setErrorCorrection(v as 'L' | 'M' | 'Q' | 'H')}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="L">{t('errorLevels.L')}</SelectItem>
										<SelectItem value="M">{t('errorLevels.M')}</SelectItem>
										<SelectItem value="Q">{t('errorLevels.Q')}</SelectItem>
										<SelectItem value="H">{t('errorLevels.H')}</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</WidgetSection>
				</WidgetCard>

				{/* Preview */}
				<WidgetCard>
					<WidgetSection className="flex flex-col items-center space-y-6">
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<QrCode className="w-5 h-5" />
							{t('preview')}
						</h3>
						<div className="p-6 bg-white rounded-2xl shadow-lg">
							<canvas ref={canvasRef} />
						</div>
						<WidgetButtonGroup>
							<WidgetSecondaryButton
								onClick={downloadQR}
								icon={<Download className="w-5 h-5" />}
							>
								{t('download')}
							</WidgetSecondaryButton>
							<WidgetPrimaryButton
								onClick={copyQRAsImage}
								icon={<Copy className="w-5 h-5" />}
							>
								{t('copy')}
							</WidgetPrimaryButton>
						</WidgetButtonGroup>
					</WidgetSection>
				</WidgetCard>
			</WidgetGrid>
		</WidgetLayout>
	)
}
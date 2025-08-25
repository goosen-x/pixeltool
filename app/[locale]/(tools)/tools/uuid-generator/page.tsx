'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Copy,
	RefreshCw,
	Download,
	Check,
	Trash2,
	Plus,
	Info,
	Shield,
	Clock,
	Hash,
	Shuffle,
	AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

type UUIDVersion = 'v4' | 'v1' | 'v7' | 'nil'
type UUIDFormat = 'standard' | 'uppercase' | 'no-hyphens' | 'braces'

interface GeneratedUUID {
	id: string
	value: string
	version: UUIDVersion
	timestamp: number
}

export default function UUIDGeneratorPage() {
	const t = useTranslations('widgets.uuidGenerator')
	const [version, setVersion] = useState<UUIDVersion>('v4')
	const [format, setFormat] = useState<UUIDFormat>('standard')
	const [quantity, setQuantity] = useState('1')
	const [uuids, setUuids] = useState<GeneratedUUID[]>([])
	const [validationInput, setValidationInput] = useState('')
	const [validationResult, setValidationResult] = useState<{
		valid: boolean
		version?: string
		variant?: string
		info?: string
	} | null>(null)
	const [copiedId, setCopiedId] = useState<string | null>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	// Generate UUID v4
	const generateV4 = (): string => {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
			/[xy]/g,
			function (c) {
				const r = (Math.random() * 16) | 0
				const v = c === 'x' ? r : (r & 0x3) | 0x8
				return v.toString(16)
			}
		)
	}

	// Generate UUID v1 (time-based)
	const generateV1 = (): string => {
		const timestamp = Date.now()
		const timestampHex = timestamp.toString(16).padStart(12, '0')
		const clockSeq = Math.floor(Math.random() * 0x3fff) | 0x8000
		const node = Array.from({ length: 6 }, () =>
			Math.floor(Math.random() * 256)
				.toString(16)
				.padStart(2, '0')
		).join('')

		return [
			timestampHex.slice(-8),
			timestampHex.slice(-12, -8),
			'1' + timestampHex.slice(0, 3),
			clockSeq.toString(16),
			node
		].join('-')
	}

	// Generate UUID v7 (Unix timestamp + random)
	const generateV7 = (): string => {
		const timestamp = Date.now()
		const timestampHex = timestamp.toString(16).padStart(12, '0')
		const random = Array.from({ length: 10 }, () =>
			Math.floor(Math.random() * 256)
				.toString(16)
				.padStart(2, '0')
		).join('')

		return [
			timestampHex.slice(0, 8),
			timestampHex.slice(8, 12),
			'7' + random.slice(0, 3),
			((parseInt(random.slice(3, 5), 16) & 0x3f) | 0x80)
				.toString(16)
				.padStart(2, '0') + random.slice(5, 7),
			random.slice(7, 19)
		].join('-')
	}

	// Format UUID
	const formatUUID = (uuid: string, format: UUIDFormat): string => {
		switch (format) {
			case 'uppercase':
				return uuid.toUpperCase()
			case 'no-hyphens':
				return uuid.replace(/-/g, '')
			case 'braces':
				return `{${uuid}}`
			default:
				return uuid
		}
	}

	// Generate UUIDs
	const generateUUIDs = () => {
		const count = Math.min(Math.max(1, parseInt(quantity) || 1), 1000)
		const newUUIDs: GeneratedUUID[] = []

		for (let i = 0; i < count; i++) {
			let uuid = ''

			switch (version) {
				case 'v4':
					uuid = generateV4()
					break
				case 'v1':
					uuid = generateV1()
					break
				case 'v7':
					uuid = generateV7()
					break
				case 'nil':
					uuid = '00000000-0000-0000-0000-000000000000'
					break
			}

			newUUIDs.push({
				id: crypto.randomUUID(),
				value: formatUUID(uuid, format),
				version,
				timestamp: Date.now()
			})
		}

		setUuids(newUUIDs)

		// Auto-copy single UUID
		if (count === 1) {
			copyToClipboard(newUUIDs[0].value, newUUIDs[0].id)
		} else {
			toast.success(t('toast.generated', { count }))
		}

		// Auto-select text for easy copying
		if (textareaRef.current) {
			setTimeout(() => {
				textareaRef.current?.select()
			}, 50)
		}
	}

	// Copy to clipboard
	const copyToClipboard = async (text: string, id?: string) => {
		try {
			await navigator.clipboard.writeText(text)
			if (id) {
				setCopiedId(id)
				setTimeout(() => setCopiedId(null), 2000)
			}
			toast.success(t('toast.copied'))
		} catch (err) {
			toast.error(t('toast.copyError'))
		}
	}

	// Copy all UUIDs
	const copyAll = () => {
		const allUuids = uuids.map(u => u.value).join('\n')
		copyToClipboard(allUuids)
	}

	// Download UUIDs
	const downloadUUIDs = () => {
		const content = uuids.map(u => u.value).join('\n')
		const blob = new Blob([content], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `uuids-${version}-${Date.now()}.txt`
		a.click()
		URL.revokeObjectURL(url)
		toast.success(t('toast.downloaded'))
	}

	// Validate UUID
	const validateUUID = (uuid: string) => {
		const cleaned = uuid
			.trim()
			.toLowerCase()
			.replace(/[\{\}]/g, '')
		const uuidRegex =
			/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i

		if (!uuidRegex.test(cleaned)) {
			setValidationResult({
				valid: false,
				info: t('validator.invalid')
			})
			return
		}

		// Add hyphens if missing
		const formatted =
			cleaned.length === 32
				? cleaned.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
				: cleaned

		const parts = formatted.split('-')
		const versionDigit = parseInt(parts[2].charAt(0), 16)
		const variantBits = parseInt(parts[3].charAt(0), 16)

		let variant = ''
		if (variantBits >= 8 && variantBits <= 11) variant = 'RFC 4122'
		else if (variantBits >= 0 && variantBits <= 7) variant = 'NCS'
		else if (variantBits >= 12 && variantBits <= 13) variant = 'Microsoft'
		else variant = 'Future'

		setValidationResult({
			valid: true,
			version:
				versionDigit >= 1 && versionDigit <= 7
					? `v${versionDigit}`
					: t('validator.unknown'),
			variant,
			info: t('validator.valid')
		})
	}

	// Generate on mount
	useEffect(() => {
		generateUUIDs()
	}, [])

	// Regenerate on settings change
	useEffect(() => {
		if (uuids.length > 0) {
			generateUUIDs()
		}
	}, [version, format])

	const versionOptions = [
		{
			value: 'v4' as UUIDVersion,
			label: 'Version 4',
			description: t('versions.v4'),
			icon: <Shuffle className='w-4 h-4' />
		},
		{
			value: 'v7' as UUIDVersion,
			label: 'Version 7',
			description: t('versions.v7'),
			icon: <Clock className='w-4 h-4' />
		},
		{
			value: 'v1' as UUIDVersion,
			label: 'Version 1',
			description: t('versions.v1'),
			icon: <Clock className='w-4 h-4' />
		},
		{
			value: 'nil' as UUIDVersion,
			label: 'NIL UUID',
			description: t('versions.nil'),
			icon: <Hash className='w-4 h-4' />
		}
	]

	const formatOptions = [
		{
			value: 'standard',
			label: t('formats.standard'),
			example: '550e8400-e29b-41d4-a716-446655440000'
		},
		{
			value: 'uppercase',
			label: t('formats.uppercase'),
			example: '550E8400-E29B-41D4-A716-446655440000'
		},
		{
			value: 'no-hyphens',
			label: t('formats.noHyphens'),
			example: '550e8400e29b41d4a716446655440000'
		},
		{
			value: 'braces',
			label: t('formats.braces'),
			example: '{550e8400-e29b-41d4-a716-446655440000}'
		}
	]

	return (
		<div className='space-y-6'>
			{/* Main Generator Card */}
			<Card>
				<CardHeader>
					<CardTitle>{t('title')}</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6'>
					{/* Quick Settings */}
					<div className='flex flex-wrap gap-4'>
						<div className='flex-1 min-w-[200px]'>
							<Label className='text-xs text-muted-foreground mb-2 block'>
								{t('version')}
							</Label>
							<div className='grid grid-cols-2 gap-2'>
								{versionOptions.map(opt => (
									<button
										key={opt.value}
										onClick={() => setVersion(opt.value)}
										className={cn(
											'flex items-center gap-2 p-3 rounded-lg border text-left transition-all',
											version === opt.value
												? 'border-primary bg-primary/5 text-primary'
												: 'border-border hover:border-primary/50'
										)}
									>
										{opt.icon}
										<div className='flex-1'>
											<div className='font-medium text-sm'>{opt.label}</div>
											<div className='text-xs text-muted-foreground'>
												{opt.description}
											</div>
										</div>
									</button>
								))}
							</div>
						</div>

						<div className='space-y-4'>
							<div>
								<Label className='text-xs text-muted-foreground mb-2 block'>
									{t('format')}
								</Label>
								<Select
									value={format}
									onValueChange={(v: UUIDFormat) => setFormat(v)}
								>
									<SelectTrigger className='w-[200px]'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{formatOptions.map(fmt => (
											<SelectItem key={fmt.value} value={fmt.value}>
												<div>
													<div className='font-medium'>{fmt.label}</div>
													<div className='text-xs text-muted-foreground font-mono'>
														{fmt.example.slice(0, 20)}...
													</div>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label className='text-xs text-muted-foreground mb-2 block'>
									{t('quantity')}
								</Label>
								<div className='flex gap-2'>
									<Input
										type='number'
										value={quantity}
										onChange={e => setQuantity(e.target.value)}
										min='1'
										max='1000'
										className='w-[100px]'
									/>
									<Button onClick={generateUUIDs} className='gap-2'>
										<RefreshCw className='w-4 h-4' />
										{t('generate')}
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Generated UUIDs */}
					<div className='space-y-3'>
						<div className='flex items-center justify-between'>
							<Label className='text-sm'>{t('result')}</Label>
							{uuids.length > 0 && (
								<div className='flex gap-2'>
									{uuids.length > 1 && (
										<>
											<Button
												size='sm'
												variant='outline'
												onClick={copyAll}
												className='gap-2'
											>
												<Copy className='w-4 h-4' />
												{t('copyAll')}
											</Button>
											<Button
												size='sm'
												variant='outline'
												onClick={downloadUUIDs}
												className='gap-2'
											>
												<Download className='w-4 h-4' />
												{t('download')}
											</Button>
										</>
									)}
									<Button
										size='sm'
										variant='outline'
										onClick={() => setUuids([])}
										className='gap-2'
									>
										<Trash2 className='w-4 h-4' />
										{t('clear')}
									</Button>
								</div>
							)}
						</div>

						{uuids.length === 1 ? (
							<div className='relative group'>
								<Input
									value={uuids[0].value}
									readOnly
									className='font-mono text-lg h-14 pr-12'
									onClick={e => (e.target as HTMLInputElement).select()}
								/>
								<Button
									size='icon'
									variant='ghost'
									onClick={() => copyToClipboard(uuids[0].value, uuids[0].id)}
									className='absolute right-2 top-1/2 -translate-y-1/2'
								>
									{copiedId === uuids[0].id ? (
										<Check className='w-4 h-4 text-green-500' />
									) : (
										<Copy className='w-4 h-4' />
									)}
								</Button>
							</div>
						) : uuids.length > 1 ? (
							<textarea
								ref={textareaRef}
								value={uuids.map(u => u.value).join('\n')}
								readOnly
								className='w-full h-48 p-4 font-mono text-sm border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary'
								onClick={e => (e.target as HTMLTextAreaElement).select()}
							/>
						) : (
							<div className='h-14 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground text-sm'>
								{t('placeholder')}
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Validator and Info */}
			<div className='grid gap-6 lg:grid-cols-2'>
				{/* Validator */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Shield className='w-5 h-5' />
							{t('validator.title')}
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='space-y-2'>
							<Label>{t('validator.input')}</Label>
							<Input
								value={validationInput}
								onChange={e => setValidationInput(e.target.value)}
								placeholder={t('validator.placeholder')}
								className='font-mono'
								onKeyDown={e =>
									e.key === 'Enter' && validateUUID(validationInput)
								}
							/>
						</div>

						<Button
							onClick={() => validateUUID(validationInput)}
							disabled={!validationInput}
							className='w-full'
						>
							{t('validator.validate')}
						</Button>

						{validationResult && (
							<div
								className={cn(
									'p-4 rounded-lg border',
									validationResult.valid
										? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
										: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
								)}
							>
								<div className='flex items-center gap-2 mb-2'>
									{validationResult.valid ? (
										<Check className='w-5 h-5 text-green-600 dark:text-green-400' />
									) : (
										<AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400' />
									)}
									<span className='font-medium'>{validationResult.info}</span>
								</div>
								{validationResult.valid && (
									<div className='space-y-1 text-sm'>
										{validationResult.version && (
											<div>
												{t('validator.version')}: {validationResult.version}
											</div>
										)}
										{validationResult.variant && (
											<div>
												{t('validator.variant')}: {validationResult.variant}
											</div>
										)}
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Info */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Info className='w-5 h-5' />
							{t('info.title')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4 text-sm'>
							<div>
								<h4 className='font-medium mb-1'>{t('info.whatIs')}</h4>
								<p className='text-muted-foreground'>{t('info.description')}</p>
							</div>
							<div>
								<h4 className='font-medium mb-1'>{t('info.structure')}</h4>
								<code className='text-xs bg-muted px-2 py-1 rounded'>
									xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
								</code>
								<p className='text-muted-foreground text-xs mt-1'>
									M = {t('info.versionDigit')}, N = {t('info.variantDigit')}
								</p>
							</div>
							<div className='space-y-2'>
								<h4 className='font-medium'>{t('info.commonUse')}</h4>
								<ul className='text-muted-foreground space-y-1'>
									<li>• {t('info.use1')}</li>
									<li>• {t('info.use2')}</li>
									<li>• {t('info.use3')}</li>
									<li>• {t('info.use4')}</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

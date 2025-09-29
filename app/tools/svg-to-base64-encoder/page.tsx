'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Copy, Check, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SVGEncoderPage() {

	const [svgInput, setSvgInput] = useState('')
	const [encodedResult, setEncodedResult] = useState('')
	const [cssResult, setCssResult] = useState('')
	const [tailwindResult, setTailwindResult] = useState('')
	const [quotes, setQuotes] = useState<'single' | 'double'>('double')
	const [backgroundColor, setBackgroundColor] = useState('white')
	const [copiedField, setCopiedField] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [activeTab, setActiveTab] = useState('encoded')

	const exampleSvg = `<svg>
  <circle r="50" cx="50" cy="50" fill="tomato"/>
  <circle r="41" cx="47" cy="50" fill="orange"/>
  <circle r="33" cx="48" cy="53" fill="gold"/>
  <circle r="25" cx="49" cy="51" fill="yellowgreen"/>
  <circle r="17" cx="52" cy="50" fill="lightseagreen"/>
  <circle r="9" cx="55" cy="48" fill="teal"/>
</svg>`

	const symbols = /[\r\n%#()<>?[\\\]^`{|}]/g

	const getQuotesConfig = () => {
		const double = '"'
		const single = "'"
		return {
			level1: quotes === 'double' ? double : single,
			level2: quotes === 'double' ? single : double
		}
	}

	const addNameSpace = (data: string) => {
		const quotesConfig = getQuotesConfig()
		if (data.indexOf('http://www.w3.org/2000/svg') < 0) {
			data = data.replace(
				/<svg/g,
				`<svg xmlns=${quotesConfig.level2}http://www.w3.org/2000/svg${quotesConfig.level2}`
			)
		}
		return data
	}

	const encodeSVG = (data: string, forceQuotes?: 'single' | 'double') => {
		const quotesToUse = forceQuotes || quotes

		// Use single quotes instead of double to avoid encoding
		if (quotesToUse === 'double') {
			data = data.replace(/"/g, "'")
		} else {
			data = data.replace(/'/g, '"')
		}

		data = data.replace(/>\s{1,}</g, '><')
		data = data.replace(/\s{2,}/g, ' ')

		return data.replace(symbols, encodeURIComponent)
	}

	const getResults = () => {
		if (!svgInput) {
			setEncodedResult('')
			setCssResult('')
			setTailwindResult('')
			return
		}

		const namespaced = addNameSpace(svgInput)
		const encoded = encodeSVG(namespaced)
		const quotesConfig = getQuotesConfig()

		setEncodedResult(encoded)
		const css = `background-image: url(${quotesConfig.level1}data:image/svg+xml,${encoded}${quotesConfig.level1});`
		setCssResult(css)

		// Generate Tailwind result - inline style
		// For Tailwind, we need to ensure double quotes in SVG to avoid conflicts with single quotes in arbitrary value
		const namespacedForTailwind = addNameSpace(svgInput).replace(/'/g, '"')
		const encodedForTailwind = encodeSVG(namespacedForTailwind, 'double')
		const tailwind = `bg-[url('data:image/svg+xml,${encodedForTailwind}')]`
		setTailwindResult(tailwind)
	}

	const handleEncodedChange = (value: string) => {
		const cleaned = value
			.trim()
			.replace(/background-image:\s{0,}url\(/, '')
			.replace(/["']{0,}data:image\/svg\+xml,/, '')
			.replace(/["']\);{0,}$/, '')

		try {
			setSvgInput(decodeURIComponent(cleaned))
		} catch (e) {
			// Invalid encoded value
		}
	}

	const copyToClipboard = async (text: string, field: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedField(field)
			setTimeout(() => setCopiedField(null), 2000)
			const toastKey =
				field === 'encoded'
					? 'toast.encodedCopied'
					: field === 'css'
						? 'toast.cssCopied'
						: 'toast.tailwindCopied'
			toast.success(
				field === 'encoded'
					? 'Код скопирован'
					: field === 'css'
						? 'CSS скопирован'
						: 'Tailwind скопирован'
			)
		} catch (err) {
			toast.error('Ошибка копирования')
		}
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = () => {
		setIsDragging(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)

		const file = e.dataTransfer.files[0]
		if (file && file.type === 'image/svg+xml') {
			const reader = new FileReader()
			reader.onload = e => {
				setSvgInput(e.target?.result as string)
				toast.success('Файл загружен')
			}
			reader.readAsText(file)
		} else if (file) {
			toast.error('Неверный формат файла')
		}
	}

	useEffect(() => {
		getResults()
	}, [svgInput, quotes])

	return (
		<div className='space-y-6'>
			{/* Input and Preview Section */}
			<div className='grid gap-6 lg:grid-cols-2'>
				{/* Input */}
				<div
					className={cn('relative', isDragging && 'opacity-75')}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<Card className='h-full'>
						<CardHeader>
							<div className='flex items-center justify-between'>
								<CardTitle>Вставить SVG</CardTitle>
								<div className='flex gap-2'>
									{svgInput && (
										<Button
											size='sm'
											variant='ghost'
											onClick={() => setSvgInput('')}
										>
											Очистить
										</Button>
									)}
									<Button
										size='sm'
										variant='outline'
										onClick={() => setSvgInput(exampleSvg)}
									>
										Пример
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<textarea
								value={svgInput}
								onChange={e => setSvgInput(e.target.value)}
								aria-label='Вставьте ваш SVG код здесь'
								className='w-full h-64 p-4 font-mono text-sm border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all'
								placeholder='Вставьте ваш SVG код здесь'
								spellCheck={false}
							/>
							<div className='mt-3 flex items-center justify-between text-xs text-muted-foreground'>
								<p>Перетащите SVG файл сюда или вставьте код</p>
								{svgInput && <span>{svgInput.length} символов</span>}
							</div>
						</CardContent>
						{isDragging && (
							<div className='absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg'>
								<div className='text-center'>
									<Upload className='w-12 h-12 mx-auto mb-3 text-primary animate-pulse' />
									<p className='text-sm font-medium'>Отпустите файл здесь</p>
								</div>
							</div>
						)}
					</Card>
				</div>

				{/* Preview */}
				<Card>
					<CardHeader className='pb-3'>
						<div className='flex items-center justify-between'>
							<CardTitle>Предварительный просмотр</CardTitle>
							<div className='flex items-center gap-2'>
								<Label className='text-xs text-muted-foreground'>Фон:</Label>
								<div className='flex gap-1'>
									{[
										{
											color: 'white',
											label: 'Белый',
											class: 'bg-white border'
										},
										{
											color: '#f3f4f6',
											label: 'Серебряный',
											class: 'bg-gray-100'
										},
										{ color: 'black', label: 'Чёрный', class: 'bg-black' }
									].map(bg => (
										<button
											key={bg.color}
											onClick={() => setBackgroundColor(bg.color)}
											className={cn(
												'w-4 h-4 rounded-full transition-all',
												bg.class,
												backgroundColor === bg.color &&
													'ring-2 ring-primary ring-offset-1'
											)}
											title={bg.label}
										>
											<span className='sr-only'>{bg.label}</span>
										</button>
									))}
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div
							className='h-72 rounded-lg border flex items-center justify-center transition-colors'
							style={{ backgroundColor }}
						>
							{svgInput ? (
								<div
									className='max-w-[200px] max-h-[200px] w-full h-full'
									style={{
										backgroundImage: cssResult
											? cssResult
													.replace('background-image: ', '')
													.replace(';', '')
											: '',
										backgroundRepeat: 'no-repeat',
										backgroundPosition: 'center',
										backgroundSize: 'contain'
									}}
								/>
							) : (
								<p className='text-muted-foreground text-sm'>
									Предварительный просмотр появится здесь
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Output Section */}
			{(encodedResult || cssResult || tailwindResult) && (
				<Card>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle>Результат</CardTitle>
							{activeTab !== 'tailwind' && (
								<div className='flex items-center gap-4'>
									<Label className='text-sm'>Кавычки:</Label>
									<RadioGroup
										value={quotes}
										onValueChange={v => setQuotes(v as 'single' | 'double')}
										className='flex gap-4'
									>
										<div className='flex items-center space-x-2'>
											<RadioGroupItem value='single' id='single' />
											<Label
												htmlFor='single'
												className='text-sm cursor-pointer'
											>
												Одинарные (')
											</Label>
										</div>
										<div className='flex items-center space-x-2'>
											<RadioGroupItem value='double' id='double' />
											<Label
												htmlFor='double'
												className='text-sm cursor-pointer'
											>
												Двойные (")
											</Label>
										</div>
									</RadioGroup>
								</div>
							)}
						</div>
					</CardHeader>
					<CardContent>
						<Tabs
							defaultValue='encoded'
							value={activeTab}
							onValueChange={setActiveTab}
							className='w-full'
						>
							<TabsList className='grid w-full grid-cols-3'>
								<TabsTrigger value='encoded'>Кодированный</TabsTrigger>
								<TabsTrigger value='css'>CSS</TabsTrigger>
								<TabsTrigger value='tailwind'>Tailwind</TabsTrigger>
							</TabsList>

							<TabsContent value='encoded' className='mt-4'>
								<div className='space-y-3'>
									<div className='flex items-center justify-between'>
										<Label className='text-sm'>Кодированный результат</Label>
										<Button
											size='sm'
											variant='outline'
											onClick={() => copyToClipboard(encodedResult, 'encoded')}
											disabled={!encodedResult}
											className='gap-2'
										>
											{copiedField === 'encoded' ? (
												<Check className='h-4 w-4' />
											) : (
												<Copy className='h-4 w-4' />
											)}
											Копировать
										</Button>
									</div>
									<textarea
										value={encodedResult}
										onChange={e => handleEncodedChange(e.target.value)}
										aria-label='Кодированный SVG появится здесь'
										className='w-full h-32 p-4 font-mono text-sm border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all'
										placeholder='Кодированный SVG появится здесь'
										spellCheck={false}
									/>
									<p className='text-xs text-muted-foreground'>
										Можно редактировать для отладки
									</p>
								</div>
							</TabsContent>

							<TabsContent value='css' className='mt-4'>
								<div className='space-y-3'>
									<div className='flex items-center justify-between'>
										<Label className='text-sm'>CSS результат</Label>
										<Button
											size='sm'
											variant='outline'
											onClick={() => copyToClipboard(cssResult, 'css')}
											disabled={!cssResult}
											className='gap-2'
										>
											{copiedField === 'css' ? (
												<Check className='h-4 w-4' />
											) : (
												<Copy className='h-4 w-4' />
											)}
											Копировать
										</Button>
									</div>
									<textarea
										value={cssResult}
										readOnly
										aria-label='CSS код появится здесь'
										className='w-full h-32 p-4 font-mono text-sm border rounded-lg bg-muted resize-none'
										placeholder='CSS код появится здесь'
										spellCheck={false}
									/>
									<p className='text-xs text-muted-foreground'>
										Готово для использования в CSS
									</p>
								</div>
							</TabsContent>

							<TabsContent value='tailwind' className='mt-4'>
								<div className='space-y-3'>
									<div className='flex items-center justify-between'>
										<Label className='text-sm'>Tailwind результат</Label>
										<Button
											size='sm'
											variant='outline'
											onClick={() =>
												copyToClipboard(tailwindResult, 'tailwind')
											}
											disabled={!tailwindResult}
											className='gap-2'
										>
											{copiedField === 'tailwind' ? (
												<Check className='h-4 w-4' />
											) : (
												<Copy className='h-4 w-4' />
											)}
											Копировать
										</Button>
									</div>
									<textarea
										value={tailwindResult}
										readOnly
										aria-label='Tailwind класс появится здесь'
										className='w-full h-32 p-4 font-mono text-sm border rounded-lg bg-muted resize-none'
										placeholder='Tailwind класс появится здесь'
										spellCheck={false}
									/>
									<p className='text-xs text-muted-foreground'>
										Готово для использования в Tailwind CSS
									</p>
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

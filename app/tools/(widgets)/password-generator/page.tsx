'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Copy,
	RefreshCw,
	Shield,
	AlertTriangle,
	Check,
	X,
	Eye,
	EyeOff,
	History,
	Download,
	Zap,
	Settings2,
	Trash2,
	Type,
	Hash,
	AtSign,
	Sparkles,
	ChevronDown,
	ChevronUp,
	Clock
} from 'lucide-react'
import { toast } from 'sonner'

import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { TextRoll } from '@/components/core/text-roll'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'

interface PasswordOptions {
	length: number
	uppercase: boolean
	lowercase: boolean
	numbers: boolean
	symbols: boolean
	excludeSimilar: boolean
	excludeAmbiguous: boolean
}

interface PasswordHistory {
	password: string
	strength: number
	timestamp: Date
}

type GeneratorMode = 'random' | 'memorable' | 'phrase'

interface MemorablePattern {
	pattern: string
	example: string
}

const DEFAULT_OPTIONS: PasswordOptions = {
	length: 16,
	uppercase: true,
	lowercase: true,
	numbers: true,
	symbols: true,
	excludeSimilar: false,
	excludeAmbiguous: false
}

const MEMORABLE_PATTERNS: MemorablePattern[] = [
	{ pattern: 'word-word-number', example: 'sunset-ocean-42' },
	{ pattern: 'Word@Word#Num', example: 'Forest@River#99' },
	{ pattern: 'word.word.word', example: 'coffee.mountain.thunder' },
	{ pattern: 'WordWordNumber!', example: 'BlueSkyFire7!' }
]

const COMMON_WORDS = [
	'sun',
	'moon',
	'star',
	'sky',
	'cloud',
	'rain',
	'snow',
	'wind',
	'fire',
	'water',
	'earth',
	'air',
	'ice',
	'storm',
	'thunder',
	'lightning',
	'tree',
	'forest',
	'mountain',
	'river',
	'ocean',
	'lake',
	'desert',
	'island',
	'wolf',
	'eagle',
	'lion',
	'dragon',
	'phoenix',
	'tiger',
	'bear',
	'hawk',
	'blue',
	'red',
	'green',
	'gold',
	'silver',
	'black',
	'white',
	'purple',
	'sword',
	'shield',
	'crown',
	'crystal',
	'diamond',
	'stone',
	'steel',
	'iron',
	'light',
	'dark',
	'shadow',
	'bright',
	'spark',
	'flame',
	'frost',
	'mist'
]

export default function PasswordGeneratorPage() {
	const widget = getWidgetById('password-generator')!
	const [password, setPassword] = useState('')
	const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS)
	const [strength, setStrength] = useState(0)
	const [showPassword, setShowPassword] = useState(true)
	const [history, setHistory] = useState<PasswordHistory[]>([])
	const [mode, setMode] = useState<GeneratorMode>('random')
	const [showAdvanced, setShowAdvanced] = useState(false)
	const [showHistory, setShowHistory] = useState(false)
	const [isGenerating, setIsGenerating] = useState(false)
	const [selectedPattern, setSelectedPattern] = useState(0)
	const [customWords, setCustomWords] = useState('')
	const [copied, setCopied] = useState(false)

	// Character sets
	const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
	const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const NUMBERS = '0123456789'
	const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
	const SIMILAR = 'il1Lo0O'
	const AMBIGUOUS = '{}[]()/\\\\\'"`~,;.<>'

	// Load history from localStorage
	useEffect(() => {
		const savedHistory = localStorage.getItem('password-history')
		if (savedHistory) {
			const parsed = JSON.parse(savedHistory)
			setHistory(
				parsed.map((item: any) => ({
					...item,
					timestamp: new Date(item.timestamp)
				}))
			)
		}
	}, [])

	const calculateStrength = useCallback((pass: string): number => {
		if (!pass) return 0

		let score = 0

		// Length score
		if (pass.length >= 8) score += 20
		if (pass.length >= 12) score += 20
		if (pass.length >= 16) score += 20

		// Character diversity
		if (/[a-z]/.test(pass)) score += 10
		if (/[A-Z]/.test(pass)) score += 10
		if (/[0-9]/.test(pass)) score += 10
		if (/[^A-Za-z0-9]/.test(pass)) score += 10

		// No repeated characters
		if (!/(.)\1{2,}/.test(pass)) score += 10

		// No common patterns
		const commonPatterns = ['123', 'abc', 'password', 'qwerty', '111']
		const hasCommonPattern = commonPatterns.some(pattern =>
			pass.toLowerCase().includes(pattern)
		)
		if (!hasCommonPattern) score += 10

		return Math.min(score, 100)
	}, [])

	const generatePassword = useCallback(() => {
		setIsGenerating(true)

		// Simulate generation delay for animation
		setTimeout(() => {
			let charset = ''

			if (options.lowercase) charset += LOWERCASE
			if (options.uppercase) charset += UPPERCASE
			if (options.numbers) charset += NUMBERS
			if (options.symbols) charset += SYMBOLS

			if (!charset) {
				toast.error('Выберите хотя бы один тип символов')
				setIsGenerating(false)
				return
			}

			// Remove excluded characters
			if (options.excludeSimilar) {
				charset = charset
					.split('')
					.filter(char => !SIMILAR.includes(char))
					.join('')
			}
			if (options.excludeAmbiguous) {
				charset = charset
					.split('')
					.filter(char => !AMBIGUOUS.includes(char))
					.join('')
			}

			// Generate password
			let newPassword = ''
			const array = new Uint32Array(options.length)
			crypto.getRandomValues(array)

			for (let i = 0; i < options.length; i++) {
				newPassword += charset[array[i] % charset.length]
			}

			// Ensure at least one character from each selected type
			const ensureTypes = []
			if (options.lowercase) ensureTypes.push(LOWERCASE)
			if (options.uppercase) ensureTypes.push(UPPERCASE)
			if (options.numbers) ensureTypes.push(NUMBERS)
			if (options.symbols) ensureTypes.push(SYMBOLS)

			if (ensureTypes.length > 1 && options.length >= ensureTypes.length) {
				const positions = new Set<number>()
				while (positions.size < ensureTypes.length) {
					positions.add(Math.floor(Math.random() * options.length))
				}

				const posArray = Array.from(positions)
				ensureTypes.forEach((type, index) => {
					const pos = posArray[index]
					const char = type[Math.floor(Math.random() * type.length)]
					newPassword =
						newPassword.substring(0, pos) +
						char +
						newPassword.substring(pos + 1)
				})
			}

			setPassword(newPassword)
			const newStrength = calculateStrength(newPassword)
			setStrength(newStrength)

			// Add to history
			const historyItem: PasswordHistory = {
				password: newPassword,
				strength: newStrength,
				timestamp: new Date()
			}

			const newHistory = [historyItem, ...history].slice(0, 50)
			setHistory(newHistory)
			localStorage.setItem('password-history', JSON.stringify(newHistory))

			setIsGenerating(false)
		}, 300)
	}, [options, history, calculateStrength])

	const generateMemorablePassword = useCallback(() => {
		setIsGenerating(true)

		setTimeout(() => {
			const pattern = MEMORABLE_PATTERNS[selectedPattern]
			const words = []

			// Select random words
			for (let i = 0; i < 3; i++) {
				words.push(
					COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]
				)
			}

			let newPassword = ''

			switch (selectedPattern) {
				case 0: // word-word-number
					newPassword = `${words[0]}-${words[1]}-${Math.floor(Math.random() * 100)}`
					break
				case 1: // Word@Word#Num
					newPassword = `${words[0].charAt(0).toUpperCase() + words[0].slice(1)}@${words[1].charAt(0).toUpperCase() + words[1].slice(1)}#${Math.floor(Math.random() * 100)}`
					break
				case 2: // word.word.word
					newPassword = `${words[0]}.${words[1]}.${words[2]}`
					break
				case 3: // WordWordNumber!
					newPassword = `${words[0].charAt(0).toUpperCase() + words[0].slice(1)}${words[1].charAt(0).toUpperCase() + words[1].slice(1)}${Math.floor(Math.random() * 10)}!`
					break
			}

			setPassword(newPassword)
			const newStrength = calculateStrength(newPassword)
			setStrength(newStrength)

			// Add to history
			const historyItem: PasswordHistory = {
				password: newPassword,
				strength: newStrength,
				timestamp: new Date()
			}

			const newHistory = [historyItem, ...history].slice(0, 50)
			setHistory(newHistory)
			localStorage.setItem('password-history', JSON.stringify(newHistory))

			setIsGenerating(false)
		}, 300)
	}, [selectedPattern, history, calculateStrength])

	const generatePassphrase = useCallback(() => {
		setIsGenerating(true)

		setTimeout(() => {
			const words = customWords
				.trim()
				.split(/\s+/)
				.filter(w => w.length > 0)

			if (words.length < 4) {
				// Use default words if not enough custom words
				const defaultWords = COMMON_WORDS.sort(() => Math.random() - 0.5).slice(
					0,
					4
				)
				words.push(...defaultWords)
			}

			// Shuffle and select words
			const shuffled = [...words].sort(() => Math.random() - 0.5)
			const selectedWords = shuffled.slice(0, Math.min(5, shuffled.length))

			// Create passphrase with random formatting
			const formats = [
				(words: string[]) => words.join('-'),
				(words: string[]) => words.join(' '),
				(words: string[]) =>
					words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''),
				(words: string[]) => words.join('.') + Math.floor(Math.random() * 100)
			]

			const format = formats[Math.floor(Math.random() * formats.length)]
			const newPassword = format(selectedWords)

			setPassword(newPassword)
			const newStrength = calculateStrength(newPassword)
			setStrength(newStrength)

			// Add to history
			const historyItem: PasswordHistory = {
				password: newPassword,
				strength: newStrength,
				timestamp: new Date()
			}

			const newHistory = [historyItem, ...history].slice(0, 50)
			setHistory(newHistory)
			localStorage.setItem('password-history', JSON.stringify(newHistory))

			setIsGenerating(false)
		}, 300)
	}, [customWords, history, calculateStrength])

	const generate = useCallback(() => {
		switch (mode) {
			case 'random':
				generatePassword()
				break
			case 'memorable':
				generateMemorablePassword()
				break
			case 'phrase':
				generatePassphrase()
				break
		}
	}, [mode, generatePassword, generateMemorablePassword, generatePassphrase])

	const copyToClipboard = async () => {
		if (!password) return

		try {
			await navigator.clipboard.writeText(password)
			setCopied(true)
			toast.success('Пароль скопирован в буфер обмена')

			// Reset copied state after animation
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			toast.error('Ошибка копирования')
		}
	}

	const clearHistory = () => {
		setHistory([])
		localStorage.removeItem('password-history')
		toast.success('История очищена')
	}

	const downloadPasswords = () => {
		const content = history
			.map(
				item =>
					`${item.password}\t${item.strength}%\t${item.timestamp.toLocaleString()}`
			)
			.join('\n')

		const blob = new Blob([content], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `passwords-${Date.now()}.txt`
		a.click()
		URL.revokeObjectURL(url)

		toast.success('Пароли загружены')
	}

	const getStrengthColor = (score: number) => {
		if (score >= 80) return 'from-green-500 to-emerald-500'
		if (score >= 60) return 'from-yellow-500 to-amber-500'
		if (score >= 40) return 'from-orange-500 to-orange-600'
		return 'from-red-500 to-red-600'
	}

	const getStrengthLabel = (score: number) => {
		if (score >= 80) return 'Очень сильный'
		if (score >= 60) return 'Сильный'
		if (score >= 40) return 'Средний'
		if (score >= 20) return 'Слабый'
		return 'Очень слабый'
	}

	// Generate initial password
	useEffect(() => {
		generate()
	}, []) // Only on mount

	// Update strength when password changes
	useEffect(() => {
		setStrength(calculateStrength(password))
	}, [password, calculateStrength])

	return (
		<WidgetSEOWrapper widget={widget}>
			<WidgetLayout showShare={false}>
				<div className='w-full space-y-6'>
				{/* Main Card with Settings and Password */}
				<Card className='relative overflow-hidden bg-gradient-to-br from-background/95 to-background/50 backdrop-blur border-border/50'>
					<CardContent className='p-6 sm:p-8 lg:p-10 space-y-6'>
						{/* Mode Switcher */}
						<div className='flex justify-center'>
							<div className='inline-flex p-1 bg-secondary/50 rounded-lg backdrop-blur-sm w-full max-w-md'>
								{[
									{ key: 'random', icon: Zap, label: 'Случайный' },
									{
										key: 'memorable',
										icon: Sparkles,
										label: 'Запоминающийся'
									},
									{ key: 'phrase', icon: Type, label: 'Фраза' }
								].map(item => (
									<div key={item.key} className='flex-1'>
										<Button
											variant={mode === item.key ? 'default' : 'ghost'}
											size='sm'
											onClick={() => setMode(item.key as GeneratorMode)}
											className='h-8 px-3 w-full text-xs'
										>
											<item.icon className='w-3.5 h-3.5 mr-1.5' />
											{item.label}
										</Button>
									</div>
								))}
							</div>
						</div>

						{/* Quick Options */}
						<div className='p-4 bg-background/50 rounded-lg'>
							{mode === 'random' && (
								<div className='space-y-4'>
									{/* Length, Characters and Advanced in one row */}
									<div className='flex items-center gap-3'>
										{/* Length Slider */}
										<div className='flex items-center gap-2'>
											<Label className='text-xs font-medium flex items-center gap-1.5 whitespace-nowrap'>
												<Hash className='w-3.5 h-3.5 text-muted-foreground' />
												{'Длина'}
											</Label>
											<div className='w-32'>
												<Slider
													value={[options.length]}
													onValueChange={([value]) =>
														setOptions({ ...options, length: value })
													}
													min={8}
													max={32}
													step={1}
													className='w-full h-1'
												/>
											</div>
											<Badge
												variant='secondary'
												className='font-mono text-xs h-5 px-1.5'
											>
												{options.length}
											</Badge>
										</div>

										{/* Character Options */}
										<div className='flex gap-1.5'>
											<Button
												size='sm'
												variant={options.uppercase ? 'default' : 'outline'}
												onClick={() =>
													setOptions({
														...options,
														uppercase: !options.uppercase
													})
												}
												className='h-7 px-2.5 text-xs transition-none'
											>
												A-Z
											</Button>
											<Button
												size='sm'
												variant={options.lowercase ? 'default' : 'outline'}
												onClick={() =>
													setOptions({
														...options,
														lowercase: !options.lowercase
													})
												}
												className='h-7 px-2.5 text-xs transition-none'
											>
												a-z
											</Button>
											<Button
												size='sm'
												variant={options.numbers ? 'default' : 'outline'}
												onClick={() =>
													setOptions({ ...options, numbers: !options.numbers })
												}
												className='h-7 px-2.5 text-xs transition-none'
											>
												0-9
											</Button>
											<Button
												size='sm'
												variant={options.symbols ? 'default' : 'outline'}
												onClick={() =>
													setOptions({ ...options, symbols: !options.symbols })
												}
												className='h-7 px-2.5 text-xs transition-none'
											>
												!@#
											</Button>
										</div>

										{/* Advanced Toggle */}
										<Button
											variant='outline'
											size='sm'
											onClick={() => setShowAdvanced(!showAdvanced)}
											className='h-8 px-3 gap-1 text-xs ml-auto'
										>
											<Settings2 className='w-3.5 h-3.5' />
											{showAdvanced ? (
												<ChevronUp className='w-3 h-3' />
											) : (
												<ChevronDown className='w-3 h-3' />
											)}
										</Button>
									</div>

									{/* Advanced Options */}
									<AnimatePresence>
										{showAdvanced && (
											<motion.div
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: 'auto', opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.3 }}
												className='overflow-hidden'
											>
												<div className='pt-3 border-t space-y-2'>
													<div className='flex items-center justify-between'>
														<Label
															htmlFor='similar'
															className='text-xs cursor-pointer'
														>
															{'Исключить похожие символы'} (il1Lo0O)
														</Label>
														<Switch
															id='similar'
															checked={options.excludeSimilar}
															onCheckedChange={checked =>
																setOptions({
																	...options,
																	excludeSimilar: checked
																})
															}
															className='scale-75'
														/>
													</div>
													<div className='flex items-center justify-between'>
														<Label
															htmlFor='ambiguous'
															className='text-xs cursor-pointer'
														>
															{'Исключить неоднозначные символы'} ({}[]()...)
														</Label>
														<Switch
															id='ambiguous'
															checked={options.excludeAmbiguous}
															onCheckedChange={checked =>
																setOptions({
																	...options,
																	excludeAmbiguous: checked
																})
															}
															className='scale-75'
														/>
													</div>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							)}

							{mode === 'memorable' && (
								<div className='space-y-3'>
									<div className='space-y-2'>
										<Label className='text-xs font-medium flex items-center gap-1.5'>
											<Sparkles className='w-3.5 h-3.5 text-muted-foreground' />
											{'Шаблон'}
										</Label>
										<div className='flex gap-2 overflow-x-auto'>
											{MEMORABLE_PATTERNS.map((pattern, index) => {
												const isSelected = selectedPattern === index
												return (
													<Button
														key={index}
														variant={isSelected ? 'default' : 'outline'}
														onClick={() => setSelectedPattern(index)}
														className='h-auto py-2 px-3 justify-start text-left flex-shrink-0 group'
													>
														<div>
															<div
																className={cn(
																	'font-medium text-xs whitespace-nowrap',
																	isSelected && 'text-primary-foreground',
																	!isSelected &&
																		'group-hover:text-primary-foreground'
																)}
															>
																{pattern.pattern}
															</div>
															<div
																className={cn(
																	'text-[10px] mt-0.5 whitespace-nowrap transition-colors',
																	isSelected && 'text-primary-foreground/70',
																	!isSelected &&
																		'text-muted-foreground group-hover:text-primary-foreground/70'
																)}
															>
																{pattern.example}
															</div>
														</div>
													</Button>
												)
											})}
										</div>
									</div>
									<div className='p-3 bg-secondary/20 rounded-lg'>
										<p className='text-xs text-muted-foreground'>
											{'Создаёт легко запоминающиеся пароли на основе слов'}
										</p>
									</div>
								</div>
							)}

							{mode === 'phrase' && (
								<div className='space-y-3'>
									<div className='space-y-2'>
										<Label className='text-xs font-medium flex items-center gap-1.5'>
											<Type className='w-3.5 h-3.5 text-muted-foreground' />
											{'Слова'}
										</Label>
										<textarea
											value={customWords}
											onChange={e => setCustomWords(e.target.value)}
											placeholder={'Введите свои слова (по одному на строку)'}
											className='w-full min-h-[60px] p-2 bg-background rounded-md border border-border resize-none font-mono text-xs'
											spellCheck={false}
										/>
										<p className='text-[10px] text-muted-foreground'>
											{'Или выберите тему ниже'}
										</p>
									</div>
									<div className='grid grid-cols-4 gap-1.5'>
										{['nature', 'tech', 'fantasy', 'space'].map(theme => (
											<Button
												key={theme}
												variant='outline'
												size='sm'
												onClick={() => {
													const themeWords = {
														nature:
															'ocean mountain forest river sunset thunder',
														tech: 'quantum neural cyber digital matrix protocol',
														fantasy:
															'dragon phoenix crystal magic sword shield',
														space: 'galaxy nebula asteroid comet stellar nova'
													}
													setCustomWords(
														themeWords[theme as keyof typeof themeWords]
													)
												}}
												className='h-7 text-[10px] px-2'
											>
												{theme === 'nature'
													? 'Природа'
													: theme === 'tech'
														? 'Технологии'
														: theme === 'fantasy'
															? 'Фэнтези'
															: 'Космос'}
											</Button>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Password Display */}
						<div className='relative p-6 sm:p-8 bg-background/80 rounded-2xl border border-border/50 shadow-xl'>
							{/* Strength Indicator - top left corner */}
							<div className='absolute left-4 top-4 space-y-1'>
								<div className='text-xs font-medium'>
									{getStrengthLabel(strength)}
								</div>
								<div className='w-24 h-1.5 bg-secondary rounded-full overflow-hidden'>
									<motion.div
										className={cn(
											'h-full bg-gradient-to-r',
											getStrengthColor(strength)
										)}
										initial={{ width: 0 }}
										animate={{ width: `${strength}%` }}
										transition={{ duration: 0.5, ease: 'easeOut' }}
									/>
								</div>
							</div>

							{/* Copy and Visibility buttons - top right corner */}
							<div className='absolute right-4 top-4 flex gap-2'>
								<button
									onClick={() => setShowPassword(!showPassword)}
									className='h-8 w-8 rounded-md border border-border/50 bg-background/70 hover:bg-background hover:border-border flex items-center justify-center transition-colors'
									aria-label={showPassword ? 'Hide password' : 'Show password'}
								>
									{showPassword ? (
										<EyeOff className='w-3.5 h-3.5 text-foreground' />
									) : (
										<Eye className='w-3.5 h-3.5 text-foreground' />
									)}
								</button>
								<button
									onClick={copyToClipboard}
									disabled={!password}
									className='h-8 w-8 rounded-md border border-border/50 bg-background/70 hover:bg-background hover:border-border flex items-center justify-center transition-colors disabled:opacity-50'
									aria-label='Copy password'
								>
									{copied ? (
										<Check className='w-3.5 h-3.5 text-green-600' />
									) : (
										<Copy className='w-3.5 h-3.5 text-foreground' />
									)}
								</button>
							</div>

							{/* Password text */}
							<div className='font-mono text-2xl sm:text-3xl lg:text-4xl text-center break-all select-all px-4 pt-8 overflow-hidden'>
								{showPassword ? (
									<TextRoll
										key={password}
										className='inline-block'
										duration={0.4}
										getEnterDelay={i => i * 0.015}
										getExitDelay={i => i * 0.015}
										transition={{
											ease: [0.25, 0.1, 0.25, 1]
										}}
										variants={{
											enter: {
												initial: { y: 0, opacity: 1 },
												animate: { y: -50, opacity: 0.1 }
											},
											exit: {
												initial: { y: 50, opacity: 0 },
												animate: { y: 0, opacity: 1 }
											}
										}}
									>
										{password}
									</TextRoll>
								) : (
									'•'.repeat(password.length)
								)}
							</div>
						</div>

						{/* Generate Button */}
						<Button
							onClick={generate}
							size='lg'
							disabled={isGenerating}
							className='w-full h-14 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl'
						>
							{isGenerating ? (
								<RefreshCw className='w-5 h-5 mr-2 animate-spin' />
							) : (
								<>
									<Zap className='w-5 h-5 mr-2' />
									{'Сгенерировать'}
								</>
							)}
						</Button>
					</CardContent>
				</Card>

				{/* History Section */}
				{history.length > 0 && (
					<Card className='bg-background/50 border-border/50'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='font-semibold flex items-center gap-2'>
									<Clock className='w-4 h-4' />
									{'Недавние пароли'}
								</h3>
								<div className='flex gap-2'>
									<Button
										size='sm'
										variant='outline'
										onClick={() => setShowHistory(!showHistory)}
										className='h-8'
									>
										{showHistory ? 'Скрыть' : 'Показать'}
									</Button>
									{showHistory && (
										<>
											<Button
												size='sm'
												variant='outline'
												onClick={downloadPasswords}
												className='h-8'
											>
												<Download className='w-3.5 h-3.5 mr-1' />
												{'Скачать'}
											</Button>
											<Button
												size='sm'
												variant='outline'
												onClick={clearHistory}
												className='h-8'
											>
												<Trash2 className='w-3.5 h-3.5 mr-1' />
												{'Очистить'}
											</Button>
										</>
									)}
								</div>
							</div>

							<AnimatePresence>
								{showHistory && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: 'auto', opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.3 }}
										className='space-y-2 overflow-hidden'
									>
										{history.slice(0, 5).map((item, index) => (
											<motion.div
												key={index}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.05 }}
												className='p-3 bg-background/50 rounded-lg flex items-center justify-between gap-4 group hover:bg-background/80 transition-colors cursor-pointer'
												onClick={async () => {
													await navigator.clipboard.writeText(item.password)
													toast.success('Пароль скопирован')
												}}
											>
												<div className='flex-1 min-w-0'>
													<code className='font-mono text-sm'>
														{showPassword ? item.password : '••••••••••••'}
													</code>
												</div>
												<div className='flex items-center gap-3'>
													<Badge
														variant='outline'
														className={cn(
															'text-xs',
															item.strength >= 80 &&
																'border-green-500/50 text-green-600',
															item.strength >= 60 &&
																item.strength < 80 &&
																'border-yellow-500/50 text-yellow-600',
															item.strength >= 40 &&
																item.strength < 60 &&
																'border-orange-500/50 text-orange-600',
															item.strength < 40 &&
																'border-red-500/50 text-red-600'
														)}
													>
														{item.strength}%
													</Badge>
													<span className='text-xs text-muted-foreground'>
														{new Date(item.timestamp).toLocaleTimeString()}
													</span>
													<Copy className='w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity' />
												</div>
											</motion.div>
										))}
									</motion.div>
								)}
							</AnimatePresence>
						</CardContent>
					</Card>
				)}
			</div>
		</WidgetLayout>
		</WidgetSEOWrapper>
	)
}

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Type,
	Copy,
	RefreshCw,
	FileText,
	Hash,
	Clock,
	BarChart3,
	Zap,
	AlertCircle,
	CheckCircle,
	MessageSquare,
	Facebook,
	Twitter,
	Linkedin,
	Instagram,
	Globe,
	Search,
	Edit3,
	ChevronDown,
	ChevronUp,
	BookOpen,
	Mic
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
interface TextStats {
	characters: number
	charactersNoSpaces: number
	words: number
	sentences: number
	paragraphs: number
	readingTime: number
	speakingTime: number
	avgWordLength: number
	avgSentenceLength: number
	longestWord: string
	commonWords: { word: string; count: number }[]
}

interface PlatformLimit {
	name: string
	icon: any
	limit: number
	type: 'characters' | 'words'
	description: string
	color: string
}

const PLATFORM_LIMITS: PlatformLimit[] = [
	{
		name: 'Twitter',
		icon: Twitter,
		limit: 280,
		type: 'characters',
		description: 'Твит',
		color: 'text-sky-500'
	},
	{
		name: 'Facebook',
		icon: Facebook,
		limit: 63206,
		type: 'characters',
		description: 'Пост',
		color: 'text-blue-600'
	},
	{
		name: 'Instagram',
		icon: Instagram,
		limit: 2200,
		type: 'characters',
		description: 'Подпись',
		color: 'text-pink-600'
	},
	{
		name: 'LinkedIn',
		icon: Linkedin,
		limit: 3000,
		type: 'characters',
		description: 'Пост',
		color: 'text-blue-700'
	},
	{
		name: 'Google Title',
		icon: Search,
		limit: 60,
		type: 'characters',
		description: 'SEO заголовок',
		color: 'text-green-600'
	},
	{
		name: 'Google Description',
		icon: Search,
		limit: 160,
		type: 'characters',
		description: 'SEO описание',
		color: 'text-green-600'
	},
	{
		name: 'SMS',
		icon: MessageSquare,
		limit: 160,
		type: 'characters',
		description: 'Одно сообщение',
		color: 'text-purple-600'
	},
	{
		name: 'WhatsApp',
		icon: MessageSquare,
		limit: 65536,
		type: 'characters',
		description: 'Сообщение',
		color: 'text-green-500'
	}
]

const COMMON_STOP_WORDS = [
	'и',
	'в',
	'не',
	'на',
	'я',
	'с',
	'что',
	'а',
	'по',
	'он',
	'она',
	'это',
	'к',
	'но',
	'the',
	'be',
	'to',
	'of',
	'and',
	'a',
	'in',
	'that',
	'have',
	'it',
	'for',
	'not',
	'on'
]

// Animated Number Component
function AnimatedNumber({
	value,
	suffix = ''
}: {
	value: number
	suffix?: string
}) {
	const [displayValue, setDisplayValue] = useState(0)

	useEffect(() => {
		const duration = 500
		const startTime = Date.now()
		const startValue = displayValue
		const difference = value - startValue

		const animate = () => {
			const now = Date.now()
			const progress = Math.min((now - startTime) / duration, 1)
			const easeOutQuart = 1 - Math.pow(1 - progress, 4)

			setDisplayValue(Math.floor(startValue + difference * easeOutQuart))

			if (progress < 1) {
				requestAnimationFrame(animate)
			} else {
				setDisplayValue(value)
			}
		}

		requestAnimationFrame(animate)
	}, [value])

	return (
		<>
			{displayValue}
			{suffix}
		</>
	)
}

// Collapsible Section Component
function CollapsibleSection({
	title,
	icon,
	children,
	defaultOpen = false
}: {
	title: string
	icon: React.ReactNode
	children: React.ReactNode
	defaultOpen?: boolean
}) {
	const [isOpen, setIsOpen] = useState(defaultOpen)

	return (
		<Card className='overflow-hidden border-2 hover:border-muted-foreground/20 transition-all duration-200'>
			<CardContent className='p-0'>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className='w-full p-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 transition-all duration-200 rounded-t-lg group'
				>
					<div className='flex items-center gap-3'>
						<motion.div
							whileHover={{ scale: 1.1 }}
							className='p-2 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-200'
						>
							{icon}
						</motion.div>
						<h3 className='font-semibold text-lg group-hover:text-primary transition-colors duration-200'>
							{title}
						</h3>
					</div>
					<motion.div
						animate={{ rotate: isOpen ? 180 : 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className='p-1 rounded-full hover:bg-muted/50 transition-colors'
					>
						<ChevronDown className='w-5 h-5 text-muted-foreground' />
					</motion.div>
				</button>

				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: 'easeInOut' }}
							className='overflow-hidden border-t bg-gradient-to-b from-muted/10 to-transparent'
						>
							<div className='p-6'>{children}</div>
						</motion.div>
					)}
				</AnimatePresence>
			</CardContent>
		</Card>
	)
}

export default function TextCounterPage() {
	const [text, setText] = useState('')
	const [stats, setStats] = useState<TextStats>({
		characters: 0,
		charactersNoSpaces: 0,
		words: 0,
		sentences: 0,
		paragraphs: 0,
		readingTime: 0,
		speakingTime: 0,
		avgWordLength: 0,
		avgSentenceLength: 0,
		longestWord: '',
		commonWords: []
	})
	const [selectedPlatform, setSelectedPlatform] =
		useState<PlatformLimit | null>(null)

	useEffect(() => {
		analyzeText(text)
	}, [text])

	const analyzeText = (inputText: string) => {
		if (!inputText) {
			setStats({
				characters: 0,
				charactersNoSpaces: 0,
				words: 0,
				sentences: 0,
				paragraphs: 0,
				readingTime: 0,
				speakingTime: 0,
				avgWordLength: 0,
				avgSentenceLength: 0,
				longestWord: '',
				commonWords: []
			})
			return
		}

		// Character counts
		const characters = inputText.length
		const charactersNoSpaces = inputText.replace(/\s/g, '').length

		// Word count
		const words = inputText
			.trim()
			.split(/\s+/)
			.filter(word => word.length > 0)
		const wordCount = words.length

		// Sentence count (basic)
		const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0)
		const sentenceCount = sentences.length

		// Paragraph count
		const paragraphs = inputText.split(/\n\n+/).filter(p => p.trim().length > 0)
		const paragraphCount = paragraphs.length

		// Reading time (200 words per minute)
		const readingTime = Math.ceil(wordCount / 200)

		// Speaking time (150 words per minute)
		const speakingTime = Math.ceil(wordCount / 150)

		// Average word length
		const totalWordLength = words.reduce((sum, word) => sum + word.length, 0)
		const avgWordLength = wordCount > 0 ? totalWordLength / wordCount : 0

		// Average sentence length
		const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0

		// Longest word
		const longestWord = words.reduce(
			(longest, word) => (word.length > longest.length ? word : longest),
			''
		)

		// Common words (excluding stop words)
		const wordFrequency: { [key: string]: number } = {}
		words.forEach(word => {
			const lowercaseWord = word.toLowerCase().replace(/[^а-яa-z0-9]/g, '')
			if (lowercaseWord && !COMMON_STOP_WORDS.includes(lowercaseWord)) {
				wordFrequency[lowercaseWord] = (wordFrequency[lowercaseWord] || 0) + 1
			}
		})

		const commonWords = Object.entries(wordFrequency)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([word, count]) => ({ word, count }))

		setStats({
			characters,
			charactersNoSpaces,
			words: wordCount,
			sentences: sentenceCount,
			paragraphs: paragraphCount,
			readingTime,
			speakingTime,
			avgWordLength,
			avgSentenceLength,
			longestWord,
			commonWords
		})
	}

	const copyStats = () => {
		const statsText = `
Анализ текста

Символов: ${stats.characters}
Символов без пробелов: ${stats.charactersNoSpaces}
Слов: ${stats.words}
Предложений: ${stats.sentences}
Абзацев: ${stats.paragraphs}

Время чтения: ${stats.readingTime} мин
Время речи: ${stats.speakingTime} мин

Средняя длина слова: ${stats.avgWordLength.toFixed(1)} символов
Средняя длина предложения: ${stats.avgSentenceLength.toFixed(1)} слов
Самое длинное слово: ${stats.longestWord}

Частые слова:
${stats.commonWords.map(({ word, count }) => `• ${word} (${count})`).join('\n')}
    `.trim()

		navigator.clipboard.writeText(statsText)
		toast.success('Статистика скопирована в буфер обмена!')
	}

	const copyText = () => {
		navigator.clipboard.writeText(text)
		toast.success('Текст скопирован в буфер обмена!')
	}

	const clearText = () => {
		setText('')
		setSelectedPlatform(null)
		toast.success('Текст очищен!')
	}

	const loadExample = () => {
		setText(
			'Добро пожаловать в анализатор текста! Этот инструмент помогает вам анализировать ваш текст в реальном времени. Попробуйте ввести или вставить любой текст, и вы увидите мгновенную статистику.'
		)
		toast.success('Пример загружен!')
	}

	const getPlatformProgress = (platform: PlatformLimit): number => {
		const value =
			platform.type === 'characters' ? stats.characters : stats.words
		return Math.min((value / platform.limit) * 100, 100)
	}

	const getPlatformStatus = (platform: PlatformLimit) => {
		const value =
			platform.type === 'characters' ? stats.characters : stats.words
		const percentage = (value / platform.limit) * 100

		if (percentage <= 80) {
			return {
				color: 'text-green-600',
				icon: CheckCircle,
				status: 'Оптимально'
			}
		} else if (percentage <= 100) {
			return {
				color: 'text-yellow-600',
				icon: AlertCircle,
				status: 'Близко к лимиту'
			}
		} else {
			return {
				color: 'text-red-600',
				icon: AlertCircle,
				status: 'Превышен лимит'
			}
		}
	}

	const highlightKeywords = () => {
		if (stats.commonWords.length === 0) return text

		let highlightedText = text
		stats.commonWords.forEach(({ word }) => {
			const regex = new RegExp(`\\b${word}\\b`, 'gi')
			highlightedText = highlightedText.replace(regex, `**${word}**`)
		})
		return highlightedText
	}

	// Keyboard shortcuts
	return (
		<WidgetLayout showShare={false}>
			<div className='w-full space-y-6'>
				{/* Hero Stats Section */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<Card className='relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10'>
							<CardContent className='p-4 sm:p-6'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2'>
											Символов
										</p>
										<p className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
											<AnimatedNumber value={stats.characters} />
										</p>
									</div>
									<div className='relative'>
										<Hash className='w-6 h-6 sm:w-8 sm:h-8 text-primary/30' />
										<div className='absolute inset-0 bg-primary/10 blur-xl rounded-full'></div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.1 }}
					>
						<Card className='relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20 hover:border-blue-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10'>
							<CardContent className='p-4 sm:p-6'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2'>
											Слов
										</p>
										<p className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent'>
											<AnimatedNumber value={stats.words} />
										</p>
									</div>
									<div className='relative'>
										<Type className='w-6 h-6 sm:w-8 sm:h-8 text-blue-500/30' />
										<div className='absolute inset-0 bg-blue-500/10 blur-xl rounded-full'></div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.2 }}
					>
						<Card className='relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/20 hover:border-green-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10'>
							<CardContent className='p-4 sm:p-6'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2'>
											Предложений
										</p>
										<p className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent'>
											<AnimatedNumber value={stats.sentences} />
										</p>
									</div>
									<div className='relative'>
										<FileText className='w-6 h-6 sm:w-8 sm:h-8 text-green-500/30' />
										<div className='absolute inset-0 bg-green-500/10 blur-xl rounded-full'></div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.3 }}
					>
						<Card className='relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/20 hover:border-orange-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/10'>
							<CardContent className='p-4 sm:p-6'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2'>
											Время чтения
										</p>
										<p className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent'>
											<AnimatedNumber value={stats.readingTime} suffix=' min' />
										</p>
									</div>
									<div className='relative'>
										<Clock className='w-6 h-6 sm:w-8 sm:h-8 text-orange-500/30' />
										<div className='absolute inset-0 bg-orange-500/10 blur-xl rounded-full'></div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* Text Input Section */}
				<Card className='relative border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/30 transition-all duration-200'>
					<CardContent className='p-4 sm:p-6'>
						<div className='relative'>
							<Textarea
								id='text-input'
								value={text}
								onChange={e => setText(e.target.value)}
								placeholder='Введите или вставьте текст для анализа...'
								className='min-h-[250px] sm:min-h-[300px] resize-y pr-12 sm:pr-16 text-base border-0 focus:ring-0 bg-transparent placeholder:text-muted-foreground/60'
							/>
							{/* Floating Character Counter */}
							<motion.div
								className='absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-xs sm:text-sm font-mono bg-background/90 backdrop-blur border rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 shadow-sm'
								initial={{ opacity: 0 }}
								animate={{ opacity: text ? 1 : 0.5 }}
								transition={{ duration: 0.2 }}
							>
								<span className='text-muted-foreground'>
									{stats.characters.toLocaleString()}
								</span>
							</motion.div>
						</div>

						{/* Action Buttons */}
						<div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-0 mt-6 pt-4 border-t'>
							<div className='flex gap-2'>
								<Button
									onClick={loadExample}
									variant='outline'
									size='sm'
									className='flex-1 sm:flex-none hover:bg-primary/5 hover:border-primary/20'
								>
									<Zap className='w-4 h-4 mr-2' />
									Пример
								</Button>
								<Button
									onClick={clearText}
									variant='outline'
									size='sm'
									className='flex-1 sm:flex-none hover:bg-destructive/5 hover:border-destructive/20'
									disabled={!text}
								>
									<RefreshCw className='w-4 h-4 mr-2' />
									Очистить
								</Button>
							</div>
							<div className='flex flex-wrap gap-2'>
								<Button
									onClick={copyText}
									variant='outline'
									size='sm'
									disabled={!text}
									className='flex-1 sm:flex-none hover:bg-blue-500/5 hover:border-blue-500/20'
								>
									<Copy className='w-4 h-4 mr-2' />
									Копировать текст
								</Button>
								<Button
									onClick={copyStats}
									variant='default'
									size='sm'
									disabled={!text}
									className='flex-1 sm:flex-none bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md hover:shadow-lg transition-all'
								>
									<BarChart3 className='w-4 h-4 mr-2' />
									Копировать статистику
								</Button>
							</div>
						</div>

						{/* Quick Info Bar */}
						{text && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								className='mt-4 pt-4 border-t bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 rounded-lg'
							>
								<div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm p-3'>
									<motion.div
										className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
										whileHover={{ scale: 1.02 }}
									>
										<BookOpen className='w-4 h-4 text-blue-500' />
										<span className='font-medium'>
											~{stats.readingTime} мин чтение
										</span>
									</motion.div>
									<motion.div
										className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
										whileHover={{ scale: 1.02 }}
									>
										<Mic className='w-4 h-4 text-green-500' />
										<span className='font-medium'>
											~{stats.speakingTime} мин речь
										</span>
									</motion.div>
									<motion.div
										className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
										whileHover={{ scale: 1.02 }}
									>
										<Type className='w-4 h-4 text-purple-500' />
										<span className='font-medium'>
											{stats.avgWordLength.toFixed(1)} букв/слово
										</span>
									</motion.div>
								</div>
							</motion.div>
						)}
					</CardContent>
				</Card>

				{/* Collapsible Platform Limits Section */}
				<CollapsibleSection
					title='Лимиты платформ'
					icon={<Globe className='w-5 h-5' />}
					defaultOpen={false}
				>
					<div className='space-y-3'>
						{PLATFORM_LIMITS.slice(0, 5).map(platform => {
							const progress = getPlatformProgress(platform)
							const status = getPlatformStatus(platform)
							const Icon = platform.icon
							const remaining =
								platform.limit -
								(platform.type === 'characters'
									? stats.characters
									: stats.words)

							return (
								<div
									key={`${platform.name}-${platform.description}`}
									className='space-y-2'
								>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<Icon className={cn('w-4 h-4', platform.color)} />
											<span className='text-sm font-medium'>
												{platform.name}
											</span>
											{platform.description && (
												<span className='text-xs text-muted-foreground'>
													({platform.description})
												</span>
											)}
										</div>
										<span
											className={cn(
												'text-sm font-medium',
												remaining < 0
													? 'text-red-600'
													: remaining < platform.limit * 0.2
														? 'text-yellow-600'
														: 'text-green-600'
											)}
										>
											{remaining >= 0
												? `${remaining} осталось`
												: `${Math.abs(remaining)} превышено`}
										</span>
									</div>
									<Progress
										value={progress}
										className={cn(
											'h-2 transition-all',
											progress > 100 && 'bg-red-100'
										)}
									/>
								</div>
							)
						})}
					</div>
				</CollapsibleSection>

				{/* Collapsible Advanced Analysis Section */}
				{stats.words > 0 && (
					<CollapsibleSection
						title='Расширенный анализ'
						icon={<BarChart3 className='w-5 h-5' />}
						defaultOpen={false}
					>
						<div className='grid md:grid-cols-2 gap-6'>
							{/* Detailed Stats */}
							<div className='space-y-4'>
								<div>
									<h4 className='text-sm font-medium mb-3'>Анализ символов</h4>
									<div className='space-y-2'>
										<div className='flex justify-between text-sm'>
											<span className='text-muted-foreground'>
												Символов без пробелов
											</span>
											<span className='font-mono'>
												{stats.charactersNoSpaces}
											</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-muted-foreground'>Пробелов</span>
											<span className='font-mono'>
												{stats.characters - stats.charactersNoSpaces}
											</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-muted-foreground'>Абзацев</span>
											<span className='font-mono'>{stats.paragraphs}</span>
										</div>
									</div>
								</div>

								<div>
									<h4 className='text-sm font-medium mb-3'>Средние значения</h4>
									<div className='space-y-2'>
										<div className='flex justify-between text-sm'>
											<span className='text-muted-foreground'>
												Слов в предложении
											</span>
											<span className='font-mono'>
												{stats.avgSentenceLength.toFixed(1)}
											</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-muted-foreground'>
												Символов в слове
											</span>
											<span className='font-mono'>
												{stats.avgWordLength.toFixed(1)}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Word Analysis */}
							<div className='space-y-4'>
								{stats.longestWord && (
									<div>
										<h4 className='text-sm font-medium mb-3'>
											Самое длинное слово
										</h4>
										<Badge variant='secondary' className='font-mono'>
											{stats.longestWord} ({stats.longestWord.length} символов)
										</Badge>
									</div>
								)}

								{stats.commonWords.length > 0 && (
									<div>
										<h4 className='text-sm font-medium mb-3'>Частые слова</h4>
										<div className='space-y-2'>
											{stats.commonWords.map(({ word, count }) => (
												<div
													key={word}
													className='flex items-center justify-between'
												>
													<span className='font-mono text-sm'>{word}</span>
													<Badge variant='outline' className='text-xs'>
														{count}×
													</Badge>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</CollapsibleSection>
				)}
			</div>
		</WidgetLayout>
	)
}

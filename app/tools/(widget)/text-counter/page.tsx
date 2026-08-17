'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
	Copy,
	Check,
	BarChart3,
	Lightbulb,
	Trash2,
	MessageSquare,
	Facebook,
	Linkedin,
	Instagram
} from 'lucide-react'
import { RiTwitterXFill } from 'react-icons/ri'
import { SiGoogle, SiVk, SiOdnoklassniki, SiWhatsapp } from 'react-icons/si'
import { BiLogoTelegram } from 'react-icons/bi'
import { cn } from '@/lib/utils'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { TextCounterSeo } from './TextCounterSeo'

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
		name: 'X',
		icon: RiTwitterXFill,
		limit: 280,
		type: 'characters',
		description: 'Твит',
		color: 'text-sky-500'
	},
	{
		name: 'ВКонтакте',
		icon: SiVk,
		limit: 15895,
		type: 'characters',
		description: 'Пост',
		color: 'text-blue-500'
	},
	{
		name: 'Одноклассники',
		icon: SiOdnoklassniki,
		limit: 15895,
		type: 'characters',
		description: 'Заметка',
		color: 'text-orange-500'
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
		name: 'Telegram',
		icon: BiLogoTelegram,
		limit: 4096,
		type: 'characters',
		description: 'Сообщение',
		color: 'text-sky-400'
	},
	{
		name: 'Telegram',
		icon: BiLogoTelegram,
		limit: 1024,
		type: 'characters',
		description: 'Подпись к медиа',
		color: 'text-sky-400'
	},
	{
		name: 'Telegram',
		icon: BiLogoTelegram,
		limit: 255,
		type: 'characters',
		description: 'Описание канала',
		color: 'text-sky-400'
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
		name: 'Google / Яндекс',
		icon: SiGoogle,
		limit: 60,
		type: 'characters',
		description: 'SEO заголовок',
		color: 'text-green-600'
	},
	{
		name: 'Google / Яндекс',
		icon: SiGoogle,
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
		icon: SiWhatsapp,
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
export default function TextCounterPage() {
	const widget = getWidgetById('text-counter')!
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
	const [copied, setCopied] = useState<'text' | 'stats' | null>(null)

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
		setCopied('stats')
		setTimeout(() => setCopied(null), 2000)
	}

	const copyText = () => {
		navigator.clipboard.writeText(text)
		setCopied('text')
		setTimeout(() => setCopied(null), 2000)
	}

	const clearText = () => {
		setText('')
	}

	const loadExample = () => {
		setText(
			'Добро пожаловать в анализатор текста! Этот инструмент помогает вам анализировать ваш текст в реальном времени. Попробуйте ввести или вставить любой текст, и вы увидите мгновенную статистику.'
		)
	}

	const getPlatformProgress = (platform: PlatformLimit): number => {
		const value =
			platform.type === 'characters' ? stats.characters : stats.words
		return Math.min((value / platform.limit) * 100, 100)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: главные цифры. Раньше это были четыре карточки
				    с градиентами, свечением и анимацией счётчика — четыре разных
				    цвета ради четырёх чисел. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-x-6 gap-y-2'>
						{[
							['символов', stats.characters.toLocaleString('ru-RU')],
							['слов', stats.words.toLocaleString('ru-RU')],
							['предложений', stats.sentences.toLocaleString('ru-RU')],
							['абзацев', stats.paragraphs.toLocaleString('ru-RU')]
						].map(([label, value]) => (
							<span key={label} className='flex items-baseline gap-2'>
								<span className='font-mono text-xl text-foreground tabular-nums'>
									{value}
								</span>
								<span className='text-sm text-muted-foreground'>{label}</span>
							</span>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='sm'
							variant='ghost'
							onClick={loadExample}
							title='Подставить пример'
							className='cursor-pointer gap-1.5 text-muted-foreground hover:bg-muted hover:text-foreground'
						>
							<Lightbulb className='h-4 w-4' />
							Пример
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyText}
							disabled={!text}
							title='Скопировать текст'
							className={toolIconButton}
						>
							{copied === 'text' ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyStats}
							disabled={!text}
							title='Скопировать статистику'
							className={toolIconButton}
						>
							{copied === 'stats' ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<BarChart3 className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={clearText}
							disabled={!text}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<Textarea
					id='text-input'
					value={text}
					onChange={e => setText(e.target.value)}
					placeholder='Введите или вставьте текст — счёт идёт на лету'
					aria-label='Текст для анализа'
					className='min-h-[16rem] resize-y rounded-none border-0 px-5 py-6 text-base focus-visible:ring-0 sm:px-6'
				/>

				{/* Полоса «сколько это на слух и на глаз»: время чтения и речи —
				    производные от количества слов, поэтому они не в шапке. */}
				<div className={toolFooterBar}>
					{[
						['мин чтения', `~${stats.readingTime}`],
						['мин вслух', `~${stats.speakingTime}`],
						['символов без пробелов', stats.charactersNoSpaces],
						['букв в слове', stats.avgWordLength.toFixed(1)],
						['слов в предложении', stats.avgSentenceLength.toFixed(1)]
					].map(([label, value]) => (
						<span
							key={label as string}
							className='flex items-center gap-2 text-sm text-muted-foreground'
						>
							<span className='font-mono text-foreground tabular-nums'>
								{value}
							</span>
							{label}
						</span>
					))}
				</div>

				{stats.longestWord && (
					<div className={toolFooterBar}>
						<span className='flex items-center gap-2 text-sm text-muted-foreground'>
							Самое длинное слово
							<span className='font-mono text-foreground'>
								{stats.longestWord}
							</span>
							<span>({stats.longestWord.length} симв.)</span>
						</span>

						{stats.commonWords.length > 0 && (
							<span className='flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground sm:ml-auto'>
								Частые слова
								{stats.commonWords.map(({ word, count }) => (
									<span key={word} className='font-mono text-foreground'>
										{word}
										<span className='ml-1 text-muted-foreground'>×{count}</span>
									</span>
								))}
							</span>
						)}
					</div>
				)}
			</Card>

			{/* Лимиты площадок — тихая полка под инструментом: их смотрят, когда
			    текст уже написан, и прятать их за раскрывашкой смысла не было. */}
			<div className='mt-6'>
				<p className='px-1 text-sm text-muted-foreground'>
					Влезет ли текст: лимиты площадок
				</p>
				<div className='mt-2 space-y-3 rounded-xl border p-4'>
					{PLATFORM_LIMITS.map(platform => {
						const progress = getPlatformProgress(platform)
						const Icon = platform.icon
						const remaining =
							platform.limit -
							(platform.type === 'characters' ? stats.characters : stats.words)

						return (
							<div
								key={`${platform.name}-${platform.description}`}
								className='space-y-1.5'
							>
								<div className='flex items-center justify-between gap-3 text-sm'>
									<span className='flex min-w-0 items-center gap-2'>
										<Icon className='h-4 w-4 shrink-0 text-muted-foreground' />
										<span>{platform.name}</span>
										{platform.description && (
											<span className='truncate text-xs text-muted-foreground'>
												{platform.description}
											</span>
										)}
									</span>
									<span
										className={cn(
											'shrink-0 font-mono',
											remaining < 0
												? 'text-red-600 dark:text-red-400'
												: remaining < platform.limit * 0.2
													? 'text-yellow-600 dark:text-yellow-500'
													: 'text-muted-foreground'
										)}
									>
										{remaining >= 0
											? `${remaining} осталось`
											: `${Math.abs(remaining)} лишних`}
									</span>
								</div>
								<Progress value={progress} className='h-1.5' />
							</div>
						)
					})}
				</div>
			</div>

			<TextCounterSeo />
		</WidgetSEOWrapper>
	)
}

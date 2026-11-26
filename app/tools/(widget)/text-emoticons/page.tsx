'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Search, Sparkles, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { TextEmoticonsSeo } from './TextEmoticonsSeo'
import { toolBar, toolIconButton, toolPill } from '@/lib/ui/tool-pill'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import {
	EMOTICON_CATEGORIES,
	allEmoticons,
	emoticonLabel,
	searchEmoticons,
	type Emoticon
} from '@/lib/data/text-emoticons'

/**
 * Копирование с запасным путём. navigator.clipboard нет или он отказывает во
 * встроенных браузерах Telegram и VK и на старых iOS, а смайлики оттуда
 * копируют чаще всего.
 */
async function copyText(text: string): Promise<void> {
	try {
		await navigator.clipboard.writeText(text)
		return
	} catch {
		// пробуем через выделение текста ниже
	}
	const area = document.createElement('textarea')
	area.value = text
	area.setAttribute('readonly', '')
	area.style.position = 'fixed'
	area.style.opacity = '0'
	document.body.appendChild(area)
	area.select()
	const ok = document.execCommand('copy')
	document.body.removeChild(area)
	if (!ok) throw new Error('copy failed')
}

/** Длинные каомодзи на телефоне занимают всю строку, иначе их обрезает. */
const isWide = (text: string) => [...text].length > 12

export default function TextEmoticonsPage() {
	const widget = getWidgetById('text-emoticons')!
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const [query, setQuery] = useState('')
	const [recentEmoticons, setRecentEmoticons] = useState<string[]>([])
	const [copiedEmoticon, setCopiedEmoticon] = useState<string | null>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		try {
			const stored = localStorage.getItem('recentEmoticons')
			if (stored) setRecentEmoticons(JSON.parse(stored))
		} catch {
			// битые данные в localStorage не должны ронять страницу
		}
	}, [])

	useEffect(() => {
		if (mounted) {
			localStorage.setItem('recentEmoticons', JSON.stringify(recentEmoticons))
		}
	}, [recentEmoticons, mounted])

	const handleCopyEmoticon = async (emoticon: string) => {
		try {
			await copyText(emoticon)
			setCopiedEmoticon(emoticon)
			toast.success(`Скопировано: ${emoticon}`)
			setRecentEmoticons(prev =>
				[emoticon, ...prev.filter(e => e !== emoticon)].slice(0, 20)
			)
			setTimeout(() => setCopiedEmoticon(null), 2000)
		} catch (err) {
			console.error('Не удалось скопировать смайлик:', err)
			toast.error('Не удалось скопировать. Выделите смайлик и скопируйте вручную')
		}
	}

	const clearRecentEmoticons = () => {
		setRecentEmoticons([])
		localStorage.removeItem('recentEmoticons')
		setSelectedCategory('all')
	}

	const searching = query.trim().length > 0

	// Поиск идёт по всей коллекции: искать «кот» внутри «Грустных» бессмысленно.
	const filteredEmoticons: Emoticon[] = searching
		? searchEmoticons(query)
		: selectedCategory === 'recent'
			? recentEmoticons.map(text => ({ text, name: '' }))
			: selectedCategory === 'all'
				? allEmoticons()
				: (EMOTICON_CATEGORIES.find(cat => cat.id === selectedCategory)
						?.emoticons ?? [])

	const categories: { id: string; label: string; icon?: React.ReactNode }[] = [
		{ id: 'all', label: 'Все', icon: <Sparkles className='h-3.5 w-3.5' /> },
		...(recentEmoticons.length > 0
			? [
					{
						id: 'recent',
						label: 'Недавние',
						icon: <Clock className='h-3.5 w-3.5' />
					}
				]
			: []),
		...EMOTICON_CATEGORIES.map(category => ({
			id: category.id,
			label: category.label
		}))
	]

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<label className='relative flex w-full items-center'>
						<Search className='pointer-events-none absolute left-2.5 h-4 w-4 text-muted-foreground' />
						<input
							type='text'
							value={query}
							onChange={event => setQuery(event.target.value)}
							placeholder='Найти: грустный, кот, сердечко, привет'
							aria-label='Поиск смайлика по эмоции'
							className='w-full rounded-md border bg-background py-1.5 pr-8 pl-8 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
						{searching && (
							<button
								type='button'
								onClick={() => setQuery('')}
								aria-label='Очистить поиск'
								className='absolute right-2 cursor-pointer text-muted-foreground hover:text-foreground'
							>
								<X className='h-4 w-4' />
							</button>
						)}
					</label>

					{/* На телефоне категории — одна строка с прокруткой: при переносе
					    кнопки разной ширины ложились вразнобой. */}
					<div className='-mx-5 flex w-[calc(100%+2.5rem)] items-center gap-1.5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden'>
						{categories.map(category => (
							<button
								key={category.id}
								type='button'
								onClick={() => {
									setSelectedCategory(category.id)
									setQuery('')
								}}
								aria-pressed={!searching && selectedCategory === category.id}
								className={toolPill(
									!searching && selectedCategory === category.id,
									'flex shrink-0 items-center gap-1.5 whitespace-nowrap'
								)}
							>
								{category.icon}
								{category.label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-3 sm:ml-auto'>
						<span className='text-sm text-muted-foreground'>
							{filteredEmoticons.length} шт. · нажмите, чтобы скопировать
						</span>
						{!searching &&
							selectedCategory === 'recent' &&
							recentEmoticons.length > 0 && (
								<Button
									size='icon'
									variant='ghost'
									onClick={clearRecentEmoticons}
									title='Очистить недавние'
									className={toolIconButton}
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							)}
					</div>
				</div>

				{filteredEmoticons.length > 0 ? (
					<div className='grid grid-flow-dense grid-cols-2 gap-1 px-5 py-6 sm:grid-cols-3 sm:px-6 md:grid-cols-4'>
						{filteredEmoticons.map((emoticon, index) => (
							<button
								key={`${emoticon.text}-${index}`}
								type='button'
								onClick={() => handleCopyEmoticon(emoticon.text)}
								title='Скопировать'
								className={cn(
									'flex min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-2 py-3 transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
									isWide(emoticon.text) && 'col-span-2 sm:col-span-1',
									copiedEmoticon === emoticon.text &&
										'bg-primary/10 ring-1 ring-primary'
								)}
							>
								{/* Шрифт обычный, не моноширинный: в моноширинном не было
								    половины японских знаков (｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡ рисовался
								    квадратиками), а Lenny face разъезжался. */}
								<span className='max-w-full overflow-hidden text-base whitespace-nowrap'>
									{emoticon.text}
								</span>
								{emoticon.name && (
									<span className='text-xs text-muted-foreground'>
										{emoticonLabel(emoticon.name)}
									</span>
								)}
							</button>
						))}
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground'>
						{searching
							? `По запросу «${query.trim()}» ничего не нашлось. Попробуйте одно слово: радость, грусть, злой, кот, любовь`
							: 'В этой категории пока пусто'}
					</p>
				)}
			</Card>

			<ToolScreenshot slug='text-emoticons' />
			<TextEmoticonsSeo />
		</WidgetSEOWrapper>
	)
}

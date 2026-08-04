'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	Clock,
	Smile,
	Heart,
	Frown,
	Angry,
	Sparkles,
	Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toolBar, toolIconButton, toolPill } from '@/lib/ui/tool-pill'

/** Русские названия категорий: в данных лежат английские id. */
const CATEGORY_LABELS: Record<string, string> = {
	popular: 'Популярные',
	happy: 'Радость',
	sad: 'Грусть',
	angry: 'Злость',
	love: 'Любовь',
	animals: 'Животные',
	special: 'Особые',
	japanese: 'Японские'
}

/**
 * Русские подписи к смайликам. Раньше этот словарь был выписан прямо в
 * разметке цепочкой из тридцати вложенных тернарников — правка одной подписи
 * означала правку отступов на семьдесят уровней вложенности.
 */
const EMOTICON_LABELS: Record<string, string> = {
	lennyFace: 'Ленни фейс',
	shrug: 'Пожимание плечами',
	tableFlip: 'Переворот стола',
	disapproval: 'Неодобрение',
	bear: 'Медведь',
	confused: 'Смущение',
	happy: 'Счастье',
	crying: 'Плач',
	cool: 'Крутой',
	love: 'Любовь',
	excited: 'Возбуждение',
	sad: 'Грусть',
	angry: 'Злость',
	kiss: 'Поцелуй',
	hug: 'Обнимашки',
	cat: 'Кот',
	dog: 'Собака',
	surprised: 'Удивление',
	fish: 'Рыба',
	give: 'Дать',
	pointing: 'Указание',
	fighting: 'Борьба',
	dancing: 'Танцы',
	shocked: 'Шок',
	singing: 'Пение',
	goodbye: 'Прощание',
	curious: 'Любопытство',
	content: 'Довольство',
	friends: 'Друзья',
	embarrassed: 'Смущение'
}

interface EmoticonCategory {
	id: string
	icon: React.ReactNode
	emoticons: Array<{
		text: string
		name: string
		tags: string[]
	}>
}

const emoticonCategories: EmoticonCategory[] = [
	{
		id: 'popular',
		icon: <Sparkles className='w-4 h-4' />,
		emoticons: [
			{
				text: '( ͡° ͜ʖ ͡°)',
				name: 'lennyFace',
				tags: ['lenny', 'smirk', 'suggestive']
			},
			{
				text: '¯\\_(ツ)_/¯',
				name: 'shrug',
				tags: ['shrug', 'dunno', 'whatever']
			},
			{
				text: '(╯°□°）╯︵ ┻━┻',
				name: 'tableFlip',
				tags: ['angry', 'flip', 'table']
			},
			{
				text: 'ಠ_ಠ',
				name: 'disapproval',
				tags: ['disapproval', 'serious', 'judging']
			},
			{
				text: 'ʕ•ᴥ•ʔ',
				name: 'bear',
				tags: ['bear', 'cute', 'animal']
			},
			{
				text: '¯\\(°_o)/¯',
				name: 'confused',
				tags: ['confused', 'shrug', 'dunno']
			},
			{
				text: '(≧▽≦)',
				name: 'happy',
				tags: ['happy', 'joy', 'excited']
			},
			{
				text: 'இдஇ',
				name: 'crying',
				tags: ['crying', 'sad', 'tears']
			},
			{
				text: '(▀̿̿Ĺ̯̿▀̿ ̿)',
				name: 'cool',
				tags: ['cool', 'sunglasses', 'deal']
			},
			{
				text: '(•ө•)♡',
				name: 'love',
				tags: ['love', 'heart', 'cute']
			}
		]
	},
	{
		id: 'happy',
		icon: <Smile className='w-4 h-4' />,
		emoticons: [
			{ text: '(^▽^)', name: 'happy', tags: ['happy', 'joy', 'smile'] },
			{ text: '(＾◡＾)', name: 'happy', tags: ['happy', 'cute', 'smile'] },
			{ text: '(´∀｀)', name: 'happy', tags: ['happy', 'glad', 'smile'] },
			{ text: '(◕‿◕)', name: 'happy', tags: ['happy', 'cute', 'smile'] },
			{ text: '(✿◠‿◠)', name: 'happy', tags: ['happy', 'flower', 'cute'] },
			{
				text: '(ﾉ´ヮ`)ﾉ*: ･ﾟ',
				name: 'excited',
				tags: ['happy', 'excited', 'sparkle']
			},
			{
				text: '＼(＾▽＾)／',
				name: 'excited',
				tags: ['happy', 'excited', 'yay']
			},
			{
				text: '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
				name: 'excited',
				tags: ['excited', 'sparkle', 'happy']
			}
		]
	},
	{
		id: 'sad',
		icon: <Frown className='w-4 h-4' />,
		emoticons: [
			{ text: '(╥﹏╥)', name: 'crying', tags: ['sad', 'crying', 'tears'] },
			{ text: '(ToT)', name: 'crying', tags: ['sad', 'crying', 'tears'] },
			{
				text: '｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡',
				name: 'crying',
				tags: ['crying', 'sad', 'upset']
			},
			{ text: '(ಥ﹏ಥ)', name: 'crying', tags: ['crying', 'sad', 'tears'] },
			{ text: '(T_T)', name: 'crying', tags: ['sad', 'crying', 'simple'] },
			{ text: '(;_;)', name: 'sad', tags: ['sad', 'tears', 'simple'] },
			{ text: '(._．)', name: 'sad', tags: ['sad', 'down', 'simple'] },
			{ text: '(´;︵;`)', name: 'sad', tags: ['sad', 'crying', 'upset'] }
		]
	},
	{
		id: 'angry',
		icon: <Angry className='w-4 h-4' />,
		emoticons: [
			{ text: '(╬ಠ益ಠ)', name: 'angry', tags: ['angry', 'mad', 'rage'] },
			{ text: '(╯°□°)╯', name: 'angry', tags: ['angry', 'flip', 'rage'] },
			{ text: '(ノಠ益ಠ)ノ', name: 'angry', tags: ['angry', 'mad', 'rage'] },
			{ text: '(＃｀Д´)', name: 'angry', tags: ['angry', 'mad', 'yell'] },
			{ text: '(｀皿´＃)', name: 'angry', tags: ['angry', 'mad', 'grr'] },
			{ text: 'ლ(ಠ益ಠლ)', name: 'angry', tags: ['angry', 'why', 'rage'] },
			{ text: '(╬ Ò﹏Ó)', name: 'angry', tags: ['angry', 'upset', 'mad'] },
			{ text: '凸(-_-)凸', name: 'angry', tags: ['angry', 'rude', 'flip'] }
		]
	},
	{
		id: 'love',
		icon: <Heart className='w-4 h-4' />,
		emoticons: [
			{ text: '(♥‿♥)', name: 'love', tags: ['love', 'heart', 'eyes'] },
			{ text: '(´♡‿♡`)', name: 'love', tags: ['love', 'heart', 'cute'] },
			{
				text: '(*˘︶˘*).｡.:*♡',
				name: 'love',
				tags: ['love', 'heart', 'dreamy']
			},
			{
				text: '(灬♥ω♥灬)',
				name: 'love',
				tags: ['love', 'heart', 'blushing']
			},
			{ text: '(｡♥‿♥｡)', name: 'love', tags: ['love', 'heart', 'happy'] },
			{ text: '♡(˃͈ દ ˂͈ ༶ )', name: 'love', tags: ['love', 'heart', 'cute'] },
			{ text: '(づ￣ ³￣)づ', name: 'kiss', tags: ['love', 'kiss', 'hug'] },
			{ text: '(⊃｡•́‿•̀｡)⊃', name: 'hug', tags: ['love', 'hug', 'cute'] }
		]
	},
	{
		id: 'animals',
		icon: <span className='text-sm'>🐾</span>,
		emoticons: [
			{ text: 'ʕ•ᴥ•ʔ', name: 'bear', tags: ['bear', 'animal', 'cute'] },
			{ text: 'ᶘᵒᴥᵒᶅ', name: 'bear', tags: ['seal', 'bear', 'animal'] },
			{ text: '(=^･ω･^=)', name: 'cat', tags: ['cat', 'animal', 'cute'] },
			{ text: '(=^･ｪ･^=)', name: 'cat', tags: ['cat', 'animal', 'kawaii'] },
			{ text: '(^._.^)ﾉ', name: 'cat', tags: ['cat', 'animal', 'wave'] },
			{ text: 'U･ω･U', name: 'dog', tags: ['dog', 'animal', 'cute'] },
			{
				text: '(･o･;)',
				name: 'surprised',
				tags: ['surprised', 'shocked', 'animal']
			},
			{ text: '<(°)#)><', name: 'fish', tags: ['fish', 'animal', 'water'] }
		]
	},
	{
		id: 'special',
		icon: <Sparkles className='w-4 h-4' />,
		emoticons: [
			{ text: '༼ つ ◕_◕ ༽つ', name: 'give', tags: ['give', 'take', 'energy'] },
			{
				text: 'ヽ༼ຈل͜ຈ༽ﾉ',
				name: 'excited',
				tags: ['excited', 'dongers', 'raise']
			},
			{ text: '(☞ﾟヮﾟ)☞', name: 'pointing', tags: ['point', 'you', 'cool'] },
			{ text: '☜(ﾟヮﾟ☜)', name: 'pointing', tags: ['point', 'you', 'cool'] },
			{
				text: "(ง'̀-'́)ง",
				name: 'fighting',
				tags: ['fight', 'determined', 'boxing']
			},
			{ text: 'ᕕ( ᐛ )ᕗ', name: 'happy', tags: ['happy', 'running', 'excited'] },
			{
				text: '♪~ ᕕ(ᐛ)ᕗ',
				name: 'dancing',
				tags: ['dancing', 'music', 'happy']
			},
			{
				text: '(屮ﾟДﾟ)屮',
				name: 'shocked',
				tags: ['shocked', 'surprised', 'yell']
			}
		]
	},
	{
		id: 'japanese',
		icon: <span className='text-sm'>🌸</span>,
		emoticons: [
			{
				text: 'φ(゜▽゜*)♪',
				name: 'singing',
				tags: ['singing', 'music', 'happy']
			},
			{ text: '(￣▽￣)ノ', name: 'goodbye', tags: ['bye', 'wave', 'leaving'] },
			{ text: 'o(^▽^)o', name: 'excited', tags: ['excited', 'happy', 'yay'] },
			{
				text: '(o・ω・o)',
				name: 'curious',
				tags: ['curious', 'wondering', 'cute']
			},
			{
				text: '＼(~o~)／',
				name: 'surprised',
				tags: ['surprised', 'shocked', 'wow']
			},
			{
				text: '(⌒‿⌒)',
				name: 'content',
				tags: ['content', 'satisfied', 'smile']
			},
			{
				text: '(〃￣︶￣)人(￣︶￣〃)',
				name: 'friends',
				tags: ['friends', 'together', 'happy']
			},
			{
				text: '(￣ω￣;)',
				name: 'embarrassed',
				tags: ['embarrassed', 'awkward', 'sweat']
			}
		]
	}
]

export default function TextEmoticonsPage() {
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const [recentEmoticons, setRecentEmoticons] = useState<string[]>([])
	const [copiedEmoticon, setCopiedEmoticon] = useState<string | null>(null)
	const [mounted, setMounted] = useState(false)

	// Load recent emoticons from localStorage
	useEffect(() => {
		setMounted(true)
		const stored = localStorage.getItem('recentEmoticons')
		if (stored) {
			setRecentEmoticons(JSON.parse(stored))
		}
	}, [])

	// Save recent emoticons to localStorage
	useEffect(() => {
		if (mounted) {
			localStorage.setItem('recentEmoticons', JSON.stringify(recentEmoticons))
		}
	}, [recentEmoticons, mounted])

	const handleCopyEmoticon = async (emoticon: string) => {
		try {
			await navigator.clipboard.writeText(emoticon)
			setCopiedEmoticon(emoticon)

			// Add to recent emoticons
			setRecentEmoticons(prev => {
				const filtered = prev.filter(e => e !== emoticon)
				return [emoticon, ...filtered].slice(0, 20)
			})

			// Reset copied state after 2 seconds
			setTimeout(() => setCopiedEmoticon(null), 2000)
		} catch (err) {
			console.error('Не удалось скопировать смайлик:', err)
		}
	}

	const clearRecentEmoticons = () => {
		setRecentEmoticons([])
		localStorage.removeItem('recentEmoticons')
	}

	// Filter emoticons based on search and category
	const getFilteredEmoticons = () => {
		if (selectedCategory === 'recent') {
			return recentEmoticons.map(text => ({
				text,
				name: '',
				tags: []
			}))
		}

		const allEmoticons =
			selectedCategory === 'all'
				? emoticonCategories.flatMap(cat => cat.emoticons)
				: emoticonCategories.find(cat => cat.id === selectedCategory)
						?.emoticons || []

		return allEmoticons
	}

	const filteredEmoticons = getFilteredEmoticons()

	if (!mounted) {
		return (
			<Card className='overflow-hidden p-0'>
				<div className='h-14 border-b bg-muted/30' />
				<div className='h-96 animate-pulse bg-muted/20' />
			</Card>
		)
	}

	const categories: { id: string; label: string; icon: React.ReactNode }[] = [
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
		...emoticonCategories.map(category => ({
			id: category.id,
			label: CATEGORY_LABELS[category.id] ?? category.id,
			icon: category.icon
		}))
	]

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: категории. Раньше они жили над карточкой
				    отдельным блоком с заголовком «Категории» — подпись занимала
				    строку, а сами кнопки повторяли заголовок карточки ниже. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{categories.map(category => (
							<button
								key={category.id}
								type='button'
								onClick={() => setSelectedCategory(category.id)}
								aria-pressed={selectedCategory === category.id}
								className={toolPill(
									selectedCategory === category.id,
									'flex items-center gap-1.5'
								)}
							>
								{category.icon}
								{category.label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-3 sm:ml-auto'>
						<span className='text-sm text-muted-foreground'>
							{filteredEmoticons.length} шт.
						</span>
						{selectedCategory === 'recent' && recentEmoticons.length > 0 && (
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
					<div className='grid grid-cols-2 gap-1 px-5 py-6 sm:grid-cols-3 sm:px-6 md:grid-cols-4 lg:grid-cols-5'>
						{filteredEmoticons.map((emoticon, index) => (
							<button
								key={`${emoticon.text}-${index}`}
								type='button'
								onClick={() => handleCopyEmoticon(emoticon.text)}
								title='Скопировать'
								className={cn(
									'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-2 py-3 transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
									copiedEmoticon === emoticon.text &&
										'bg-primary/10 ring-1 ring-primary'
								)}
							>
								<span className='font-mono text-base break-all'>
									{emoticon.text}
								</span>
								{emoticon.name && (
									<span className='text-xs text-muted-foreground'>
										{EMOTICON_LABELS[emoticon.name] ?? emoticon.name}
									</span>
								)}
							</button>
						))}
					</div>
				) : (
					<p className='py-16 text-center text-sm text-muted-foreground'>
						В этой категории пока пусто
					</p>
				)}
			</Card>

			<div className='mt-6 space-y-3 text-sm text-muted-foreground'>
				<p>
					Текстовые смайлики (каомодзи) собраны из обычных символов Unicode,
					поэтому вставляются куда угодно — в ник, в сообщение, в комментарий —
					и выглядят одинаково на любом устройстве, в отличие от эмодзи.
				</p>
				<p>
					Клик по смайлику копирует его в буфер обмена, а сам смайлик попадает в
					«Недавние» — там копятся последние двадцать.
				</p>
			</div>
		</>
	)
}

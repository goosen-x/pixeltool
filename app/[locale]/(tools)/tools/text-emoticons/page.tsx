'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Clock,
	Smile,
	Heart,
	Frown,
	Laugh,
	Angry,
	Sparkles,
	Copy,
	Check,
	X
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

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
			{ text: '(ﾉ´ヮ`)ﾉ*: ･ﾟ', name: 'excited', tags: ['happy', 'excited', 'sparkle'] },
			{ text: '＼(＾▽＾)／', name: 'excited', tags: ['happy', 'excited', 'yay'] },
			{ text: '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', name: 'excited', tags: ['excited', 'sparkle', 'happy'] }
		]
	},
	{
		id: 'sad',
		icon: <Frown className='w-4 h-4' />,
		emoticons: [
			{ text: '(╥﹏╥)', name: 'crying', tags: ['sad', 'crying', 'tears'] },
			{ text: '(ToT)', name: 'crying', tags: ['sad', 'crying', 'tears'] },
			{ text: '｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡', name: 'crying', tags: ['crying', 'sad', 'upset'] },
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
			{ text: '(*˘︶˘*).｡.:*♡', name: 'love', tags: ['love', 'heart', 'dreamy'] },
			{ text: '(灬♥ω♥灬)', name: 'love', tags: ['love', 'heart', 'blushing'] },
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
			{ text: '(･o･;)', name: 'surprised', tags: ['surprised', 'shocked', 'animal'] },
			{ text: '<(°)#)><', name: 'fish', tags: ['fish', 'animal', 'water'] }
		]
	},
	{
		id: 'special',
		icon: <Sparkles className='w-4 h-4' />,
		emoticons: [
			{ text: '༼ つ ◕_◕ ༽つ', name: 'give', tags: ['give', 'take', 'energy'] },
			{ text: 'ヽ༼ຈل͜ຈ༽ﾉ', name: 'excited', tags: ['excited', 'dongers', 'raise'] },
			{ text: '(☞ﾟヮﾟ)☞', name: 'pointing', tags: ['point', 'you', 'cool'] },
			{ text: '☜(ﾟヮﾟ☜)', name: 'pointing', tags: ['point', 'you', 'cool'] },
			{ text: '(ง\'̀-\'́)ง', name: 'fighting', tags: ['fight', 'determined', 'boxing'] },
			{ text: 'ᕕ( ᐛ )ᕗ', name: 'happy', tags: ['happy', 'running', 'excited'] },
			{ text: '♪~ ᕕ(ᐛ)ᕗ', name: 'dancing', tags: ['dancing', 'music', 'happy'] },
			{ text: '(屮ﾟДﾟ)屮', name: 'shocked', tags: ['shocked', 'surprised', 'yell'] }
		]
	},
	{
		id: 'japanese',
		icon: <span className='text-sm'>🌸</span>,
		emoticons: [
			{ text: 'φ(゜▽゜*)♪', name: 'singing', tags: ['singing', 'music', 'happy'] },
			{ text: '(￣▽￣)ノ', name: 'goodbye', tags: ['bye', 'wave', 'leaving'] },
			{ text: 'o(^▽^)o', name: 'excited', tags: ['excited', 'happy', 'yay'] },
			{ text: '(o・ω・o)', name: 'curious', tags: ['curious', 'wondering', 'cute'] },
			{ text: '＼(~o~)／', name: 'surprised', tags: ['surprised', 'shocked', 'wow'] },
			{ text: '(⌒‿⌒)', name: 'content', tags: ['content', 'satisfied', 'smile'] },
			{ text: '(〃￣︶￣)人(￣︶￣〃)', name: 'friends', tags: ['friends', 'together', 'happy'] },
			{ text: '(￣ω￣;)', name: 'embarrassed', tags: ['embarrassed', 'awkward', 'sweat'] }
		]
	}
]

export default function TextEmoticonsPage() {
	const t = useTranslations('widgets.textEmoticons')
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
			toast.success(t('copied', { emoticon }))

			// Add to recent emoticons
			setRecentEmoticons(prev => {
				const filtered = prev.filter(e => e !== emoticon)
				return [emoticon, ...filtered].slice(0, 20)
			})

			// Reset copied state after 2 seconds
			setTimeout(() => setCopiedEmoticon(null), 2000)
		} catch (err) {
			toast.error(t('copyError'))
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

		const allEmoticons = selectedCategory === 'all' 
			? emoticonCategories.flatMap(cat => cat.emoticons)
			: emoticonCategories.find(cat => cat.id === selectedCategory)?.emoticons || []

		return allEmoticons
	}

	const filteredEmoticons = getFilteredEmoticons()

	if (!mounted) {
		return (
			<div className='max-w-6xl mx-auto space-y-6'>
				<Card className='p-6'>
					<div className='animate-pulse space-y-4'>
						<div className='h-10 bg-muted rounded' />
						<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
							{[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
								<div key={i} className='h-20 bg-muted rounded' />
							))}
						</div>
					</div>
				</Card>
			</div>
		)
	}

	return (
		<div className='max-w-6xl mx-auto space-y-6'>
			{/* Category Filter */}
			<div className='space-y-4'>
				<div className='flex justify-between items-center'>
					<h2 className='text-lg font-semibold'>{t('categories.title')}</h2>
					{recentEmoticons.length > 0 && selectedCategory === 'recent' && (
						<Button 
							variant="outline" 
							size="sm"
							onClick={clearRecentEmoticons}
							className='whitespace-nowrap'
						>
							<X className='w-4 h-4 mr-2' />
							{t('clearRecent')}
						</Button>
					)}
				</div>

				{/* Category Pills */}
				<div className='flex flex-wrap gap-2'>
					<Button
						variant={selectedCategory === 'all' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setSelectedCategory('all')}
						className={cn(
							'h-9 px-4 rounded-full transition-all',
							selectedCategory === 'all' && 'shadow-lg'
						)}
					>
						<Sparkles className='w-4 h-4 mr-2' />
						{t('allCategories')}
					</Button>
					
					{recentEmoticons.length > 0 && (
						<Button
							variant={selectedCategory === 'recent' ? 'default' : 'outline'}
							size='sm'
							onClick={() => setSelectedCategory('recent')}
							className={cn(
								'h-9 px-4 rounded-full transition-all',
								selectedCategory === 'recent' && 'shadow-lg'
							)}
						>
							<Clock className='w-4 h-4 mr-2' />
							{t('recentlyUsed')}
						</Button>
					)}
					
					{emoticonCategories.map(category => (
						<Button
							key={category.id}
							variant={selectedCategory === category.id ? 'default' : 'outline'}
							size='sm'
							onClick={() => setSelectedCategory(category.id)}
							className={cn(
								'h-9 px-4 rounded-full transition-all',
								selectedCategory === category.id && 'shadow-lg'
							)}
						>
							<span className='mr-2'>{category.icon}</span>
							{t(`categories.${category.id}`)}
						</Button>
					))}
				</div>
			</div>

			{/* Emoticons Grid */}
			<Card className='p-6'>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-lg font-semibold'>
						{selectedCategory === 'all' 
							? t('allCategories')
							: selectedCategory === 'recent'
							? t('recentlyUsed')
							: t(`categories.${selectedCategory}`)}
					</h2>
					<Badge variant='secondary'>
						{t('totalEmoticons', { count: filteredEmoticons.length })}
					</Badge>
				</div>

				{filteredEmoticons.length > 0 ? (
					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'>
						{filteredEmoticons.map((emoticon, index) => (
							<Button
								key={`${emoticon.text}-${index}`}
								variant='outline'
								className={cn(
									'h-20 flex flex-col items-center justify-center gap-1 p-2 transition-all duration-200',
									'group relative overflow-hidden',
									'hover:border-primary hover:bg-muted/50 hover:shadow-md hover:scale-105',
									copiedEmoticon === emoticon.text && 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950/20'
								)}
								onClick={() => handleCopyEmoticon(emoticon.text)}
								title={t('clickToCopy')}
							>
								<span className='text-lg font-mono relative z-10 group-hover:text-foreground transition-colors'>{emoticon.text}</span>
								{emoticon.name && (
									<span className='text-xs text-muted-foreground relative z-10 group-hover:text-foreground/80 transition-colors'>
										{t(`emoticonName.${emoticon.name}`)}
									</span>
								)}
								
								{copiedEmoticon === emoticon.text && (
									<div className='absolute inset-0 flex items-center justify-center'>
										<Check className='w-6 h-6 text-green-600 dark:text-green-400' />
									</div>
								)}
								
								<Copy className='absolute bottom-1 right-1 w-3 h-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity z-10' />
							</Button>
						))}
					</div>
				) : (
					<div className='text-center py-12 text-muted-foreground'>
						<p>{t('noResults')}</p>
					</div>
				)}
			</Card>

			{/* Info Card */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>{t('aboutTitle')}</h3>
				<p className='text-sm text-muted-foreground mb-4'>
					{t('aboutDescription')}
				</p>
				
				<div className='grid md:grid-cols-2 gap-4 mt-4'>
					<div>
						<h4 className='font-medium mb-2'>{t('features.title')}</h4>
						<ul className='space-y-1 text-sm text-muted-foreground'>
							<li>• {t('features.list.collection')}</li>
							<li>• {t('features.list.categories')}</li>
							<li>• {t('features.list.copy')}</li>
							<li>• {t('features.list.recent')}</li>
							<li>• {t('features.list.search')}</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>{t('tips.title')}</h4>
						<ul className='space-y-1 text-sm text-muted-foreground'>
							<li>• {t('tips.list.social')}</li>
							<li>• {t('tips.list.messages')}</li>
							<li>• {t('tips.list.forums')}</li>
							<li>• {t('tips.list.email')}</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>
	)
}
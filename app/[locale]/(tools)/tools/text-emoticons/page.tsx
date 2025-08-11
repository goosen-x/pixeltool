'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Search,
	Clock,
	Smile,
	Heart,
	Frown,
	Laugh,
	Angry,
	Sparkles,
	Copy,
	Check
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface EmoticonCategory {
	id: string
	name: string
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
		name: 'Popular',
		icon: <Sparkles className='w-4 h-4' />,
		emoticons: [
			{
				text: '( ͡° ͜ʖ ͡°)',
				name: 'Lenny Face',
				tags: ['lenny', 'smirk', 'suggestive']
			},
			{
				text: '¯\\_(ツ)_/¯',
				name: 'Shrug',
				tags: ['shrug', 'dunno', 'whatever']
			},
			{
				text: 'ヽ༼ຈل͜ຈ༽ﾉ',
				name: 'Raise Your Dongers',
				tags: ['excited', 'dongers', 'happy']
			},
			{
				text: 'ಠ_ಠ',
				name: 'Look of Disapproval',
				tags: ['disapproval', 'serious', 'judging']
			},
			{
				text: '¯\\(°_o)/¯',
				name: 'Confused Shrug',
				tags: ['confused', 'shrug', 'dunno']
			},
			{
				text: '( ﾟдﾟ)',
				name: 'Shocked',
				tags: ['shocked', 'surprised', 'wow']
			},
			{ text: 'இдஇ', name: 'Crying', tags: ['crying', 'sad', 'tears'] },
			{ text: '(≧▽≦)', name: 'Happy', tags: ['happy', 'joy', 'excited'] },
			{
				text: '(´_ゝ`)',
				name: 'Indifferent',
				tags: ['meh', 'whatever', 'bored']
			},
			{ text: '´• ل •`', name: 'Cute Face', tags: ['cute', 'kawaii', 'sweet'] },
			{ text: 'ʕ•ᴥ•ʔ', name: 'Bear', tags: ['bear', 'cute', 'animal'] },
			{ text: 'ᶘᵒᴥᵒᶅ', name: 'Seal', tags: ['seal', 'cute', 'animal'] },
			{ text: '[̲̅$̲̅(̲̅ιοο̲̅)̲̅$̲̅]', name: 'Money', tags: ['money', 'dollar', 'cash'] },
			{ text: "/̵͇/'̿'̿ ̿ ̿̿ ̿̿ ̿ ̿̿ ̿̿", name: 'Gun', tags: ['gun', 'weapon', 'action'] },
			{
				text: '(▀̿̿Ĺ̯̿▀̿ ̿)',
				name: 'Deal With It',
				tags: ['cool', 'sunglasses', 'deal']
			},
			{
				text: '凸-_-凸',
				name: 'Middle Finger',
				tags: ['angry', 'rude', 'flip']
			},
			{
				text: '(ㆁωㆁ*)',
				name: 'Curious',
				tags: ['curious', 'wondering', 'thinking']
			},
			{ text: '(•ө•)♡', name: 'Love', tags: ['love', 'heart', 'cute'] },
			{ text: '(/◕ヮ◕)/', name: 'Excited', tags: ['excited', 'happy', 'yay'] },
			{ text: '(^_^.)', name: 'Shy Smile', tags: ['shy', 'smile', 'happy'] }
		]
	},
	{
		id: 'happy',
		name: 'Happy & Excited',
		icon: <Smile className='w-4 h-4' />,
		emoticons: [
			{
				text: '(◉ω◉)',
				name: 'Wide Eyes Happy',
				tags: ['happy', 'excited', 'wow']
			},
			{ text: '^오^', name: 'Cheerful', tags: ['happy', 'cheerful', 'smile'] },
			{
				text: '(*´∀｀)',
				name: 'Blushing Happy',
				tags: ['happy', 'blush', 'shy']
			},
			{
				text: '•̀.̫•́✧',
				name: 'Sparkle Eyes',
				tags: ['sparkle', 'happy', 'excited']
			},
			{ text: '(๑´ڡ`๑)', name: 'Delicious', tags: ['yummy', 'food', 'happy'] },
			{
				text: '(・∀・)',
				name: 'Simple Happy',
				tags: ['happy', 'smile', 'simple']
			},
			{
				text: '༼ ºلº ༽',
				name: 'Crazy Happy',
				tags: ['crazy', 'excited', 'wild']
			},
			{
				text: 'ლ(´ڡ`ლ)',
				name: 'Grabby Happy',
				tags: ['excited', 'want', 'grabby']
			},
			{ text: '(･ิω･ิ)', name: 'Cat Smile', tags: ['cat', 'smile', 'cute'] },
			{
				text: 'ヽ(^o^)丿',
				name: 'Celebration',
				tags: ['celebrate', 'happy', 'yay']
			},
			{
				text: '(*^_^*)',
				name: 'Classic Happy',
				tags: ['happy', 'smile', 'classic']
			},
			{
				text: '٩(♡ε♡ )۶',
				name: 'Love Struck',
				tags: ['love', 'happy', 'hearts']
			},
			{
				text: '(๑•̀ㅂ•́)ﻭ✧',
				name: 'Determined',
				tags: ['determined', 'ready', 'pumped']
			},
			{
				text: '(๑˃̵ᴗ˂̵)ﻭ',
				name: 'Fighting',
				tags: ['fight', 'ready', 'determined']
			},
			{ text: '(^o^)', name: 'Simple Joy', tags: ['joy', 'happy', 'simple'] },
			{
				text: '(✿◠‿◠)',
				name: 'Flower Happy',
				tags: ['flower', 'happy', 'cute']
			},
			{
				text: '(＾ｕ＾)',
				name: 'Content',
				tags: ['content', 'happy', 'peaceful']
			},
			{
				text: 'ヽ(´▽`)/',
				name: 'Cheering',
				tags: ['cheer', 'happy', 'celebrate']
			},
			{
				text: '＼(^o^)／',
				name: 'Hooray',
				tags: ['hooray', 'celebrate', 'happy']
			},
			{
				text: 'o((*^▽^*))o',
				name: 'Super Happy',
				tags: ['super', 'happy', 'excited']
			}
		]
	},
	{
		id: 'sad',
		name: 'Sad & Crying',
		icon: <Frown className='w-4 h-4' />,
		emoticons: [
			{
				text: '(-_-;)',
				name: 'Sweat Drop',
				tags: ['embarrassed', 'awkward', 'sweat']
			},
			{
				text: '^_^;',
				name: 'Nervous Smile',
				tags: ['nervous', 'awkward', 'smile']
			},
			{
				text: '(^o^;',
				name: 'Nervous Happy',
				tags: ['nervous', 'happy', 'awkward']
			},
			{
				text: '(ーー;)',
				name: 'Worried',
				tags: ['worried', 'concerned', 'thinking']
			},
			{
				text: "('・ω・')",
				name: 'Confused',
				tags: ['confused', 'wondering', 'unsure']
			},
			{
				text: '(；´Д｀)',
				name: 'Distressed',
				tags: ['distressed', 'upset', 'worried']
			},
			{
				text: '(；･`д･´)',
				name: 'Shocked Sad',
				tags: ['shocked', 'sad', 'upset']
			},
			{
				text: '(´-﹏-`；)',
				name: 'Depressed',
				tags: ['depressed', 'sad', 'down']
			},
			{
				text: 'm(_ _;)m',
				name: 'Apologizing',
				tags: ['sorry', 'apologize', 'bow']
			},
			{
				text: '( ﾟдﾟ)',
				name: 'Stunned',
				tags: ['stunned', 'shocked', 'surprised']
			},
			{
				text: '(゜o゜)',
				name: 'Wide Eyes Shock',
				tags: ['shock', 'surprised', 'wow']
			},
			{
				text: '＿|￣|○',
				name: 'Defeated',
				tags: ['defeated', 'give up', 'tired']
			},
			{ text: '(T_T)', name: 'Crying', tags: ['crying', 'sad', 'tears'] },
			{
				text: '(｡ŏ﹏ŏ)',
				name: 'Teary Eyes',
				tags: ['crying', 'sad', 'emotional']
			},
			{
				text: '( ･ั﹏･ั)',
				name: 'About to Cry',
				tags: ['sad', 'crying', 'emotional']
			},
			{
				text: '(¯―¯٥)',
				name: 'Disappointed',
				tags: ['disappointed', 'sad', 'let down']
			},
			{
				text: '(｡>﹏<｡)',
				name: 'Sobbing',
				tags: ['sobbing', 'crying', 'very sad']
			},
			{
				text: '(ಥ﹏ಥ)',
				name: 'Tears Streaming',
				tags: ['crying', 'tears', 'very sad']
			},
			{
				text: '༼ಢ_ಢ༽',
				name: 'Ugly Crying',
				tags: ['crying', 'ugly', 'very sad']
			},
			{ text: '(๑´•.̫ • `๑)', name: 'Sad Cute', tags: ['sad', 'cute', 'pouty'] }
		]
	},
	{
		id: 'angry',
		name: 'Angry & Annoyed',
		icon: <Angry className='w-4 h-4' />,
		emoticons: [
			{
				text: '(-̩̩-̩̩͡_-̩̩-̩̩͡)',
				name: 'Frustrated',
				tags: ['frustrated', 'annoyed', 'tired']
			},
			{
				text: '(;´༎ຶД༎ຶ`)',
				name: 'Angry Crying',
				tags: ['angry', 'crying', 'upset']
			},
			{ text: "'ㅂ'", name: 'Annoyed', tags: ['annoyed', 'irritated', 'mad'] },
			{ text: "'ㅅ'", name: 'Pouting', tags: ['pout', 'annoyed', 'cute'] },
			{ text: '-ㅅ-', name: 'Grumpy', tags: ['grumpy', 'annoyed', 'tired'] },
			{ text: '(︶^︶)', name: 'Smug', tags: ['smug', 'proud', 'confident'] },
			{
				text: '→_→',
				name: 'Side Eye',
				tags: ['side eye', 'suspicious', 'judging']
			},
			{
				text: '(・へ・)',
				name: 'Displeased',
				tags: ['displeased', 'unhappy', 'annoyed']
			},
			{
				text: '(~_~メ)',
				name: 'Irritated',
				tags: ['irritated', 'annoyed', 'angry']
			},
			{ text: '(ノಠ益ಠ)', name: 'Rage', tags: ['rage', 'angry', 'furious'] },
			{
				text: '(╬ಠ益ಠ)',
				name: 'Very Angry',
				tags: ['angry', 'furious', 'rage']
			},
			{
				text: '(ノ°Д°）ノ',
				name: 'Table Flip',
				tags: ['angry', 'flip', 'rage']
			},
			{
				text: '(╯°□°）╯',
				name: 'Flipping Out',
				tags: ['angry', 'flip', 'rage']
			},
			{
				text: '(¬_¬)',
				name: 'Unimpressed',
				tags: ['unimpressed', 'annoyed', 'bored']
			},
			{
				text: '(¬‿¬)',
				name: 'Sarcastic',
				tags: ['sarcastic', 'smirk', 'knowing']
			},
			{ text: '눈_눈', name: 'Glaring', tags: ['glare', 'stare', 'annoyed'] },
			{ text: '(⋋▂⋌)', name: 'Furious', tags: ['furious', 'angry', 'mad'] },
			{
				text: '(҂◡_◡)',
				name: 'Creepy Angry',
				tags: ['creepy', 'angry', 'scary']
			},
			{
				text: 'ಠ╭╮ಠ',
				name: 'Sad Angry',
				tags: ['sad', 'angry', 'disappointed']
			},
			{
				text: '(╥﹏╥)',
				name: 'Crying Angry',
				tags: ['crying', 'angry', 'upset']
			}
		]
	},
	{
		id: 'cute',
		name: 'Cute & Kawaii',
		icon: <Heart className='w-4 h-4' />,
		emoticons: [
			{ text: 'Ƹ̵̡Ӝ̵̨̄Ʒ', name: 'Butterfly', tags: ['butterfly', 'cute', 'nature'] },
			{ text: '囧', name: 'Jiong', tags: ['jiong', 'embarrassed', 'awkward'] },
			{ text: '◕‿◕', name: 'Cute Smile', tags: ['cute', 'smile', 'happy'] },
			{ text: 'ó_ò', name: 'Puppy Eyes', tags: ['puppy', 'sad', 'cute'] },
			{
				text: '♪♫*•♪',
				name: 'Music Notes',
				tags: ['music', 'notes', 'singing']
			},
			{
				text: '(◡ ‿ ◡ ✿)',
				name: 'Flower Girl',
				tags: ['flower', 'cute', 'girl']
			},
			{ text: '(◕‿◕)♡', name: 'Love Eyes', tags: ['love', 'cute', 'heart'] },
			{
				text: '(｡♥‿♥｡)',
				name: 'Heart Eyes',
				tags: ['heart', 'love', 'cute']
			},
			{
				text: '(✿ ♥‿♥)',
				name: 'Flower Love',
				tags: ['flower', 'love', 'cute']
			},
			{ text: '٩(◕‿◕)۶', name: 'Hugging', tags: ['hug', 'cute', 'happy'] },
			{ text: '(◕ᴥ◕)', name: 'Animal Face', tags: ['animal', 'cute', 'pet'] },
			{ text: 'ʕ •́؈•̀ ₎', name: 'Bear Cub', tags: ['bear', 'cute', 'baby'] },
			{ text: '(｡◕‿◕｡)', name: 'Kawaii', tags: ['kawaii', 'cute', 'sweet'] },
			{
				text: '(◕‿◕✿)',
				name: 'Flower Cute',
				tags: ['flower', 'cute', 'happy']
			},
			{ text: '(ᵔᴥᵔ)', name: 'Puppy', tags: ['puppy', 'dog', 'cute'] },
			{ text: 'ʕ·͡ᴥ·ʔ', name: 'Bear Face', tags: ['bear', 'cute', 'animal'] },
			{ text: '(=^･ω･^=)', name: 'Cat Face', tags: ['cat', 'cute', 'kitty'] },
			{ text: '(=^･ｪ･^=)', name: 'Kitty', tags: ['kitty', 'cat', 'cute'] },
			{ text: '(^._.^)ﾉ', name: 'Cat Wave', tags: ['cat', 'wave', 'cute'] },
			{ text: '(･ω･)', name: 'Simple Cute', tags: ['cute', 'simple', 'kawaii'] }
		]
	},
	{
		id: 'special',
		name: 'Special & Misc',
		icon: <Laugh className='w-4 h-4' />,
		emoticons: [
			{
				text: '( ͡° ͜ʖ ͡°)',
				name: 'Lenny Face',
				tags: ['lenny', 'smirk', 'suggestive']
			},
			{
				text: '(͡ ͡° ͜ つ ͡͡°)',
				name: 'Winking Lenny',
				tags: ['lenny', 'wink', 'suggestive']
			},
			{
				text: '( ͡~ ͜ʖ ͡°)',
				name: 'Winking Lenny 2',
				tags: ['lenny', 'wink', 'flirty']
			},
			{
				text: '(☞ﾟヮﾟ)☞',
				name: 'Finger Guns',
				tags: ['finger', 'guns', 'cool']
			},
			{
				text: '☜(ﾟヮﾟ☜)',
				name: 'Finger Guns Left',
				tags: ['finger', 'guns', 'cool']
			},
			{
				text: '(☞ ͡° ͜ʖ ͡°)☞',
				name: 'Lenny Finger Guns',
				tags: ['lenny', 'finger', 'guns']
			},
			{
				text: '┬┴┬┴┤ ͜ʖ ͡°)',
				name: 'Hiding Lenny',
				tags: ['lenny', 'hiding', 'sneaky']
			},
			{
				text: '( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)',
				name: 'Multi Lenny',
				tags: ['lenny', 'multiple', 'crowd']
			},
			{
				text: '¯\\_( ͡° ͜ʖ ͡°)_/¯',
				name: 'Lenny Shrug',
				tags: ['lenny', 'shrug', 'whatever']
			},
			{
				text: '( ͡ʘ ͜ʖ ͡ʘ)',
				name: 'Wide Eyes Lenny',
				tags: ['lenny', 'surprised', 'wide']
			},
			{
				text: '(▰˘◡˘▰)',
				name: 'Sleeping',
				tags: ['sleeping', 'tired', 'rest']
			},
			{ text: '(¬‿¬ )', name: 'Smirking', tags: ['smirk', 'knowing', 'sly'] },
			{
				text: '(◔_◔)',
				name: 'Rolling Eyes',
				tags: ['rolling', 'eyes', 'annoyed']
			},
			{
				text: '⊙﹏⊙',
				name: 'Worried Eyes',
				tags: ['worried', 'concerned', 'nervous']
			},
			{ text: '◔̯◔', name: 'Unamused', tags: ['unamused', 'bored', 'meh'] },
			{
				text: '◉_◉',
				name: 'Staring',
				tags: ['staring', 'shocked', 'surprised']
			},
			{
				text: '(°ロ°) !',
				name: 'Shocked Face',
				tags: ['shocked', 'surprised', 'gasp']
			},
			{
				text: '(￣ω￣)',
				name: 'Satisfied',
				tags: ['satisfied', 'content', 'smug']
			},
			{ text: '(￣～￣)', name: 'Chewing', tags: ['chewing', 'eating', 'nom'] },
			{ text: '┐(´∀｀)┌', name: 'Whatever', tags: ['whatever', 'shrug', 'meh'] }
		]
	}
]

export default function TextEmoticonsPage() {
	const [mounted, setMounted] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('popular')
	const [recentEmoticons, setRecentEmoticons] = useState<string[]>([])
	const [copiedEmoticon, setCopiedEmoticon] = useState<string | null>(null)

	useEffect(() => {
		setMounted(true)
		// Load recent emoticons from localStorage
		const saved = localStorage.getItem('recentEmoticons')
		if (saved) {
			setRecentEmoticons(JSON.parse(saved))
		}
	}, [])

	const copyEmoticon = (emoticon: string) => {
		navigator.clipboard.writeText(emoticon)
		setCopiedEmoticon(emoticon)
		toast.success(`Copied ${emoticon} to clipboard!`)

		// Add to recent emoticons
		const newRecent = [
			emoticon,
			...recentEmoticons.filter(e => e !== emoticon)
		].slice(0, 20)
		setRecentEmoticons(newRecent)
		localStorage.setItem('recentEmoticons', JSON.stringify(newRecent))

		setTimeout(() => setCopiedEmoticon(null), 2000)
	}

	const getFilteredEmoticons = () => {
		if (!searchTerm) {
			return (
				emoticonCategories.find(cat => cat.id === selectedCategory)
					?.emoticons || []
			)
		}

		// Search across all categories by name and tags
		const allEmoticons = emoticonCategories.flatMap(cat => cat.emoticons)
		const searchLower = searchTerm.toLowerCase()
		return allEmoticons.filter(
			emoticon =>
				emoticon.name.toLowerCase().includes(searchLower) ||
				emoticon.tags.some(tag => tag.includes(searchLower)) ||
				emoticon.text.includes(searchTerm)
		)
	}

	const clearRecentEmoticons = () => {
		setRecentEmoticons([])
		localStorage.removeItem('recentEmoticons')
		toast.success('Recent emoticons cleared')
	}

	if (!mounted) {
		return (
			<div className='max-w-6xl mx-auto space-y-8'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight mb-2'>
						Text Emoticons
					</h1>
					<p className='text-muted-foreground'>
						ASCII emoticons and kaomoji for expressing emotions
					</p>
				</div>
				<div className='animate-pulse space-y-8'>
					<div className='h-96 bg-muted rounded-lg'></div>
				</div>
			</div>
		)
	}

	const filteredEmoticons = getFilteredEmoticons()

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Info Card */}
			<Card className='p-4 bg-muted/50'>
				<p className='text-sm text-muted-foreground'>
					<strong>Emoticon = Emotion + Icon.</strong> Also known as Kaomoji
					(顔文字) in Japanese. These text-based expressions use punctuation
					marks, letters, and numbers to represent facial expressions and
					emotions. The first documented emoticons :-) and :-( were used by
					Scott Fahlman in 1982.
				</p>
			</Card>

			{/* Search Bar */}
			<Card className='p-4'>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
					<Input
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						placeholder='Search emoticons by name or mood...'
						className='pl-10'
					/>
				</div>
			</Card>

			{/* Recent Emoticons */}
			{recentEmoticons.length > 0 && !searchTerm && (
				<Card className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<div className='flex items-center gap-2'>
							<Clock className='w-4 h-4 text-muted-foreground' />
							<h3 className='font-semibold'>Recently Used</h3>
							<Badge variant='secondary'>{recentEmoticons.length}</Badge>
						</div>
						<Button onClick={clearRecentEmoticons} variant='ghost' size='sm'>
							Clear
						</Button>
					</div>
					<div className='flex flex-wrap gap-2'>
						{recentEmoticons.map((emoticon, index) => (
							<Button
								key={`${emoticon}-${index}`}
								onClick={() => copyEmoticon(emoticon)}
								variant={copiedEmoticon === emoticon ? 'default' : 'outline'}
								className='font-mono text-sm px-3 py-2 h-auto'
							>
								{emoticon}
							</Button>
						))}
					</div>
				</Card>
			)}

			{/* Categories */}
			{!searchTerm && (
				<Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
					<TabsList className='grid grid-cols-3 lg:grid-cols-6 w-full'>
						{emoticonCategories.map(category => (
							<TabsTrigger
								key={category.id}
								value={category.id}
								className='text-xs'
							>
								<span className='flex items-center gap-1'>
									{category.icon}
									<span className='hidden sm:inline'>{category.name}</span>
								</span>
							</TabsTrigger>
						))}
					</TabsList>

					{emoticonCategories.map(category => (
						<TabsContent key={category.id} value={category.id} className='mt-6'>
							<Card className='p-6'>
								<h3 className='font-semibold mb-4 flex items-center gap-2'>
									{category.icon}
									{category.name}
									<Badge variant='secondary'>
										{category.emoticons.length} emoticons
									</Badge>
								</h3>
								<div className='grid gap-3'>
									{category.emoticons.map((emoticon, index) => (
										<div
											key={`${emoticon.text}-${index}`}
											className='flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors'
										>
											<Button
												onClick={() => copyEmoticon(emoticon.text)}
												variant={
													copiedEmoticon === emoticon.text ? 'default' : 'ghost'
												}
												size='sm'
												className='font-mono text-base px-4 py-2 h-auto min-w-[120px]'
											>
												{emoticon.text}
												{copiedEmoticon === emoticon.text && (
													<Check className='w-3 h-3 ml-2' />
												)}
											</Button>
											<div className='flex-1'>
												<p className='font-medium text-sm'>{emoticon.name}</p>
												<div className='flex flex-wrap gap-1 mt-1'>
													{emoticon.tags.map(tag => (
														<Badge
															key={tag}
															variant='outline'
															className='text-xs'
														>
															{tag}
														</Badge>
													))}
												</div>
											</div>
											<Button
												onClick={() => copyEmoticon(emoticon.text)}
												size='icon'
												variant='ghost'
												className='shrink-0'
											>
												<Copy className='w-4 h-4' />
											</Button>
										</div>
									))}
								</div>
							</Card>
						</TabsContent>
					))}
				</Tabs>
			)}

			{/* Search Results */}
			{searchTerm && (
				<Card className='p-6'>
					<h3 className='font-semibold mb-4'>
						Search Results
						<Badge variant='secondary' className='ml-2'>
							{filteredEmoticons.length} emoticons
						</Badge>
					</h3>
					{filteredEmoticons.length > 0 ? (
						<div className='grid gap-3'>
							{filteredEmoticons.map((emoticon, index) => (
								<div
									key={`${emoticon.text}-${index}`}
									className='flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors'
								>
									<Button
										onClick={() => copyEmoticon(emoticon.text)}
										variant={
											copiedEmoticon === emoticon.text ? 'default' : 'ghost'
										}
										size='sm'
										className='font-mono text-base px-4 py-2 h-auto min-w-[120px]'
									>
										{emoticon.text}
										{copiedEmoticon === emoticon.text && (
											<Check className='w-3 h-3 ml-2' />
										)}
									</Button>
									<div className='flex-1'>
										<p className='font-medium text-sm'>{emoticon.name}</p>
										<div className='flex flex-wrap gap-1 mt-1'>
											{emoticon.tags.map(tag => (
												<Badge key={tag} variant='outline' className='text-xs'>
													{tag}
												</Badge>
											))}
										</div>
									</div>
									<Button
										onClick={() => copyEmoticon(emoticon.text)}
										size='icon'
										variant='ghost'
										className='shrink-0'
									>
										<Copy className='w-4 h-4' />
									</Button>
								</div>
							))}
						</div>
					) : (
						<p className='text-center text-muted-foreground py-8'>
							No emoticons found for &quot;{searchTerm}&quot;
						</p>
					)}
				</Card>
			)}

			{/* Popular Emoticons Quick Reference */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>Quick Reference</h3>
				<div className='grid md:grid-cols-2 gap-4 text-sm'>
					<div>
						<h4 className='font-medium mb-2'>Most Popular</h4>
						<div className='space-y-1 font-mono'>
							<p>Lenny Face: ( ͡° ͜ʖ ͡°)</p>
							<p>Shrug: ¯\_(ツ)_/¯</p>
							<p>Table Flip: (╯°□°）╯︵ ┻━┻</p>
							<p>Disapproval: ಠ_ಠ</p>
							<p>Happy: (◕‿◕)</p>
						</div>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Emoticon Styles</h4>
						<ul className='space-y-1 text-muted-foreground'>
							<li>• Western style: Turn 90° to see the face :-)</li>
							<li>• Eastern style (Kaomoji): No rotation needed (^_^)</li>
							<li>• ASCII art: Uses special characters ¯\_(ツ)_/¯</li>
							<li>• Unicode: Includes special symbols ʕ•ᴥ•ʔ</li>
						</ul>
					</div>
				</div>
				<p className='text-xs mt-4 text-muted-foreground'>
					Pro tip: These emoticons work great in social media, chat apps,
					emails, and anywhere that supports Unicode text. Some complex
					emoticons may not display correctly on all platforms.
				</p>
			</Card>
		</div>
	)
}

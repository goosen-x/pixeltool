'use client'

import { useState } from 'react'
import { Copy, Check, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Symbol categories with their symbols
const symbolCategories = {
	popular: {
		name: 'Popular',
		symbols: [
			'ღ',
			'•',
			'⁂',
			'€',
			'™',
			'↑',
			'→',
			'↓',
			'⇝',
			'√',
			'∞',
			'░',
			'▲',
			'▶',
			'◀',
			'●',
			'☀',
			'☁',
			'☂',
			'☃',
			'☄',
			'★',
			'☆',
			'☉',
			'☐',
			'☑',
			'☚',
			'☛',
			'☜',
			'☝',
			'☞',
			'☟',
			'☠',
			'☢',
			'☣',
			'☪',
			'☮',
			'☯',
			'☸',
			'☹',
			'☺',
			'☻',
			'☼',
			'☽',
			'☾',
			'♔',
			'♕',
			'♖',
			'♗',
			'♘',
			'♚',
			'♛',
			'♜',
			'♝',
			'♞',
			'♟',
			'♡',
			'♨',
			'♩',
			'♪',
			'♫',
			'♬',
			'✈',
			'✉',
			'✎',
			'✓',
			'✔',
			'✘',
			'✚',
			'✞',
			'✟',
			'✠',
			'✡',
			'✦',
			'✧',
			'✩',
			'✪',
			'✮',
			'✯',
			'✹',
			'✿',
			'❀',
			'❁',
			'❂',
			'❄',
			'❅',
			'❆',
			'❝',
			'❞',
			'❣',
			'❤',
			'❥',
			'❦',
			'➤'
		]
	},
	chess: {
		name: 'Chess',
		symbols: ['♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟']
	},
	music: {
		name: 'Music',
		symbols: [
			'♩',
			'♪',
			'♫',
			'♬',
			'♭',
			'♮',
			'♯',
			'𝄞',
			'𝄡',
			'𝄢',
			'𝄪',
			'𝄫',
			'🎵',
			'🎶',
			'🎼',
			'𓏢'
		]
	},
	weather: {
		name: 'Weather',
		symbols: [
			'ϟ',
			'☀',
			'☁',
			'☂',
			'☃',
			'⛆',
			'⛇',
			'⛈︎',
			'☄',
			'☉',
			'☼',
			'☽',
			'☾',
			'♁',
			'♨',
			'❄',
			'❅',
			'❆',
			'༄',
			'࿓',
			'𐓷',
			'𐓏',
			'𖤓',
			'𖣔'
		]
	},
	business: {
		name: 'Business',
		symbols: ['©', '®', '℗', '℠', '™', '℡', '℻', '℀', '℁', '℅', '℆']
	},
	objects: {
		name: 'Objects',
		symbols: [
			'☏',
			'✁',
			'✂',
			'✃',
			'✄',
			'✆',
			'✇',
			'✈',
			'✉',
			'✎',
			'✏',
			'✐',
			'✑',
			'✒',
			'𓍝',
			'⚐',
			'⚑',
			'⚖',
			'⚗',
			'⚿',
			'⛟',
			'⛨',
			'⛫',
			'⛾',
			'⛿',
			'⎈',
			'࿄',
			'𖠦',
			'𖠿',
			'ꗃ',
			'𓄲',
			'𓊔',
			'𖤘',
			'𖣘',
			'߷',
			'𖠚',
			'𖠜',
			'𖡡',
			'𖥣',
			'𖥔',
			'𖥠',
			'⌖',
			'⊹',
			'𓊝',
			'𖠎',
			'𖡌',
			'𖣳',
			'𖤠',
			'𖥈',
			'𖥩',
			'𖧶',
			'ꚰ',
			'⛀',
			'⛁',
			'⛂',
			'⛃'
		]
	},
	technical: {
		name: 'Technical',
		symbols: [
			'⏎',
			'⇧',
			'⏏',
			'⌂',
			'⌘',
			'⎋',
			'⊞',
			'⌨',
			'↹',
			'⌥',
			'⌫',
			'⎗',
			'⎘',
			'⎙',
			'⎵',
			'⇥'
		]
	},
	zodiac: {
		name: 'Zodiac',
		symbols: [
			'♓',
			'♒',
			'♑',
			'♐',
			'♏',
			'♎',
			'♍',
			'♌',
			'♋',
			'♊',
			'♉',
			'♈',
			'☉',
			'☽',
			'☿',
			'♀'
		]
	},
	checkmarks: {
		name: 'Checkmarks',
		symbols: [
			'✓',
			'✔',
			'✖',
			'✗',
			'✘',
			'∛',
			'∜',
			'⍻',
			'☐',
			'☑',
			'☒',
			'□',
			'■',
			'○',
			'●',
			'༝',
			'྾',
			'∨',
			'🆅',
			'🆇',
			'🅥',
			'🅧',
			'⊗'
		]
	},
	cards: {
		name: 'Card Suits',
		symbols: ['♡', '♢', '♤', '♧', '♣', '♦', '♥', '♠']
	},
	dice: {
		name: 'Dice',
		symbols: ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
	},
	units: {
		name: 'Units',
		symbols: [
			'μ',
			'°',
			'℃',
			'℉',
			'㎍',
			'㎎',
			'㎏',
			'℥',
			'㏌',
			'㎚',
			'㎛',
			'㎜',
			'㎝',
			'㎞',
			'²',
			'³',
			'㎖',
			'㎗',
			'㎘',
			'㏄',
			'㏖',
			'㏒',
			'㎅',
			'㎆',
			'㎇',
			'㎈',
			'㎉',
			'㎐',
			'㎑',
			'㎒',
			'㎓',
			'㎾',
			'Ω',
			'㏑',
			'㏈',
			'㏐',
			'㏂',
			'㏘',
			'㎳',
			'㎭',
			'㏅',
			'㎪',
			'㏗',
			'′',
			'″'
		]
	},
	numbers: {
		name: 'Numbers',
		symbols: [
			'Ⅰ',
			'Ⅱ',
			'Ⅲ',
			'Ⅳ',
			'Ⅴ',
			'Ⅵ',
			'Ⅶ',
			'Ⅷ',
			'Ⅸ',
			'Ⅹ',
			'Ⅺ',
			'Ⅻ',
			'①',
			'②',
			'③',
			'④',
			'⑤',
			'⑥',
			'⑦',
			'⑧',
			'⑨',
			'⑩',
			'❶',
			'❷',
			'❸',
			'❹',
			'❺',
			'❻',
			'❼',
			'❽',
			'❾',
			'❿'
		]
	},
	punctuation: {
		name: 'Punctuation',
		symbols: [
			'˙',
			'‥',
			'‧',
			'‵',
			'、',
			'。',
			'﹐',
			'﹒',
			'﹔',
			'﹕',
			'！',
			'＃',
			'＄',
			'％',
			'＆',
			'＊',
			'，',
			'．',
			'：',
			'；',
			'？',
			'＠',
			'～',
			'•',
			'…',
			'·',
			'.',
			'ᐟ',
			'¡',
			'¿',
			'¦',
			'¨',
			'¯',
			'´',
			'·',
			'¸',
			'º',
			'‽',
			'‼',
			'⁏',
			'※',
			'†',
			'‡',
			'ˉ',
			'˘',
			'⁇',
			'⁈',
			'⁉',
			'ˆ',
			'⁊',
			'⸘',
			'№'
		]
	},
	brackets: {
		name: 'Brackets',
		symbols: [
			'〈',
			'〉',
			'《',
			'》',
			'「',
			'」',
			'『',
			'』',
			'【',
			'】',
			'〔',
			'〕',
			'︵',
			'︶',
			'︷',
			'︸',
			'︹',
			'︺',
			'︻',
			'︼',
			'︽',
			'︾',
			'︿',
			'﹀',
			'﹁',
			'﹂',
			'﹃',
			'﹄',
			'﹙',
			'﹚',
			'﹛',
			'﹜',
			'﹝',
			'﹞',
			'﹤',
			'﹥',
			'（',
			'）',
			'＜',
			'＞',
			'｛',
			'｝',
			'❬',
			'❭',
			'❮',
			'❯',
			'❰',
			'❱',
			'〖',
			'〗',
			'〘',
			'〙',
			'〚',
			'〛',
			'⟨',
			'⟩',
			'‹',
			'›',
			'«',
			'»',
			'｢',
			'｣'
		]
	},
	hearts: {
		name: 'Hearts & Love',
		symbols: [
			'♡',
			'♥',
			'❣',
			'❤',
			'❦',
			'❧',
			'❥',
			'☙',
			'დ',
			'ღ',
			'ო',
			'ᦂ',
			'ᦦ',
			'ʚ',
			'ɞ',
			'Ꮼ'
		]
	},
	hands: {
		name: 'Hands',
		symbols: [
			'☚',
			'☛',
			'☜',
			'☝',
			'☞',
			'☟',
			'✌',
			'𓂬',
			'𓂩',
			'𓂨',
			'𓂷',
			'𓂭',
			'𓂝',
			'𓂡',
			'𓂦',
			'𓃈',
			'⍝'
		]
	},
	religious: {
		name: 'Religious',
		symbols: [
			'☤',
			'☥',
			'☪',
			'☫',
			'☬',
			'☮',
			'☭',
			'☯',
			'☸',
			'☽',
			'☾',
			'♰',
			'♱',
			'⚚',
			'✡',
			'卍',
			'﷽',
			'✵',
			'ૐ',
			'𓉴',
			'𓉸',
			'۞',
			'࿊',
			'۩',
			'࿅',
			'࿉',
			'࿈'
		]
	},
	crosses: {
		name: 'Christian Crosses',
		symbols: [
			'✝',
			'✞',
			'✠',
			'☦',
			'✙',
			'✜',
			'✟',
			'✚',
			'☧',
			'☨',
			'☩',
			'✛',
			'✢',
			'⛪',
			'†',
			'⚜'
		]
	},
	stars: {
		name: 'Stars',
		symbols: [
			'★',
			'☆',
			'✡',
			'✦',
			'✧',
			'⌑',
			'✩',
			'✪',
			'⍟',
			'❂',
			'✫',
			'✬',
			'✭',
			'✮',
			'✯',
			'✰',
			'☪',
			'⚝',
			'⛤',
			'⛥',
			'⛦',
			'⛧',
			'⍣',
			'⋆',
			'≛',
			'𓇼',
			'𓇻',
			'𓇽',
			'꙳',
			'⭑',
			'⭒',
			'𖤐',
			'𖣔',
			'⟡',
			'⟢',
			'⟣',
			'⊹'
		]
	},
	flowers: {
		name: 'Flowers',
		symbols: [
			'✻',
			'✼',
			'✾',
			'✿',
			'❀',
			'❁',
			'❃',
			'❇',
			'❈',
			'❉',
			'❊',
			'✢',
			'✣',
			'✤',
			'✥',
			'⚜',
			'ꕥ',
			'𓇬',
			'⚘',
			'𓆸',
			'𓆹',
			'𓆼',
			'𓇊',
			'𓇚',
			'𓇕',
			'𓇗',
			'𓋇',
			'𓁙',
			'𓁋',
			'֍',
			'֎',
			'𓆭',
			'𓆰',
			'𓆱',
			'𓇋',
			'𓇑',
			'𓇛',
			'𓇟',
			'𓇣',
			'𖧷',
			'ꕤ',
			'𑁍',
			'᪥',
			'𖠁',
			'𖠇',
			'𖤣',
			'𖤥',
			'𖡗',
			'𖢨',
			'𖣶',
			'𖦞',
			'𖧧',
			'༗',
			'𖣂',
			'𖠺',
			'𖠻',
			'𓄟',
			'𖢔',
			'𐌙',
			'𐊵',
			'𐡘',
			'𐡙',
			'𐡚',
			'꧁',
			'꧂',
			'𒂭'
		]
	},
	arrows: {
		name: 'Arrows',
		symbols: [
			'←',
			'↑',
			'→',
			'↓',
			'↔',
			'↕',
			'↖',
			'↗',
			'↘',
			'↙',
			'⇐',
			'⇑',
			'⇒',
			'⇓',
			'⇔',
			'⇕',
			'⇖',
			'⇗',
			'⇘',
			'⇙',
			'⬅',
			'⬆',
			'⬇',
			'➡',
			'⬈',
			'⬉',
			'⬊',
			'⬋',
			'⬌',
			'⬍',
			'⮕',
			'➔',
			'➘',
			'➙',
			'➚',
			'➛',
			'➜',
			'➝',
			'➞',
			'➟',
			'➠',
			'➤',
			'➥',
			'➦',
			'➧',
			'➨',
			'➩',
			'➪',
			'➫',
			'➬',
			'➭',
			'➮',
			'➯',
			'➱',
			'➲',
			'➳',
			'➴',
			'➵',
			'➶',
			'➷',
			'➸',
			'➹',
			'➺',
			'➻',
			'➼',
			'➽',
			'➾'
		]
	},
	squares: {
		name: 'Squares',
		symbols: [
			'∎',
			'⊞',
			'⊟',
			'⊠',
			'⊡',
			'▀',
			'▁',
			'▂',
			'▃',
			'▄',
			'▅',
			'▆',
			'▇',
			'█',
			'▉',
			'▊',
			'▋',
			'▌',
			'▍',
			'▎',
			'▏',
			'▐',
			'░',
			'▒',
			'▓',
			'▔',
			'■',
			'□',
			'▢',
			'▣',
			'▤',
			'▥',
			'▦',
			'▧',
			'▨',
			'▩',
			'▪',
			'▫',
			'▬',
			'▭',
			'▮',
			'▯',
			'◘',
			'◙',
			'◚',
			'◛',
			'◧',
			'◨',
			'◩',
			'◪',
			'◫',
			'❏',
			'❐',
			'❑',
			'❒',
			'❘',
			'❙',
			'❚'
		]
	},
	triangles: {
		name: 'Triangles',
		symbols: [
			'⊿',
			'▲',
			'△',
			'▴',
			'▵',
			'▶',
			'▷',
			'▸',
			'▹',
			'►',
			'▻',
			'▼',
			'▽',
			'▾',
			'▿',
			'◀',
			'◁',
			'◂',
			'◃',
			'◄',
			'◅',
			'◢',
			'◣',
			'◤',
			'◥',
			'◬',
			'◭',
			'◮',
			'◸',
			'◹',
			'◺',
			'◿',
			'∇',
			'∆',
			'𓇮',
			'⫷',
			'⫸'
		]
	},
	circles: {
		name: 'Circles',
		symbols: [
			'⊖',
			'⊘',
			'⊙',
			'⊚',
			'⊛',
			'⊜',
			'⊝',
			'◉',
			'○',
			'◌',
			'◍',
			'◎',
			'●',
			'◐',
			'◑',
			'◒'
		]
	},
	math: {
		name: 'Math',
		symbols: [
			'±',
			'∓',
			'×',
			'÷',
			'∶',
			'…',
			'≤',
			'≥',
			'≠',
			'√',
			'∛',
			'∜',
			'∑',
			'∏',
			'∞',
			'♾',
			'ℕ',
			'ℤ',
			'ℚ',
			'ℝ',
			'ℂ',
			'α',
			'β',
			'γ',
			'δ',
			'ε',
			'μ',
			'φ',
			'π',
			'σ',
			'θ',
			'∈',
			'∉',
			'∅',
			'∫',
			'∬',
			'∭',
			'∮',
			'∯',
			'∂',
			'∆',
			'∇',
			'≈',
			'≅',
			'≡',
			'≟',
			'∝',
			'∠'
		]
	},
	fractions: {
		name: 'Fractions',
		symbols: [
			'½',
			'⅓',
			'⅔',
			'¼',
			'¾',
			'⅕',
			'⅖',
			'⅗',
			'⅘',
			'⅙',
			'⅚',
			'⅐',
			'⅛',
			'⅜',
			'⅝',
			'⅞',
			'⅑',
			'⅒',
			'↉',
			'⅟'
		]
	},
	superscript: {
		name: 'Superscript',
		symbols: [
			'⁰',
			'¹',
			'²',
			'³',
			'⁴',
			'⁵',
			'⁶',
			'⁷',
			'⁸',
			'⁹',
			'⁺',
			'⁻',
			'⁼',
			'⁽',
			'⁾',
			'ⁿ'
		]
	},
	greek: {
		name: 'Greek',
		symbols: [
			'Α',
			'Β',
			'Γ',
			'Δ',
			'Ε',
			'Ζ',
			'Η',
			'Θ',
			'Ι',
			'Κ',
			'Λ',
			'Μ',
			'Ν',
			'Ξ',
			'Ο',
			'Π',
			'Ρ',
			'Σ',
			'Τ',
			'Υ',
			'Φ',
			'Χ',
			'Ψ',
			'Ω',
			'α',
			'β',
			'γ',
			'δ',
			'ε',
			'ζ',
			'η',
			'θ',
			'ι',
			'κ',
			'λ',
			'μ',
			'ν',
			'ξ',
			'ο',
			'π',
			'ρ',
			'ς',
			'σ',
			'τ',
			'υ',
			'φ',
			'χ',
			'ψ',
			'ω'
		]
	},
	currency: {
		name: 'Currency',
		symbols: [
			'$',
			'¢',
			'€',
			'£',
			'¥',
			'₩',
			'₽',
			'₹',
			'¤',
			'₱',
			'₦',
			'ƒ',
			'₮',
			'৲',
			'৳',
			'₨',
			'௹',
			'฿',
			'៛',
			'₪',
			'₫',
			'₭',
			'₲',
			'₴',
			'₵',
			'﷼',
			'≋',
			'₿',
			'Ł',
			'Ð',
			'₳'
		]
	}
}

// Recently used symbols storage
const STORAGE_KEY = 'recently-used-symbols'
const MAX_RECENT = 30

export default function SpecialSymbolsPickerPage() {
	const [searchQuery, setSearchQuery] = useState('')
	const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null)
	const [recentSymbols, setRecentSymbols] = useState<string[]>(() => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem(STORAGE_KEY)
			return stored ? JSON.parse(stored) : []
		}
		return []
	})

	const copySymbol = (symbol: string) => {
		navigator.clipboard
			.writeText(symbol)
			.then(() => {
				setCopiedSymbol(symbol)
				toast.success(`Symbol "${symbol}" copied to clipboard`)

				// Update recent symbols
				const newRecent = [
					symbol,
					...recentSymbols.filter(s => s !== symbol)
				].slice(0, MAX_RECENT)
				setRecentSymbols(newRecent)
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecent))

				setTimeout(() => setCopiedSymbol(null), 2000)
			})
			.catch(() => {
				toast.error('Failed to copy symbol')
			})
	}

	const clearRecent = () => {
		setRecentSymbols([])
		localStorage.removeItem(STORAGE_KEY)
		toast.success('Recently used symbols cleared')
	}

	// Filter symbols based on search
	const filteredCategories = Object.entries(symbolCategories).reduce(
		(acc, [key, category]) => {
			if (!searchQuery) {
				(acc as any)[key] = category
			} else {
				const filteredSymbols = category.symbols.filter(
					symbol =>
						symbol.includes(searchQuery) ||
						category.name.toLowerCase().includes(searchQuery.toLowerCase())
				)
				if (filteredSymbols.length > 0) {
					(acc as any)[key] = { ...category, symbols: filteredSymbols }
				}
			}
			return acc
		},
		{} as typeof symbolCategories
	)

	const SymbolButton = ({ symbol }: { symbol: string }) => (
		<button
			onClick={() => copySymbol(symbol)}
			className={cn(
				'relative group p-3 rounded-lg border transition-all',
				'hover:bg-accent hover:border-accent hover:scale-110',
				'focus:outline-none focus:ring-2 focus:ring-accent',
				copiedSymbol === symbol
					? 'bg-green-500/10 border-green-500'
					: 'bg-card border-border'
			)}
			title={`Click to copy: ${symbol}`}
		>
			<span className='text-2xl block'>{symbol}</span>
			<div
				className={cn(
					'absolute inset-0 rounded-lg flex items-center justify-center',
					'bg-background/90 transition-opacity',
					copiedSymbol === symbol ? 'opacity-100' : 'opacity-0'
				)}
			>
				<Check className='w-4 h-4 text-green-500' />
			</div>
		</button>
	)

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Search */}
			<div className='relative'>
				<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
				<Input
					placeholder='Search symbols...'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					className='pl-10'
				/>
			</div>

			{/* Recently Used */}
			{recentSymbols.length > 0 && !searchQuery && (
				<Card className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-lg font-semibold'>Recently Used</h2>
						<Button variant='ghost' size='sm' onClick={clearRecent}>
							Clear
						</Button>
					</div>
					<div className='grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 gap-2'>
						{recentSymbols.map((symbol, index) => (
							<SymbolButton key={`${symbol}-${index}`} symbol={symbol} />
						))}
					</div>
				</Card>
			)}

			{/* Categories */}
			<Tabs defaultValue='popular' className='space-y-4'>
				<TabsList className='w-full flex-wrap h-auto p-1 gap-1'>
					{Object.entries(filteredCategories).map(([key, category]) => (
						<TabsTrigger
							key={key}
							value={key}
							className='data-[state=active]:bg-accent data-[state=active]:text-accent-foreground'
						>
							{category.name}
						</TabsTrigger>
					))}
				</TabsList>

				{Object.entries(filteredCategories).map(([key, category]) => (
					<TabsContent key={key} value={key} className='mt-4'>
						<Card className='p-6'>
							<h2 className='text-lg font-semibold mb-4'>
								{category.name} Symbols
							</h2>
							<div className='grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 gap-2'>
								{category.symbols.map((symbol, index) => (
									<SymbolButton key={`${symbol}-${index}`} symbol={symbol} />
								))}
							</div>
						</Card>
					</TabsContent>
				))}
			</Tabs>

			{/* Info */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-2'>How to Use</h3>
				<ul className='space-y-1 text-sm text-muted-foreground'>
					<li>• Click any symbol to copy it to your clipboard</li>
					<li>• Recently used symbols appear at the top for quick access</li>
					<li>• Use the search bar to find specific symbols</li>
					<li>• Symbols work in any application that supports Unicode</li>
				</ul>
			</Card>
		</div>
	)
}

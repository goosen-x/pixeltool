import {
	Type,
	Code2,
	Hash,
	FileText,
	Braces,
	Slash,
	Minus,
	Shuffle,
	RotateCcw,
	Zap,
	Sparkles,
	Binary,
	GitBranch,
	Terminal,
	FileCode,
	Brackets
} from 'lucide-react'

export type CaseType =
	| 'uppercase'
	| 'lowercase'
	| 'capitalize'
	| 'title'
	| 'sentence'
	| 'camelCase'
	| 'PascalCase'
	| 'snake_case'
	| 'kebab-case'
	| 'CONSTANT_CASE'
	| 'dot.case'
	| 'path/case'
	| 'Header-Case'
	| 'Train-Case'
	| 'alternating'
	| 'inverse'
	| 'reverse'
	| 'sponge'

export interface CaseConfig {
	type: CaseType
	icon: React.ReactNode
	gradient: string
	category: 'basic' | 'programming' | 'special'
}

export const caseConfigs: Record<CaseType, CaseConfig> = {
	uppercase: {
		type: 'uppercase',
		icon: <Type className='w-4 h-4' />,
		gradient: 'from-blue-400 to-blue-600',
		category: 'basic'
	},
	lowercase: {
		type: 'lowercase',
		icon: <Type className='w-4 h-4' />,
		gradient: 'from-green-400 to-green-600',
		category: 'basic'
	},
	capitalize: {
		type: 'capitalize',
		icon: <FileText className='w-4 h-4' />,
		gradient: 'from-purple-400 to-purple-600',
		category: 'basic'
	},
	title: {
		type: 'title',
		icon: <FileText className='w-4 h-4' />,
		gradient: 'from-pink-400 to-pink-600',
		category: 'basic'
	},
	sentence: {
		type: 'sentence',
		icon: <FileText className='w-4 h-4' />,
		gradient: 'from-indigo-400 to-indigo-600',
		category: 'basic'
	},
	camelCase: {
		type: 'camelCase',
		icon: <Code2 className='w-4 h-4' />,
		gradient: 'from-yellow-400 to-yellow-600',
		category: 'programming'
	},
	PascalCase: {
		type: 'PascalCase',
		icon: <Code2 className='w-4 h-4' />,
		gradient: 'from-orange-400 to-orange-600',
		category: 'programming'
	},
	snake_case: {
		type: 'snake_case',
		icon: <Minus className='w-4 h-4' />,
		gradient: 'from-teal-400 to-teal-600',
		category: 'programming'
	},
	'kebab-case': {
		type: 'kebab-case',
		icon: <Minus className='w-4 h-4' />,
		gradient: 'from-cyan-400 to-cyan-600',
		category: 'programming'
	},
	CONSTANT_CASE: {
		type: 'CONSTANT_CASE',
		icon: <Hash className='w-4 h-4' />,
		gradient: 'from-red-400 to-red-600',
		category: 'programming'
	},
	'dot.case': {
		type: 'dot.case',
		icon: <Binary className='w-4 h-4' />,
		gradient: 'from-emerald-400 to-emerald-600',
		category: 'programming'
	},
	'path/case': {
		type: 'path/case',
		icon: <Slash className='w-4 h-4' />,
		gradient: 'from-lime-400 to-lime-600',
		category: 'programming'
	},
	'Header-Case': {
		type: 'Header-Case',
		icon: <FileCode className='w-4 h-4' />,
		gradient: 'from-violet-400 to-violet-600',
		category: 'programming'
	},
	'Train-Case': {
		type: 'Train-Case',
		icon: <GitBranch className='w-4 h-4' />,
		gradient: 'from-fuchsia-400 to-fuchsia-600',
		category: 'programming'
	},
	alternating: {
		type: 'alternating',
		icon: <Shuffle className='w-4 h-4' />,
		gradient: 'from-rose-400 to-rose-600',
		category: 'special'
	},
	inverse: {
		type: 'inverse',
		icon: <RotateCcw className='w-4 h-4' />,
		gradient: 'from-amber-400 to-amber-600',
		category: 'special'
	},
	reverse: {
		type: 'reverse',
		icon: <RotateCcw className='w-4 h-4' />,
		gradient: 'from-stone-400 to-stone-600',
		category: 'special'
	},
	sponge: {
		type: 'sponge',
		icon: <Sparkles className='w-4 h-4' />,
		gradient: 'from-sky-400 via-purple-400 to-pink-400',
		category: 'special'
	}
}

export const categories = {
	basic: 'Basic Cases',
	programming: 'Programming',
	special: 'Special'
}

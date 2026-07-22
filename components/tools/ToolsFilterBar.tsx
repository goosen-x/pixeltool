'use client'

import { Grid3X3, List, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { DifficultyBars } from './DifficultyBars'
import { FavoritesToolsSection } from './FavoritesToolsSection'
import type { Widget } from '@/lib/constants/widgets'

export type SortOption = 'default' | 'alpha' | 'difficulty' | 'popularity'

export const DIFFICULTY_LABELS: Record<
	NonNullable<Widget['difficulty']>,
	string
> = {
	beginner: 'Простой',
	intermediate: 'Средний',
	advanced: 'Сложный'
}

const SORT_LABELS: Record<SortOption, string> = {
	default: 'По умолчанию',
	alpha: 'По алфавиту',
	difficulty: 'По сложности',
	popularity: 'Популярность'
}

interface Props {
	found: number
	search: string
	onSearchChange: (query: string) => void
	viewMode: 'grid' | 'list'
	onViewModeChange: (mode: 'grid' | 'list') => void
	selectedDifficulty: string[]
	onDifficultyChange: (difficulty: string[]) => void
	sort: SortOption
	onSortChange: (sort: SortOption) => void
}

/**
 * Сайдбар с фильтром по сложности и сортировкой — работает на месте, без
 * перехода на другой URL. Категорию сюда не добавляем: чипсы в CategoryHero
 * уже её выбирают (ссылкой на отдельную SEO-страницу), второй такой же по
 * смыслу контрол рядом был бы дублем.
 */
export function ToolsFilterBar({
	found,
	search,
	onSearchChange,
	viewMode,
	onViewModeChange,
	selectedDifficulty,
	onDifficultyChange,
	sort,
	onSortChange
}: Props) {
	const hasActiveFilters = selectedDifficulty.length > 0

	return (
		<aside className='w-full shrink-0 space-y-6 rounded-2xl border border-border/50 bg-muted/40 p-4 lg:sticky lg:top-24 lg:w-44'>
			<FavoritesToolsSection />

			<div>
				<div className='flex items-center justify-between gap-2'>
					<span className='text-sm text-muted-foreground'>
						Найдено: {found}
					</span>
					{search !== '' && (
						<Button
							variant='ghost'
							size='sm'
							onClick={() => onSearchChange('')}
							className='h-7 cursor-pointer px-2'
						>
							<X className='mr-1 h-3 w-3' />
							Очистить
						</Button>
					)}
				</div>

				<div className='mt-3 flex items-center gap-1'>
					<Button
						variant={viewMode === 'grid' ? 'default' : 'ghost'}
						size='sm'
						onClick={() => onViewModeChange('grid')}
						aria-pressed={viewMode === 'grid'}
						aria-label='Плиткой'
						title='Плиткой'
						className={cn(
							'h-9 flex-1 cursor-pointer px-0',
							viewMode !== 'grid' && 'hover:!bg-primary/10 hover:!text-primary'
						)}
					>
						<Grid3X3 className='h-4 w-4' />
					</Button>
					<Button
						variant={viewMode === 'list' ? 'default' : 'ghost'}
						size='sm'
						onClick={() => onViewModeChange('list')}
						aria-pressed={viewMode === 'list'}
						aria-label='Списком'
						title='Списком'
						className={cn(
							'h-9 flex-1 cursor-pointer px-0',
							viewMode !== 'list' && 'hover:!bg-primary/10 hover:!text-primary'
						)}
					>
						<List className='h-4 w-4' />
					</Button>
				</div>
			</div>

			<div>
				<p className='mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
					Сложность
				</p>
				<div className='flex items-center gap-1.5'>
					{(
						Object.keys(DIFFICULTY_LABELS) as Array<
							keyof typeof DIFFICULTY_LABELS
						>
					).map(key => {
						const active = selectedDifficulty.includes(key)
						return (
							<button
								key={key}
								type='button'
								onClick={() => onDifficultyChange(active ? [] : [key])}
								aria-pressed={active}
								aria-label={DIFFICULTY_LABELS[key]}
								title={DIFFICULTY_LABELS[key]}
								className={cn(
									'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition-colors',
									active
										? 'border-primary bg-primary text-primary-foreground'
										: 'border-border bg-background text-foreground hover:border-primary/50'
								)}
							>
								<DifficultyBars level={key} className='h-4 w-4' />
							</button>
						)
					})}
				</div>
			</div>

			<div>
				<p className='mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
					Сортировка
				</p>
				<Select
					value={sort}
					onValueChange={value => onSortChange(value as SortOption)}
				>
					<SelectTrigger className='w-full text-xs'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{(Object.keys(SORT_LABELS) as SortOption[]).map(key => (
							<SelectItem key={key} value={key}>
								{SORT_LABELS[key]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{hasActiveFilters && (
				<button
					type='button'
					onClick={() => onDifficultyChange([])}
					className='cursor-pointer text-xs font-medium text-muted-foreground underline-offset-2 hover:text-primary hover:underline'
				>
					Сбросить фильтры
				</button>
			)}
		</aside>
	)
}

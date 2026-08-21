'use client'

import { Grid3X3, List, Loader2, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Widget } from '@/lib/constants/widgets'

export type SortOption = 'default' | 'alpha' | 'difficulty' | 'views' | 'rating'

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
	views: 'По просмотрам',
	rating: 'По оценке'
}

interface Props {
	found: number
	search: string
	onSearchChange: (query: string) => void
	isSearching: boolean
	viewMode: 'grid' | 'list'
	onViewModeChange: (mode: 'grid' | 'list') => void
	sort: SortOption
	onSortChange: (sort: SortOption) => void
}

/**
 * Панель над карточками каталога: поиск, счётчик найденного, переключатель
 * вида и сортировка. Категорию сюда не добавляем: чипсы в CategoryHero уже её
 * выбирают (ссылкой на отдельную SEO-страницу), второй такой же по смыслу
 * контрол рядом был бы дублем.
 *
 * Только sm+ — на мобильном её место занимает `MobileCatalogHeader` со своей
 * раскладкой (заголовок/поиск/фильтры/сортировка/описание одной колонкой).
 */
export function ToolsFilterBar({
	found,
	search,
	onSearchChange,
	isSearching,
	viewMode,
	onViewModeChange,
	sort,
	onSortChange
}: Props) {
	return (
		<div className='sticky top-[var(--chrome-h,5rem)] z-30 hidden flex-wrap items-center gap-3 rounded-2xl border border-border/50 bg-background/90 p-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 sm:flex'>
			<span className='shrink-0 text-sm text-muted-foreground'>
				Найдено: {found}
			</span>

			<div className='relative mx-auto w-full max-w-md flex-1'>
				<Search className='pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground' />
				<Input
					value={search}
					onChange={event => onSearchChange(event.target.value)}
					placeholder='Поиск инструментов…'
					aria-label='Поиск инструментов'
					className='h-10 rounded-xl border-border/50 bg-background pl-11 pr-11'
				/>
				{isSearching ? (
					<Loader2
						aria-hidden
						className='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground'
					/>
				) : (
					search && (
						<Button
							variant='ghost'
							size='sm'
							onClick={() => onSearchChange('')}
							aria-label='Очистить поиск'
							className='absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 cursor-pointer p-1'
						>
							<X className='h-4 w-4' />
						</Button>
					)
				)}
			</div>

			{/* Экранный диктор не видит спиннер — сообщаем результат словами */}
			<span className='sr-only' role='status' aria-live='polite'>
				{isSearching ? 'Идёт поиск' : `Найдено инструментов: ${found}`}
			</span>

			<div className='flex shrink-0 items-center gap-3'>
				<div className='flex items-center gap-1'>
					<Button
						variant={viewMode === 'grid' ? 'default' : 'ghost'}
						size='sm'
						onClick={() => onViewModeChange('grid')}
						aria-pressed={viewMode === 'grid'}
						aria-label='Плиткой'
						title='Плиткой'
						className={cn(
							'h-9 w-9 cursor-pointer px-0',
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
							'h-9 w-9 cursor-pointer px-0',
							viewMode !== 'list' && 'hover:!bg-primary/10 hover:!text-primary'
						)}
					>
						<List className='h-4 w-4' />
					</Button>
				</div>

				<Select
					value={sort}
					onValueChange={value => onSortChange(value as SortOption)}
				>
					<SelectTrigger className='w-44 text-xs'>
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
		</div>
	)
}

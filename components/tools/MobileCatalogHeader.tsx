'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	ArrowUpDown,
	Loader2,
	ListFilter,
	RotateCcw,
	Search,
	X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle
} from '@/components/ui/drawer'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { CATEGORY_META } from '@/lib/constants/categories'
import { CategoryChipsNav } from '@/components/tools/CategoryChipsNav'
import { cn } from '@/lib/utils'
import type { SortOption } from '@/components/tools/ToolsFilterBar'

const SORT_LABELS: Record<SortOption, string> = {
	default: 'По умолчанию',
	alpha: 'По алфавиту',
	difficulty: 'По сложности',
	views: 'По просмотрам',
	rating: 'По оценке'
}

interface Props {
	category: string
	search: string
	onSearchChange: (query: string) => void
	isSearching: boolean
	found: number
	viewMode: 'grid' | 'list'
	onViewModeChange: (mode: 'grid' | 'list') => void
	sort: SortOption
	onSortChange: (sort: SortOption) => void
}

/**
 * Мобильная замена связки «CategoryHero + ToolsFilterBar» (обе спрятаны
 * `sm:hidden`/`hidden sm:block` у себя). На узком экране заголовок и поиск с
 * фильтрами не помещаются рядом, поэтому раскладка своя, одной колонкой:
 * заголовок → поиск + категории → сортировка + сброс → описание.
 *
 * Категории раскрываются CSS-панелью, а не `Drawer` — чипсы это настоящие
 * ссылки на SEO-страницы категорий (см. `CategoryChipsNav`), и `Drawer`
 * (vaul) не рендерит содержимое, пока не открыт: ссылки пропали бы из DOM
 * мобильной версии страницы для краулера. Сортировка такой проблемы не
 * несёт (не ссылки, просто UI-состояние) — она в обычном `Drawer`.
 */
export function MobileCatalogHeader({
	category,
	search,
	onSearchChange,
	isSearching,
	found,
	viewMode,
	onViewModeChange,
	sort,
	onSortChange
}: Props) {
	const router = useRouter()
	const [categoriesOpen, setCategoriesOpen] = useState(false)
	const [sortOpen, setSortOpen] = useState(false)

	const meta =
		CATEGORY_META[category as keyof typeof CATEGORY_META] ?? CATEGORY_META['']

	const isFiltered =
		search !== '' ||
		sort !== 'default' ||
		viewMode !== 'grid' ||
		category !== ''

	// Категория — не клиентское состояние, а отдельная SEO-страница (см.
	// CategoryChipsNav), поэтому «сброс» для нёе — это переход на /tools, а не
	// смена пропа на месте.
	function clearFilters() {
		onSearchChange('')
		onSortChange('default')
		onViewModeChange('grid')
		if (category !== '') router.push('/tools')
	}

	return (
		<div className='flex flex-col gap-4 sm:hidden'>
			<h1 className='text-balance text-3xl font-bold leading-tight tracking-tight'>
				{meta.heading}
			</h1>

			<div className='relative'>
				<Search className='pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground' />
				<Input
					value={search}
					onChange={event => onSearchChange(event.target.value)}
					placeholder='Поиск инструментов…'
					aria-label='Поиск инструментов'
					className='h-11 rounded-xl border-border/50 bg-background pl-11 pr-11'
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

			<div className='flex items-center gap-2'>
				<Button
					variant={categoriesOpen ? 'default' : 'outline'}
					size='icon'
					onClick={() => setCategoriesOpen(open => !open)}
					aria-expanded={categoriesOpen}
					aria-label='Категории'
					title='Категории'
					className='h-11 w-11 shrink-0 cursor-pointer rounded-xl'
				>
					<ListFilter className='h-4 w-4' />
				</Button>

				<Button
					variant='outline'
					size='icon'
					onClick={() => setSortOpen(true)}
					aria-label='Сортировка и вид'
					title='Сортировка и вид'
					className='h-11 w-11 shrink-0 cursor-pointer rounded-xl'
				>
					<ArrowUpDown className='h-4 w-4' />
				</Button>

				{isFiltered && (
					<Button
						variant='ghost'
						size='sm'
						onClick={clearFilters}
						className='cursor-pointer gap-2 text-muted-foreground'
					>
						Очистить фильтры
						<RotateCcw className='h-4 w-4' />
					</Button>
				)}
			</div>

			{/* Всегда в DOM — только визуально сворачивается, ссылки видны краулеру */}
			<CategoryChipsNav
				category={category}
				className={cn(
					'overflow-hidden transition-[max-height,opacity] duration-300',
					categoriesOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
				)}
			/>

			<span className='sr-only' role='status' aria-live='polite'>
				{isSearching ? 'Идёт поиск' : `Найдено инструментов: ${found}`}
			</span>

			<p className='text-base leading-relaxed text-muted-foreground'>
				{meta.description}
			</p>

			<Drawer open={sortOpen} onOpenChange={setSortOpen}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Сортировка и вид</DrawerTitle>
					</DrawerHeader>
					<div className='flex flex-col gap-6 p-4'>
						<div className='flex flex-col gap-2'>
							<span className='text-sm font-medium'>Вид отображения</span>
							<div className='flex items-center gap-1'>
								<Button
									variant={viewMode === 'grid' ? 'default' : 'outline'}
									onClick={() => onViewModeChange('grid')}
									aria-pressed={viewMode === 'grid'}
									className='h-11 flex-1 cursor-pointer gap-2'
								>
									Плиткой
								</Button>
								<Button
									variant={viewMode === 'list' ? 'default' : 'outline'}
									onClick={() => onViewModeChange('list')}
									aria-pressed={viewMode === 'list'}
									className='h-11 flex-1 cursor-pointer gap-2'
								>
									Списком
								</Button>
							</div>
						</div>
						<div className='flex flex-col gap-2'>
							<span className='text-sm font-medium'>Сортировка</span>
							<Select
								value={sort}
								onValueChange={value => onSortChange(value as SortOption)}
							>
								<SelectTrigger className='w-full text-sm'>
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
					<DrawerFooter>
						<DrawerClose asChild>
							<Button className='cursor-pointer'>Готово</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	)
}

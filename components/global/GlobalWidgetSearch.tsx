'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Search,
	Command,
	ArrowRight,
	Hash,
	Star,
	Clock,
	Sparkles
} from 'lucide-react'
import {
	publicWidgets,
	widgetCategories,
	type Widget
} from '@/lib/constants/widgets'
import { toolsCountLabel } from '@/lib/utils/pluralize'
import { searchWidgets } from '@/lib/utils/widget-search'
import { useSearchHistory } from '@/lib/hooks/useSearchHistory'
import { useFavorites } from '@/lib/hooks/useFavorites'
import { highlightText } from '@/lib/utils/highlightText'
import { cn } from '@/lib/utils'
import { YandexGoals } from '@/lib/analytics/yandex-goals'

interface GlobalWidgetSearchProps {
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function GlobalWidgetSearch({
	open: controlledOpen,
	onOpenChange
}: GlobalWidgetSearchProps) {
	const router = useRouter()
	const [internalOpen, setInternalOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedIndex, setSelectedIndex] = useState(0)

	// Use controlled state if provided, otherwise use internal state
	const open = controlledOpen !== undefined ? controlledOpen : internalOpen
	const setOpen = onOpenChange || setInternalOpen

	// const searchT = useTranslations('widgets.search')
	const { history, addToHistory } = useSearchHistory()
	const { favorites } = useFavorites()

	// Данные берём из реестра виджетов: заголовок, описание и категория живут
	// там и там же поддерживаются. Раньше здесь лежали два словаря по
	// translationKey на 60 ключей, из-за чего 103 инструмента из 119
	// показывались сырым ключом («tvSize» вместо «Калькулятор размеров
	// телевизора») и не находились ни по одному русскому слову.
	const searchableWidgets = useMemo(() => {
		return publicWidgets.map(widget => ({
			widget,
			title: widget.title ?? widget.translationKey,
			description: widget.description ?? '',
			category: widget.category,
			categoryName: widgetCategories[widget.category] || widget.category,
			isFavorite: favorites.includes(widget.id),
			path: `/tools/${widget.path}`
		}))
	}, [favorites])

	// Что показывать в пустом поле: избранное, затем самые ходовые инструменты.
	// Раньше вместо этого история запросов подставлялась через поиск виджета по
	// строке запроса, и при пустой истории список оставался пустым.
	const suggestions = useMemo(() => {
		const favoriteItems = searchableWidgets.filter(item => item.isFavorite)
		const byHistory = history
			.flatMap(query => searchWidgets(publicWidgets, query, { limit: 1 }))
			.map(widget =>
				searchableWidgets.find(item => item.widget.id === widget.id)
			)
			.filter((item): item is (typeof searchableWidgets)[0] => Boolean(item))
		const popular = [...searchableWidgets].sort(
			(a, b) => (b.widget.searchVolume ?? 0) - (a.widget.searchVolume ?? 0)
		)

		const seen = new Set<string>()
		const result: typeof searchableWidgets = []
		for (const item of [...favoriteItems, ...byHistory, ...popular]) {
			if (seen.has(item.widget.id)) continue
			seen.add(item.widget.id)
			result.push(item)
			if (result.length === 6) break
		}
		return result
	}, [searchableWidgets, history])

	const filteredWidgets = useMemo(() => {
		if (!searchQuery.trim()) return suggestions

		const byId = new Map(searchableWidgets.map(item => [item.widget.id, item]))
		return searchWidgets(publicWidgets, searchQuery, { limit: 8 })
			.map(widget => byId.get(widget.id))
			.filter((item): item is (typeof searchableWidgets)[0] => Boolean(item))
	}, [searchQuery, searchableWidgets, suggestions])

	// Курсор всегда на первом результате: без сброса он оставался, например, на
	// шестой строке, и после нового запроса подсветка висела на пустом месте, а
	// Enter уводил не туда, куда показывает глаз.
	useEffect(() => {
		setSelectedIndex(0)
	}, [searchQuery])

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Open search with Cmd/Ctrl + K
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault()
				setOpen(true)
			}

			// Navigation when open
			if (open) {
				switch (e.key) {
					case 'ArrowDown':
						e.preventDefault()
						setSelectedIndex(prev =>
							prev < filteredWidgets.length - 1 ? prev + 1 : 0
						)
						break
					case 'ArrowUp':
						e.preventDefault()
						setSelectedIndex(prev =>
							prev > 0 ? prev - 1 : filteredWidgets.length - 1
						)
						break
					case 'Enter':
						e.preventDefault()
						if (filteredWidgets[selectedIndex]) {
							handleSelect(filteredWidgets[selectedIndex])
						}
						break
					case 'Escape':
						e.preventDefault()
						setOpen(false)
						break
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [open, filteredWidgets, selectedIndex])

	// Reset state when closing
	useEffect(() => {
		if (!open) {
			setSearchQuery('')
			setSelectedIndex(0)
		}
	}, [open])

	const handleSelect = useCallback(
		(item: (typeof searchableWidgets)[0]) => {
			if (searchQuery.trim()) {
				addToHistory(searchQuery)
				// Track search goal
				YandexGoals.toolSearched(searchQuery)
			}
			router.push(item.path)
			setOpen(false)
		},
		[searchQuery, addToHistory, router]
	)

	return (
		<>
			{/* Show floating search button only if not controlled */}
			{controlledOpen === undefined && (
				<Button
					onClick={() => setOpen(true)}
					className='fixed bottom-8 left-8 rounded-full shadow-lg z-40 h-14 w-14 p-0'
					size='icon'
					variant='default'
				>
					<Search className='w-6 h-6' />
				</Button>
			)}

			{/* Search dialog */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className='sm:max-w-2xl p-0 overflow-hidden fixed inset-0 sm:inset-auto sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] w-full h-full sm:h-auto sm:max-h-[85vh] m-0 rounded-none sm:rounded-lg'>
					<DialogHeader className='sr-only'>
						<DialogTitle>Поиск инструментов</DialogTitle>
						<DialogDescription>
							Введите запрос, чтобы найти инструмент среди всех доступных.
						</DialogDescription>
					</DialogHeader>

					{/* Search input */}
					<div className='flex items-center border-b px-4 pr-4 sm:pr-12 h-14'>
						<Search className='w-5 h-5 text-muted-foreground shrink-0' />
						<Input
							placeholder='Поиск инструментов...'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							className='flex-1 border-0 focus-visible:ring-0 text-base px-3 h-full'
							autoFocus
						/>
						<Badge variant='secondary' className='ml-2 shrink-0 hidden sm:flex'>
							<Command className='w-3 h-3 mr-1' />K
						</Badge>
					</div>

					{/* Results */}
					<ScrollArea className='h-[calc(100vh-8rem)] sm:h-auto sm:max-h-[400px]'>
						{filteredWidgets.length === 0 ? (
							<div className='p-8 text-center text-muted-foreground'>
								<Search className='w-12 h-12 mx-auto mb-4 opacity-50' />
								<p className='text-sm'>Ничего не найдено</p>
							</div>
						) : (
							<div className='p-2'>
								{/* Category label for empty search */}
								{!searchQuery.trim() && (
									<div className='px-3 py-2 text-xs font-medium text-muted-foreground'>
										{favorites.length > 0
											? 'Рекомендуемые и избранные'
											: 'Рекомендуемые'}
									</div>
								)}

								{/* Widget results */}
								{filteredWidgets.map((item, index) => {
									const Icon = item.widget.icon
									return (
										<button
											key={item.widget.id}
											onClick={() => handleSelect(item)}
											className={cn(
												'w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors',
												'hover:bg-muted active:bg-muted/80',
												selectedIndex === index && 'bg-muted'
											)}
										>
											{/* Widget icon */}
											<div
												className={cn(
													'w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0',
													`bg-gradient-to-br ${item.widget.gradient}`
												)}
											>
												<Icon className='w-5 h-5' />
											</div>

											{/* Widget info */}
											<div className='flex-1 min-w-0'>
												<div className='flex items-center gap-2'>
													<p className='font-medium text-sm truncate'>
														{searchQuery
															? highlightText(item.title, searchQuery)
															: item.title}
													</p>
													{item.isFavorite && (
														<Star className='w-3 h-3 text-yellow-500 fill-current' />
													)}
												</div>
												<p className='text-xs text-muted-foreground truncate'>
													{searchQuery
														? highlightText(item.description, searchQuery)
														: item.description}
												</p>
											</div>

											{/* Category badge */}
											<Badge variant='outline' className='shrink-0'>
												{item.categoryName}
											</Badge>

											{/* Arrow */}
											<ArrowRight className='w-4 h-4 text-muted-foreground shrink-0' />
										</button>
									)
								})}
							</div>
						)}
					</ScrollArea>

					{/* Footer */}
					<div className='border-t px-4 py-3 flex items-center justify-between text-xs text-muted-foreground'>
						<div className='hidden sm:flex items-center gap-4'>
							<span className='flex items-center gap-1'>
								<kbd className='px-1.5 py-0.5 rounded border bg-muted font-mono'>
									↑
								</kbd>
								<kbd className='px-1.5 py-0.5 rounded border bg-muted font-mono'>
									↓
								</kbd>
								навигация
							</span>
							<span className='flex items-center gap-1'>
								<kbd className='px-1.5 py-0.5 rounded border bg-muted font-mono'>
									↵
								</kbd>
								выбрать
							</span>
							<span className='flex items-center gap-1'>
								<kbd className='px-1.5 py-0.5 rounded border bg-muted font-mono'>
									esc
								</kbd>
								закрыть
							</span>
						</div>
						<span className='flex items-center gap-1 mx-auto sm:mx-0'>
							<Sparkles className='w-3 h-3' />
							{toolsCountLabel(publicWidgets.length)}
						</span>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

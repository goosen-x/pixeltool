'use client'

import { useState } from 'react'
import { ExternalLink, Film, Loader2, Star } from 'lucide-react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toolBar, toolFooterBar, toolPill } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import type { RandomMovie } from '@/app/api/random-movies/route'
import { RandomMovieGeneratorSeo } from './RandomMovieGeneratorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

const ALL_GENRES = 'Любой жанр'

// ID жанров Кинопоиска — /api/v2.2/films/filters
const GENRE_IDS: Record<string, number> = {
	Драма: 2,
	Комедия: 13,
	Боевик: 11,
	Фантастика: 6,
	Ужасы: 17,
	Мультфильм: 18,
	Фэнтези: 12,
	Триллер: 1
}

const GENRES = Object.keys(GENRE_IDS)
const HISTORY_LIMIT = 8
const STAR_COUNT = 10

// Ряд из 10 звёзд вместо одного числа — рейтинги у Кинопоиска и IMDb по
// 10-балльной шкале, и звёзды нагляднее показывают место оценки на этой
// шкале, чем голая цифра. Каждая звезда закрашивается на свою долю (8.4 —
// значит восьмая полностью закрашена, девятая на 40%, десятая пустая):
// под пустой звездой лежит залитая того же размера, обрезанная по ширине
// через overflow-hidden, а не просто округление до целой звезды.
function RatingStars({ value }: { value: number }) {
	return (
		<div className='flex gap-0.5'>
			{Array.from({ length: STAR_COUNT }, (_, index) => {
				const fraction = Math.min(1, Math.max(0, value - index))
				return (
					<span key={index} className='relative h-3.5 w-3.5'>
						<Star className='absolute inset-0 h-3.5 w-3.5 text-muted-foreground/25' />
						{fraction > 0 && (
							<span
								className='absolute inset-0 overflow-hidden'
								style={{ width: `${fraction * 100}%` }}
							>
								<Star className='h-3.5 w-3.5 fill-amber-400 text-amber-400' />
							</span>
						)}
					</span>
				)
			})}
		</div>
	)
}

function KinopoiskLogo({ className }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 215 215'
			fill='currentColor'
			className={className}
			aria-hidden='true'
		>
			<path d='M215 121.415l-99.297-6.644 90.943 36.334a106.416 106.416 0 0 0 8.354-29.69z' />
			<path d='M194.608 171.609C174.933 197.942 143.441 215 107.948 215 48.33 215 0 166.871 0 107.5 0 48.13 48.33 0 107.948 0c35.559 0 67.102 17.122 86.77 43.539l-90.181 48.07L162.57 32.25h-32.169L90.892 86.862V32.25H64.77v150.5h26.123v-54.524l39.509 54.524h32.169l-56.526-57.493 88.564 46.352z' />
			<path d='M206.646 63.895l-90.308 36.076L215 93.583a106.396 106.396 0 0 0-8.354-29.688z' />
		</svg>
	)
}

function ImdbLogo({ className }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 32 32'
			fill='currentColor'
			className={className}
			aria-hidden='true'
		>
			<path d='M19.078 12.786v0.005c-0.099-0.063-0.302-0.094-0.557-0.094v6.422c0.359 0 0.583-0.083 0.667-0.224 0.083-0.135 0.125-0.536 0.125-1.177v-3.823c0-0.438-0.005-0.719-0.042-0.839-0.031-0.13-0.089-0.219-0.188-0.271zM29.885 0h-27.724c-1.172 0.078-2.083 0.99-2.161 2.13v27.708c0.078 1.167 0.948 2.057 2.073 2.156 0.021 0.005 0.042 0.005 0.063 0.005h27.792c1.172-0.12 2.068-1.099 2.073-2.281v-27.438c0-1.188-0.927-2.188-2.115-2.281zM6.391 20.833h-2.542v-9.818h2.542zM15.109 20.833h-2.214v-6.63l-0.896 6.625h-1.583l-0.932-6.479-0.010 6.479h-2.219v-9.813h3.286c0.115 0.693 0.214 1.396 0.307 2.099l0.359 2.49 0.594-4.589h3.307zM21.745 17.927c0 0.87-0.057 1.458-0.141 1.76-0.078 0.292-0.224 0.531-0.432 0.693-0.198 0.172-0.453 0.292-0.76 0.354-0.297 0.057-0.76 0.099-1.359 0.099l-0.005-0.005h-3.073v-9.813h1.901c1.219 0 1.932 0.063 2.359 0.167 0.432 0.12 0.766 0.302 0.995 0.563 0.219 0.24 0.365 0.536 0.417 0.859 0.068 0.313 0.099 0.938 0.099 1.87zM28.339 18.557c0 0.599-0.063 1.021-0.12 1.323-0.083 0.297-0.26 0.536-0.542 0.755-0.302 0.224-0.641 0.323-1.042 0.323-0.292 0-0.667-0.083-0.906-0.182-0.25-0.125-0.474-0.318-0.688-0.573l-0.151 0.63h-2.292v-9.818l-0.026-0.005h2.401v3.198c0.198-0.234 0.422-0.411 0.677-0.531 0.266-0.109 0.625-0.172 0.922-0.172 0.302 0 0.599 0.047 0.88 0.156 0.229 0.094 0.427 0.245 0.583 0.438 0.12 0.167 0.198 0.359 0.24 0.563 0.036 0.182 0.057 0.573 0.057 1.156v2.74zM25.438 14.938c-0.156 0-0.255 0.057-0.297 0.161-0.042 0.109-0.078 0.385-0.078 0.833v2.594c0 0.432 0.036 0.714 0.078 0.833 0.052 0.115 0.172 0.182 0.302 0.177 0.156 0 0.359-0.063 0.401-0.188 0.036-0.13 0.057-0.427 0.057-0.896l0.042-0.005v-2.521c0-0.401-0.021-0.677-0.078-0.802-0.063-0.135-0.26-0.188-0.422-0.188z' />
		</svg>
	)
}

export default function RandomMovieGeneratorPage() {
	const widget = getWidgetById('random-movie-generator')!

	const [genre, setGenre] = useState<string>(ALL_GENRES)
	const [batch, setBatch] = useState<RandomMovie[]>([])
	const [current, setCurrent] = useState<RandomMovie | null>(null)
	const [history, setHistory] = useState<RandomMovie[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [posterBroken, setPosterBroken] = useState(false)
	// Заголовок и рейтинг — просто React-состояние, обновляются мгновенно, а
	// постер должен ещё докачаться по сети — без этого флага на экране на
	// секунду соседствуют новое название и старая обложка предыдущего фильма.
	const [posterLoaded, setPosterLoaded] = useState(false)

	// Батч из ~20 фильмов кэшируется — «ещё один фильм» сначала расходует его
	// локально, новый запрос к Кинопоиску идёт только когда батч закончился
	// или сменился жанр. Экономит дневную квоту бесплатного тарифа.
	const fetchBatch = async (): Promise<RandomMovie[]> => {
		const genreId = genre === ALL_GENRES ? '' : GENRE_IDS[genre]
		const query = genreId ? `?genre=${genreId}` : ''
		const response = await fetch(`/api/random-movies${query}`)
		if (!response.ok) throw new Error('bad status')
		const data = (await response.json()) as { movies: RandomMovie[] }
		return data.movies
	}

	const generate = async () => {
		setError(null)
		setLoading(true)
		try {
			let pool = batch
			if (pool.length === 0) {
				pool = await fetchBatch()
			}
			if (pool.length === 0) {
				setError('Не нашлось фильмов по этому жанру. Попробуйте другой.')
				return
			}
			const [next, ...rest] = pool
			setBatch(rest)
			setCurrent(next)
			setPosterBroken(false)
			setPosterLoaded(false)
			setHistory(prev => [next, ...prev].slice(0, HISTORY_LIMIT))
		} catch {
			setError('Не удалось получить данные с Кинопоиска. Попробуйте ещё раз.')
		} finally {
			setLoading(false)
		}
	}

	const selectGenre = (value: string) => {
		setGenre(value)
		setBatch([])
	}

	// Общая кнопка для обоих состояний (есть фильм / только заглушка) —
	// раньше она стояла одна под всей раскладкой, из-за чего между короткой
	// текстовой колонкой и кнопкой оставалась пустая полоса высотой с
	// постер. Теперь кнопка — часть группы «рейтинги + ссылка + кнопка»,
	// прижатой к низу колонки (см. mt-auto на обёртке этой группы ниже).
	const generateButton = (
		<Button
			onClick={() => void generate()}
			disabled={loading}
			size='lg'
			className='cursor-pointer'
		>
			{loading ? (
				<Loader2 className='h-4 w-4 animate-spin' />
			) : current ? (
				'Ещё один фильм'
			) : (
				'Получить случайный фильм'
			)}
		</Button>
	)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className='ml-auto flex flex-wrap items-center gap-1.5'>
						<button
							type='button'
							onClick={() => selectGenre(ALL_GENRES)}
							aria-pressed={genre === ALL_GENRES}
							className={toolPill(genre === ALL_GENRES)}
						>
							{ALL_GENRES}
						</button>
						{GENRES.map(item => (
							<button
								key={item}
								type='button'
								onClick={() => selectGenre(item)}
								aria-pressed={genre === item}
								className={toolPill(genre === item)}
							>
								{item}
							</button>
						))}
					</div>
				</div>

				<div className='flex flex-col items-center gap-6 px-5 py-10 text-center sm:px-6'>
					{current ? (
						<div className='flex w-full max-w-2xl flex-col items-center gap-6 sm:flex-row sm:items-stretch sm:gap-8 sm:text-left'>
							{current.posterUrl && !posterBroken ? (
								<div className='relative aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-lg border bg-muted/30 sm:w-48'>
									{!posterLoaded && (
										<div className='absolute inset-0 flex items-center justify-center'>
											<Film className='h-8 w-8 text-muted-foreground' />
										</div>
									)}
									<Image
										key={current.id}
										src={current.posterUrl}
										alt={current.title}
										fill
										unoptimized
										className={cn(
											'object-cover transition-opacity',
											posterLoaded ? 'opacity-100' : 'opacity-0'
										)}
										onLoad={() => setPosterLoaded(true)}
										onError={() => setPosterBroken(true)}
									/>
								</div>
							) : (
								<div className='flex aspect-[2/3] w-40 shrink-0 items-center justify-center rounded-lg border bg-muted/30 sm:w-48'>
									<Film className='h-8 w-8 text-muted-foreground' />
								</div>
							)}

							<div className='flex min-w-0 flex-1 flex-col items-center gap-4 sm:items-start sm:pt-2'>
								<div>
									<h2 className='text-2xl font-bold tracking-tight'>
										{current.title}
									</h2>
									{current.originalTitle &&
										current.originalTitle !== current.title && (
											<p className='text-sm text-muted-foreground'>
												{current.originalTitle}
											</p>
										)}
									<p className='mt-1 text-sm text-muted-foreground'>
										{[
											current.year,
											current.genres.join(', '),
											current.countries.join(', ')
										]
											.filter(Boolean)
											.join(' · ')}
									</p>
								</div>

								{/* Рейтинги, ссылка и кнопка — одной группой, прижатой к низу
								    колонки (та растянута до высоты постера через items-stretch
								    у родителя). Раньше был прижат только generateButton — у
								    фильмов с длинным названием звёзды и ссылка оставались
								    прилипшими к тексту сверху, а не к низу вместе с кнопкой. */}
								<div className='mt-auto flex flex-col items-center gap-4 sm:items-start'>
									{(current.ratingKinopoisk !== null ||
										current.ratingImdb !== null) && (
										<div className='flex flex-col gap-2'>
											{current.ratingKinopoisk !== null && (
												<div className='flex items-center gap-2'>
													<KinopoiskLogo className='h-4 w-4 shrink-0 text-foreground' />
													<RatingStars value={current.ratingKinopoisk} />
													<span className='text-sm font-medium text-muted-foreground tabular-nums'>
														{current.ratingKinopoisk.toFixed(1)}
													</span>
												</div>
											)}
											{current.ratingImdb !== null && (
												<div className='flex items-center gap-2'>
													<ImdbLogo className='h-4 w-4 shrink-0 text-foreground' />
													<RatingStars value={current.ratingImdb} />
													<span className='text-sm font-medium text-muted-foreground tabular-nums'>
														{current.ratingImdb.toFixed(1)}
													</span>
												</div>
											)}
										</div>
									)}

									<a
										href={current.kinopoiskUrl}
										target='_blank'
										rel='noopener noreferrer nofollow'
										className='inline-flex cursor-pointer items-center gap-1.5 text-sm text-primary hover:underline'
									>
										Открыть на Кинопоиске
										<ExternalLink className='h-3.5 w-3.5' />
									</a>

									{generateButton}
								</div>
							</div>
						</div>
					) : (
						generateButton
					)}

					{error && <p className='text-sm text-destructive'>{error}</p>}
				</div>

				{history.length > 1 && (
					<div className={toolFooterBar}>
						<span className='text-sm text-muted-foreground'>Недавние</span>
						{history.slice(1).map((movie, index) => (
							<span
								key={`${movie.id}-${index}`}
								className='rounded-full border bg-background px-2.5 py-0.5 text-xs'
							>
								{movie.title}
							</span>
						))}
					</div>
				)}
			</Card>

			<ToolScreenshot slug='random-movie-generator' />
			<RandomMovieGeneratorSeo />
		</WidgetSEOWrapper>
	)
}

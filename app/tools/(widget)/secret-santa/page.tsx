'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	Check,
	Copy,
	Eye,
	EyeOff,
	Gift,
	RotateCcw,
	Share2,
	Trash2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { useYandexGoals } from '@/lib/hooks/useYandexGoals'
import {
	MAX_PARTICIPANTS,
	decodeSantaLink,
	drawSecretSanta,
	encodeSantaLink,
	parseExclusions,
	parseParticipants,
	type SantaCard,
	type SantaPair
} from '@/lib/secret-santa'
import { SecretSantaSeo } from './SecretSantaSeo'

const STORAGE_KEY = 'pixeltool:secret-santa'

const EXAMPLE_PARTICIPANTS =
	'Аня: книга или настолка\nПетя\nОля: что-нибудь для кухни\nКоля\nМаша'

const inputClass =
	'w-full min-w-0 rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

interface SavedState {
	participants: string
	exclusions: string
	event: string
	budget: string
	date: string
	pairs: SantaPair[] | null
}

function linkFor(card: SantaCard): string {
	return `${window.location.origin}/tools/secret-santa#s=${encodeSantaLink(card)}`
}

export default function SecretSantaPage() {
	const widget = getWidgetById('secret-santa')!
	const [mounted, setMounted] = useState(false)
	const [card, setCard] = useState<SantaCard | null>(null)

	// Личная ссылка участника живёт в #s=…: хэш не уходит на сервер и в
	// логи, а прочитать его можно только на клиенте.
	useEffect(() => {
		const readHash = () => {
			const match = window.location.hash.match(/s=([\w-]+)/)
			setCard(match ? decodeSantaLink(match[1]) : null)
		}
		readHash()
		setMounted(true)
		window.addEventListener('hashchange', readHash)
		return () => window.removeEventListener('hashchange', readHash)
	}, [])

	const openOrganizer = () => {
		history.replaceState(null, '', window.location.pathname)
		setCard(null)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			{!mounted ? (
				<Card className='min-h-[28rem] p-0' />
			) : card ? (
				<ParticipantCard card={card} onOrganize={openOrganizer} />
			) : (
				<Organizer />
			)}
			<SecretSantaSeo />
		</WidgetSEOWrapper>
	)
}

function Organizer() {
	const { trackToolAction } = useYandexGoals()
	const [participants, setParticipants] = useState(EXAMPLE_PARTICIPANTS)
	const [exclusions, setExclusions] = useState('')
	const [event, setEvent] = useState('')
	const [budget, setBudget] = useState('')
	const [date, setDate] = useState('')
	const [pairs, setPairs] = useState<SantaPair[] | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loaded, setLoaded] = useState(false)

	// Организатор может закрыть вкладку до того, как разослал ссылки:
	// храним последнюю жеребьёвку в этом браузере.
	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			if (raw) {
				const saved = JSON.parse(raw) as SavedState
				setParticipants(saved.participants ?? EXAMPLE_PARTICIPANTS)
				setExclusions(saved.exclusions ?? '')
				setEvent(saved.event ?? '')
				setBudget(saved.budget ?? '')
				setDate(saved.date ?? '')
				setPairs(saved.pairs ?? null)
			}
		} catch {
			// повреждённое или недоступное хранилище: начинаем с примера
		}
		setLoaded(true)
	}, [])

	useEffect(() => {
		if (!loaded) return
		try {
			const state: SavedState = {
				participants,
				exclusions,
				event,
				budget,
				date,
				pairs
			}
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
		} catch {
			// приватный режим: просто не сохраняем
		}
	}, [loaded, participants, exclusions, event, budget, date, pairs])

	const parsed = useMemo(() => parseParticipants(participants), [participants])

	const draw = useCallback(() => {
		const result = drawSecretSanta(
			parsed.map(p => p.name),
			parseExclusions(exclusions)
		)
		if ('error' in result) {
			setError(result.error)
			return
		}
		setError(null)
		setPairs(result)
		trackToolAction('draw')
	}, [parsed, exclusions, trackToolAction])

	if (pairs) {
		return (
			<Results
				pairs={pairs}
				wishes={new Map(parsed.map(p => [p.name, p.wish]))}
				meta={{ event, budget, date }}
				onReset={() => setPairs(null)}
			/>
		)
	}

	return (
		<Card className='overflow-hidden p-0'>
			<div className={toolBar}>
				<span
					className={cn(
						'text-sm',
						parsed.length > MAX_PARTICIPANTS
							? 'font-medium text-destructive'
							: 'text-muted-foreground'
					)}
				>
					{parsed.length} из {MAX_PARTICIPANTS} участников · по одному на
					строку, пожелание через двоеточие
				</span>
				<button
					type='button'
					onClick={() => setParticipants(EXAMPLE_PARTICIPANTS)}
					className={cn(
						toolPill(false, 'inline-flex items-center gap-1.5 sm:ml-auto'),
						participants === EXAMPLE_PARTICIPANTS && 'invisible'
					)}
				>
					<RotateCcw className='h-3.5 w-3.5' />
					Вернуть пример
				</button>
			</div>

			<div className='grid sm:grid-cols-2'>
				<div className='relative min-w-0'>
					<Textarea
						value={participants}
						onChange={e => setParticipants(e.target.value)}
						placeholder={'Аня: книга\nПетя\nОля'}
						spellCheck={false}
						aria-label='Участники'
						className='min-h-[16rem] min-w-0 resize-none rounded-none border-0 border-b px-5 py-6 font-mono text-base [field-sizing:content] focus-visible:ring-0 sm:border-r sm:border-b-0 sm:px-6 md:text-sm'
					/>
					{participants !== '' && (
						<Button
							size='icon'
							variant='secondary'
							onClick={() => setParticipants('')}
							title='Очистить'
							className='absolute top-3 right-3 h-8 w-8 cursor-pointer shadow-sm'
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					)}
				</div>

				<div className='grid content-start gap-4 px-5 py-6 sm:px-6'>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Название игры
						</span>
						<input
							value={event}
							onChange={e => setEvent(e.target.value)}
							placeholder='Новый год в отделе продаж'
							className={inputClass}
						/>
					</label>
					<div className='grid grid-cols-2 gap-3'>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Бюджет подарка
							</span>
							<input
								value={budget}
								onChange={e => setBudget(e.target.value)}
								placeholder='до 1500 ₽'
								className={inputClass}
							/>
						</label>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Когда дарим
							</span>
							<input
								value={date}
								onChange={e => setDate(e.target.value)}
								placeholder='27 декабря'
								className={inputClass}
							/>
						</label>
					</div>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Кто не должен дарить друг другу
						</span>
						<Textarea
							value={exclusions}
							onChange={e => setExclusions(e.target.value)}
							placeholder={'Аня - Петя\nОля - Коля'}
							spellCheck={false}
							aria-label='Исключения'
							className='min-h-[4.5rem] resize-none font-mono text-base [field-sizing:content] md:text-sm'
						/>
						<span className='mt-1 block text-xs text-muted-foreground'>
							Пара на строку, например супруги. Можно оставить пустым.
						</span>
					</label>
				</div>
			</div>

			<div className={toolFooterBar}>
				<Button
					onClick={draw}
					disabled={parsed.length === 0}
					className='cursor-pointer'
				>
					<Gift className='mr-2 h-4 w-4' />
					Провести жеребьёвку
				</Button>
				{error && <span className='text-sm text-destructive'>{error}</span>}
			</div>
		</Card>
	)
}

function Results({
	pairs,
	wishes,
	meta,
	onReset
}: {
	pairs: SantaPair[]
	wishes: Map<string, string>
	meta: { event: string; budget: string; date: string }
	onReset: () => void
}) {
	const { trackToolAction } = useYandexGoals()
	const [showPairs, setShowPairs] = useState(false)
	const [copied, setCopied] = useState<string | null>(null)
	const [sent, setSent] = useState<Set<string>>(new Set())
	const canShare = typeof navigator !== 'undefined' && !!navigator.share

	const links = useMemo(
		() =>
			pairs.map(pair => ({
				...pair,
				url: linkFor({
					giver: pair.giver,
					receiver: pair.receiver,
					wish: wishes.get(pair.receiver) ?? '',
					...meta
				})
			})),
		[pairs, wishes, meta]
	)

	const markSent = (name: string) => setSent(prev => new Set(prev).add(name))

	const copy = async (key: string, text: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopied(key)
			setTimeout(() => setCopied(c => (c === key ? null : c)), 2000)
			trackToolAction('copy')
		} catch {
			// буфер недоступен: ссылку видно в title кнопки, но это редкость
		}
	}

	const share = async (giver: string, url: string) => {
		try {
			await navigator.share({
				title: 'Тайный Санта',
				text: `${giver}, это твоя ссылка на жеребьёвку «Тайного Санты». Открой и узнай, кому даришь подарок.`,
				url
			})
			markSent(giver)
		} catch {
			// пользователь закрыл меню «Поделиться»
		}
	}

	return (
		<Card className='overflow-hidden p-0'>
			<div className={toolBar}>
				<span className='text-sm text-muted-foreground'>
					Жеребьёвка готова · отправьте каждому его ссылку
				</span>
				<div className='flex items-center gap-1 sm:ml-auto'>
					<button
						type='button'
						onClick={() => setShowPairs(v => !v)}
						className={toolPill(showPairs, 'inline-flex items-center gap-1.5')}
					>
						{showPairs ? (
							<EyeOff className='h-3.5 w-3.5' />
						) : (
							<Eye className='h-3.5 w-3.5' />
						)}
						{showPairs ? 'Скрыть пары' : 'Показать пары'}
					</button>
					<button
						type='button'
						onClick={onReset}
						className={toolPill(false, 'inline-flex items-center gap-1.5')}
					>
						<RotateCcw className='h-3.5 w-3.5' />
						Изменить список
					</button>
				</div>
			</div>

			<ul className='divide-y'>
				{links.map(({ giver, receiver, url }) => (
					<li
						key={giver}
						className='flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 sm:px-6'
					>
						<span className='min-w-0 flex-1 truncate font-medium'>
							{giver}
							{showPairs && (
								<span className='ml-2 font-normal text-muted-foreground'>
									→ {receiver}
								</span>
							)}
						</span>
						{sent.has(giver) && (
							<span className='text-xs text-green-700 dark:text-green-400'>
								отправлено
							</span>
						)}
						<div className='flex items-center gap-1'>
							<button
								type='button'
								onClick={() => {
									copy(giver, url)
									markSent(giver)
								}}
								title={url}
								className={toolPill(
									copied === giver,
									'inline-flex items-center gap-1.5'
								)}
							>
								{copied === giver ? (
									<Check className='h-3.5 w-3.5' />
								) : (
									<Copy className='h-3.5 w-3.5' />
								)}
								{copied === giver ? 'Скопировано' : 'Ссылка'}
							</button>
							{canShare && (
								<Button
									size='icon'
									variant='ghost'
									onClick={() => share(giver, url)}
									title='Отправить'
									className={toolIconButton}
								>
									<Share2 className='h-4 w-4' />
								</Button>
							)}
						</div>
					</li>
				))}
			</ul>

			<div className={toolFooterBar}>
				<span className='text-sm text-muted-foreground'>
					В каждой ссылке только один подопечный. Жеребьёвка сохранена в этом
					браузере.
				</span>
				<button
					type='button'
					onClick={() =>
						copy('all', links.map(l => `${l.giver}: ${l.url}`).join('\n'))
					}
					className={toolPill(
						copied === 'all',
						'inline-flex items-center gap-1.5 sm:ml-auto'
					)}
				>
					{copied === 'all' ? (
						<Check className='h-3.5 w-3.5' />
					) : (
						<Copy className='h-3.5 w-3.5' />
					)}
					Все ссылки списком
				</button>
			</div>
		</Card>
	)
}

function ParticipantCard({
	card,
	onOrganize
}: {
	card: SantaCard
	onOrganize: () => void
}) {
	const [revealed, setRevealed] = useState(false)
	const details = [
		card.wish && { label: 'Пожелание', value: card.wish },
		card.budget && { label: 'Бюджет', value: card.budget },
		card.date && { label: 'Когда дарим', value: card.date }
	].filter(Boolean) as { label: string; value: string }[]

	return (
		<Card className='overflow-hidden p-0'>
			<div className={toolBar}>
				<span className='text-sm text-muted-foreground'>
					{card.event ? `Тайный Санта · ${card.event}` : 'Тайный Санта'}
				</span>
			</div>

			<div className='px-5 py-10 text-center sm:px-6'>
				<p className='text-lg'>{card.giver}, вы Тайный Санта для…</p>

				<button
					type='button'
					onClick={() => setRevealed(true)}
					disabled={revealed}
					className={cn(
						'group mx-auto mt-6 block h-40 w-full max-w-xs rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
						revealed ? 'cursor-default' : 'cursor-pointer'
					)}
					style={{ perspective: '1000px' }}
				>
					<div
						className={cn(
							'relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]',
							revealed && '[transform:rotateY(180deg)]'
						)}
					>
						<div className='absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border bg-muted/30 [backface-visibility:hidden] group-hover:border-primary/50 group-hover:bg-muted'>
							<Gift className='h-8 w-8 text-muted-foreground' />
							<span className='text-sm text-muted-foreground'>
								Нажмите, чтобы открыть
							</span>
						</div>
						<div className='absolute inset-0 flex items-center justify-center rounded-2xl border border-primary bg-primary/5 p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]'>
							<span className='break-words text-3xl font-bold tracking-tight'>
								{card.receiver}
							</span>
						</div>
					</div>
				</button>

				{revealed && details.length > 0 && (
					<dl className='mx-auto mt-8 grid max-w-sm gap-3 text-left'>
						{details.map(item => (
							<div key={item.label}>
								<dt className='text-xs text-muted-foreground'>{item.label}</dt>
								<dd className='text-sm'>{item.value}</dd>
							</div>
						))}
					</dl>
				)}
			</div>

			<div className={toolFooterBar}>
				<span className='text-sm text-muted-foreground'>
					Никому не говорите, кто вам выпал: в этом весь смысл.
				</span>
				<button
					type='button'
					onClick={onOrganize}
					className={toolPill(false, 'sm:ml-auto')}
				>
					Организовать свою жеребьёвку
				</button>
			</div>
		</Card>
	)
}

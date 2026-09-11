'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { IconType } from 'react-icons'
import {
	SiApple,
	SiDiscord,
	SiInstagram,
	SiRoblox,
	SiSteam,
	SiTelegram,
	SiTiktok,
	SiVk,
	SiWhatsapp,
	SiX
} from 'react-icons/si'
import { Ban, Check, Copy, ThumbsDown, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { FeedbackModal } from '@/components/feedback/FeedbackModal'
import {
	invisiblePlatforms,
	getInvisibleChar,
	invisibleCharacters
} from '@/lib/data/invisible-characters'
import { platformFeedbackKey } from '@/lib/tool-stats/storage-keys'

const TOOL_ID = 'invisible-character'

// Официальный логотип PUBG Mobile сложнее плоской монохромной марки simple
// icons (это экспорт из Illustrator, ~34 КБ путей даже после svgo) — держим
// файлом в /public, а не инлайним, и красим через dark:invert, раз
// currentColor тут недоступен (SVG грузится как <img>, не как разметка).
function PubgMobileIcon({ className }: { className?: string }) {
	return (
		<img
			src='/icons/pubg-mobile.svg'
			alt=''
			className={`${className ?? ''} dark:invert`}
		/>
	)
}

// У Mojang нет монохромной марки в simple-icons (товарный знак), поэтому
// перерисовали крипера сами по официальной иконке лаунчера
// (minecraft-launcher.svg — блок травы 100×100 с двухцветным бевелом на
// 8 путей и мёртвыми stroke-width без stroke, 571 байт). Разобрали на грид
// 6×6: у крипера ровно шесть прямоугольников без бевела, и он остаётся
// узнаваемым и плоским, currentColor вместо своих цветов — тот же язык, что
// у остальных SI-иконок ряда. Инлайним JSX, не файлом в /public: 162 байта
// в бандле дешевле, чем ещё один HTTP-запрос за отдельным SVG.
function MinecraftIcon({ className }: { className?: string }) {
	return (
		<svg viewBox='0 0 6 6' className={className} fill='currentColor'>
			<path d='M0 0h2v2H0zM4 0h2v2H4zM2 2h2v1H2zM1 3h4v2H1zM1 5h1v1H1zM4 5h1v1H4z' />
		</svg>
	)
}

// У Standoff 2 в промо-лого («STANDOFF 2», хром+красный) нет отдельного
// пиктографического знака — только леттеринг, целиком в квадрат 24×24 не
// поместится читаемо. Взяли за марку заглавную «S», но не шрифтом-заменителем
// (Arial Black давал другие пропорции, шире и круглее настоящей буквы), а
// вырезали именно эту «S» из официального лого
// (web-static.cdn.boltgaming.io/.../1_logo_default_*.webp) через potrace —
// контур повторяет реальные пропорции и характерный срез в верхнем углу.
// currentColor, без файла в /public — тот же приём, что у MinecraftIcon:
// ~1 КБ разметки дешевле отдельного запроса.
function StandoffIcon({ className }: { className?: string }) {
	return (
		<svg viewBox='0 0 24 24' className={className} fill='currentColor'>
			<path d='M9.2 2.1C9.1 2.2 9 2.2 8.9 2.2C8.4 2.2 7.5 3.1 7.1 4C6.8 4.6 6.7 9.9 7 10.4C7 10.5 7.2 10.8 7.2 10.9C7.4 11.4 8.2 12.1 8.6 12.3C8.9 12.4 9.3 12.6 9.9 12.8C10.1 12.9 10.3 13 10.4 13.1C10.6 13.1 10.7 13.2 10.8 13.2C10.8 13.2 11.4 13.4 11.7 13.6C11.8 13.6 11.9 13.7 11.9 13.7C12.6 13.7 13.8 14.8 14 15.7C14.5 17.9 13.8 19.1 12.1 19.1C10.7 19.1 10.2 18.7 10 17.6C10 17.2 10 17.2 8.4 17.2C6.9 17.1 6.9 17.1 6.9 18.4C6.9 20 7.4 21.1 8.5 21.6C8.7 21.7 8.9 21.8 9 21.9C9.3 22 14.7 22 15 21.9C15.1 21.8 15.4 21.7 15.5 21.6C16.9 21 17.2 20.2 17.2 16.7C17.2 13.3 17.1 13.2 16.3 12.3C15.8 11.8 15.6 11.7 14.2 11.2C14.1 11.1 13.8 11 13.7 10.9C13.6 10.9 13.4 10.8 13.4 10.8C13.3 10.8 13.2 10.8 13.1 10.7C12.8 10.6 12.6 10.4 11.8 10.2C10.2 9.5 9.4 7.5 10.1 5.8C10.9 4.3 13.9 4.6 14 6.2C14.1 6.9 13.9 6.8 15.6 6.8C17.3 6.9 17.2 6.9 17.2 5.8C17.2 3.8 16.5 2.5 15.2 2.2C15 2.2 14.9 2.1 14.9 2.1C14.9 1.9 9.3 2 9.2 2.1Z' />
		</svg>
	)
}

/**
 * Иконки держим здесь, а не в данных: файл с символами описывает факты о
 * юникоде и не должен тянуть за собой React.
 */
const ICONS: Record<
	string,
	IconType | typeof PubgMobileIcon | typeof MinecraftIcon | typeof StandoffIcon
> = {
	telegram: SiTelegram,
	discord: SiDiscord,
	steam: SiSteam,
	'steam-artwork': SiSteam,
	roblox: SiRoblox,
	pubg: PubgMobileIcon,
	instagram: SiInstagram,
	whatsapp: SiWhatsapp,
	ios: SiApple,
	vk: SiVk,
	tiktok: SiTiktok,
	x: SiX,
	minecraft: MinecraftIcon,
	standoff2: StandoffIcon
}

export function InvisiblePlatformGrid() {
	const [copiedId, setCopiedId] = useState<string | null>(null)
	// true — «сработало», false — «не сработало», отсутствие ключа — ещё не
	// оценивали. Один тап на площадку: как только оценка есть, обе кнопки
	// блокируются, поменять мнение нельзя (см. sendFeedback ниже).
	const [feedback, setFeedback] = useState<Record<string, boolean>>({})
	// Счётчики — сколько всего человек нажали каждую кнопку по площадке. Два
	// числа, не один net-score: см. platform-feedback-two-counts-vs-net-score
	// — цель диагностика «отвалилось ли», а не рейтинг, и разница между
	// «3 работает / 15 не работает» и «18 работает / 0 не работает» тонет в
	// одинаковом net +3.
	const [stats, setStats] = useState<
		Record<string, { works: number; broken: number }>
	>({})

	useEffect(() => {
		try {
			const loaded: Record<string, boolean> = {}
			for (const p of invisiblePlatforms) {
				const raw = localStorage.getItem(platformFeedbackKey(TOOL_ID, p.id))
				if (raw === 'works') loaded[p.id] = true
				else if (raw === 'broken') loaded[p.id] = false
			}
			setFeedback(loaded)
		} catch {
			// приватный режим — не критично, просто не подсветим отправленные
		}
	}, [])

	useEffect(() => {
		// Без БД локально возвращается {} (см. GET-хендлер) — грид просто не
		// покажет чисел, а не упадёт ошибкой.
		fetch(`/api/platform-feedback?toolId=${TOOL_ID}`)
			.then(response => (response.ok ? response.json() : {}))
			.then(setStats)
			.catch(() => {
				// сеть/БД недоступны — грид работает и без чисел
			})
	}, [])

	const copyFor = async (
		platformId: string,
		charId: string,
		platformName: string,
		charName: string
	) => {
		const char = getInvisibleChar(charId)
		if (!char) return

		// Символ невидим, поэтому в тосте называем его и площадку: пустое
		// уведомление выглядело бы поломкой (см. коммит 9f0ee46 выше по списку).
		try {
			await navigator.clipboard.writeText(char)
			setCopiedId(platformId)
			setTimeout(() => setCopiedId(null), 2000)
			toast.success(`${platformName}: скопирован ${charName}`)
		} catch {
			toast.error('Не удалось скопировать символ')
		}
	}

	// Один тап, без подтверждения и без текста — см. память
	// platform-feedback-friction-gap. Раньше единственным выходом для
	// недовольства площадкой была общая звезда рейтинга тула, площадку
	// указать было негде. works=true — «сработало», false — «не сработало»;
	// обе стороны идут в одну таблицу platform_feedback одним и тем же путём.
	const sendFeedback = async (
		platformId: string,
		charId: string,
		platformName: string,
		works: boolean
	) => {
		setFeedback(prev => ({ ...prev, [platformId]: works }))
		// +1 сразу, не дожидаясь ответа сервера — на успехе перезапишется
		// точным значением из RETURNING (см. POST ниже), на неудаче откатится
		// вместе с feedback в catch.
		setStats(prev => {
			const current = prev[platformId] ?? { works: 0, broken: 0 }
			return {
				...prev,
				[platformId]: works
					? { ...current, works: current.works + 1 }
					: { ...current, broken: current.broken + 1 }
			}
		})
		try {
			localStorage.setItem(
				platformFeedbackKey(TOOL_ID, platformId),
				works ? 'works' : 'broken'
			)
		} catch {
			// приватный режим — состояние проживёт только до перезагрузки
		}

		try {
			const response = await fetch('/api/platform-feedback', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					toolId: TOOL_ID,
					platformId,
					charId,
					works
				})
			})
			if (!response.ok) throw new Error('bad response')
			const counts: { works: number; broken: number } = await response.json()
			setStats(prev => ({ ...prev, [platformId]: counts }))
			toast.success(
				works
					? `Спасибо, отметили, что символ работает на ${platformName}`
					: `Спасибо, передали разработчику про ${platformName}`
			)
		} catch {
			toast.error('Не удалось отправить, попробуйте позже')
			setFeedback(prev => {
				const next = { ...prev }
				delete next[platformId]
				return next
			})
			setStats(prev => {
				const current = prev[platformId]
				if (!current) return prev
				return {
					...prev,
					[platformId]: works
						? { ...current, works: Math.max(0, current.works - 1) }
						: { ...current, broken: Math.max(0, current.broken - 1) }
				}
			})
			try {
				localStorage.removeItem(platformFeedbackKey(TOOL_ID, platformId))
			} catch {
				// приватный режим
			}
		}
	}

	return (
		<Card className='mt-6 overflow-hidden p-0'>
			<div className='border-b bg-muted/30 px-5 py-3 sm:px-6'>
				<p className='text-sm text-muted-foreground'>
					Площадки периодически закрывают лазейки с невидимыми символами,
					поэтому список быстро устаревает. Нашли рабочий символ —{' '}
					<FeedbackModal
						defaultType='feature'
						trigger={
							<button
								type='button'
								className='cursor-pointer text-primary hover:underline'
							>
								напишите нам
							</button>
						}
					/>
				</p>
			</div>

			<div className='grid gap-px bg-border sm:grid-cols-2'>
				{invisiblePlatforms.map(platform => {
					const Icon = ICONS[platform.id]
					const char = invisibleCharacters.find(c => c.id === platform.charId)
					const copied = copiedId === platform.id
					const blocked = !platform.charId
					const platformFeedback = feedback[platform.id]
					const rated = platformFeedback !== undefined
					const platformStats = stats[platform.id]

					return (
						<div
							key={platform.id}
							// Ховер живёт на строке целиком, не на кнопке «Скопировать»:
							// раньше подсветка обрывалась ровно на её правом крае, а
							// таблетка с 👍/👎 оставалась вне подсветки — казалось, что фон
							// обрезан криво. group здесь только при !blocked — у
							// заблокированных площадок нет ни одного клика, значит и
							// подсвечивать при наведении нечего.
							className={cn(
								'flex items-center gap-2 bg-background pr-3 transition-colors sm:pr-4',
								!blocked && 'group hover:bg-muted/40'
							)}
						>
							{blocked ? (
								<div className='flex flex-1 items-center gap-4 px-5 py-4 text-left sm:px-6'>
									{Icon ? (
										<Icon
											className='h-6 w-6 shrink-0 text-muted-foreground'
											aria-hidden
										/>
									) : null}
									<span className='min-w-0 flex-1'>
										<span className='font-medium text-foreground'>
											{platform.name}
										</span>
										<span className='mt-0.5 block text-xs text-muted-foreground'>
											заблокировано разработчиками
										</span>
									</span>
									<Ban className='h-4 w-4 shrink-0 text-muted-foreground' />
								</div>
							) : (
								<>
									<button
										type='button'
										onClick={() =>
											copyFor(
												platform.id,
												platform.charId as string,
												platform.name,
												char?.name ?? 'символ'
											)
										}
										title={`Скопировать символ для ${platform.name}`}
										className='flex flex-1 cursor-pointer items-center gap-4 py-4 pl-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:pl-6'
									>
										{Icon ? (
											<Icon
												className='h-6 w-6 shrink-0 text-muted-foreground group-hover:text-foreground'
												aria-hidden
											/>
										) : null}

										<span className='min-w-0 flex-1'>
											<span className='font-medium text-foreground'>
												{platform.name}
											</span>
											<span className='mt-0.5 block text-xs text-muted-foreground'>
												{`${char?.name} ${char?.codepoint}`}
											</span>
										</span>

										<span className='shrink-0 text-muted-foreground group-hover:text-foreground'>
											{copied ? (
												<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
											) : (
												<Copy className='h-4 w-4' />
											)}
										</span>
									</button>

									{/* Пара 👍/👎 живёт в общей «таблетке», не как два отдельных
									    значка рядом с копированием: по одиночке они читались как
									    третья несвязанная сущность — палец у lucide визуально
									    гораздо «плотнее» галочки и скрепок копирования при
									    одинаковом реальном размере 16px и той же обводке 2px (см.
									    getComputedStyle) — глазом это не считывалось как совпадение.
									    Ховер нейтральный (bg-muted, text-foreground), как у
									    копирования: подсветка зелёным/красным ДО клика забегала
									    вперёд решения, которое ещё не принято — cвет-подтверждение
									    остаётся только за уже сделанным выбором (см. platformFeedback
									    ниже). */}
									<div className='flex shrink-0 items-center gap-0.5 rounded-md border p-0.5'>
										<button
											type='button'
											disabled={rated}
											onClick={() =>
												sendFeedback(
													platform.id,
													platform.charId as string,
													platform.name,
													true
												)
											}
											title={
												rated
													? 'Уже оценили, спасибо'
													: `Символ сработал на ${platform.name}`
											}
											className='inline-flex cursor-pointer items-center justify-center gap-1 rounded-sm px-1.5 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-default disabled:hover:bg-transparent'
										>
											<ThumbsUp
												className={
													platformFeedback === true
														? 'h-3.5 w-3.5 text-green-600 dark:text-green-400'
														: 'h-3.5 w-3.5'
												}
												aria-hidden
											/>
											{/* Ноль не показываем — на свежих площадках (Minecraft,
											    Standoff 2) это просто шум, а не сигнал. */}
											{!!platformStats?.works && (
												<span
													className={cn(
														'text-[11px] tabular-nums',
														platformFeedback === true &&
															'text-green-600 dark:text-green-400'
													)}
												>
													{platformStats.works}
												</span>
											)}
											<span className='sr-only'>
												Символ сработал на {platform.name}
												{platformStats?.works
													? `, отметили ${platformStats.works} раз`
													: ''}
											</span>
										</button>

										<div className='h-4 w-px bg-border' aria-hidden />

										<button
											type='button'
											disabled={rated}
											onClick={() =>
												sendFeedback(
													platform.id,
													platform.charId as string,
													platform.name,
													false
												)
											}
											title={
												rated
													? 'Уже оценили, спасибо'
													: `Символ не сработал на ${platform.name}`
											}
											className='inline-flex cursor-pointer items-center justify-center gap-1 rounded-sm px-1.5 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-default disabled:hover:bg-transparent'
										>
											<ThumbsDown
												className={
													platformFeedback === false
														? 'h-3.5 w-3.5 text-destructive'
														: 'h-3.5 w-3.5'
												}
												aria-hidden
											/>
											{!!platformStats?.broken && (
												<span
													className={cn(
														'text-[11px] tabular-nums',
														platformFeedback === false && 'text-destructive'
													)}
												>
													{platformStats.broken}
												</span>
											)}
											<span className='sr-only'>
												Символ не сработал на {platform.name}
												{platformStats?.broken
													? `, отметили ${platformStats.broken} раз`
													: ''}
											</span>
										</button>
									</div>
								</>
							)}
						</div>
					)
				})}
			</div>
		</Card>
	)
}

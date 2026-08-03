'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/* Одна и та же связка нужна и на баннере, и в попапе. Держим её в одном месте,
   иначе стиль клавиш в двух точках воронки неизбежно разъедется. */
function KeycapCombo({
	letter,
	/** Какая из двух клавиш проседает на ховер карточки. Пара выбирается так,
	 *  чтобы нажатыми оказались углы композиции по диагонали. */
	press
}: {
	letter: string
	press?: 'ctrl' | 'letter'
}) {
	return (
		<div className='flex items-center gap-2'>
			<span
				className={cn('keycap keycap-wide', press === 'ctrl' && 'keycap-press')}
			>
				<span className='keycap-letter'>Ctrl</span>
			</span>
			<span className='text-lg font-semibold text-white/80 drop-shadow'>+</span>
			<span className={cn('keycap', press === 'letter' && 'keycap-press')}>
				<span className='keycap-letter'>{letter}</span>
			</span>
		</div>
	)
}

/* Своя проверка вместо нативной: браузерная подсказка приходит на языке
   интерфейса (у большинства — английская), всплывает поверх текста и не
   стилизуется. Правило намеренно простое — отсечь опечатки, а не пытаться
   доказать существование ящика: это всё равно делает только письмо. */
function validateEmail(value: string) {
	if (!value) return 'Введите email — на него придёт PDF'
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
		return 'Похоже, в адресе опечатка'
	}
	return ''
}

export function LeadMagnetCard() {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	const [email, setEmail] = useState('')
	const [company, setCompany] = useState('') // honeypot, должно оставаться пустым
	const [loading, setLoading] = useState(false)
	const [sent, setSent] = useState(false)
	const [error, setError] = useState('')
	// Обе галки пустые по умолчанию: предустановленное согласие законом не
	// признаётся — человек должен совершить активное действие.
	const [consentData, setConsentData] = useState(false)
	const [consentAds, setConsentAds] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (loading) return

		const address = email.trim()
		const problem = validateEmail(address)
		if (problem) {
			setError(problem)
			return
		}

		if (!consentData) {
			setError('Отметьте согласие на обработку персональных данных')
			return
		}

		setLoading(true)
		setError('')

		try {
			const response = await fetch('/api/leads', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: address,
					company,
					source: pathname,
					consentData,
					consentAds
				})
			})

			if (!response.ok) throw new Error('request failed')
			setSent(true)
		} catch {
			setError('Не получилось отправить. Попробуйте ещё раз')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={next => {
				setOpen(next)
				if (!next) {
					setTimeout(() => {
						setSent(false)
						setEmail('')
						setError('')
						setConsentData(false)
						setConsentAds(false)
					}, 200)
				}
			}}
		>
			<DialogTrigger asChild>
				<button
					type='button'
					className='keycap-scene group block w-full cursor-pointer text-left'
				>
					<div className='overflow-hidden rounded-2xl border bg-card shadow-sm transition-colors hover:border-primary/40'>
						<div className='relative aspect-[4/5] w-full'>
							{/* Нижний слой всегда полностью виден — верхний плавно
							    гаснет на hover, открывая его. Одна анимируемая
							    прозрачность вместо двух встречных. */}
							<Image
								src='/images/lead-magnet/card-banner-hover-v2.png'
								alt=''
								fill
								sizes='320px'
								className='object-cover'
							/>
							<Image
								src='/images/lead-magnet/card-banner-v2.png'
								alt=''
								fill
								priority
								sizes='320px'
								className='object-cover transition-opacity duration-500 group-hover:opacity-0'
							/>
							{/* Текстовый блок занимает нижнюю треть, поэтому затемнение
							    держим плотным до середины — иначе заголовок ложится на
							    светлые участки картинки. */}
							<div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 via-45% to-transparent' />

							{/* Ctrl+C и Ctrl+V — самые узнаваемые сочетания, они же
							    объясняют, что внутри, без единого слова. Внутри ряда
							    клавиши держат строй, а сами ряды качаются врозь.
							    Смещение задано полями, а не translate: transform уже
							    занят анимацией. */}
							<div
								className='pointer-events-none absolute inset-x-0 top-[16%] flex flex-col items-center gap-8'
								aria-hidden='true'
							>
								<div className='keycap-float mr-12'>
									<KeycapCombo letter='C' press='ctrl' />
								</div>
								<div className='keycap-float-alt ml-12'>
									<KeycapCombo letter='V' press='letter' />
								</div>
							</div>

							{/* Продающая связка: что получишь (конкретное число), зачем
							    оно нужно и что для этого сделать. Цифра честная —
							    ровно столько сочетаний в SECTIONS у генератора PDF. */}
							<div className='pointer-events-none absolute inset-x-3 bottom-3'>
								{/* На ховер заголовок чуть уходит в холодный оттенок — сигнал
								    «это кликабельно», но без смены смысла: белый остаётся
								    белым, меняется только температура. */}
								<p className='font-heading text-[1.375rem] font-bold leading-tight tracking-tight text-white transition-colors duration-300 group-hover:text-blue-200'>
									{/* Цифра — главный крючок оффера, поэтому она крупнее
									    остального заголовка. align-baseline держит её на
									    одной линии со строкой, а leading-none не даёт
									    раздуть межстрочный интервал первой строки. */}
									<span className='align-baseline text-[2rem] leading-none'>
										100
									</span>{' '}
									горячих клавиш, которые экономят часы
								</p>
								<p className='mt-1.5 text-sm font-medium text-white/90'>
									Получить бесплатную шпаргалку →
								</p>
							</div>
						</div>
					</div>
				</button>
			</DialogTrigger>

			{/* Картинка идёт до самых краёв, поэтому рамка не нужна, а overflow
			    обрезает её по скруглению. Крестик лежит поверх тёмного фона: белый
			    значок на полупрозрачной подложке, иначе он теряется. На экране
			    «письмо ушло» картинки нет — там оставляем крестик как был. */}
			<DialogContent
				className={cn(
					'overflow-hidden border-0 sm:max-w-[30rem]',
					!sent &&
						'[&>button]:rounded-full [&>button]:bg-black/40 [&>button]:p-1.5 [&>button]:text-white [&>button]:opacity-100 [&>button]:backdrop-blur-sm [&>button]:hover:bg-black/60'
				)}
			>
				{sent ? (
					<div className='flex flex-col items-center gap-3 py-6 text-center'>
						<div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950'>
							<Check className='h-6 w-6 text-green-600 dark:text-green-400' />
						</div>
						<DialogTitle className='font-heading text-lg'>
							Письмо уже в пути
						</DialogTitle>
						<DialogDescription className='max-w-xs'>
							Шпаргалка со 100 клавишами летит на {email}. Если её нет через
							пару минут — загляните в «Промоакции» и спам.
						</DialogDescription>
						<Button
							onClick={() => setOpen(false)}
							variant='outline'
							className='mt-2 cursor-pointer'
						>
							Закрыть
						</Button>
					</div>
				) : (
					<>
						{/* Продолжение баннера, а не новый экран: та же картинка, те же
						    клавиши. Текста минимум — визуал уже объяснил, что внутри. */}
						<div className='relative -mx-6 -mt-6 h-60'>
							<Image
								src='/images/lead-magnet/card-banner-v2.png'
								alt=''
								fill
								sizes='480px'
								className='object-cover'
							/>
							<div className='absolute inset-0 bg-black/25' />
							{/* Раскладка та же, что на баннере: по диагонали и врозь —
							    человек узнаёт картинку, по которой кликнул. */}
							<div
								className='absolute inset-0 flex flex-col items-center justify-center gap-6'
								aria-hidden='true'
							>
								<div className='keycap-float mr-16'>
									<KeycapCombo letter='C' />
								</div>
								<div className='keycap-float-alt ml-16'>
									<KeycapCombo letter='V' />
								</div>
							</div>
						</div>

						<DialogHeader>
							<DialogTitle className='font-heading text-2xl leading-tight tracking-tight'>
								100 горячих клавиш
							</DialogTitle>
							<DialogDescription>
								Шпаргалка в PDF: Windows, macOS, браузер, Excel, Zoom,
								презентации.
							</DialogDescription>
						</DialogHeader>

						{/* noValidate снимает нативные подсказки браузера — проверяем
						    сами и показываем ошибку по-русски рядом с полем. */}
						<form onSubmit={handleSubmit} noValidate className='space-y-3'>
							<input
								type='text'
								name='company'
								value={company}
								onChange={e => setCompany(e.target.value)}
								tabIndex={-1}
								autoComplete='off'
								className='absolute h-0 w-0 opacity-0'
								aria-hidden='true'
							/>
							{/* Поле и кнопка в одну строку: так форма читается как один
							    шаг, а не как анкета. Кнопка не сжимается, поле забирает
							    остаток ширины. */}
							<div className='flex gap-2'>
								<Input
									type='email'
									autoFocus
									placeholder='Email'
									value={email}
									onChange={e => {
										setEmail(e.target.value)
										// Ошибка гаснет, как только человек начал её править:
										// держать красное поле под рукой, которая уже
										// исправляет, — лишнее давление.
										if (error) setError('')
									}}
									aria-invalid={!!error}
									aria-describedby={error ? 'lead-magnet-error' : undefined}
									className={cn(
										'h-12 flex-1 text-base',
										error && 'border-destructive focus-visible:ring-destructive'
									)}
								/>

								<Button
									type='submit'
									className='h-12 shrink-0 cursor-pointer px-6 text-base'
									disabled={loading}
								>
									{loading ? (
										<>
											<Loader2 className='mr-2 h-4 w-4 animate-spin' />
											Отправляем…
										</>
									) : (
										'Получить'
									)}
								</Button>
							</div>

							{error && (
								<p
									id='lead-magnet-error'
									className='text-sm text-destructive'
									role='alert'
								>
									{error}
								</p>
							)}

							{/* Две раздельные галки, обе пустые по умолчанию. Объединять их
							    нельзя: согласие должно быть конкретным, человек вправе
							    забрать шпаргалку и отказаться от рассылки. Факт согласия
							    и редакция документов пишутся в БД — по ч. 1 ст. 9 152-ФЗ
							    доказывать его обязан оператор. */}
							<div className='space-y-2 pt-1'>
								<label className='flex cursor-pointer items-start gap-2 text-[11px] leading-snug text-muted-foreground'>
									<input
										type='checkbox'
										checked={consentData}
										onChange={e => {
											setConsentData(e.target.checked)
											if (error) setError('')
										}}
										className='mt-px h-3.5 w-3.5 shrink-0 cursor-pointer accent-primary'
									/>
									<span>
										Соглашаюсь с{' '}
										<a
											href='/downloads/legal/politika-obrabotki-personalnyh-dannyh.pdf'
											download
											className='cursor-pointer underline'
										>
											политикой обработки персональных данных
										</a>{' '}
										и даю{' '}
										<a
											href='/downloads/legal/soglasie-na-obrabotku-personalnyh-dannyh.pdf'
											download
											className='cursor-pointer underline'
										>
											согласие на их обработку
										</a>
									</span>
								</label>

								<label className='flex cursor-pointer items-start gap-2 text-[11px] leading-snug text-muted-foreground'>
									<input
										type='checkbox'
										checked={consentAds}
										onChange={e => setConsentAds(e.target.checked)}
										className='mt-px h-3.5 w-3.5 shrink-0 cursor-pointer accent-primary'
									/>
									<span>
										Даю{' '}
										<a
											href='/downloads/legal/soglasie-na-reklamnuyu-rassylku.pdf'
											download
											className='cursor-pointer underline'
										>
											согласие на рассылку
										</a>{' '}
										— письма о новых инструментах. Необязательно
									</span>
								</label>
							</div>
						</form>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}

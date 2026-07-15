'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	CheckCircle2,
	AlertTriangle,
	XCircle,
	Info,
	ShieldCheck,
	Loader2,
	Upload
} from 'lucide-react'
import { cn } from '@/lib/utils'

/** Сообщение из Nu HTML Checker (validator.w3.org/nu). */
interface W3CMessage {
	type: 'error' | 'info' | 'non-document-error'
	subType?: 'warning' | 'fatal'
	message: string
	lastLine?: number
	extract?: string
}

type Severity = 'error' | 'warning' | 'info'
type Mode = 'text' | 'url' | 'file'

const NU_ENDPOINT = 'https://validator.w3.org/nu/?out=json'

function severityOf(msg: W3CMessage): Severity {
	if (msg.type === 'error' || msg.subType === 'fatal') return 'error'
	if (msg.subType === 'warning') return 'warning'
	return 'info'
}

const SEVERITY_META: Record<
	Severity,
	{ icon: typeof XCircle; className: string; label: string }
> = {
	error: { icon: XCircle, className: 'text-red-600', label: 'Ошибка' },
	warning: {
		icon: AlertTriangle,
		className: 'text-amber-600',
		label: 'Предупреждение'
	},
	info: { icon: Info, className: 'text-blue-600', label: 'Заметка' }
}

const MODES: { id: Mode; label: string }[] = [
	{ id: 'text', label: 'Из поля ввода' },
	{ id: 'url', label: 'По адресу' },
	{ id: 'file', label: 'Из файла' }
]

/**
 * Проверка разметки через официальный Nu HTML Checker (движок validator.w3.org).
 * У сервиса открытый CORS, поэтому запросы идут прямо из браузера — свой сервер
 * не нужен. Три источника: код из поля ввода виджета, чужой адрес и файл.
 *
 * @param html — текущий HTML из поля ввода виджета (для режима «Из поля ввода»).
 */
export function W3CValidation({ html }: { html: string }) {
	const [mode, setMode] = useState<Mode>('text')
	const [url, setUrl] = useState('')
	const [messages, setMessages] = useState<W3CMessage[] | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const request = async (init: RequestInit) => {
		setLoading(true)
		setError(null)
		setMessages(null)
		try {
			const response = await fetch(NU_ENDPOINT, init)
			if (!response.ok) throw new Error(String(response.status))
			const data = (await response.json()) as { messages: W3CMessage[] }
			setMessages(data.messages ?? [])
		} catch {
			setError(
				'Не удалось связаться с валидатором W3C. Проверьте соединение и попробуйте ещё раз.'
			)
		} finally {
			setLoading(false)
		}
	}

	const validateBody = (body: string) =>
		request({
			method: 'POST',
			headers: { 'Content-Type': 'text/html; charset=utf-8' },
			body
		})

	const validateText = () => {
		if (!html.trim()) {
			setError('Поле ввода пустое — вставьте HTML выше')
			return
		}
		validateBody(html)
	}

	const validateUrl = () => {
		const trimmed = url.trim()
		if (!trimmed) {
			setError('Введите адрес страницы')
			return
		}
		let target: URL
		try {
			target = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`)
		} catch {
			setError('Не похоже на адрес сайта')
			return
		}
		// Валидатор сам сходит на страницу по ?doc — прокси нам не нужен.
		setLoading(true)
		setError(null)
		setMessages(null)
		fetch(`${NU_ENDPOINT}&doc=${encodeURIComponent(target.toString())}`)
			.then(async response => {
				if (!response.ok) throw new Error(String(response.status))
				const data = (await response.json()) as { messages: W3CMessage[] }
				setMessages(data.messages ?? [])
			})
			.catch(() =>
				setError('Не удалось проверить адрес. Возможно, страница недоступна.')
			)
			.finally(() => setLoading(false))
	}

	const validateFile = async (file: File) => {
		try {
			const text = await file.text()
			await validateBody(text)
		} catch {
			setError('Не удалось прочитать файл')
		}
	}

	const run = () => {
		if (mode === 'text') validateText()
		else if (mode === 'url') validateUrl()
		else fileInputRef.current?.click()
	}

	const counts = messages
		? messages.reduce(
				(acc, msg) => {
					acc[severityOf(msg)]++
					return acc
				},
				{ error: 0, warning: 0, info: 0 } as Record<Severity, number>
			)
		: null

	return (
		<div className='space-y-4'>
			<div>
				<h3 className='text-lg font-semibold'>Валидация W3C</h3>
				<p className='text-sm text-muted-foreground'>
					Официальная проверка разметки — тот же движок, что на
					validator.w3.org.
				</p>
			</div>

			{/* Переключатель источника */}
			<div className='inline-flex rounded-lg border p-1'>
				{MODES.map(item => (
					<button
						key={item.id}
						type='button'
						onClick={() => {
							setMode(item.id)
							setError(null)
						}}
						className={cn(
							'cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
							mode === item.id
								? 'bg-primary text-primary-foreground'
								: 'text-muted-foreground hover:text-foreground'
						)}
					>
						{item.label}
					</button>
				))}
			</div>

			<div className='flex flex-wrap items-center gap-2'>
				{mode === 'url' && (
					<Input
						value={url}
						onChange={event => setUrl(event.target.value)}
						onKeyDown={event => event.key === 'Enter' && validateUrl()}
						placeholder='example.com'
						aria-label='Адрес страницы для проверки'
						className='max-w-sm'
					/>
				)}

				<Button onClick={run} disabled={loading} className='cursor-pointer'>
					{loading ? (
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
					) : mode === 'file' ? (
						<Upload className='mr-2 h-4 w-4' />
					) : (
						<ShieldCheck className='mr-2 h-4 w-4' />
					)}
					{loading
						? 'Проверяем…'
						: mode === 'file'
							? 'Выбрать файл'
							: 'Проверить'}
				</Button>

				<input
					ref={fileInputRef}
					type='file'
					accept='.html,.htm,.xml,.svg,text/html'
					className='hidden'
					onChange={event => {
						const file = event.target.files?.[0]
						if (file) validateFile(file)
						event.target.value = ''
					}}
				/>
			</div>

			{error && (
				<div className='flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-600'>
					<AlertTriangle className='h-4 w-4 shrink-0' />
					{error}
				</div>
			)}

			{counts && (
				<div className='flex flex-wrap gap-2'>
					<Badge variant={counts.error > 0 ? 'destructive' : 'secondary'}>
						Ошибок: {counts.error}
					</Badge>
					<Badge variant='secondary'>Предупреждений: {counts.warning}</Badge>
					<Badge variant='secondary'>Заметок: {counts.info}</Badge>
				</div>
			)}

			{messages?.length === 0 && (
				<div className='py-8 text-center'>
					<CheckCircle2 className='mx-auto mb-3 h-12 w-12 text-green-600' />
					<h4 className='text-lg font-semibold text-green-600'>
						Ошибок не найдено
					</h4>
					<p className='text-muted-foreground'>
						Разметка проходит проверку W3C.
					</p>
				</div>
			)}

			{messages && messages.length > 0 && (
				<ul className='space-y-2'>
					{messages.map((msg, index) => {
						const meta = SEVERITY_META[severityOf(msg)]
						const Icon = meta.icon

						return (
							<li
								key={index}
								className='rounded-lg border bg-muted/20 p-4 text-sm'
							>
								<div className='flex items-start gap-3'>
									<Icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.className}`} />
									<div className='min-w-0 flex-1'>
										<div className='flex items-center gap-2'>
											<span className={`text-xs font-medium ${meta.className}`}>
												{meta.label}
											</span>
											{msg.lastLine && (
												<span className='text-xs text-muted-foreground'>
													строка {msg.lastLine}
												</span>
											)}
										</div>
										<p className='mt-1'>{msg.message}</p>
										{msg.extract && (
											<pre className='mt-2 overflow-x-auto rounded bg-muted px-2 py-1 font-mono text-xs'>
												<code>{msg.extract}</code>
											</pre>
										)}
									</div>
								</div>
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	CheckCircle2,
	AlertTriangle,
	XCircle,
	Info,
	ShieldCheck,
	Loader2
} from 'lucide-react'

/** Сообщение из Nu HTML Checker (validator.w3.org/nu). */
interface W3CMessage {
	type: 'error' | 'info' | 'non-document-error'
	subType?: 'warning' | 'fatal'
	message: string
	lastLine?: number
	firstLine?: number
	extract?: string
}

type Severity = 'error' | 'warning' | 'info'

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

/**
 * Проверка разметки через официальный Nu HTML Checker (тот же движок, что на
 * validator.w3.org). У сервиса открытый CORS, поэтому запрос идёт прямо из
 * браузера — свой сервер-прокси не нужен, и код никуда, кроме W3C, не уходит.
 */
export function W3CValidation({ html }: { html: string }) {
	const [messages, setMessages] = useState<W3CMessage[] | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const validate = async () => {
		if (!html.trim()) {
			setError('Сначала вставьте HTML в поле выше')
			return
		}

		setLoading(true)
		setError(null)
		setMessages(null)

		try {
			const response = await fetch('https://validator.w3.org/nu/?out=json', {
				method: 'POST',
				headers: { 'Content-Type': 'text/html; charset=utf-8' },
				body: html
			})

			if (!response.ok) {
				throw new Error(`Валидатор ответил ${response.status}`)
			}

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
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<div>
					<h3 className='text-lg font-semibold'>Валидация W3C</h3>
					<p className='text-sm text-muted-foreground'>
						Официальная проверка разметки — тот же движок, что на
						validator.w3.org.
					</p>
				</div>
				<Button
					onClick={validate}
					disabled={loading}
					className='cursor-pointer'
				>
					{loading ? (
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
					) : (
						<ShieldCheck className='mr-2 h-4 w-4' />
					)}
					{loading ? 'Проверяем…' : 'Проверить'}
				</Button>
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
						const severity = severityOf(msg)
						const meta = SEVERITY_META[severity]
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

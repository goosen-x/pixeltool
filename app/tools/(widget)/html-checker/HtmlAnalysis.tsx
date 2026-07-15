'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	AlertTriangle,
	XCircle,
	CheckCircle2,
	Loader2,
	Download
} from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
	analyzeDocument,
	type AnalysisReport
} from '@/lib/html-analysis/analyze'
import { validateW3C, w3cCategory } from '@/lib/html-analysis/w3c'
import { lintHtml } from '@/lib/html-analysis/lint'
import { downloadAnalysisPdf } from '@/lib/html-analysis/report-pdf'
import { ScoreGauge } from './ScoreGauge'

/** Цвет балла: зелёный от 90, янтарный от 60, иначе красный. */
function scoreColor(score: number): string {
	if (score >= 90) return 'text-green-600'
	if (score >= 60) return 'text-amber-600'
	return 'text-red-600'
}

export function HtmlAnalysis({ html }: { html: string }) {
	const [report, setReport] = useState<AnalysisReport | null>(null)
	const [loading, setLoading] = useState(false)
	const [downloading, setDownloading] = useState(false)

	// Свежий html в ref, чтобы отложенный анализ брал последнее значение и не
	// тянул html в зависимости эффекта.
	const htmlRef = useRef(html)
	htmlRef.current = html

	// Линтинг синхронный и без сети — считаем сразу по строке разметки.
	const lint = useMemo(() => lintHtml(html), [html])

	const run = async () => {
		const current = htmlRef.current
		if (!current.trim()) return
		setLoading(true)
		try {
			const local = analyzeDocument(current)

			// W3C — по сети. Если сервис недоступен, показываем локальный отчёт без
			// категории валидности, а не роняем весь анализ.
			let validity
			try {
				validity = w3cCategory(await validateW3C(current))
			} catch {
				toast.warning(
					'Валидатор W3C недоступен — отчёт без проверки валидности'
				)
			}

			const categories = validity
				? [...local.categories, validity]
				: local.categories
			const overall = Math.round(
				categories.reduce((sum, c) => sum + c.score, 0) / categories.length
			)

			setReport({ ...local, categories, overall })
		} finally {
			setLoading(false)
		}
	}

	// Анализ запускается сам, как только появился HTML. Дебаунс — потому что
	// W3C ходит по сети: без задержки печать в поле спамила бы валидатор.
	useEffect(() => {
		if (!html.trim()) {
			setReport(null)
			return
		}
		const timer = setTimeout(() => {
			void run()
		}, 900)
		return () => clearTimeout(timer)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [html])

	const download = async () => {
		if (!report) return
		setDownloading(true)
		try {
			await downloadAnalysisPdf(report, new Date().toLocaleString('ru-RU'))
		} catch {
			toast.error('Не удалось собрать PDF')
		} finally {
			setDownloading(false)
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<div>
					<h3 className='flex items-center gap-2 text-lg font-semibold'>
						Анализ качества
						{loading && (
							<span className='inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary'>
								<Loader2 className='h-3 w-3 animate-spin' />
								Проверяем W3C…
							</span>
						)}
					</h3>
					<p className='text-sm text-muted-foreground'>
						Семантика, доступность, заголовки и валидность W3C — одной оценкой.
						Обновляется автоматически.
					</p>
				</div>
				{report && !loading && (
					<Button
						variant='outline'
						onClick={download}
						disabled={downloading}
						className='cursor-pointer'
					>
						{downloading ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						) : (
							<Download className='mr-2 h-4 w-4' />
						)}
						Скачать PDF
					</Button>
				)}
			</div>

			{loading ? (
				/* Скелетоны на месте гейджа и плиток, пока идёт анализ (ждём W3C) */
				<div className='grid gap-4 lg:grid-cols-[minmax(0,16rem)_1fr]'>
					<div className='flex flex-col justify-center rounded-xl border bg-muted/30 p-4'>
						<div className='flex flex-col items-center gap-3 py-3'>
							<Skeleton className='h-24 w-40 rounded-t-full' />
							<Skeleton className='h-3 w-20' />
						</div>
					</div>
					<div className='grid gap-3 sm:grid-cols-2'>
						{Array.from({ length: 4 }).map((_, index) => (
							<div
								key={index}
								className='flex items-center justify-between rounded-xl border p-4'
							>
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-7 w-10' />
							</div>
						))}
					</div>
				</div>
			) : (
				report && (
					<>
						{/* Общий балл датчиком, категории — плитками рядом */}
						<div className='grid gap-4 lg:grid-cols-[minmax(0,16rem)_1fr]'>
							<div className='flex flex-col items-center justify-center rounded-xl border bg-muted/30 p-4'>
								<ScoreGauge score={report.overall} />
								<div className='text-center text-xs text-muted-foreground'>
									Общий балл
								</div>
							</div>
							<div className='grid gap-3 sm:grid-cols-2'>
								{report.categories.map(category => (
									<div
										key={category.key}
										className='flex items-center justify-between rounded-xl border p-4'
									>
										<span className='text-sm text-muted-foreground'>
											{category.label}
										</span>
										<span
											className={cn(
												'text-2xl font-bold',
												scoreColor(category.score)
											)}
										>
											{category.score}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Проблемы по категориям */}
						{report.categories.map(category => (
							<div key={category.key}>
								<h4 className='mb-2 font-semibold'>{category.label}</h4>
								{category.checks.length === 0 ? (
									<div className='flex items-center gap-2 text-sm text-green-600'>
										<CheckCircle2 className='h-4 w-4' />
										Проблем не найдено
									</div>
								) : (
									<ul className='space-y-2'>
										{category.checks.map((check, index) => {
											const isError = check.severity === 'error'
											const Icon = isError ? XCircle : AlertTriangle
											return (
												<li
													key={index}
													className='rounded-lg border bg-muted/20 p-3 text-sm'
												>
													<div className='flex items-start gap-2'>
														<Icon
															className={cn(
																'mt-0.5 h-4 w-4 shrink-0',
																isError ? 'text-red-600' : 'text-amber-600'
															)}
														/>
														<div>
															<div className='font-medium'>{check.title}</div>
															{check.detail && (
																<p className='mt-1 text-muted-foreground'>
																	{check.detail}
																</p>
															)}
														</div>
													</div>
												</li>
											)
										})}
									</ul>
								)}
							</div>
						))}

						{/* Линтинг — отдельный список замечаний HTMLHint, не влияет на балл */}
						<div>
							<h4 className='mb-2 flex items-center gap-2 font-semibold'>
								Линтинг
								{lint.length > 0 && (
									<span className='rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums'>
										{lint.length}
									</span>
								)}
							</h4>
							{lint.length === 0 ? (
								<div className='flex items-center gap-2 text-sm text-green-600'>
									<CheckCircle2 className='h-4 w-4' />
									Проблем не найдено
								</div>
							) : (
								<ul className='space-y-2'>
									{lint.map((msg, index) => {
										const isError = msg.severity === 'error'
										const Icon = isError ? XCircle : AlertTriangle
										return (
											<li
												key={index}
												className='rounded-lg border bg-muted/20 p-3 text-sm'
											>
												<div className='flex items-start gap-2'>
													<Icon
														className={cn(
															'mt-0.5 h-4 w-4 shrink-0',
															isError ? 'text-red-600' : 'text-amber-600'
														)}
													/>
													<div className='min-w-0'>
														<div className='flex flex-wrap items-center gap-2'>
															<a
																href={msg.link}
																target='_blank'
																rel='noopener noreferrer'
																className='cursor-pointer rounded bg-muted px-1.5 py-0.5 font-mono text-xs hover:underline'
															>
																{msg.rule}
															</a>
															<span className='text-xs text-muted-foreground tabular-nums'>
																строка {msg.line}:{msg.col}
															</span>
														</div>
														<p className='mt-1'>{msg.message}</p>
													</div>
												</div>
											</li>
										)
									})}
								</ul>
							)}
						</div>
					</>
				)
			)}
		</div>
	)
}

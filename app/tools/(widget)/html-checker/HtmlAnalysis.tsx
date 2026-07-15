'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	AlertTriangle,
	XCircle,
	CheckCircle2,
	Loader2,
	Download,
	ShieldCheck
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { analyzeDocument, type AnalysisReport } from '@/lib/html-analysis/analyze'
import { validateW3C, w3cCategory } from '@/lib/html-analysis/w3c'
import { downloadAnalysisPdf } from '@/lib/html-analysis/report-pdf'

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

	const run = async () => {
		if (!html.trim()) {
			toast.error('Сначала введите HTML')
			return
		}
		setLoading(true)
		try {
			const local = analyzeDocument(html)

			// W3C — по сети. Если сервис недоступен, показываем локальный отчёт без
			// категории валидности, а не роняем весь анализ.
			let validity
			try {
				validity = w3cCategory(await validateW3C(html))
			} catch {
				toast.warning('Валидатор W3C недоступен — отчёт без проверки валидности')
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

	const download = async () => {
		if (!report) return
		setDownloading(true)
		try {
			await downloadAnalysisPdf(
				report,
				new Date().toLocaleString('ru-RU')
			)
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
					<h3 className='text-lg font-semibold'>Анализ качества</h3>
					<p className='text-sm text-muted-foreground'>
						Семантика, доступность, заголовки и валидность W3C — одной оценкой.
					</p>
				</div>
				<div className='flex gap-2'>
					{report && (
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
					<Button onClick={run} disabled={loading} className='cursor-pointer'>
						{loading ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						) : (
							<ShieldCheck className='mr-2 h-4 w-4' />
						)}
						{loading ? 'Анализируем…' : 'Анализировать'}
					</Button>
				</div>
			</div>

			{report && (
				<>
					{/* Баллы */}
					<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
						<div className='rounded-xl border bg-muted/30 p-4 text-center'>
							<div className={cn('text-3xl font-bold', scoreColor(report.overall))}>
								{report.overall}
							</div>
							<div className='mt-1 text-xs text-muted-foreground'>Общий балл</div>
						</div>
						{report.categories.map(category => (
							<div
								key={category.key}
								className='rounded-xl border p-4 text-center'
							>
								<div
									className={cn(
										'text-3xl font-bold',
										scoreColor(category.score)
									)}
								>
									{category.score}
								</div>
								<div className='mt-1 text-xs text-muted-foreground'>
									{category.label}
								</div>
							</div>
						))}
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
				</>
			)}
		</div>
	)
}

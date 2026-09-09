'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function WebmasterStatsImportForm() {
	const router = useRouter()
	const [csv, setCsv] = useState('')
	const [status, setStatus] = useState<
		| { kind: 'idle' }
		| { kind: 'saving' }
		| { kind: 'error'; message: string }
		| { kind: 'done'; count: number }
	>({ kind: 'idle' })

	const submit = async () => {
		setStatus({ kind: 'saving' })
		try {
			const res = await fetch('/api/dev/webmaster-stats', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ csv })
			})
			const data = await res.json()
			if (!res.ok) throw new Error(data.error ?? 'Не удалось импортировать')
			setStatus({ kind: 'done', count: data.imported })
			setCsv('')
			router.refresh()
		} catch (error) {
			setStatus({
				kind: 'error',
				message: error instanceof Error ? error.message : 'Ошибка импорта'
			})
		}
	}

	return (
		<div className='mt-4 rounded-md border p-4'>
			<p className='mb-2 text-sm font-medium'>
				Импорт CSV из «Расширенной аналитики поисковых запросов по URL»
			</p>
			<Textarea
				value={csv}
				onChange={e => setCsv(e.target.value)}
				placeholder='Вставьте содержимое CSV-файла...'
				className='min-h-[120px] font-mono text-xs'
			/>
			<div className='mt-2 flex items-center gap-3'>
				<Button
					onClick={submit}
					disabled={csv.trim().length === 0 || status.kind === 'saving'}
				>
					{status.kind === 'saving' ? 'Импортирую...' : 'Импортировать'}
				</Button>
				{status.kind === 'done' && (
					<span className='text-sm text-green-600 dark:text-green-400'>
						Импортировано строк: {status.count}
					</span>
				)}
				{status.kind === 'error' && (
					<span className='text-sm text-destructive'>{status.message}</span>
				)}
			</div>
		</div>
	)
}

import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { LEGAL_DOCUMENTS } from '@/lib/legal/documents'
import { LEGAL_VERSION_DATE } from '@/lib/legal/operator'

export const metadata: Metadata = {
	// Без «— PixelTool»: в app/layout.tsx задан template '%s | PixelTool',
	// который допишет бренд сам — иначе в выдаче получается «… | PixelTool».
	title: 'Правовые документы',
	description:
		'Политика конфиденциальности, политика обработки персональных данных и согласия на обработку данных для сайта pixeltool.pro.',
	// Реестр документов индексировать незачем: он не отвечает ни на один
	// поисковый запрос, а сами PDF доступны прямыми ссылками.
	robots: { index: false, follow: true }
}

/** Короткое пояснение к каждому документу — чтобы не открывать все четыре. */
const SUMMARIES: Record<string, string> = {
	'politika-konfidencialnosti':
		'Какие данные собирает сайт, что делают cookie и статистика, кому передаются данные и как их удалить.',
	'politika-obrabotki-personalnyh-dannyh':
		'Формальный документ по 152-ФЗ: цели, правовые основания, сроки, меры защиты и реквизиты оператора.',
	'soglasie-na-obrabotku-personalnyh-dannyh':
		'То, с чем соглашается человек, отправляя форму на сайте.',
	'soglasie-na-reklamnuyu-rassylku':
		'Отдельное согласие на письма о новых инструментах и материалах. Даётся по желанию.'
}

export default function LegalPage() {
	return (
		<div className='mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8'>
			<h1 className='font-heading text-3xl font-bold tracking-tight'>
				Правовые документы
			</h1>
			<p className='mt-3 text-muted-foreground'>
				Действующая редакция от {LEGAL_VERSION_DATE} Каждый документ скачивается
				в PDF.
			</p>

			<ul className='mt-8 space-y-3'>
				{LEGAL_DOCUMENTS.map(document => (
					<li key={document.slug}>
						<a
							href={`/downloads/legal/${document.file}.pdf`}
							download
							className='group flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-accent/40'
						>
							<Download className='mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary' />
							<span>
								<span className='block font-medium'>{document.title}</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									{SUMMARIES[document.slug]}
								</span>
							</span>
						</a>
					</li>
				))}
			</ul>
		</div>
	)
}

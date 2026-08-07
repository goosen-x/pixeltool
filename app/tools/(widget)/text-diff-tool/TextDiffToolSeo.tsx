import Link from 'next/link'

/**
 * SEO-контент под инструментом. Отдельная секция про Word/PDF закрывает
 * реальный кластер спроса («сравнить два текста в ворде», «сравнение
 * документов пдф онлайн» — Вордстат 07.08.2026) честно: тул сравнивает
 * вставленный текст, а не файл целиком, и это стоит сказать прямо, а не
 * оставить человека разбираться самому.
 */
export function TextDiffToolSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Сравнение файлов Word и PDF
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Инструмент сравнивает текст, который вы вставили в поля, а не сам файл
					документа — форматирование, стили и структура .docx или .pdf в
					сравнение не входят, только содержимое. Чтобы сравнить два договора
					или два экспорта из Word, скопируйте текст из обоих документов (
					<kbd className='rounded border bg-muted px-1.5 py-0.5 text-xs'>
						Ctrl+A
					</kbd>
					,{' '}
					<kbd className='rounded border bg-muted px-1.5 py-0.5 text-xs'>
						Ctrl+C
					</kbd>
					) и вставьте в оба поля — различия в содержании найдутся точно так же.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Построчное и посимвольное сравнение
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Строка, которой нет во втором тексте, помечается удалённой (красный),
					новая — добавленной (зелёный), а строка, оставшаяся на месте, но
					изменившаяся внутри, — изменённой (жёлтый). Это отличается от простого
					«одинаково / не одинаково»: переставленная местами строка честно
					покажется как «удалили здесь — добавили там», а не проигнорируется.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Подробный разбор с примерами — код-ревью, договоры, редактура текстов —
				в статье{' '}
				<Link
					href='/blog/kak-sravnit-dva-teksta'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как сравнить два текста и найти отличия онлайн
				</Link>
				.
			</p>
		</div>
	)
}

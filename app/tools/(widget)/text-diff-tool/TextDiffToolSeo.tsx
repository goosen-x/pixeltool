import Link from 'next/link'

/**
 * SEO-контент под инструментом. Секция про Word/PDF закрывает реальный
 * кластер спроса («сравнить два текста в ворде», «сравнение документов пдф
 * онлайн» — Вордстат 07.08.2026) — через рабочий процесс копипаста.
 */
export function TextDiffToolSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Построчное и посимвольное сравнение
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Строка, которой нет во втором тексте, помечается удалённой (красный),
					новая добавленной (зелёный), а строка, оставшаяся на месте, но
					изменившаяся внутри, изменённой (жёлтый), причём жёлтым подсвечивается
					конкретное слово, а не вся строка целиком. Это точнее, чем простое
					«одинаково или не одинаково». Переставленная местами строка честно
					покажется как «удалили здесь, добавили там», а не проигнорируется.
					Сравнение считается прямо в браузере, тексты никуда не отправляются на
					сервер.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Четыре сочетания настроек и когда какое нужно:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Режим</th>
								<th className='py-2 pr-4 font-medium'>Что сравнивает</th>
								<th className='py-2 font-medium'>Когда брать</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>По строкам</td>
								<td className='py-2 pr-4'>строки целиком</td>
								<td className='py-2'>код, конфиги, логи</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>По словам</td>
								<td className='py-2 pr-4'>отдельные слова</td>
								<td className='py-2'>текст, статьи, договоры</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Без учёта регистра</td>
								<td className='py-2 pr-4'>игнорирует большие буквы</td>
								<td className='py-2'>когда важен смысл, а не оформление</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>Без пробелов</td>
								<td className='py-2 pr-4'>игнорирует отступы</td>
								<td className='py-2'>после переформатирования кода</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Без пробелов и без учёта регистра
				</h2>
				<p className='mt-3 text-muted-foreground'>
					«Без учёта пробелов» полезно, когда отличается только форматирование:
					отступы, лишние переносы строк, а не сам текст. «Без учёта регистра»
					нужно, когда важен смысл, а не то, с какой буквы написано слово. Оба
					фильтра можно включать одновременно. Готовый результат забирается
					кнопкой скачивания в виде патча, обычного unified diff, который
					понимает Git и большинство редакторов кода.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как сравнить два договора или экспорта из Word
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Выделите текст в обоих документах (
					<kbd className='rounded border bg-muted px-1.5 py-0.5 text-xs'>
						Ctrl+A
					</kbd>
					,{' '}
					<kbd className='rounded border bg-muted px-1.5 py-0.5 text-xs'>
						Ctrl+C
					</kbd>
					) и вставьте каждый в своё поле. Инструмент сравнит именно содержание,
					без разметки шрифтов и стилей, которая обычно только мешает увидеть,
					что реально поменялось в тексте договора, статьи или правки редактора.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Разбор с примерами из код-ревью, договоров и редактуры текстов есть в
				статье{' '}
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

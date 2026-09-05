import Link from 'next/link'

export function CompressPdfSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Из чего складывается вес PDF
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Почти весь вес документа дают картинки. Текст в PDF хранится как
					ссылки на шрифт и координаты букв — договор на двадцать страниц
					занимает сотни килобайт, и сжимать там нечего. А один разворот,
					отсканированный в 600 dpi, легко весит десять мегабайт. Поэтому
					тяжёлые PDF — это почти всегда сканы и презентации с фотографиями, и
					настоящее сжатие сводится к тому, чтобы уменьшить именно картинки.
					Если несколько файлов сначала нужно склеить в один, для этого есть{' '}
					<Link
						href='/tools/merge-pdf'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						объединение PDF
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Два режима и честная цена каждого
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Бережный режим пересобирает документ: служебные объекты пакуются
					плотнее, следы прошлых правок не переносятся. Ничего не теряется —
					текст остаётся текстом, ссылки живут, поиск работает, — но и выигрыш
					небольшой: единицы процентов, а на файле, который уже кто-то
					оптимизировал, честный ноль.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Сильный режим рисует каждую страницу и сохраняет её картинкой, из
					которых собирается новый документ. Вес падает в разы, потому что
					плотность и качество задаёте вы. Расплата ровно одна, и она
					существенная: текстового слоя в результате нет. По такому файлу не
					ищется слово, из него не копируется абзац, и программа для
					распознавания увидит в нём фотографию, а не документ. Так устроено
					большинство онлайн-сжималок — разница в том, что здесь это написано до
					того, как вы нажали кнопку, а не обнаруживается потом.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какие настройки выбрать
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Документ для чтения с экрана и отправки почтой — 150 dpi и качество
					около 70%: обычно это даёт файл в несколько раз легче исходного, а
					текст на странице остаётся разборчивым. Документ, который понесут на
					печать, — 300 dpi: на бумаге разница с 150 уже видна глазом. 96 dpi
					берите, когда нужно любой ценой уложиться в лимит вложения и качество
					вторично. Если вместо целого PDF нужны именно картинки отдельных
					страниц, для этого есть{' '}
					<Link
						href='/tools/pdf-to-jpg'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						конвертер PDF в JPG
					</Link>
					.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Задача</th>
								<th className='py-2 font-semibold'>DPI</th>
							</tr>
						</thead>
						<tbody>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Чтение с экрана, почта</td>
								<td className='py-2 align-top text-muted-foreground'>150</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Печать на бумаге</td>
								<td className='py-2 align-top text-muted-foreground'>300</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>
									Минимальный размер файла
								</td>
								<td className='py-2 align-top text-muted-foreground'>96</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Если файл не уменьшился
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Бывает, что после сжатия размер тот же или чуть больше — инструмент
					говорит об этом прямо, а не выдаёт прежний файл за результат. Причина
					обычно одна из двух: документ уже оптимизирован, либо он текстовый и
					сжимать в нём нечего. В обоих случаях выигрыша не будет ни здесь, ни в
					любом другом сервисе — файл и так близок к минимуму. Если вес всё
					равно нужно уменьшить, остаётся сильный режим с пониженной плотностью,
					но тогда стоит понимать, что вы меняете текстовый документ на
					последовательность картинок.
				</p>
			</section>
		</div>
	)
}

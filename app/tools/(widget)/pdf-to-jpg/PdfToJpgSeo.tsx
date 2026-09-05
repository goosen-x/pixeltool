import Link from 'next/link'

export function PdfToJpgSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что значит «плотность» и сколько её нужно
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Страница PDF описана не пикселями, а размером в миллиметрах: это
					чертёж листа, а не картинка. Чтобы получить картинку, лист надо
					нарисовать в каком-то разрешении — его и задаёт плотность, точки на
					дюйм. При 72 dpi лист A4 превращается в картинку примерно 595×842
					пикселя, при 150 — вдвое больше, при 300 — вчетверо. Для экрана и
					презентации хватает 150, для печати берут 300, а 72 годятся на быстрое
					превью.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>DPI</th>
								<th className='py-2 font-semibold'>
									Размер картинки для листа A4
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>72</td>
								<td className='py-2 align-top text-muted-foreground'>
									≈ 595×842 пикселей
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>150</td>
								<td className='py-2 align-top text-muted-foreground'>
									≈ 1240×1754 пикселей
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>300</td>
								<td className='py-2 align-top text-muted-foreground'>
									≈ 2480×3508 пикселей
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему повышение dpi не всегда помогает
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Плотность работает там, где страница нарисована текстом и векторной
					графикой: их можно перерисовать в любом размере без потери чёткости.
					Но если внутри PDF лежит фотография скана в низком разрешении, поднять
					dpi — всё равно что растянуть маленькую картинку: пикселей станет
					больше, деталей не прибавится. В этом случае резче исходника результат
					не будет никогда.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>JPEG или PNG</h2>
				<p className='mt-3 text-muted-foreground'>
					JPEG сжимает с потерями и даёт файл в разы легче — это верный выбор
					для сканов, фотографий и вообще всего, где на странице есть
					изображения. PNG сжимает без потерь: буквы и линии остаются идеально
					резкими, без мутного ореола вокруг текста, но и весит такая картинка
					заметно больше. Берите PNG для страниц со схемами, таблицами и мелким
					шрифтом, которые потом будут разглядывать. Если вместо картинок нужен
					просто более лёгкий PDF, тот же документ, но меньшим весом, для этого
					есть{' '}
					<Link
						href='/tools/compress-pdf'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						сжатие PDF
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Выбор страниц и порядок в архиве
				</h2>
				<p className='mt-3 text-muted-foreground'>
					В поле страниц понимаются диапазоны и перечисления: «1-3, 7» — первые
					три и седьмая, «5-» — с пятой до конца, пустое поле — весь документ.
					Когда страниц больше одной, они приходят zip-архивом: браузер не умеет
					отдавать десяток файлов одним нажатием. Номера внутри архива добиты
					нулями — «03», а не «3», — иначе файловый менеджер поставит десятую
					страницу перед второй и порядок в папке разойдётся с порядком в
					документе.
				</p>
			</section>
		</div>
	)
}

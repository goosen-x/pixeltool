import Link from 'next/link'

export function AsciiArtGeneratorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Два разных режима: из текста и из картинки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Режим «Текст» рисует крупный баннер из букв. Он подходит для
					заголовков README, приветствия в CLI-инструменте или подписи в письме.
					Режим «Изображение» превращает загруженную фотографию в ASCII-рисунок
					из символов разной плотности. Здесь лучше работают контрастные
					картинки с простыми объектами, а фото с мелкими деталями на выходе
					превращаются в кашу из символов. Если вместо символов нужен именно
					пиксельный стиль с сеткой и цветом, для этого есть{' '}
					<Link
						href='/tools/pixel-art-editor'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						редактор пиксель-арта
					</Link>
					.
				</p>

				<p className='mt-4 text-muted-foreground'>
					В текстовом режиме доступны шесть шрифтов figlet:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Шрифт</th>
								<th className='py-2 font-medium'>Характер</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Doom</td>
								<td className='py-2'>массивные объёмные буквы</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>ANSI Shadow</td>
								<td className='py-2'>блочные буквы с тенью</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Blur Vision</td>
								<td className='py-2'>размытый пиксельный вид</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Shaded Blocky</td>
								<td className='py-2'>плотные блоки со штриховкой</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>RubiFont</td>
								<td className='py-2'>тонкие контурные буквы</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>Alpha</td>
								<td className='py-2'>крупные буквы из символов</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Ни один из шрифтов figlet не знает кириллицы: русские буквы они просто
					пропускают, поэтому текст надо писать латиницей.
				</p>
			</section>
		</div>
	)
}

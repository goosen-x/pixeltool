import Link from 'next/link'

export function PhotoColorPickerSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как инструмент читает цвет с фото
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Фото рисуется на canvas, встроенном в браузер холсте для работы с
					пикселями. При наведении курсора инструмент читает цвет пикселя под
					ним и переводит его в HEX и RGB. Вся обработка идёт локально, в
					браузере. На сервер файл не уходит. Подобранные цвета можно сразу
					использовать в{' '}
					<Link
						href='/tools/pixel-art-editor'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						редакторе пиксель-арта
					</Link>
					.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Один и тот же пиксель инструмент отдаёт в трёх записях. Это один цвет,
					разные способы его записать:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Формат</th>
								<th className='py-2 pr-4 font-medium'>Пример</th>
								<th className='py-2 font-medium'>Где применяется</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>HEX</td>
								<td className='py-2 pr-4 font-mono'>#3B82F6</td>
								<td className='py-2'>CSS, дизайн-макеты, самый ходовой</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>RGB</td>
								<td className='py-2 pr-4 font-mono'>rgb(59, 130, 246)</td>
								<td className='py-2'>CSS с прозрачностью, canvas, код</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>HSL</td>
								<td className='py-2 pr-4 font-mono'>hsl(217, 91%, 60%)</td>
								<td className='py-2'>
									когда надо сделать тот же цвет светлее или бледнее
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					HSL удобнее остальных именно для правок: чтобы получить оттенок той же
					гаммы, достаточно изменить последнее число, а в HEX для этого пришлось
					бы пересчитывать все три пары.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Зачем нужна лупа при наведении
				</h2>
				<p className='mt-3 text-muted-foreground'>
					На экране один пиксель занимает доли миллиметра, промахнуться мимо
					него легко, особенно на мелких деталях фото. Рядом с результатом при
					наведении курсора появляется круглая лупа с увеличенным участком и
					рамкой на текущем пикселе. Так видно, что возьмётся, ещё до клика.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что влияет на точность цвета с фото
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Экран показывает RGB, то есть свет. Краска на предмете отражает свет
					по другим законам, поэтому у экранного и реального цвета разная
					физическая природа. На итоговый цвет на фото дополнительно влияют
					освещение и баланс белого при съёмке, сжатие JPEG (оно немного смещает
					цвета соседних пикселей) и калибровка конкретного монитора. Для
					дизайна и вёрстки такой точности хватает. Для подбора краски или
					печати цвет с фото стоит проверить образцом на месте. Там он работает
					ориентиром, а не финальным значением.
				</p>
			</section>
		</div>
	)
}

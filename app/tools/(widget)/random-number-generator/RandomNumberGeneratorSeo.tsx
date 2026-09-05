import Link from 'next/link'

/**
 * SEO-контент под генератором случайных чисел. Закрывает интент «розыгрыш
 * случайных чисел» (крупный кластер спроса рядом с головным термином) — то,
 * что не поместилось в FAQ.
 */
export function RandomNumberGeneratorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как провести розыгрыш случайным числом
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Пронумеруйте участников по порядку, скажем по номеру комментария, и
					зафиксируйте список до генерации. Задайте диапазон от 1 до числа
					участников, и выпавшее число будет номером победителя. Для розыгрыша
					нескольких призов генерируйте по одному числу за раз: если номер уже
					выигрывал, нажмите «Сгенерировать» ещё раз. Если вместо номера нужен
					результат броска игральной кости, для этого есть отдельный{' '}
					<Link
						href='/tools/dice-roller'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						бросок кубика
					</Link>
					, а чтобы перемешать сам список участников целиком, а не выбрать
					номер, подойдёт{' '}
					<Link
						href='/tools/random-list-generator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						перемешивание списка
					</Link>
					.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Вероятность, что выпадет конкретное задуманное число:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Диапазон</th>
								<th className='py-2 pr-4 font-medium'>Вариантов</th>
								<th className='py-2 font-medium'>Шанс одного числа</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>1–6, как кубик</td>
								<td className='py-2 pr-4 font-mono'>6</td>
								<td className='py-2 font-mono'>16,7%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>1–10</td>
								<td className='py-2 pr-4 font-mono'>10</td>
								<td className='py-2 font-mono'>10%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>1–36</td>
								<td className='py-2 pr-4 font-mono'>36</td>
								<td className='py-2 font-mono'>2,8%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>1–100</td>
								<td className='py-2 pr-4 font-mono'>100</td>
								<td className='py-2 font-mono'>1%</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>1–1000</td>
								<td className='py-2 pr-4 font-mono'>1000</td>
								<td className='py-2 font-mono'>0,1%</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему это не то же самое, что Math.random()
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Стандартный генератор случайных чисел в JavaScript предсказуем. Если
					знать его текущее состояние, следующие значения можно вычислить
					заранее. Для розыгрыша с призом это уязвимость. Этот инструмент берёт
					числа из{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						crypto.getRandomValues
					</code>{' '}
					, встроенного в браузер источника криптографической случайности на
					основе энтропии операционной системы, который нельзя ни предсказать,
					ни воспроизвести повторным запуском.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Пошаговая инструкция и разбор, чем настоящая случайность отличается от
				выбора «на глаз», есть в статье{' '}
				<Link
					href='/blog/kak-provesti-rozygrysh-sluchaynym-chislom'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как провести честный розыгрыш случайным числом
				</Link>
				.
			</p>
		</div>
	)
}

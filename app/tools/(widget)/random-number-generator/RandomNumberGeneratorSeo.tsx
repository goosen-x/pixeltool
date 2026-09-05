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

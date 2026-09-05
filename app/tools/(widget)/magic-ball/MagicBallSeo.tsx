import Link from 'next/link'

export function MagicBallSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что это на самом деле
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Шар выбирает одну из двадцати заранее написанных реплик случайным
					образом. Он не знает вашего вопроса, не анализирует его и ничего не
					предсказывает: вы можете спросить про погоду, а можете вообще ничего
					не спрашивать — набор ответов и вероятности будут теми же. Поле для
					вопроса нужно только вам: сформулированный вопрос заставляет
					определиться, что именно вы решаете.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему «да» выпадает чаще
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Раскладка ответов взята у настоящей игрушки: десять утвердительных,
					пять уклончивых, пять отрицательных. Это не ошибка и не случайность —
					перевес заложен в оригинал, из-за него шар кажется доброжелательным.
					Уклончивые реплики вроде «спроси позже» играют свою роль: они
					возвращают решение вам, вместо того чтобы отвечать наугад ещё раз.
					Если выровнять пропорции, ощущение от инструмента заметно меняется,
					поэтому мы их не трогали.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Раскладка канонического набора, ровно как в коде инструмента:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Тон ответа</th>
								<th className='py-2 pr-4 font-medium'>Реплик</th>
								<th className='py-2 font-medium'>Вероятность</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Утвердительные</td>
								<td className='py-2 pr-4 font-mono'>10</td>
								<td className='py-2 font-mono'>50%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Уклончивые</td>
								<td className='py-2 pr-4 font-mono'>5</td>
								<td className='py-2 font-mono'>25%</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Отрицательные</td>
								<td className='py-2 pr-4 font-mono'>5</td>
								<td className='py-2 font-mono'>25%</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					В режиме «только да или нет» реплик всего две и шансы ровно пополам:
					уклончивых там нет по определению.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Режим «только да или нет»
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Классический набор годится, когда хочется поиграть, но плохо подходит,
					когда решение действительно надо принять: пятая часть реплик вообще не
					ответы, а «спроси позже», да и перевес в сторону «да» никуда не
					девается. Переключатель в шапке отключает и то и другое: остаются
					ровно два варианта с равными шансами. Это честная монетка, только в
					форме шара, и повтор подряд там разрешён намеренно — запрет превратил
					бы бросок в строгое чередование да-нет-да-нет, то есть в расписание
					вместо случайности.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как этим пользоваться с толком
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Есть приём, который работает независимо от того, верите вы в гадания
					или нет: задайте вопрос, получите ответ и прислушайтесь к первой
					реакции. Если на «нет» стало обидно — вы уже знали, чего хотите, и
					решение принято, просто не вами, а вашим разочарованием. Случайный
					ответ здесь не советчик, а способ вытащить наружу собственное
					предпочтение, о котором вы не догадывались.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Для выбора не из двух вариантов, а из нескольких, рядом есть{' '}
					<Link
						href='/tools/draw-lots'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						жеребьёвка
					</Link>{' '}
					и{' '}
					<Link
						href='/tools/fortune-wheel'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						колесо фортуны
					</Link>
					, а для честного «орёл или решка» —{' '}
					<Link
						href='/tools/coin-flip'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						подбрасывание монетки
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					История вопросов остаётся у вас
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Последние двадцать ответов сохраняются в самом браузере и никуда не
					отправляются. Регистрация не нужна и не даёт ничего дополнительного:
					вопросы, которые задают такому шару, обычно личные, и собирать их на
					сервере ради списка из двадцати строк незачем. Кнопка с корзиной
					очищает историю, а в режиме инкогнито она просто не сохранится.
				</p>
			</section>
		</div>
	)
}

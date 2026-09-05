export function AbTestCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					13% против 10% ещё не победа
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Конверсия — это оценка по конкретной выборке, а не точное свойство
					варианта. Соберите ту же тысячу посетителей ещё раз, и цифра слегка
					сдвинется. Доверительный интервал показывает, в каком диапазоне на
					самом деле лежит истинная конверсия. Значимость отвечает на другой
					вопрос: могла ли разница между вариантами получиться просто из-за
					случайности выборки.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Ширина интервала зависит от выбранного уровня доверия. За ним стоит
					критическое значение z, и чем выше уверенность, тем шире интервал:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Уровень доверия</th>
								<th className='py-2 pr-4 font-medium'>Значение z</th>
								<th className='py-2 font-medium'>Что означает</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>80%</td>
								<td className='py-2 pr-4 font-mono'>1,282</td>
								<td className='py-2'>
									грубая прикидка, ошибётесь в каждом пятом случае
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>90%</td>
								<td className='py-2 pr-4 font-mono'>1,645</td>
								<td className='py-2'>мягкий порог для быстрых решений</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>95%</td>
								<td className='py-2 pr-4 font-mono'>1,960</td>
								<td className='py-2'>
									стандарт по умолчанию в продуктовой аналитике
								</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>99%</td>
								<td className='py-2 pr-4 font-mono'>2,576</td>
								<td className='py-2'>когда цена ошибки высока</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Повысить уровень доверия и не потерять в чувствительности можно только
					одним способом: набрать больше наблюдений.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему интервал Уилсона, а не «плюс-минус» на глаз
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Обычное нормальное приближение (среднее ± z·стандартная ошибка) на
					низкой конверсии или маленькой выборке легко даёт нижнюю границу ниже
					нуля. Формула просто не знает, что доля не может выйти за эти пределы.
					Интервал Уилсона устроен иначе и всегда остаётся в границах 0–100%.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Разница между вариантами считается отдельно, двухвыборочным z-тестом
					пропорций. Это тот же метод, что и хи-квадрат тест, на котором
					построены большинство калькуляторов A/B-тестов, включая калькулятор
					Эвана Миллера. При трёх и более вариантах калькулятор сравнивает их
					попарно и поднимает порог значимости поправкой Бонферрони. Чем больше
					пар проверяется, тем выше шанс найти «значимую» разницу просто по
					случайности, если не ужесточить критерий.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Маленькая выборка обманывает чаще, чем кажется
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Один и тот же прирост конверсии на 100 посетителях и на 10&nbsp;000
					значит разное. На маленькой выборке доверительный интервал широкий, и
					то, что выглядит как явная победа варианта, легко оказывается шумом.
					Останавливать тест по первому «значимому» результату не стоит.
					Дождитесь, пока выборка наберёт объём, достаточный для выбранного
					уровня доверия.
				</p>
			</section>
		</div>
	)
}

import Link from 'next/link'
import { Formula } from '@/components/seo/Formula'

export function CalorieCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается норма калорий
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Расчёт идёт в два шага. Сначала формула Миффлина-Сан Жеора считает
					базовый обмен веществ, то есть сколько калорий тело тратит в полном
					покое, только на дыхание, кровообращение и работу органов. Затем этот
					результат умножается на коэффициент активности, от 1.2 при сидячем
					образе жизни до 1.9 при тяжёлых ежедневных нагрузках. Итоговая цифра
					дополнительно сдвигается на ±15% в зависимости от цели: дефицит для
					похудения, профицит для набора массы, без изменений для поддержания
					веса. Понять, в какую сторону вообще двигать вес, поможет{' '}
					<Link
						href='/tools/bmi-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор ИМТ
					</Link>
					.
				</p>
				<Formula
					latex='\text{BMR} = 10m + 6{,}25h - 5a + s'
					caption='m — вес в кг, h — рост в см, a — возраст в годах, s равно +5 для мужчин и −161 для женщин'
				/>
				<Formula
					latex='\text{Норма} = \text{BMR} \cdot k \cdot g'
					caption='k — коэффициент активности от 1,2 до 1,9, g — поправка на цель: 0,85, 1 или 1,15'
				/>

				<p className='mt-4 text-muted-foreground'>
					Так выглядит поддерживающая норма по формуле Миффлина-Сан Жеора для
					двух условных людей: мужчина 80 кг ростом 178 см и женщина 65 кг
					ростом 165 см. В скобках коэффициент активности:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Кто</th>
								<th className='py-2 pr-4 font-medium'>Минимальная (1,2)</th>
								<th className='py-2 pr-4 font-medium'>Средняя (1,55)</th>
								<th className='py-2 font-medium'>Высокая (1,725)</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Мужчина, 25 лет</td>
								<td className='py-2 pr-4 font-mono'>2151</td>
								<td className='py-2 pr-4 font-mono'>2778</td>
								<td className='py-2 font-mono'>3092</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Мужчина, 40 лет</td>
								<td className='py-2 pr-4 font-mono'>2061</td>
								<td className='py-2 pr-4 font-mono'>2662</td>
								<td className='py-2 font-mono'>2963</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Мужчина, 60 лет</td>
								<td className='py-2 pr-4 font-mono'>1941</td>
								<td className='py-2 pr-4 font-mono'>2507</td>
								<td className='py-2 font-mono'>2790</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Женщина, 25 лет</td>
								<td className='py-2 pr-4 font-mono'>1674</td>
								<td className='py-2 pr-4 font-mono'>2163</td>
								<td className='py-2 font-mono'>2407</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Женщина, 40 лет</td>
								<td className='py-2 pr-4 font-mono'>1584</td>
								<td className='py-2 pr-4 font-mono'>2046</td>
								<td className='py-2 font-mono'>2277</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Женщина, 60 лет</td>
								<td className='py-2 pr-4 font-mono'>1464</td>
								<td className='py-2 pr-4 font-mono'>1891</td>
								<td className='py-2 font-mono'>2105</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Видно главное: разница между сидячим и подвижным образом жизни больше,
					чем разница в 35 лет возраста. Свои цифры считайте в калькуляторе
					выше, таблица нужна только чтобы понимать порядок.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что такое КБЖУ и зачем делить калории на белки, жиры и углеводы
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Одна и та же суточная норма калорий по-разному влияет на организм в
					зависимости от того, из чего она набрана. КБЖУ — это норма,
					разложенная на три группы нутриентов в граммах: белки (1 г = 4 ккал),
					жиры (1 г = 9 ккал) и углеводы (1 г = 4 ккал). Здесь используется
					распределение 30% калорий из белка, 30% из жира, остальное из
					углеводов. Оно подходит для большинства целей без специализации под
					конкретный вид спорта.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Это не медицинское назначение
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Формула даёт стандартный ориентировочный расчёт. Она не учитывает
					приём лекарств, хронические заболевания, гормональные особенности и
					другие индивидуальные факторы. Для точного плана питания при особых
					условиях здоровья разумнее обратиться к врачу или диетологу, а не
					ориентироваться только на калькулятор. При беременности норма калорий
					считается иначе и меняется по неделям и триместрам, которые можно
					уточнить в{' '}
					<Link
						href='/tools/pregnancy-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе беременности
					</Link>
					.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Разбор формулы на числовом примере, коэффициенты активности и объяснение
				КБЖУ есть в статье{' '}
				<Link
					href='/blog/kak-poschitat-kalorii-i-kbju'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как посчитать калории и КБЖУ: формула, коэффициенты активности и
					разбор на примере
				</Link>
				.
			</p>
		</div>
	)
}

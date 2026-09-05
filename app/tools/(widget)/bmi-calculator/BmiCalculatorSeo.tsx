import Link from 'next/link'
import { Formula } from '@/components/seo/Formula'

export function BmiCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается индекс массы тела
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Формула простая: вес делится на рост в квадрате.
				</p>
				<Formula
					latex='\text{ИМТ} = \dfrac{m}{h^2}'
					caption='m — вес в килограммах, h — рост в метрах'
				/>
				<p className='mt-3 text-muted-foreground'>
					Придумал её в XIX веке бельгийский статистик Адольф Кетле, причём как
					способ сравнивать телосложение людей в больших группах, а не как
					медицинский показатель. В медицину как массовый ориентировочный
					инструмент ИМТ вошёл только в XX веке. Поэтому у него нет привязки к
					конкретному человеку, только к усреднённым данным по популяции.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Категории ИМТ по стандарту ВОЗ
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Пороги одинаковы для мужчин и женщин, сама формула пол не учитывает:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>ИМТ</th>
								<th className='py-2 font-medium'>Категория</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>меньше 18.5</td>
								<td className='py-2'>Недостаток массы тела</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>18.5–24.9</td>
								<td className='py-2'>Норма</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>25–29.9</td>
								<td className='py-2'>Избыточная масса тела</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>30 и больше</td>
								<td className='py-2'>Ожирение</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему ИМТ не окончательный ответ
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Главное ограничение в том, что формула не различает мышцы и жир, она
					видит только суммарный вес. Поэтому у людей с развитой мускулатурой
					(спортсмены, бодибилдеры) ИМТ часто показывает «избыточную массу» или
					даже «ожирение», хотя процент жира в организме у них ниже среднего.
					Показатель не учитывает и то, где именно в теле распределён жир, а для
					здоровья это важнее самой цифры. ИМТ остаётся полезным как быстрый
					ориентир для среднестатистического взрослого, но диагнозом он не
					является. Решения о весе разумнее принимать после консультации с
					врачом. Если вес нужно изменить, отправной точкой служит суточная
					норма калорий — её считает{' '}
					<Link
						href='/tools/calorie-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор калорий
					</Link>
					.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Разбор формулы на примере, история происхождения ИМТ и подробности об
				ограничениях есть в статье{' '}
				<Link
					href='/blog/kak-rasschitat-imt'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как рассчитать ИМТ: формула, таблица категорий и её ограничения
				</Link>
				.
			</p>
		</div>
	)
}

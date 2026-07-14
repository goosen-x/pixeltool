import Link from 'next/link'

/**
 * Образовательный контент под конвертером цветов.
 * Повышает глубину страницы (качество), закрывает информационные запросы
 * по форматам цвета (hex в rgb и т.п.) и даёт внутреннюю перелинковку.
 */

const SAMPLES: { hex: string; rgb: string; hsl: string }[] = [
	{ hex: '#2563eb', rgb: 'rgb(37, 99, 235)', hsl: 'hsl(221, 83%, 53%)' },
	{ hex: '#ec4899', rgb: 'rgb(236, 72, 153)', hsl: 'hsl(330, 81%, 60%)' },
	{ hex: '#22c55e', rgb: 'rgb(34, 197, 94)', hsl: 'hsl(142, 71%, 45%)' }
]

const FORMATS: { name: string; desc: string }[] = [
	{
		name: 'HEX',
		desc: 'Запись #rrggbb — основной формат для web и CSS. Компактный, удобно копировать.'
	},
	{
		name: 'RGB / RGBA',
		desc: 'Каналы красного, зелёного, синего (0–255). A — прозрачность (0–1). Модель экранов.'
	},
	{
		name: 'HSL / HSLA',
		desc: 'Тон, насыщенность, светлота. Удобно менять яркость и оттенок, не пересчитывая каналы.'
	},
	{
		name: 'CMYK',
		desc: 'Голубой, пурпурный, жёлтый, чёрный — модель для печати, а не для экрана.'
	},
	{
		name: 'LAB',
		desc: 'Перцептивная модель: расстояния соответствуют видимой разнице. Для точного подбора и контраста.'
	}
]

export function ColorGuide() {
	return (
		<section className='mt-12 max-w-3xl mx-auto text-left text-foreground'>
			<h2 className='text-2xl font-bold tracking-tight'>
				Что такое цветовые форматы
			</h2>
			<p className='mt-3 text-foreground leading-relaxed'>
				Один и тот же цвет можно записать по-разному:{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					HEX
				</code>{' '}
				для CSS,{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					RGB
				</code>{' '}
				по каналам экрана,{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					HSL
				</code>{' '}
				для удобной подстройки, CMYK для печати. Конвертер переводит значение из
				любого формата во все остальные — вставьте цвет, и результат
				пересчитается сразу.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Один цвет в разных форматах
			</h2>
			<p className='mt-3 text-foreground leading-relaxed'>
				Наглядный пример: одинаковый цвет в HEX, RGB и HSL.
			</p>
			<div className='mt-4 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b text-left'>
							<th className='py-2 pr-4 font-semibold'>Цвет</th>
							<th className='py-2 pr-4 font-semibold'>HEX</th>
							<th className='py-2 pr-4 font-semibold'>RGB</th>
							<th className='py-2 font-semibold'>HSL</th>
						</tr>
					</thead>
					<tbody>
						{SAMPLES.map(s => (
							<tr key={s.hex} className='border-b last:border-0'>
								<td className='py-2 pr-4'>
									<span
										className='inline-block h-6 w-10 rounded border'
										style={{ backgroundColor: s.hex }}
									/>
								</td>
								<td className='py-2 pr-4 font-mono text-xs'>{s.hex}</td>
								<td className='py-2 pr-4 font-mono text-xs'>{s.rgb}</td>
								<td className='py-2 font-mono text-xs'>{s.hsl}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Форматы цвета: когда какой
			</h2>
			<div className='mt-4 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b text-left'>
							<th className='py-2 pr-4 font-semibold'>Формат</th>
							<th className='py-2 font-semibold'>Когда использовать</th>
						</tr>
					</thead>
					<tbody>
						{FORMATS.map(f => (
							<tr key={f.name} className='border-b align-top last:border-0'>
								<td className='py-2 pr-4'>
									<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
										{f.name}
									</code>
								</td>
								<td className='py-2 text-foreground'>{f.desc}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Как пользоваться конвертером
			</h2>
			<ol className='mt-3 space-y-2 text-foreground leading-relaxed'>
				<li>Вставьте цвет в любом формате — HEX, RGB, HSL и других.</li>
				<li>Остальные форматы пересчитаются автоматически.</li>
				<li>Скопируйте нужное значение одной кнопкой.</li>
			</ol>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>Что дальше</h2>
			<p className='mt-3 text-foreground leading-relaxed'>
				Подобранный цвет пригодится в{' '}
				<Link
					href='/tools/css-gradient-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генераторе градиентов
				</Link>
				, а проверить читаемость текста на фоне поможет{' '}
				<Link
					href='/tools/color-contrast-checker'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					проверка контраста цветов
				</Link>
				.
			</p>
		</section>
	)
}

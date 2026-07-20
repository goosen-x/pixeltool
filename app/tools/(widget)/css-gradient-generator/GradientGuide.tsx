import Link from 'next/link'
import { GuideCodeBlock } from '@/components/widgets/GuideCodeBlock'

/**
 * Образовательный контент под инструментом генератора градиентов.
 * Повышает глубину страницы (качество), закрывает информационные запросы
 * по CSS-градиентам и даёт внутреннюю перелинковку на смежные тулы.
 */

type Demo = 'linear' | 'radial' | 'conic'

const EXAMPLES: { title: string; desc: string; code: string; demo: Demo }[] = [
	{
		title: 'Линейный градиент',
		desc: 'Плавный переход цвета вдоль прямой. Угол задаёт направление: 90deg — слева направо, 45deg — по диагонали.',
		demo: 'linear',
		code: 'background: linear-gradient(90deg, #a855f7, #ec4899);'
	},
	{
		title: 'Радиальный градиент',
		desc: 'Цвет расходится от центра наружу кругом или эллипсом. Удобно для подсветки, «свечения» и фонов.',
		demo: 'radial',
		code: 'background: radial-gradient(circle, #a855f7, #ec4899);'
	},
	{
		title: 'Конический градиент',
		desc: 'Цвета вращаются вокруг центра, как цветовое колесо. Основа круговых диаграмм и индикаторов загрузки.',
		demo: 'conic',
		code: 'background: conic-gradient(from 0deg, #a855f7, #ec4899, #f59e0b, #a855f7);'
	}
]

const PROPS: { name: string; desc: string }[] = [
	{
		name: 'linear-gradient()',
		desc: 'Линейный переход. Первый аргумент — угол (90deg) или направление (to right), далее цветовые точки.'
	},
	{
		name: 'radial-gradient()',
		desc: 'Переход от центра. Задаются форма (circle / ellipse) и позиция (at center), затем цвета.'
	},
	{
		name: 'conic-gradient()',
		desc: 'Вращение цветов вокруг точки. from задаёт стартовый угол, at — центр вращения.'
	},
	{
		name: 'color stops',
		desc: 'Цветовые точки с позициями: red 0%, blue 100%. Управляют, где именно меняется цвет.'
	},
	{
		name: 'repeating-*-gradient()',
		desc: 'Повторяющийся узор из градиента — полоски, кольца, сектора без картинок.'
	},
	{
		name: 'transparent / rgba()',
		desc: 'Прозрачные точки дают эффект затухания — например от цвета к прозрачности.'
	}
]

/**
 * Живой предпросмотр: рендерится настоящим CSS-градиентом того же типа,
 * что и в коде примера.
 */
function GradientPreview({ demo }: { demo: Demo }) {
	const bg =
		demo === 'linear'
			? 'linear-gradient(90deg, #a855f7, #ec4899)'
			: demo === 'radial'
				? 'radial-gradient(circle, #a855f7, #ec4899)'
				: 'conic-gradient(from 0deg, #a855f7, #ec4899, #f59e0b, #a855f7)'

	return (
		<div className='mt-3 rounded-lg border bg-muted/40 p-3'>
			<div className='mb-2 text-xs text-muted-foreground'>Предпросмотр</div>
			<div style={{ background: bg }} className='h-24 w-full rounded-md' />
		</div>
	)
}

export function GradientGuide() {
	return (
		<section className='mt-12 max-w-3xl mx-auto text-left text-foreground'>
			<h2 className='text-2xl font-bold tracking-tight'>
				Что такое CSS-градиент
			</h2>
			<p className='mt-3 text-foreground leading-relaxed'>
				CSS-градиент — это плавный переход между двумя и более цветами, который
				задаётся прямо в CSS как значение{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					background
				</code>
				, без картинок. Есть три типа:{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					linear-gradient
				</code>{' '}
				(вдоль линии),{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					radial-gradient
				</code>{' '}
				(от центра) и{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					conic-gradient
				</code>{' '}
				(по кругу). Градиенты — это векторы: они не грузятся отдельным файлом,
				идеально масштабируются и легко анимируются.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Как пользоваться генератором
			</h2>
			<ol className='mt-3 space-y-2 text-foreground leading-relaxed'>
				<li>Выберите тип градиента — линейный, радиальный или конический.</li>
				<li>Добавьте цветовые точки и задайте их позиции и направление.</li>
				<li>Скопируйте готовый CSS или Tailwind-классы одной кнопкой.</li>
				<li>Вставьте код в свойство background нужного элемента.</li>
			</ol>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Примеры градиентов
			</h2>
			<div className='mt-4 space-y-5'>
				{EXAMPLES.map(ex => (
					<div
						key={ex.title}
						className='rounded-xl border bg-card p-5 text-left'
					>
						<h3 className='font-semibold'>{ex.title}</h3>
						<p className='mt-1 text-sm text-foreground'>{ex.desc}</p>
						<GradientPreview demo={ex.demo} />
						<GuideCodeBlock className='mt-3' code={ex.code} />
					</div>
				))}
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Синтаксис CSS-градиентов
			</h2>
			<p className='mt-3 text-foreground leading-relaxed'>
				Короткая шпаргалка по функциям и параметрам, которые собирает генератор
				выше, — скопируйте нужное в свой CSS.
			</p>
			<div className='mt-4 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b text-left'>
							<th className='py-2 pr-4 font-semibold'>Функция / параметр</th>
							<th className='py-2 font-semibold'>Что делает</th>
						</tr>
					</thead>
					<tbody>
						{PROPS.map(p => (
							<tr key={p.name} className='border-b align-top last:border-0'>
								<td className='py-2 pr-4'>
									<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
										{p.name}
									</code>
								</td>
								<td className='py-2 text-foreground'>{p.desc}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Градиент или картинка
			</h2>
			<p className='mt-3 text-foreground leading-relaxed'>
				CSS-градиент почти всегда лучше картинки-фона: меньше вес, нет лишнего
				HTTP-запроса, идеальное масштабирование и возможность анимации.
				Подобрать цвета для точек удобно в{' '}
				<Link
					href='/tools/color-converter'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					конвертере цветов
				</Link>
				, а добавить объём элементу поможет{' '}
				<Link
					href='/tools/css-box-shadow-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генератор теней box-shadow
				</Link>
				.
			</p>
		</section>
	)
}

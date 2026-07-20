import Link from 'next/link'
import type { CSSProperties } from 'react'
import { GuideCodeBlock } from '@/components/widgets/GuideCodeBlock'

/**
 * Образовательный контент под инструментом Grid-генератора.
 * Повышает глубину страницы (качество), закрывает информационные запросы
 * по CSS Grid и даёт внутреннюю перелинковку на Flexbox-генератор и блог.
 */

type Demo = 'sidebar' | 'gallery' | 'holygrail'

const EXAMPLES: { title: string; desc: string; code: string; demo: Demo }[] = [
	{
		title: 'Две колонки: сайдбар и контент',
		desc: 'Фиксированный сайдбар слева и «резиновый» контент справа. Единица fr забирает всё свободное место.',
		demo: 'sidebar',
		code: `.layout {
  display: grid;
  grid-template-columns: 16rem 1fr;
  gap: 1.5rem;
}`
	},
	{
		title: 'Адаптивная галерея',
		desc: 'Карточки сами переносятся на новую строку. auto-fill + minmax() — раскладка без медиазапросов.',
		demo: 'gallery',
		code: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 1rem;
}`
	},
	{
		title: 'Раскладка страницы через grid-template-areas',
		desc: 'Классический макет: шапка, сайдбар, контент, подвал — заданы по именам областей.',
		demo: 'holygrail',
		code: `.page {
  display: grid;
  grid-template-columns: 12rem 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  gap: 1rem;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }`
	}
]

/** Ячейка визуального предпросмотра раскладки. */
function Cell({
	children,
	accent = false,
	style
}: {
	children: React.ReactNode
	accent?: boolean
	style?: CSSProperties
}) {
	return (
		<div
			style={style}
			className={`flex items-center justify-center rounded-md py-3 text-center text-xs font-medium ${
				accent
					? 'bg-primary text-primary-foreground'
					: 'bg-secondary text-secondary-foreground'
			}`}
		>
			{children}
		</div>
	)
}

/**
 * Живой предпросмотр раскладки: рендерится настоящим CSS Grid теми же
 * свойствами, что и в коде примера (размеры уменьшены под ширину блока).
 */
function GridPreview({ demo }: { demo: Demo }) {
	let grid = null

	if (demo === 'sidebar') {
		grid = (
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '4rem 1fr',
					gap: '0.5rem'
				}}
			>
				<Cell accent>sidebar</Cell>
				<Cell>content · 1fr</Cell>
			</div>
		)
	} else if (demo === 'gallery') {
		grid = (
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(3.5rem, 1fr))',
					gap: '0.5rem'
				}}
			>
				{Array.from({ length: 6 }).map((_, i) => (
					<Cell key={i}>{i + 1}</Cell>
				))}
			</div>
		)
	} else {
		grid = (
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '4rem 1fr',
					gridTemplateAreas: '"header header" "sidebar main" "footer footer"',
					gap: '0.5rem'
				}}
			>
				<Cell accent style={{ gridArea: 'header' }}>
					header
				</Cell>
				<Cell style={{ gridArea: 'sidebar' }}>sidebar</Cell>
				<Cell style={{ gridArea: 'main', minHeight: '3.5rem' }}>main</Cell>
				<Cell accent style={{ gridArea: 'footer' }}>
					footer
				</Cell>
			</div>
		)
	}

	return (
		<div className='mt-3 rounded-lg border bg-muted/40 p-3'>
			<div className='mb-2 text-xs text-muted-foreground'>Предпросмотр</div>
			{grid}
		</div>
	)
}

const PROPS: { name: string; desc: string }[] = [
	{
		name: 'grid-template-columns',
		desc: 'Задаёт число и ширину колонок. Значения — fr, px, %, minmax(), repeat().'
	},
	{
		name: 'grid-template-rows',
		desc: 'Задаёт число и высоту строк по тем же правилам, что и колонки.'
	},
	{
		name: 'gap',
		desc: 'Отступы между ячейками сетки. row-gap и column-gap задают их раздельно.'
	},
	{
		name: 'justify-items / align-items',
		desc: 'Выравнивание каждого элемента внутри ячейки по горизонтали и вертикали.'
	},
	{
		name: 'justify-content / align-content',
		desc: 'Выравнивание всей сетки внутри контейнера, когда остаётся свободное место.'
	},
	{
		name: 'grid-auto-flow',
		desc: 'Как размещаются элементы автоматически: по строкам, колонкам или плотно (dense).'
	},
	{
		name: 'repeat() и minmax()',
		desc: 'repeat(auto-fit, minmax(12rem, 1fr)) — адаптивная сетка без медиазапросов.'
	}
]

export function GridGuide() {
	return (
		<section className='mt-12 max-w-3xl mx-auto text-left text-foreground'>
			<h2 className='text-2xl font-bold tracking-tight'>Что такое CSS Grid</h2>
			<p className='mt-3 text-foreground leading-relaxed'>
				CSS Grid — двумерная система раскладки: она управляет одновременно{' '}
				<strong>строками и колонками</strong>. Этим Grid отличается от Flexbox,
				который раскладывает элементы в одном направлении. Сетка задаётся
				свойствами{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					grid-template-columns
				</code>
				,{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					grid-template-rows
				</code>{' '}
				и{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					gap
				</code>
				, а размеры удобно задавать в долях{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					fr
				</code>{' '}
				и через{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					minmax()
				</code>
				.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Как пользоваться генератором
			</h2>
			<ol className='mt-3 space-y-2 text-foreground leading-relaxed'>
				<li>
					Задайте число колонок и строк — сетка сразу перестроится в
					предпросмотре.
				</li>
				<li>
					Настройте отступы{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						gap
					</code>{' '}
					и выравнивание элементов по осям.
				</li>
				<li>Скопируйте готовый CSS или Tailwind-классы одной кнопкой.</li>
				<li>
					Вставьте код в проект — раскладка работает во всех современных
					браузерах.
				</li>
			</ol>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Примеры раскладок
			</h2>
			<div className='mt-4 space-y-5'>
				{EXAMPLES.map(ex => (
					<div
						key={ex.title}
						className='rounded-xl border bg-card p-5 text-left'
					>
						<h3 className='font-semibold'>{ex.title}</h3>
						<p className='mt-1 text-sm text-foreground'>{ex.desc}</p>
						<GridPreview demo={ex.demo} />
						<GuideCodeBlock className='mt-3' code={ex.code} />
					</div>
				))}
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Основные свойства CSS Grid
			</h2>
			<p className='mt-3 text-foreground leading-relaxed'>
				Короткая шпаргалка по свойствам, которые настраивает генератор выше, —
				скопируйте нужное в свой CSS.
			</p>
			<div className='mt-4 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b text-left'>
							<th className='py-2 pr-4 font-semibold'>Свойство</th>
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
				Grid или Flexbox — что выбрать
			</h2>
			<p className='mt-3 text-foreground leading-relaxed'>
				Правило простое: <strong>Grid — для двумерных макетов</strong>{' '}
				(страница, галерея, дашборд), <strong>Flexbox — для одномерных</strong>{' '}
				(панель кнопок, меню, ряд карточек). Часто их сочетают: Grid задаёт
				крупную структуру страницы, Flexbox выравнивает элементы внутри ячеек.
				Для одномерных раскладок используйте{' '}
				<Link
					href='/tools/flexbox-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генератор Flexbox
				</Link>
				, а глубже разобраться в Grid поможет{' '}
				<Link
					href='/blog/css-grid-layout'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					подробный гайд по CSS Grid
				</Link>
				.
			</p>
		</section>
	)
}

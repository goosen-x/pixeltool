import Link from 'next/link'
import type { CSSProperties } from 'react'

/**
 * Образовательный контент под инструментом Flexbox-генератора.
 * Повышает глубину страницы (качество), закрывает информационные запросы
 * по CSS Flexbox и даёт внутреннюю перелинковку на Grid-генератор и блог.
 */

type Demo = 'navbar' | 'center' | 'cards'

const EXAMPLES: { title: string; desc: string; code: string; demo: Demo }[] = [
	{
		title: 'Навигационная панель',
		desc: 'Логотип слева, ссылки справа. justify-content: space-between разносит элементы по краям, align-items: center выравнивает их по вертикали.',
		demo: 'navbar',
		code: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`
	},
	{
		title: 'Центрирование по обеим осям',
		desc: 'Классическая задача «отцентрировать блок». justify-content центрирует по горизонтали, align-items — по вертикали.',
		demo: 'center',
		code: `.box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 12rem;
}`
	},
	{
		title: 'Адаптивные карточки',
		desc: 'Карточки делят место поровну и переносятся на новую строку. flex: 1 растягивает их, flex-wrap разрешает перенос.',
		demo: 'cards',
		code: `.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.card {
  flex: 1 1 12rem;
}`
	}
]

const PROPS: { name: string; desc: string }[] = [
	{
		name: 'display: flex',
		desc: 'Включает флекс-раскладку — все прямые потомки становятся флекс-элементами.'
	},
	{
		name: 'flex-direction',
		desc: 'Основная ось: row (в ряд) или column (в столбец), плюс варианты -reverse.'
	},
	{
		name: 'justify-content',
		desc: 'Выравнивание вдоль основной оси: start, center, end, space-between, space-around.'
	},
	{
		name: 'align-items',
		desc: 'Выравнивание по поперечной оси: stretch, center, start, end, baseline.'
	},
	{
		name: 'flex-wrap',
		desc: 'Разрешает перенос элементов на новую строку (wrap) вместо сжатия в одну.'
	},
	{
		name: 'gap',
		desc: 'Отступы между флекс-элементами — по обеим осям или раздельно (row/column).'
	},
	{
		name: 'flex: grow shrink basis',
		desc: 'Как элемент растёт и сжимается. flex: 1 — занять всё свободное место поровну.'
	},
	{
		name: 'align-self / order',
		desc: 'Переопределить выравнивание одного элемента или изменить его визуальный порядок.'
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
			className={`flex items-center justify-center rounded-md px-3 py-3 text-center text-xs font-medium ${
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
 * Живой предпросмотр раскладки: рендерится настоящим CSS Flexbox теми же
 * свойствами, что и в коде примера.
 */
function FlexPreview({ demo }: { demo: Demo }) {
	let flex = null

	if (demo === 'navbar') {
		flex = (
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: '0.5rem'
				}}
			>
				<Cell accent>Логотип</Cell>
				<div style={{ display: 'flex', gap: '0.5rem' }}>
					<Cell>Главная</Cell>
					<Cell>О нас</Cell>
					<Cell>Контакты</Cell>
				</div>
			</div>
		)
	} else if (demo === 'center') {
		flex = (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '6rem'
				}}
			>
				<Cell accent>по центру</Cell>
			</div>
		)
	} else {
		flex = (
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
				{Array.from({ length: 3 }).map((_, i) => (
					<Cell key={i} style={{ flex: '1 1 6rem' }}>
						Карточка {i + 1}
					</Cell>
				))}
			</div>
		)
	}

	return (
		<div className='mt-3 rounded-lg border bg-muted/40 p-3'>
			<div className='mb-2 text-xs text-muted-foreground'>Предпросмотр</div>
			{flex}
		</div>
	)
}

export function FlexboxGuide() {
	return (
		<section className='mt-12 max-w-3xl mx-auto text-left text-foreground'>
			<h2 className='text-2xl font-bold tracking-tight'>
				Что такое CSS Flexbox
			</h2>
			<p className='mt-3 text-foreground leading-relaxed'>
				CSS Flexbox — одномерная система раскладки: она выстраивает элементы
				вдоль <strong>одной оси</strong> — в ряд или в столбец — и удобно
				управляет их выравниванием и распределением свободного места. Этим
				Flexbox отличается от Grid, который работает с двумя осями сразу.
				Раскладка задаётся свойством{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					display: flex
				</code>{' '}
				на контейнере, а поведение элементов — через{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					justify-content
				</code>
				,{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					align-items
				</code>{' '}
				и{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
					flex-wrap
				</code>
				.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Как пользоваться генератором
			</h2>
			<ol className='mt-3 space-y-2 text-foreground leading-relaxed'>
				<li>
					Выберите направление оси и способ выравнивания — раскладка сразу
					перестроится в предпросмотре.
				</li>
				<li>
					Настройте отступы{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						gap
					</code>{' '}
					и перенос элементов.
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
						<FlexPreview demo={ex.demo} />
						<pre className='mt-3 overflow-x-auto rounded-lg bg-secondary p-4 text-sm'>
							<code className='font-mono text-secondary-foreground'>
								{ex.code}
							</code>
						</pre>
					</div>
				))}
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Основные свойства CSS Flexbox
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
				Flexbox или Grid — что выбрать
			</h2>
			<p className='mt-3 text-foreground leading-relaxed'>
				Правило простое: <strong>Flexbox — для одномерных раскладок</strong>{' '}
				(панель кнопок, меню, ряд карточек, центрирование),{' '}
				<strong>Grid — для двумерных</strong> (страница, галерея, дашборд).
				Часто их сочетают: Grid задаёт крупную структуру страницы, Flexbox
				выравнивает элементы внутри блоков. Для двумерных раскладок используйте{' '}
				<Link
					href='/tools/grid-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генератор CSS Grid
				</Link>
				, а глубже разобраться во Flexbox поможет{' '}
				<Link
					href='/blog/css-flexbox-guide'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					подробный гайд по Flexbox
				</Link>
				.
			</p>
		</section>
	)
}

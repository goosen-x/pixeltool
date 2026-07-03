import Link from 'next/link'

/**
 * Образовательный контент под инструментом Grid-генератора.
 * Повышает глубину страницы (качество), закрывает информационные запросы
 * по CSS Grid и даёт внутреннюю перелинковку на Flexbox-генератор и блог.
 */

const EXAMPLES: { title: string; desc: string; code: string }[] = [
	{
		title: 'Две колонки: сайдбар и контент',
		desc: 'Фиксированный сайдбар слева и «резиновый» контент справа. Единица fr забирает всё свободное место.',
		code: `.layout {
  display: grid;
  grid-template-columns: 16rem 1fr;
  gap: 1.5rem;
}`
	},
	{
		title: 'Адаптивная галерея',
		desc: 'Карточки сами переносятся на новую строку. auto-fill + minmax() — раскладка без медиазапросов.',
		code: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 1rem;
}`
	},
	{
		title: 'Holy Grail через grid-template-areas',
		desc: 'Классический макет: шапка, сайдбар, контент, подвал — заданы по именам областей.',
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

export function GridGuide() {
	return (
		<section className='mt-12 max-w-3xl mx-auto text-center text-foreground'>
			<h2 className='text-2xl font-bold tracking-tight'>Что такое CSS Grid</h2>
			<p className='mt-3 text-foreground leading-relaxed'>
				CSS Grid — двумерная система раскладки: она управляет одновременно{' '}
				<strong>строками и колонками</strong>. Этим Grid отличается от Flexbox,
				который раскладывает элементы в одном направлении. Сетка задаётся
				свойствами <code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>grid-template-columns</code>,{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>grid-template-rows</code> и{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>gap</code>, а размеры удобно
				задавать в долях <code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>fr</code> и через{' '}
				<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>minmax()</code>.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Как пользоваться генератором
			</h2>
			<ol className='mt-3 space-y-2 text-foreground leading-relaxed'>
				<li>Задайте число колонок и строк — сетка сразу перестроится в предпросмотре.</li>
				<li>
					Настройте отступы <code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>gap</code> и
					выравнивание элементов по осям.
				</li>
				<li>Скопируйте готовый CSS или Tailwind-классы одной кнопкой.</li>
				<li>Вставьте код в проект — раскладка работает во всех современных браузерах.</li>
			</ol>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>Примеры раскладок</h2>
			<div className='mt-4 space-y-5'>
				{EXAMPLES.map(ex => (
					<div key={ex.title} className='rounded-xl border bg-card p-5 text-left'>
						<h3 className='font-semibold'>{ex.title}</h3>
						<p className='mt-1 text-sm text-foreground'>{ex.desc}</p>
						<pre className='mt-3 overflow-x-auto rounded-lg bg-secondary p-4 text-sm'>
							<code className='font-mono text-secondary-foreground'>{ex.code}</code>
						</pre>
					</div>
				))}
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Grid или Flexbox — что выбрать
			</h2>
			<p className='mt-3 text-foreground leading-relaxed'>
				Правило простое: <strong>Grid — для двумерных макетов</strong> (страница,
				галерея, дашборд), <strong>Flexbox — для одномерных</strong> (панель кнопок,
				меню, ряд карточек). Часто их сочетают: Grid задаёт крупную структуру
				страницы, Flexbox выравнивает элементы внутри ячеек. Для одномерных
				раскладок используйте{' '}
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

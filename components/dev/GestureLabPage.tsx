import Link from 'next/link'
import { GestureLabPicker, type LabGesture } from './GestureLabPicker'

// Стенд доступен на проде: жест надо трогать пальцем на настоящем телефоне, а
// не в эмуляторе, поэтому 404 по флагу dev здесь не ставим — от индексации
// закрываемся мета-роботсом, robots.txt и заголовком (см. lib/seo/noindex.ts).
export { NOINDEX } from '@/lib/seo/noindex'

type Variant = {
	gesture: LabGesture
	letter: string
	slug: string
	title: string
	summary: string
	rules: [string, string][]
	pros: string[]
	cons: string[]
}

export const VARIANTS: Variant[] = [
	{
		gesture: 'direction',
		letter: 'A',
		slug: 'napravlenie',
		title: 'Направление жеста',
		summary:
			'Браузеру заранее объявлено, что вертикаль — его: touch-action: pan-y. Горизонтальное ведение остаётся нам, и по первым восьми пикселям код решает, чей это жест.',
		rules: [
			['вниз/вверх', 'страница прокручивается, как обычно'],
			['вбок', 'ведём пипетку, страница стоит'],
			['тап', 'берём цвет в точке']
		],
		pros: [
			'Ничему учиться не надо: палец вниз — страница едет, палец вбок — цвет.'
		],
		cons: ['Вести пипетку строго вертикально нельзя — жест уйдёт в прокрутку.']
	},
	{
		gesture: 'hold',
		letter: 'B',
		slug: 'uderzhanie',
		title: 'Удержание',
		summary:
			'Пока палец неподвижен, браузер прокрутку ещё не начал — значит preventDefault() в этот момент её и не даст начать. Через 280 мс включается режим пипетки, и дальше палец волен идти куда угодно.',
		rules: [
			['свайп', 'страница прокручивается'],
			['держать 0,3 с', 'включается пипетка, дальше ведём куда угодно'],
			['тап', 'берём цвет в точке']
		],
		pros: [
			'Пипетка ходит в любую сторону, прокрутка по фото работает как везде.'
		],
		cons: ['Про удержание нужно догадаться — лечится подсказкой над фото.']
	},
	{
		gesture: 'target',
		letter: 'C',
		slug: 'pritsel',
		title: 'Перетаскиваемый прицел',
		summary:
			'touch-action: none висит только на маркере — 44 пикселя из всего фото. Само фото для браузера обычная картинка, прокрутка по нему не ломается в принципе.',
		rules: [
			['тап по фото', 'прицел прыгает в точку'],
			['тащить прицел', 'ведём пипетку, страница стоит'],
			['палец по фото', 'страница прокручивается всегда']
		],
		pros: [
			'Палец не закрывает точку, в которую целитесь, — попадание точнее.',
			'Единственный вариант, где прокрутка не может сломаться в принципе.'
		],
		cons: ['Лишний шаг: сначала тап, потом подводим маркер.']
	}
]

export function GestureLabPage({ slug }: { slug: string }) {
	const variant = VARIANTS.find(v => v.slug === slug)
	if (!variant) return null
	const others = VARIANTS.filter(v => v.slug !== slug)

	return (
		<main className='mx-auto max-w-2xl px-4 pt-10 pb-24'>
			<Link
				href='/dev/pipetka'
				className='font-mono text-xs text-muted-foreground hover:text-foreground'
			>
				← все варианты
			</Link>

			<h1 className='mt-4 text-3xl font-bold tracking-tight'>
				<span className='font-mono text-base text-muted-foreground'>
					{variant.letter}.
				</span>{' '}
				{variant.title}
			</h1>

			<div className='mt-4 flex flex-col gap-2'>
				{variant.rules.map(([gesture, result]) => (
					<div key={gesture} className='flex items-baseline gap-3 text-sm'>
						<span className='shrink-0 rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary'>
							{gesture}
						</span>
						<span className='text-muted-foreground'>{result}</span>
					</div>
				))}
			</div>

			<div className='mt-6'>
				<GestureLabPicker gesture={variant.gesture} />
			</div>

			<p className='mt-4 rounded-lg bg-primary/5 px-4 py-3 text-sm text-muted-foreground'>
				Строка «страница за жест» считает, на сколько пикселей уехала страница,
				пока вы вели пипетку. Ноль — то, чего сейчас нет в проде, где лупа и
				прокрутка едут одновременно.
			</p>

			<section className='mt-10 flex flex-col gap-3'>
				<h2 className='text-xl font-semibold'>Как это устроено</h2>
				<p className='text-sm text-muted-foreground'>{variant.summary}</p>
				<ul className='flex list-disc flex-col gap-1.5 pl-5 text-sm'>
					{variant.pros.map(pro => (
						<li key={pro}>{pro}</li>
					))}
					{variant.cons.map(con => (
						<li key={con} className='text-muted-foreground'>
							{con}
						</li>
					))}
				</ul>
			</section>

			<section className='mt-10 flex flex-col gap-3'>
				<h2 className='text-xl font-semibold'>
					Почему в проде едет и лупа, и страница
				</h2>
				<p className='text-sm text-muted-foreground'>
					В photo-color-picker логика «скролл или пипетка» написана правильно,
					но preventDefault() вызывается внутри React-пропа onTouchMove. React с
					17-й версии вешает touchstart, touchmove и wheel на корень документа
					пассивно, а в пассивном слушателе preventDefault() не делает ничего:
					код принимает решение, браузер о нём не знает и продолжает
					прокручивать. Поэтому во всех трёх вариантах слушатели повешены
					нативно, через addEventListener с passive: false.
				</p>
			</section>

			<section className='mt-10 flex flex-col gap-3'>
				<h2 className='text-xl font-semibold'>Другие варианты</h2>
				<div className='flex flex-col gap-2'>
					{others.map(other => (
						<Link
							key={other.slug}
							href={`/dev/pipetka/${other.slug}`}
							rel='nofollow'
							className='rounded-lg border px-4 py-3 text-sm transition-colors hover:border-primary/50'
						>
							<span className='font-mono text-xs text-muted-foreground'>
								{other.letter}.
							</span>{' '}
							{other.title}
						</Link>
					))}
				</div>
			</section>

			{/* Запас высоты: без него на длинном экране страница не прокручивается
			    вовсе, и проверить конфликт жеста с прокруткой невозможно. */}
			<div className='h-[70vh]' aria-hidden />
		</main>
	)
}

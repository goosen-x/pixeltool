'use client'

import Link from 'next/link'
import { CSSProperties } from 'react'

interface ShadowExample {
	title: string
	desc: string
	code: string
	style: CSSProperties
	kind: 'box' | 'text'
}

const BOX_EXAMPLES: ShadowExample[] = [
	{
		title: 'Тень карточки',
		desc: 'Мягкая многослойная тень: два слоя с разным размытием выглядят естественнее одного.',
		code: `box-shadow:
  0 1px 2px rgba(0, 0, 0, 0.06),
  0 8px 24px rgba(0, 0, 0, 0.12);`,
		style: {
			boxShadow: '0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.12)'
		},
		kind: 'box'
	},
	{
		title: 'Тень кнопки',
		desc: 'Короткое смещение и небольшое размытие: кнопка приподнята, но не парит над макетом.',
		code: `box-shadow: 0 2px 4px rgba(37, 99, 235, 0.4);`,
		style: { boxShadow: '0 2px 4px rgba(37, 99, 235, .4)' },
		kind: 'box'
	},
	{
		title: 'Внутренняя тень (inset)',
		desc: 'Ключевое слово inset уводит тень внутрь — так делают вдавленные кнопки и поля ввода.',
		code: `box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);`,
		style: { boxShadow: 'inset 0 2px 4px rgba(0,0,0,.15)' },
		kind: 'box'
	},
	{
		title: 'Свечение вокруг элемента',
		desc: 'Нулевое смещение, крупное размытие и цветная тень дают ореол вместо тени.',
		code: `box-shadow: 0 0 20px 3px rgba(59, 130, 246, 0.5);`,
		style: { boxShadow: '0 0 20px 3px rgba(59, 130, 246, .5)' },
		kind: 'box'
	}
]

const TEXT_EXAMPLES: ShadowExample[] = [
	{
		title: 'Мягкая тень текста',
		desc: 'Аккуратно отделяет заголовок от фона, не мешая читаемости.',
		code: `text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.3);`,
		style: { textShadow: '1px 2px 4px rgba(0,0,0,.3)' },
		kind: 'text'
	},
	{
		title: 'Текст поверх фотографии',
		desc: 'Два слоя тени удерживают контраст на пёстрой картинке.',
		code: `text-shadow:
  0 1px 3px rgba(0, 0, 0, 0.8),
  0 0 12px rgba(0, 0, 0, 0.6);`,
		style: { textShadow: '0 1px 3px rgba(0,0,0,.8), 0 0 12px rgba(0,0,0,.6)' },
		kind: 'text'
	},
	{
		title: 'Неоновый текст',
		desc: 'Несколько слоёв одного цвета с растущим размытием — и буквы светятся.',
		code: `text-shadow:
  0 0 8px rgba(244, 63, 94, 0.9),
  0 0 20px rgba(244, 63, 94, 0.7),
  0 0 40px rgba(244, 63, 94, 0.4);`,
		style: {
			textShadow:
				'0 0 8px rgba(244,63,94,.9), 0 0 20px rgba(244,63,94,.7), 0 0 40px rgba(244,63,94,.4)'
		},
		kind: 'text'
	}
]

const PARAMS: { name: string; desc: string }[] = [
	{
		name: 'offset-x',
		desc: 'Смещение тени по горизонтали. Положительное значение сдвигает вправо, отрицательное — влево.'
	},
	{
		name: 'offset-y',
		desc: 'Смещение по вертикали. Положительное значение опускает тень вниз — так падает свет сверху.'
	},
	{
		name: 'blur-radius',
		desc: 'Размытие краёв. Ноль даёт резкую тень, большие значения — мягкий рассеянный ореол.'
	},
	{
		name: 'spread-radius',
		desc: 'Растяжение: увеличивает или уменьшает тень целиком. Только у box-shadow.'
	},
	{
		name: 'color',
		desc: 'Цвет тени. Почти всегда rgba с низкой альфой — чистый чёрный выглядит грязно.'
	},
	{
		name: 'inset',
		desc: 'Переносит тень внутрь элемента. Только у box-shadow; text-shadow его не поддерживает.'
	}
]

function Code({ children }: { children: string }) {
	return (
		<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
			{children}
		</code>
	)
}

function ExampleCard({ ex }: { ex: ShadowExample }) {
	return (
		<div className='rounded-xl border bg-card p-5 text-left'>
			<h3 className='font-semibold'>{ex.title}</h3>
			<p className='mt-1 text-sm text-foreground'>{ex.desc}</p>
			<div className='mt-4 flex items-center justify-center rounded-lg bg-secondary p-8'>
				{ex.kind === 'box' ? (
					<div
						className='h-20 w-32 rounded-lg bg-background'
						style={ex.style}
						aria-hidden
					/>
				) : (
					<span
						className='text-3xl font-bold text-foreground'
						style={ex.style}
						aria-hidden
					>
						Заголовок
					</span>
				)}
			</div>
			<pre className='mt-3 overflow-x-auto rounded-lg bg-secondary p-4 text-sm'>
				<code className='font-mono text-secondary-foreground'>{ex.code}</code>
			</pre>
		</div>
	)
}

export function ShadowGuide() {
	return (
		<section className='mt-12 max-w-3xl mx-auto text-left text-foreground'>
			<h2 className='text-2xl font-bold tracking-tight'>Как сделать тень в CSS</h2>
			<p className='mt-3 leading-relaxed'>
				В CSS две тени, и путать их не стоит. Тень блока рисует{' '}
				<Code>box-shadow</Code> — она повторяет прямоугольник элемента вместе со
				скруглением углов. Тень букв рисует <Code>text-shadow</Code> — у неё
				короче синтаксис: нет ни растяжения, ни внутренней тени. Генератор выше
				умеет обе: переключите режим в блоке «Что затеняем».
			</p>
			<p className='mt-3 leading-relaxed'>
				Значение читается слева направо: сначала смещение по X и Y, затем
				размытие, затем (только у <Code>box-shadow</Code>) растяжение, и в конце
				цвет.
			</p>
			<pre className='mt-4 overflow-x-auto rounded-lg bg-secondary p-4 text-sm'>
				<code className='font-mono text-secondary-foreground'>{`/* смещение X, смещение Y, размытие, растяжение, цвет */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

/* смещение X, смещение Y, размытие, цвет */
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);`}</code>
			</pre>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Готовые тени для блоков
			</h2>
			<p className='mt-3 leading-relaxed'>
				Четыре тени, которые закрывают почти все задачи вёрстки. Скопируйте код и
				вставьте в свой CSS — или соберите свой вариант в генераторе выше.
			</p>
			<div className='mt-4 space-y-5'>
				{BOX_EXAMPLES.map(ex => (
					<ExampleCard key={ex.title} ex={ex} />
				))}
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Тень при наведении
			</h2>
			<p className='mt-3 leading-relaxed'>
				Чтобы карточка приподнималась под курсором, опишите тень в состоянии{' '}
				<Code>:hover</Code> и добавьте переход. Анимируйте только тень — не
				трогайте <Code>margin</Code> или <Code>height</Code>, иначе браузер будет
				пересчитывать вёрстку на каждом кадре.
			</p>
			<pre className='mt-4 overflow-x-auto rounded-lg bg-secondary p-4 text-sm'>
				<code className='font-mono text-secondary-foreground'>{`.card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}`}</code>
			</pre>
			<p className='mt-3 leading-relaxed'>
				Плавность перехода задаёт функция времени: подобрать свою можно в{' '}
				<Link
					href='/tools/css-bezier-curve-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генераторе cubic-bezier
				</Link>
				, а собрать полноценную анимацию — в{' '}
				<Link
					href='/tools/css-keyframes-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					конструкторе CSS-анимаций
				</Link>
				.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>Тень текста</h2>
			<p className='mt-3 leading-relaxed'>
				<Code>text-shadow</Code> работает так же, но без растяжения и{' '}
				<Code>inset</Code>. Чаще всего его берут ради читаемости — когда светлый
				заголовок лежит поверх фотографии.
			</p>
			<div className='mt-4 space-y-5'>
				{TEXT_EXAMPLES.map(ex => (
					<ExampleCard key={ex.title} ex={ex} />
				))}
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Параметры тени
			</h2>
			<div className='mt-4 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b text-left'>
							<th className='py-2 pr-4 font-semibold'>Параметр</th>
							<th className='py-2 font-semibold'>Что делает</th>
						</tr>
					</thead>
					<tbody>
						{PARAMS.map(p => (
							<tr key={p.name} className='border-b align-top last:border-0'>
								<td className='py-2 pr-4'>
									<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
										{p.name}
									</code>
								</td>
								<td className='py-2'>{p.desc}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Как получается красивая тень
			</h2>
			<p className='mt-3 leading-relaxed'>
				Главная ошибка — чёрная тень на полной непрозрачности. В жизни свет
				рассеивается, поэтому берите <Code>rgba</Code> с альфой{' '}
				<strong>0.08–0.15</strong> и размытие <strong>15–30px</strong>.
				Небольшое отрицательное растяжение подтягивает тень под элемент и убирает
				ореол по краям. Два-три слоя с разным размытием дают глубину, которой не
				добиться одним. Оттенок тени полезно брать не чёрный, а затемнённый цвет
				фона — подобрать его поможет{' '}
				<Link
					href='/tools/color-converter'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					конвертер цветов
				</Link>
				.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				box-shadow или filter: drop-shadow
			</h2>
			<p className='mt-3 leading-relaxed'>
				<Code>box-shadow</Code> всегда повторяет прямоугольник элемента с учётом{' '}
				<Code>border-radius</Code>. <Code>filter: drop-shadow()</Code> повторяет
				фактическую форму содержимого — прозрачные области PNG и контуры SVG. Для
				карточек и кнопок берите первое, для иконок и картинок с прозрачным фоном
				— второе. Фон под тенью удобно собрать в{' '}
				<Link
					href='/tools/css-gradient-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генераторе градиентов
				</Link>
				.
			</p>
		</section>
	)
}

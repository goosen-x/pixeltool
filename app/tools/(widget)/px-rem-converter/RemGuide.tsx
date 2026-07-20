'use client'

import Link from 'next/link'
import { GuideCodeBlock } from '@/components/widgets/GuideCodeBlock'

const TABLE: { px: number; rem: string; usage: string }[] = [
	{
		px: 4,
		rem: '0.25rem',
		usage: 'Мелкий отступ, зазор между иконкой и текстом'
	},
	{ px: 8, rem: '0.5rem', usage: 'Внутренний отступ компактных элементов' },
	{ px: 12, rem: '0.75rem', usage: 'Подписи, вспомогательный текст' },
	{ px: 14, rem: '0.875rem', usage: 'Мелкий текст интерфейса' },
	{ px: 16, rem: '1rem', usage: 'Базовый размер текста' },
	{ px: 20, rem: '1.25rem', usage: 'Крупный текст, подзаголовок' },
	{ px: 24, rem: '1.5rem', usage: 'Заголовок третьего уровня, отступ секции' },
	{ px: 32, rem: '2rem', usage: 'Заголовок, крупный отступ' },
	{ px: 48, rem: '3rem', usage: 'Отступ между блоками страницы' },
	{ px: 64, rem: '4rem', usage: 'Крупный заголовок, отступ секции' }
]

function Code({ children }: { children: string }) {
	return (
		<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
			{children}
		</code>
	)
}

export function RemGuide() {
	return (
		<section className='mt-12 max-w-3xl mx-auto text-left text-foreground'>
			<h2 className='text-2xl font-bold tracking-tight'>
				Как перевести rem в px и обратно
			</h2>
			<p className='mt-3 leading-relaxed'>
				Обе формулы держатся на одном числе — базовом размере шрифта корневого
				элемента. По умолчанию в браузерах это <strong>16px</strong>.
			</p>
			<GuideCodeBlock
				className='mt-4'
				code={`px  = rem × 16      /* 1.5rem × 16 = 24px */
rem = px  ÷ 16      /* 24px  ÷ 16 = 1.5rem */`}
			/>
			<p className='mt-3 leading-relaxed'>
				Если база другая — скажем, дизайн-система живёт на 14px — подставьте её
				вместо шестнадцати. Конвертер выше умеет считать с любой базой.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Таблица соответствий при базе 16px
			</h2>
			<p className='mt-3 leading-relaxed'>
				Значения, которые встречаются в вёрстке чаще всего. Держите под рукой,
				чтобы не считать в уме.
			</p>
			<div className='mt-4 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b text-left'>
							<th className='py-2 pr-4 font-semibold'>px</th>
							<th className='py-2 pr-4 font-semibold'>rem</th>
							<th className='py-2 font-semibold'>Где применяется</th>
						</tr>
					</thead>
					<tbody>
						{TABLE.map(row => (
							<tr key={row.px} className='border-b align-top last:border-0'>
								<td className='py-2 pr-4 font-mono text-xs'>{row.px}px</td>
								<td className='py-2 pr-4 font-mono text-xs'>{row.rem}</td>
								<td className='py-2'>{row.usage}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Чем rem отличается от em
			</h2>
			<p className='mt-3 leading-relaxed'>
				<Code>rem</Code> всегда считается от корневого элемента, а{' '}
				<Code>em</Code> — от размера шрифта родителя. Разница вылезает при
				вложенности: <Code>em</Code> накапливается.
			</p>
			<GuideCodeBlock
				className='mt-4'
				code={`/* em копится: каждый уровень умножает предыдущий */
.a { font-size: 0.9em; }  /* 14.4px от базовых 16px */
.a .b { font-size: 0.9em; }  /* 12.96px — уже не от 16px, а от 14.4px */
.a .b .c { font-size: 0.9em; }  /* 11.66px */

/* rem не копится: отсчёт всегда от html */
.a, .a .b, .a .b .c { font-size: 0.9rem; }  /* везде 14.4px */`}
			/>
			<p className='mt-3 leading-relaxed'>
				Поэтому для типографики и отступов берут <Code>rem</Code> — он
				предсказуем. <Code>em</Code> остаётся полезен там, где размер должен
				зависеть от текста рядом: например, внутренний отступ кнопки, который
				сам подстраивается под кегль надписи.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Зачем вообще rem вместо px
			</h2>
			<p className='mt-3 leading-relaxed'>
				Ради людей, которые увеличивают шрифт в настройках браузера. Размеры в{' '}
				<Code>rem</Code> подхватят эту настройку автоматически: текст, отступы и
				блоки вырастут вместе. Размеры в <Code>px</Code> останутся мелкими — и
				сайт для такого человека просто не читается. Это самая частая причина
				жалоб на «слишком мелкий шрифт», и лечится она выбором единицы.
			</p>
			<p className='mt-3 leading-relaxed'>
				При этом <Code>px</Code> никуда не уходит: границы в 1px, тонкие
				разделители и размеры иконок масштабировать не нужно. Смешивать единицы
				— нормально, если понимаешь, почему в каждом месте выбрана своя.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Трюк с базой 10px
			</h2>
			<p className='mt-3 leading-relaxed'>
				Чтобы деление на 16 не мешало жить, корню задают{' '}
				<Code>font-size: 62.5%</Code> — это как раз 10px от стандартных 16px.
				После этого <Code>1rem = 10px</Code>, и перевод превращается в сдвиг
				запятой: 24px — это 2.4rem.
			</p>
			<GuideCodeBlock
				className='mt-4'
				code={`html { font-size: 62.5%; }  /* 1rem = 10px */
body { font-size: 1.6rem; } /* вернули читаемые 16px тексту */`}
			/>
			<p className='mt-3 leading-relaxed'>
				Важная деталь: базу задают в процентах, а не в пикселях. Жёсткое{' '}
				<Code>font-size: 10px</Code> на корне отрезало бы пользовательскую
				настройку шрифта — то есть убило бы ровно то, ради чего мы взяли{' '}
				<Code>rem</Code>. Проценты же считаются от пользовательской базы и
				сохраняют масштабирование.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Шрифт, который тянется за экраном
			</h2>
			<p className='mt-3 leading-relaxed'>
				Если размер должен плавно меняться вместе с шириной окна, фиксированного{' '}
				<Code>rem</Code> мало — нужна функция <Code>clamp()</Code>. Она задаёт
				минимум, желаемое значение и максимум одной строкой; собрать её можно в{' '}
				<Link
					href='/tools/css-clamp-calculator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					калькуляторе clamp
				</Link>
				.
			</p>

			<p className='mt-8 leading-relaxed'>
				Подробнее о формуле перевода, трюке с базой 10px и о том, почему rem
				важен для доступности, — в статье{' '}
				<Link
					href='/blog/px-rem-converter'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					«Как перевести px в rem (и обратно)»
				</Link>
				.
			</p>
		</section>
	)
}

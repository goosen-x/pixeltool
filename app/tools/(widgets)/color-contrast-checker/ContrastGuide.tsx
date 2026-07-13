'use client'

import Link from 'next/link'

interface Sample {
	label: string
	fg: string
	bg: string
	ratio: string
	verdict: string
	ok: boolean
}

const SAMPLES: Sample[] = [
	{
		label: 'Чёрный на белом',
		fg: '#000000',
		bg: '#ffffff',
		ratio: '21:1',
		verdict: 'Максимум. Проходит всё, включая AAA',
		ok: true
	},
	{
		label: 'Тёмно-серый на белом',
		fg: '#4b5563',
		bg: '#ffffff',
		ratio: '7.5:1',
		verdict: 'Проходит AAA для обычного текста',
		ok: true
	},
	{
		label: 'Синий на белом',
		fg: '#2563eb',
		bg: '#ffffff',
		ratio: '5.2:1',
		verdict: 'Проходит AA, до AAA не дотягивает',
		ok: true
	},
	{
		label: 'Светло-серый на белом',
		fg: '#9ca3af',
		bg: '#ffffff',
		ratio: '2.5:1',
		verdict: 'Не проходит даже AA — типичная ошибка в плейсхолдерах',
		ok: false
	},
	{
		label: 'Белый на жёлтом',
		fg: '#ffffff',
		bg: '#facc15',
		ratio: '1.6:1',
		verdict: 'Не проходит. Жёлтый кажется ярким, но контраста с белым почти нет',
		ok: false
	}
]

const LEVELS: { level: string; normal: string; large: string; note: string }[] = [
	{
		level: 'AA (минимум)',
		normal: '4.5:1',
		large: '3:1',
		note: 'Рабочая планка для обычного интерфейса'
	},
	{
		level: 'AAA (строгий)',
		normal: '7:1',
		large: '4.5:1',
		note: 'Нужен там, где читаемость критична'
	},
	{
		level: 'Интерфейс',
		normal: '3:1',
		large: '3:1',
		note: 'Границы полей, иконки, индикатор фокуса'
	}
]

function Code({ children }: { children: string }) {
	return (
		<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
			{children}
		</code>
	)
}

export function ContrastGuide() {
	return (
		<section className='mt-12 max-w-3xl mx-auto text-left text-foreground'>
			<h2 className='text-2xl font-bold tracking-tight'>
				Что такое контраст текста и фона
			</h2>
			<p className='mt-3 leading-relaxed'>
				Контраст — это отношение яркости двух цветов. Его считают по формуле{' '}
				<Code>(L1 + 0.05) / (L2 + 0.05)</Code>, где L1 — яркость светлого цвета,
				L2 — тёмного. Шкала идёт от <strong>1:1</strong> (цвета совпадают, текст
				не виден) до <strong>21:1</strong> (чистый чёрный на чистом белом).
			</p>
			<p className='mt-3 leading-relaxed'>
				Главная ловушка: контраст не равен «разнице цветов на глаз». Жёлтый
				кажется ярким и заметным, но белый текст на жёлтом фоне почти нечитаем —
				их яркости слишком близки. Поэтому цвета проверяют цифрой, а не
				ощущением.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Пороги WCAG: сколько нужно
			</h2>
			<div className='mt-4 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b text-left'>
							<th className='py-2 pr-4 font-semibold'>Уровень</th>
							<th className='py-2 pr-4 font-semibold'>Обычный текст</th>
							<th className='py-2 pr-4 font-semibold'>Крупный текст</th>
							<th className='py-2 font-semibold'>Когда применять</th>
						</tr>
					</thead>
					<tbody>
						{LEVELS.map(l => (
							<tr key={l.level} className='border-b align-top last:border-0'>
								<td className='py-2 pr-4 font-medium'>{l.level}</td>
								<td className='py-2 pr-4 font-mono text-xs'>{l.normal}</td>
								<td className='py-2 pr-4 font-mono text-xs'>{l.large}</td>
								<td className='py-2'>{l.note}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<p className='mt-3 leading-relaxed'>
				Крупным считается текст от <strong>24px</strong> обычного начертания или
				от <strong>18.66px</strong> жирного. Буквы толще — глазу проще, поэтому
				порог ниже.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Как это выглядит на практике
			</h2>
			<div className='mt-4 space-y-3'>
				{SAMPLES.map(s => (
					<div
						key={s.label}
						className='flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center'
					>
						<div
							className='flex h-16 w-full shrink-0 items-center justify-center rounded-lg sm:w-48'
							style={{ backgroundColor: s.bg, color: s.fg }}
						>
							<span className='text-base font-medium'>Пример текста</span>
						</div>
						<div className='min-w-0'>
							<p className='font-semibold'>
								{s.label} — <span className='font-mono'>{s.ratio}</span>
							</p>
							<p
								className={`mt-1 text-sm ${
									s.ok ? 'text-muted-foreground' : 'text-destructive'
								}`}
							>
								{s.verdict}
							</p>
						</div>
					</div>
				))}
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Текст не проходит по контрасту: как чинить
			</h2>
			<p className='mt-3 leading-relaxed'>
				Первый инстинкт — «сделать цвет ярче» — обычно не помогает: насыщенность
				на контраст почти не влияет.{' '}
				<strong>Меняйте светлоту, а не насыщенность.</strong> Затемните текст или
				осветлите фон, сохранив тон, — фирменный цвет останется узнаваемым, а
				коэффициент вырастет. Удобнее всего крутить это в HSL, где светлота
				вынесена в отдельный канал:{' '}
				<Link
					href='/tools/color-converter'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					конвертер цветов
				</Link>{' '}
				переведёт HEX в HSL и обратно.
			</p>
			<p className='mt-3 leading-relaxed'>
				Если цвет менять нельзя вовсе, увеличьте кегль или сделайте начертание
				жирным: для крупного текста порог падает с 4.5:1 до 3:1. А для белого
				заголовка поверх фотографии добавьте тень или полупрозрачную подложку —
				подобрать её можно в{' '}
				<Link
					href='/tools/css-box-shadow-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генераторе теней
				</Link>
				.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Где чаще всего проваливают контраст
			</h2>
			<ul className='mt-3 space-y-2 leading-relaxed'>
				<li>
					<strong>Плейсхолдеры в полях ввода.</strong> Светло-серый на белом —
					классические 2.5:1. Подсказка внутри поля обязана читаться так же, как
					обычный текст.
				</li>
				<li>
					<strong>Неактивные элементы.</strong> Задизейбленную кнопку часто
					делают почти невидимой. Формально к ней требований нет, но пользователь
					должен понимать, что она вообще существует.
				</li>
				<li>
					<strong>Текст поверх картинок и градиентов.</strong> Фон меняется от
					пикселя к пикселю: проверяйте по самому светлому участку под текстом.
				</li>
				<li>
					<strong>Индикатор фокуса.</strong> Ему нужны те же 3:1 с фоном — иначе
					навигация с клавиатуры превращается в угадайку.
				</li>
			</ul>
		</section>
	)
}

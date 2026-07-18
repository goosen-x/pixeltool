/**
 * Декоративный фоновый узор карточки инструмента. Семь вариантов, чтобы карточки
 * на главной отличались друг от друга. Узор рисуется линиями currentColor —
 * цвет и прозрачность задаёт родитель, поэтому он одинаково работает в светлой
 * и тёмной теме. Вариант выбирается по хешу id инструмента (стабильно).
 */

interface Props {
	/** Любое число (например индекс или хеш id) — приводится к 0..6. */
	variant: number
	className?: string
}

const wrap = (children: React.ReactNode) => (
	<svg
		viewBox='0 0 240 240'
		fill='none'
		stroke='currentColor'
		preserveAspectRatio='xMidYMid slice'
		aria-hidden
		className='absolute -right-10 top-1/2 h-[150%] w-[20rem] max-w-none -translate-y-1/2 transition-transform duration-500 group-hover:scale-110'
	>
		{children}
	</svg>
)

// 0 — плавные волны (контурные линии)
const waves = wrap(
	<g strokeWidth={1.2}>
		{[0, 22, 44, 66, 88, 110, 132].map((o, i) => (
			<path
				key={i}
				d={`M-20 ${60 + o} C 40 ${20 + o}, 90 ${120 + o}, 150 ${70 + o} S 240 ${10 + o}, 300 ${60 + o}`}
			/>
		))}
	</g>
)

// 1 — точечная сетка
const dots = wrap(
	<>
		<defs>
			<pattern
				id='cp-dots'
				width='18'
				height='18'
				patternUnits='userSpaceOnUse'
			>
				<circle cx='2' cy='2' r='1.6' fill='currentColor' stroke='none' />
			</pattern>
		</defs>
		<rect width='240' height='240' fill='url(#cp-dots)' stroke='none' />
	</>
)

// 2 — диагональные линии
const diagonals = wrap(
	<>
		<defs>
			<pattern
				id='cp-diag'
				width='16'
				height='16'
				patternUnits='userSpaceOnUse'
				patternTransform='rotate(0)'
			>
				<path d='M-4 20 L 20 -4' strokeWidth={1.2} />
				<path d='M4 28 L 28 4' strokeWidth={1.2} />
			</pattern>
		</defs>
		<rect width='240' height='240' fill='url(#cp-diag)' stroke='none' />
	</>
)

// 3 — концентрические круги
const rings = wrap(
	<g strokeWidth={1.2}>
		{[26, 52, 78, 104, 130, 156, 182].map(r => (
			<circle key={r} cx='170' cy='120' r={r} />
		))}
	</g>
)

// 4 — квадратная сетка
const grid = wrap(
	<>
		<defs>
			<pattern
				id='cp-grid'
				width='22'
				height='22'
				patternUnits='userSpaceOnUse'
			>
				<path d='M22 0 L 0 0 0 22' strokeWidth={1} />
			</pattern>
		</defs>
		<rect width='240' height='240' fill='url(#cp-grid)' stroke='none' />
	</>
)

// 5 — шевроны (зигзаг)
const chevrons = wrap(
	<>
		<defs>
			<pattern
				id='cp-chevron'
				width='24'
				height='16'
				patternUnits='userSpaceOnUse'
			>
				<path d='M0 14 L 12 2 L 24 14' strokeWidth={1.2} />
			</pattern>
		</defs>
		<rect width='240' height='240' fill='url(#cp-chevron)' stroke='none' />
	</>
)

// 6 — чешуя (пересекающиеся дуги)
const scales = wrap(
	<>
		<defs>
			<pattern
				id='cp-scales'
				width='28'
				height='16'
				patternUnits='userSpaceOnUse'
			>
				<path d='M0 16 A 14 14 0 0 1 28 16' strokeWidth={1.1} />
				<path d='M-14 16 A 14 14 0 0 1 14 16' strokeWidth={1.1} />
				<path d='M14 16 A 14 14 0 0 1 42 16' strokeWidth={1.1} />
			</pattern>
		</defs>
		<rect width='240' height='240' fill='url(#cp-scales)' stroke='none' />
	</>
)

const PATTERNS = [waves, dots, diagonals, rings, grid, chevrons, scales]

/** Стабильный индекс узора 0..6 из строки. */
function hashIndex(s: string): number {
	let sum = 0
	for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i)
	return sum % PATTERNS.length
}

// У каждой категории — свой узор («рубашка»): категорий ровно 7, как и узоров.
const CATEGORY_PATTERN: Record<string, number> = {
	generators: 0,
	html: 1,
	css: 2,
	javascript: 3,
	text: 4,
	security: 5,
	utilities: 6
}

/** Индекс узора по категории инструмента (fallback — хеш строки). */
export function patternIndexForCategory(category: string): number {
	return CATEGORY_PATTERN[category] ?? hashIndex(category)
}

export function CardPattern({ variant }: Props) {
	const v = ((variant % PATTERNS.length) + PATTERNS.length) % PATTERNS.length
	return PATTERNS[v]
}

export function DestinyMatrixIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
		>
			<title>Матрица судьбы</title>
			{/* Прямой квадрат и повёрнутый на 45° — вместе как на схеме тула,
			    пересечение двух четырёхугольников образует восьмиконечную звезду. */}
			<rect x='4.2' y='4.2' width='15.6' height='15.6' />
			<path d='M12 1 23 12 12 23 1 12Z' />
		</svg>
	)
}

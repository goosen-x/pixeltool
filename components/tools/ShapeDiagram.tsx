/**
 * Схема фигуры с подписанными размерами.
 *
 * Ради неё половина смысла тула: у конкурентов поля называются «сторона a» и
 * «сторона b», и человек гадает, что из этого длина, а что ширина, и меряется
 * ли диаметр или радиус. Схема снимает вопрос без единого слова.
 *
 * Рисуется схематично и не в масштабе: задача — показать, какая буква к
 * какому размеру относится, а не изобразить пропорции. Масштабная схема на
 * трубе диаметром 100 мм и длиной 6 м выродилась бы в линию.
 */

interface ShapeDiagramProps {
	shapeId: string
	className?: string
}

const SHAPE = 'stroke-foreground/70'
const DIM = 'stroke-primary'
const LABEL = 'fill-primary text-[13px] font-medium'

/** Размерная линия со стрелками на концах. */
function Dim({
	x1,
	y1,
	x2,
	y2
}: {
	x1: number
	y1: number
	x2: number
	y2: number
}) {
	return (
		<g
			className={DIM}
			strokeWidth={1.2}
			markerStart='url(#tick)'
			markerEnd='url(#tick)'
		>
			<line x1={x1} y1={y1} x2={x2} y2={y2} />
		</g>
	)
}

export function ShapeDiagram({ shapeId, className }: ShapeDiagramProps) {
	return (
		<svg
			viewBox='0 0 220 160'
			role='img'
			aria-label='Схема фигуры с обозначениями размеров'
			className={className}
			fill='none'
		>
			<defs>
				<marker
					id='tick'
					viewBox='0 0 6 6'
					refX='3'
					refY='3'
					markerWidth='6'
					markerHeight='6'
					orient='auto'
				>
					<line
						x1='3'
						y1='0'
						x2='3'
						y2='6'
						className='stroke-primary'
						strokeWidth={1.2}
					/>
				</marker>
			</defs>

			{shapeId === 'rectangle' && (
				<>
					<rect
						x='30'
						y='30'
						width='140'
						height='80'
						className={SHAPE}
						strokeWidth={1.6}
					/>
					<Dim x1={30} y1={126} x2={170} y2={126} />
					<text x='100' y='144' textAnchor='middle' className={LABEL}>
						a
					</text>
					<Dim x1={186} y1={30} x2={186} y2={110} />
					<text x='198' y='74' className={LABEL}>
						b
					</text>
				</>
			)}

			{(shapeId === 'circle' ||
				shapeId === 'sphere' ||
				shapeId === 'sphere-surface') && (
				<>
					<circle cx='110' cy='70' r='52' className={SHAPE} strokeWidth={1.6} />
					<Dim x1={58} y1={70} x2={162} y2={70} />
					<text x='110' y='62' textAnchor='middle' className={LABEL}>
						D
					</text>
					{shapeId !== 'circle' && (
						<ellipse
							cx='110'
							cy='70'
							rx='52'
							ry='16'
							className={SHAPE}
							strokeWidth={1}
							strokeDasharray='4 3'
						/>
					)}
				</>
			)}

			{shapeId === 'triangle' && (
				<>
					<polygon
						points='35,120 185,120 120,25'
						className={SHAPE}
						strokeWidth={1.6}
					/>
					<text x='110' y='140' textAnchor='middle' className={LABEL}>
						a
					</text>
					<text x='162' y='68' className={LABEL}>
						b
					</text>
					<text x='62' y='68' textAnchor='end' className={LABEL}>
						c
					</text>
				</>
			)}

			{shapeId === 'trapezoid' && (
				<>
					<polygon
						points='25,120 195,120 155,35 65,35'
						className={SHAPE}
						strokeWidth={1.6}
					/>
					<text x='110' y='140' textAnchor='middle' className={LABEL}>
						a
					</text>
					<text x='110' y='28' textAnchor='middle' className={LABEL}>
						b
					</text>
					<Dim x1={205} y1={35} x2={205} y2={120} />
					<text x='212' y='82' className={LABEL}>
						h
					</text>
				</>
			)}

			{shapeId === 'ring' && (
				<>
					<circle cx='110' cy='75' r='58' className={SHAPE} strokeWidth={1.6} />
					<circle cx='110' cy='75' r='34' className={SHAPE} strokeWidth={1.6} />
					<Dim x1={52} y1={75} x2={168} y2={75} />
					<text x='110' y='68' textAnchor='middle' className={LABEL}>
						D
					</text>
					<Dim x1={76} y1={98} x2={144} y2={98} />
					<text x='110' y='116' textAnchor='middle' className={LABEL}>
						d
					</text>
				</>
			)}

			{shapeId === 'walls' && (
				<>
					{/* Комната в аксонометрии: видно и план, и высоту */}
					<polygon
						points='30,60 130,25 190,50 90,90'
						className={SHAPE}
						strokeWidth={1.4}
					/>
					<line
						x1='30'
						y1='60'
						x2='30'
						y2='120'
						className={SHAPE}
						strokeWidth={1.4}
					/>
					<line
						x1='90'
						y1='90'
						x2='90'
						y2='150'
						className={SHAPE}
						strokeWidth={1.4}
					/>
					<line
						x1='190'
						y1='50'
						x2='190'
						y2='110'
						className={SHAPE}
						strokeWidth={1.4}
					/>
					<polyline
						points='30,120 90,150 190,110'
						className={SHAPE}
						strokeWidth={1.4}
					/>
					<text x='52' y='84' className={LABEL}>
						a
					</text>
					<text x='150' y='60' className={LABEL}>
						b
					</text>
					<Dim x1={20} y1={60} x2={20} y2={120} />
					<text x='6' y='94' className={LABEL}>
						h
					</text>
				</>
			)}

			{(shapeId === 'cylinder' || shapeId === 'pipe-surface') && (
				<>
					<ellipse
						cx='110'
						cy='35'
						rx='50'
						ry='15'
						className={SHAPE}
						strokeWidth={1.6}
					/>
					<path
						d='M60 35 V115 A50 15 0 0 0 160 115 V35'
						className={SHAPE}
						strokeWidth={1.6}
					/>
					<Dim x1={60} y1={35} x2={160} y2={35} />
					<text x='110' y='28' textAnchor='middle' className={LABEL}>
						D
					</text>
					<Dim x1={178} y1={35} x2={178} y2={115} />
					<text x='190' y='79' className={LABEL}>
						{shapeId === 'cylinder' ? 'h' : 'L'}
					</text>
				</>
			)}

			{shapeId === 'pipe' && (
				<>
					<ellipse
						cx='110'
						cy='35'
						rx='50'
						ry='15'
						className={SHAPE}
						strokeWidth={1.6}
					/>
					<ellipse
						cx='110'
						cy='35'
						rx='34'
						ry='10'
						className={SHAPE}
						strokeWidth={1.4}
					/>
					<path
						d='M60 35 V115 A50 15 0 0 0 160 115 V35'
						className={SHAPE}
						strokeWidth={1.6}
					/>
					<Dim x1={60} y1={35} x2={160} y2={35} />
					<text x='110' y='24' textAnchor='middle' className={LABEL}>
						D
					</text>
					<Dim x1={76} y1={48} x2={144} y2={48} />
					<text x='110' y='62' textAnchor='middle' className={LABEL}>
						d
					</text>
					<Dim x1={178} y1={35} x2={178} y2={115} />
					<text x='190' y='79' className={LABEL}>
						L
					</text>
				</>
			)}

			{shapeId === 'box' && (
				<>
					<polygon
						points='30,55 120,25 190,50 100,85'
						className={SHAPE}
						strokeWidth={1.4}
					/>
					<polyline
						points='30,55 30,115 100,145 100,85'
						className={SHAPE}
						strokeWidth={1.4}
					/>
					<polyline
						points='100,145 190,110 190,50'
						className={SHAPE}
						strokeWidth={1.4}
					/>
					<text x='55' y='80' className={LABEL}>
						a
					</text>
					<text x='152' y='58' className={LABEL}>
						b
					</text>
					<Dim x1={20} y1={55} x2={20} y2={115} />
					<text x='6' y='92' className={LABEL}>
						c
					</text>
				</>
			)}

			{shapeId === 'cone' && (
				<>
					<ellipse
						cx='110'
						cy='115'
						rx='50'
						ry='15'
						className={SHAPE}
						strokeWidth={1.6}
					/>
					<path
						d='M60 115 L110 25 L160 115'
						className={SHAPE}
						strokeWidth={1.6}
					/>
					<Dim x1={60} y1={115} x2={160} y2={115} />
					<text x='110' y='145' textAnchor='middle' className={LABEL}>
						D
					</text>
					<Dim x1={178} y1={25} x2={178} y2={115} />
					<text x='190' y='74' className={LABEL}>
						h
					</text>
				</>
			)}

			{shapeId === 'truncated-cone' && (
				<>
					<ellipse
						cx='110'
						cy='40'
						rx='34'
						ry='11'
						className={SHAPE}
						strokeWidth={1.6}
					/>
					<ellipse
						cx='110'
						cy='115'
						rx='52'
						ry='16'
						className={SHAPE}
						strokeWidth={1.6}
					/>
					<path
						d='M76 40 L58 115 M144 40 L162 115'
						className={SHAPE}
						strokeWidth={1.6}
					/>
					<Dim x1={76} y1={40} x2={144} y2={40} />
					<text x='110' y='32' textAnchor='middle' className={LABEL}>
						d
					</text>
					<Dim x1={58} y1={115} x2={162} y2={115} />
					<text x='110' y='146' textAnchor='middle' className={LABEL}>
						D
					</text>
					<Dim x1={180} y1={40} x2={180} y2={115} />
					<text x='192' y='82' className={LABEL}>
						h
					</text>
				</>
			)}
		</svg>
	)
}

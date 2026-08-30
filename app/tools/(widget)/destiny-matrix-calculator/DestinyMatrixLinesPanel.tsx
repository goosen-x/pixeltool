import {
	NAMED_LINES,
	TALENT_POINTS,
	getArcana,
	type FullDestinyMatrixResult
} from '@/lib/utils/destiny-matrix'

interface DestinyMatrixLinesPanelProps {
	result: FullDestinyMatrixResult
	highlightedLine: string | null
	onToggle: (key: string) => void
}

export function DestinyMatrixLinesPanel({
	result,
	highlightedLine,
	onToggle
}: DestinyMatrixLinesPanelProps) {
	return (
		<div className='space-y-2'>
			<span className='block text-xs font-medium uppercase tracking-wide text-muted-foreground'>
				Родовые линии, любовь, деньги, талант
			</span>

			{NAMED_LINES.map(line => {
				const isActive = highlightedLine === line.key
				return (
					<button
						key={line.key}
						type='button'
						onClick={() => onToggle(line.key)}
						className={
							isActive
								? 'w-full cursor-pointer rounded-lg border border-primary bg-primary/5 p-3 text-left'
								: 'w-full cursor-pointer rounded-lg border p-3 text-left hover:border-primary/50'
						}
					>
						<span className='block text-sm font-medium text-foreground'>
							{line.label}
						</span>
						<span className='mt-1 block space-x-3 font-mono text-xs text-muted-foreground'>
							{line.segments.map((segment, index) => (
								<span key={index}>
									{segment.map(key => result[key]).join(' → ')}
								</span>
							))}
						</span>
					</button>
				)
			})}

			<button
				type='button'
				onClick={() => onToggle('talent')}
				className={
					highlightedLine === 'talent'
						? 'w-full cursor-pointer rounded-lg border border-primary bg-primary/5 p-3 text-left'
						: 'w-full cursor-pointer rounded-lg border p-3 text-left hover:border-primary/50'
				}
			>
				<span className='block text-sm font-medium text-foreground'>
					Талант
				</span>
				<span className='mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground'>
					{TALENT_POINTS.map(point => (
						<span key={point.key} className='font-mono'>
							{getArcana(result[point.key]).number}: {point.label}
						</span>
					))}
				</span>
			</button>
		</div>
	)
}

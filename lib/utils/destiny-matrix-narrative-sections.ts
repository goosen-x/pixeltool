import type { FullPointKey } from './destiny-matrix'

export interface NarrativeSection {
	title: string
	keys: FullPointKey[]
}

/**
 * Порядок чтения сплошного текста матрицы судьбы: вступление, линия
 * мужского рода, линия женского рода, любовь, деньги, талант. r — общий
 * узел линий любви и денег, f2/g2 — общие узлы родовых линий и таланта:
 * каждый перечислен только в одном разделе, чтобы при сборке текст не
 * повторялся дважды (см. docs/research/destiny-matrix-narrative-prompt.md).
 * Общий источник для actions.ts (batch-запрос текста), страницы
 * (DestinyMatrixNarrative.tsx) и PDF (DestinyMatrixPdf.ts), чтобы все три
 * места не расходились в наборе точек и порядке чтения.
 */
export const NARRATIVE_SECTIONS: NarrativeSection[] = [
	{
		title: 'Личность и предназначение',
		keys: ['day', 'month', 'year', 'fourth', 'center']
	},
	{
		title: 'Родовая линия по мужской стороне',
		keys: ['f', 'f1', 'f2', 'h2', 'h1', 'h']
	},
	{
		title: 'Родовая линия по женской стороне',
		keys: ['i', 'i1', 'i2', 'g2', 'g1', 'g']
	},
	{ title: 'Любовь и отношения', keys: ['m', 'r1', 'r'] },
	{ title: 'Деньги', keys: ['q', 'l', 'r2'] },
	{ title: 'Талант', keys: ['k'] }
]

export const NARRATIVE_KEYS: FullPointKey[] = NARRATIVE_SECTIONS.flatMap(
	section => section.keys
)

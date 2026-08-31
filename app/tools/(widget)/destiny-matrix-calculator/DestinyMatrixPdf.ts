import {
	getArcana,
	type FullDestinyMatrixResult,
	type FullPointKey
} from '@/lib/utils/destiny-matrix'
import { getCurrentPeriod } from '@/lib/utils/destiny-matrix-current-period'
import {
	DIAGRAM_BASE_EDGES,
	DIAGRAM_CATEGORY_COLOR,
	DIAGRAM_CATEGORY_LABEL,
	DIAGRAM_NODES,
	DIAGRAM_NODE_BY_KEY,
	type DiagramCategory
} from '@/lib/utils/destiny-matrix-diagram'
import { NARRATIVE_SECTIONS } from '@/lib/utils/destiny-matrix-narrative-sections'
import { formatIsoToRu } from '@/lib/utils/date-input'

/**
 * Генерация PDF-отчёта по матрице судьбы: та же схема (векторная, не
 * скриншот) и та же структура разделов, что и в блоке «Полное толкование
 * матрицы судьбы» на странице — общие источники геометрии
 * (destiny-matrix-diagram.ts) и текста (NARRATIVE_SECTIONS,
 * getCurrentPeriod), чтобы PDF не расходился с сайтом.
 *
 * jsPDF и шрифт грузятся динамически, только при клике «Скачать PDF», по
 * тому же приёму, что и в lib/html-analysis/report-pdf.ts (кириллица не
 * входит в стандартные шрифты jsPDF, поэтому встраиваем Roboto).
 */

const PRIMARY: [number, number, number] = [59, 130, 246]
const BORDER: [number, number, number] = [224, 224, 224]
const INK: [number, number, number] = [17, 24, 39]
const MUTED: [number, number, number] = [107, 114, 128]

let cachedFont: string | null = null

async function loadFontBase64(): Promise<string> {
	if (cachedFont) return cachedFont
	const buffer = await fetch('/fonts/Roboto-Regular.ttf').then(r =>
		r.arrayBuffer()
	)
	let binary = ''
	const bytes = new Uint8Array(buffer)
	const chunk = 0x8000
	for (let i = 0; i < bytes.length; i += chunk) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
	}
	cachedFont = btoa(binary)
	return cachedFont
}

function hexToRgb(hex: string): [number, number, number] {
	const num = parseInt(hex.replace('#', ''), 16)
	return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

/** Смешивает цвет с белым, чтобы получить мягкую заливку узла (как
 * полупрозрачная заливка категорий на странице), но без альфа-канала —
 * не все версии jsPDF одинаково рендерят прозрачность в PDF-вьюверах. */
function lighten(
	[r, g, b]: [number, number, number],
	amount: number
): [number, number, number] {
	return [
		Math.round(r + (255 - r) * amount),
		Math.round(g + (255 - g) * amount),
		Math.round(b + (255 - b) * amount)
	]
}

const CATEGORY_FONT_SIZE: Record<DiagramCategory, number> = {
	core: 10,
	family: 7.5,
	diagonal: 6.5,
	familyDiagonal: 5.5,
	loveMoney: 5.5
}

export async function downloadDestinyMatrixPdf(
	result: FullDestinyMatrixResult,
	birthDate: string,
	narrativeTexts: Partial<Record<FullPointKey, string>>
): Promise<void> {
	const { jsPDF } = await import('jspdf')
	const fontBase64 = await loadFontBase64()

	const doc = new jsPDF({ unit: 'pt', format: 'a4' })
	doc.addFileToVFS('Roboto-Regular.ttf', fontBase64)
	doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
	doc.setFont('Roboto')

	const margin = 48
	const pageWidth = doc.internal.pageSize.getWidth()
	const pageHeight = doc.internal.pageSize.getHeight()
	const maxWidth = pageWidth - margin * 2
	let y = margin

	const ensureSpace = (needed: number) => {
		if (y + needed > pageHeight - margin) {
			doc.addPage()
			y = margin
		}
	}

	const text = (
		value: string,
		size: number,
		opts: { color?: [number, number, number]; gap?: number } = {}
	) => {
		doc.setFont('Roboto', 'normal')
		doc.setFontSize(size)
		doc.setTextColor(...(opts.color ?? INK))
		const lines = doc.splitTextToSize(value, maxWidth)
		ensureSpace(lines.length * size * 1.3)
		doc.text(lines, margin, y)
		y += lines.length * size * 1.3 + (opts.gap ?? 0)
	}

	const rule = (gap = 12) => {
		doc.setDrawColor(...BORDER)
		doc.setLineWidth(0.6)
		doc.line(margin, y, pageWidth - margin, y)
		y += gap
	}

	// Заголовок: синяя плашка сверху, как акцентный цвет сайта (primary).
	doc.setFillColor(...PRIMARY)
	doc.rect(0, 0, pageWidth, 6, 'F')
	y = margin

	text('Матрица судьбы', 24, { color: PRIMARY, gap: 4 })
	const dateLabel = formatIsoToRu(birthDate)
	if (dateLabel) {
		text(`Дата рождения: ${dateLabel}`, 11, { color: MUTED, gap: 16 })
	} else {
		y += 8
	}

	// Схема: те же координаты (viewBox 480×480) и цвета категорий, что и в
	// DestinyMatrixFullDiagram.tsx на странице, только векторно на PDF,
	// не скриншотом.
	const diagramSize = 260
	const legendHeight = 24
	ensureSpace(diagramSize + legendHeight + 20)
	const scale = diagramSize / 480
	const diagramX = (pageWidth - diagramSize) / 2
	const diagramY = y
	const toX = (value: number) => diagramX + value * scale
	const toY = (value: number) => diagramY + value * scale

	doc.setDrawColor(...BORDER)
	doc.setLineWidth(0.5)
	for (const [fromKey, toKey] of DIAGRAM_BASE_EDGES) {
		const from = DIAGRAM_NODE_BY_KEY.get(fromKey)!
		const to = DIAGRAM_NODE_BY_KEY.get(toKey)!
		doc.line(toX(from.x), toY(from.y), toX(to.x), toY(to.y))
	}

	for (const node of DIAGRAM_NODES) {
		const arcana = getArcana(result[node.key])
		const r = Math.max(node.radius * scale, 4)
		const cx = toX(node.x)
		const cy = toY(node.y)

		if (node.category === 'core') {
			doc.setFillColor(255, 255, 255)
			doc.setDrawColor(...PRIMARY)
		} else {
			const base = hexToRgb(DIAGRAM_CATEGORY_COLOR[node.category])
			doc.setFillColor(...lighten(base, 0.85))
			doc.setDrawColor(...base)
		}
		doc.setLineWidth(node.category === 'core' ? 1.1 : 0.7)
		doc.circle(cx, cy, r, 'FD')

		doc.setFont('Roboto', 'normal')
		doc.setFontSize(CATEGORY_FONT_SIZE[node.category])
		doc.setTextColor(...INK)
		doc.text(String(arcana.number), cx, cy, {
			align: 'center',
			baseline: 'middle'
		})

		if (node.staticLabel) {
			doc.setFontSize(7)
			doc.setTextColor(...MUTED)
			doc.text(node.staticLabel, cx, cy + r + 9, { align: 'center' })
		}
	}

	y = diagramY + diagramSize + 14

	const legendItems = Object.keys(
		DIAGRAM_CATEGORY_LABEL
	) as (keyof typeof DIAGRAM_CATEGORY_LABEL)[]
	const legendGap = maxWidth / legendItems.length
	legendItems.forEach((category, index) => {
		const itemX = margin + index * legendGap
		const [r, g, b] = hexToRgb(DIAGRAM_CATEGORY_COLOR[category])
		doc.setFillColor(r, g, b)
		doc.circle(itemX + 4, y - 3, 3, 'F')
		doc.setFont('Roboto', 'normal')
		doc.setFontSize(7.5)
		doc.setTextColor(...MUTED)
		doc.text(DIAGRAM_CATEGORY_LABEL[category], itemX + 11, y)
	})
	y += legendHeight

	rule(20)

	const currentPeriod = getCurrentPeriod(result, birthDate)
	const sections = [
		{
			title: 'Текущий период',
			indexLine: `${currentPeriod.arcana.number} (${currentPeriod.arcana.name})`,
			paragraphs: [currentPeriod.text]
		},
		...NARRATIVE_SECTIONS.map(section => ({
			title: section.title,
			indexLine: section.keys
				.map(key => {
					const arcana = getArcana(result[key])
					return `${arcana.number} (${arcana.name})`
				})
				.join(', '),
			paragraphs: section.keys
				.map(key => narrativeTexts[key])
				.filter((value): value is string => Boolean(value))
		}))
	]

	for (const section of sections) {
		if (section.paragraphs.length === 0) continue
		ensureSpace(40)
		text(section.title, 15, { color: PRIMARY, gap: 4 })
		text(section.indexLine, 8.5, { color: MUTED, gap: 10 })
		section.paragraphs.forEach((paragraph, index) => {
			const isLast = index === section.paragraphs.length - 1
			text(paragraph, 10, { color: INK, gap: isLast ? 4 : 8 })
		})
		rule(16)
	}

	const pageCount = doc.getNumberOfPages()
	for (let page = 1; page <= pageCount; page++) {
		doc.setPage(page)
		doc.setFont('Roboto', 'normal')
		doc.setFontSize(8)
		doc.setTextColor(...MUTED)
		doc.text('pixeltool.pro', margin, pageHeight - 24)
		doc.text(`${page} / ${pageCount}`, pageWidth - margin, pageHeight - 24, {
			align: 'right'
		})
	}

	doc.save('matritsa-sudby.pdf')
}

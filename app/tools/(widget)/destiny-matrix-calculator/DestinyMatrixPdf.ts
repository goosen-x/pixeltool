import type { FullPointKey } from '@/lib/utils/destiny-matrix'
import { NARRATIVE_SECTIONS } from '@/lib/utils/destiny-matrix-narrative-sections'

/**
 * Генерация PDF-отчёта по матрице судьбы.
 *
 * jsPDF и шрифт грузятся динамически, только при клике «Скачать PDF», по
 * тому же приёму, что и в lib/html-analysis/report-pdf.ts (кириллица не
 * входит в стандартные шрифты jsPDF, поэтому встраиваем Roboto).
 */

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

export async function downloadDestinyMatrixPdf(
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
		doc.setFontSize(size)
		doc.setTextColor(...(opts.color ?? [17, 24, 39]))
		const lines = doc.splitTextToSize(value, maxWidth)
		ensureSpace(lines.length * size * 1.3)
		doc.text(lines, margin, y)
		y += lines.length * size * 1.3 + (opts.gap ?? 0)
	}

	text('Матрица судьбы', 22, { gap: 16 })

	for (const section of NARRATIVE_SECTIONS) {
		const paragraphs = section.keys
			.map(key => narrativeTexts[key])
			.filter((value): value is string => Boolean(value))
		if (paragraphs.length === 0) continue
		text(section.title, 13, { gap: 4 })
		paragraphs.forEach((paragraph, index) => {
			const isLast = index === paragraphs.length - 1
			text(paragraph, 10, { color: [75, 85, 99], gap: isLast ? 12 : 6 })
		})
	}

	doc.save('matritsa-sudby.pdf')
}

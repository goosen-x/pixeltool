import {
	getArcana,
	getPersonalizedMeaning,
	POSITIONS,
	type DestinyMatrixResult,
	type Gender
} from '@/lib/utils/destiny-matrix'

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

interface DestinyMatrixPdfOptions {
	name?: string
	gender?: Gender
}

export async function downloadDestinyMatrixPdf(
	result: DestinyMatrixResult,
	options: DestinyMatrixPdfOptions = {}
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

	text(
		options.name ? `Матрица судьбы: ${options.name}` : 'Матрица судьбы',
		22,
		{ gap: 16 }
	)

	for (const { key, label } of POSITIONS) {
		const arcana = getArcana(result[key])
		text(`${label}: ${arcana.number} (${arcana.name})`, 13, { gap: 4 })
		text(getPersonalizedMeaning(arcana, options.gender), 10, {
			color: [75, 85, 99],
			gap: 12
		})
	}

	const center = getArcana(result.center)
	text(`Главное предназначение: ${center.number} (${center.name})`, 13, {
		gap: 4
	})
	text(getPersonalizedMeaning(center, options.gender), 10, {
		color: [75, 85, 99],
		gap: 12
	})

	doc.save('matritsa-sudby.pdf')
}

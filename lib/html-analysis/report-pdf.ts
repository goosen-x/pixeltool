import type { AnalysisReport } from './analyze'

/**
 * Генерация PDF-отчёта.
 *
 * jsPDF и шрифт грузятся динамически — только при клике «Скачать PDF», чтобы не
 * утяжелять бандл остальных страниц (jsPDF ~250 КБ, шрифт ~500 КБ). Кириллица:
 * стандартные шрифты jsPDF её не содержат, поэтому встраиваем Roboto из
 * /public/fonts.
 */

let cachedFont: string | null = null

async function loadFontBase64(): Promise<string> {
	if (cachedFont) return cachedFont
	const buffer = await fetch('/fonts/Roboto-Regular.ttf').then(r =>
		r.arrayBuffer()
	)
	// ArrayBuffer → base64 без раздувания стека большими строками.
	let binary = ''
	const bytes = new Uint8Array(buffer)
	const chunk = 0x8000
	for (let i = 0; i < bytes.length; i += chunk) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
	}
	cachedFont = btoa(binary)
	return cachedFont
}

export async function downloadAnalysisPdf(
	report: AnalysisReport,
	dateLabel: string
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

	// Шапка
	text('Отчёт об анализе HTML', 22, { gap: 4 })
	text(dateLabel, 10, { color: [107, 114, 128], gap: 6 })
	text(
		report.isWholePage
			? 'Проверена целая страница'
			: 'Проверен фрагмент разметки',
		10,
		{ color: [107, 114, 128], gap: 16 }
	)

	// Общий балл
	text(`Общая оценка: ${report.overall} из 100`, 16, { gap: 12 })

	// Категории
	for (const category of report.categories) {
		ensureSpace(40)
		text(`${category.label} — ${category.score}/100`, 13, { gap: 4 })

		if (category.checks.length === 0) {
			text('Проблем не найдено.', 10, { color: [22, 163, 74], gap: 10 })
			continue
		}

		for (const check of category.checks) {
			const mark = check.severity === 'error' ? '● Ошибка' : '▲ Предупреждение'
			const color: [number, number, number] =
				check.severity === 'error' ? [220, 38, 38] : [217, 119, 6]
			text(`${mark}: ${check.title}`, 10, { color, gap: 1 })
			if (check.detail) text(check.detail, 9, { color: [75, 85, 99], gap: 4 })
		}
		y += 8
	}

	// Статистика
	ensureSpace(120)
	text('Статистика', 13, { gap: 6 })
	const s = report.stats
	const rows = [
		['Всего элементов', s.elements],
		['Максимальная глубина', s.maxDepth],
		['Картинок', s.images],
		['Ссылок', s.links],
		['Полей форм', s.formFields],
		['Классов', s.classes],
		['Идентификаторов', s.ids]
	]
	for (const [label, value] of rows) {
		text(`${label}: ${value}`, 10, { color: [55, 65, 81], gap: 2 })
	}

	doc.save('html-analysis.pdf')
}

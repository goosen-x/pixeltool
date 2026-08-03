// Сборка правовых документов сайта в PDF: политика конфиденциальности,
// политика обработки ПД и два согласия. Тексты живут в lib/legal/documents.ts,
// реквизиты — в lib/legal/operator.ts, здесь только вёрстка.
//
// Перегенерировать: npx tsx scripts/generate-legal-pdfs.ts
// Готовые файлы коммитятся в public/downloads/legal и раздаются статикой —
// ничего не рендерится на лету, как и у лид-магнита.
import { jsPDF } from 'jspdf'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { LEGAL_DOCUMENTS, type Block } from '../lib/legal/documents'
import { LEGAL_VERSION_DATE, unfilledFields } from '../lib/legal/operator'

const INK: [number, number, number] = [17, 24, 39]
const MUTED: [number, number, number] = [107, 114, 128]

const MARGIN = 64
const BODY_SIZE = 10.5
const LINE_HEIGHT = 15

function render(doc: jsPDF, title: string, blocks: Block[]) {
	const pageWidth = doc.internal.pageSize.getWidth()
	const pageHeight = doc.internal.pageSize.getHeight()
	const maxWidth = pageWidth - MARGIN * 2
	let y = MARGIN

	const ensureSpace = (needed: number) => {
		if (y + needed > pageHeight - MARGIN - 24) {
			doc.addPage()
			y = MARGIN
		}
	}

	// Заголовок документа — по центру, как в отраслевых образцах: документ
	// должны узнавать по виду, а не только по имени файла.
	doc.setFontSize(14)
	doc.setTextColor(...INK)
	const titleLines = doc.splitTextToSize(title.toUpperCase(), maxWidth)
	titleLines.forEach((line: string) => {
		doc.text(line, pageWidth / 2, y, { align: 'center' })
		y += 19
	})
	y += 12

	doc.setFontSize(BODY_SIZE)

	for (const block of blocks) {
		if (block.type === 'h2') {
			ensureSpace(LINE_HEIGHT * 2)
			y += 8
			doc.setFontSize(11.5)
			const lines = doc.splitTextToSize(block.text, maxWidth)
			lines.forEach((line: string) => {
				doc.text(line, MARGIN, y)
				y += 16
			})
			doc.setFontSize(BODY_SIZE)
			y += 4
			continue
		}

		if (block.type === 'term') {
			// Термин и определение идут одним абзацем: разрывать их переносом
			// строки — значит рассыпать словарь на обрывки.
			const text = `${block.term} — ${block.text}`
			const lines = doc.splitTextToSize(text, maxWidth)
			ensureSpace(lines.length * LINE_HEIGHT)
			lines.forEach((line: string) => {
				doc.text(line, MARGIN, y)
				y += LINE_HEIGHT
			})
			y += 6
			continue
		}

		const indent = block.type === 'li' ? 16 : 0
		const lines = doc.splitTextToSize(block.text, maxWidth - indent)
		ensureSpace(lines.length * LINE_HEIGHT)
		lines.forEach((line: string) => {
			doc.text(line, MARGIN + indent, y)
			y += LINE_HEIGHT
		})
		y += block.type === 'li' ? 3 : 6
	}

	// Колонтитул с датой редакции и нумерацией — иначе непонятно, какая версия
	// документа на руках у пользователя.
	const pages = doc.getNumberOfPages()
	for (let page = 1; page <= pages; page++) {
		doc.setPage(page)
		doc.setFontSize(8)
		doc.setTextColor(...MUTED)
		doc.text(
			`Редакция от ${LEGAL_VERSION_DATE} · pixeltool.pro`,
			MARGIN,
			pageHeight - 32
		)
		doc.text(`${page} / ${pages}`, pageWidth - MARGIN, pageHeight - 32, {
			align: 'right'
		})
		doc.setTextColor(...INK)
		doc.setFontSize(BODY_SIZE)
	}
}

function run() {
	const fontPath = join(process.cwd(), 'public/fonts/Roboto-Regular.ttf')
	const fontBase64 = readFileSync(fontPath).toString('base64')

	const outDir = join(process.cwd(), 'public/downloads/legal')
	mkdirSync(outDir, { recursive: true })

	for (const document of LEGAL_DOCUMENTS) {
		const doc = new jsPDF({ unit: 'pt', format: 'a4' })
		doc.addFileToVFS('Roboto-Regular.ttf', fontBase64)
		doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
		doc.setFont('Roboto')

		render(doc, document.title, document.blocks)

		const outPath = join(outDir, `${document.file}.pdf`)
		writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')))
		console.log(`✓ ${document.title} → ${outPath}`)
	}

	const unfilled = unfilledFields()
	if (unfilled.length > 0) {
		console.warn(
			`\n⚠ В документах остались прочерки вместо реквизитов: ${unfilled.join(', ')}.` +
				`\n  Заполните lib/legal/operator.ts и пересоберите, публиковать в таком виде нельзя.`
		)
	}
}

run()

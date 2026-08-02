// Разовая генерация статического PDF для лид-магнита (сайдбар: форма email).
// Готовый файл коммитится в public/downloads — API-роут просто прикрепляет
// его к письму, ничего не рендерит на лету (жёсткая зависимость от
// Cyrillic-шрифта в рантайме не нужна). Перегенерировать: npx tsx scripts/generate-lead-magnet-pdf.ts
//
// Тема — «горячие клавиши» (Wordstat: 202 453 показов/мес, чистый интент,
// проверено 02.08.2026 — см. память lead-magnet-feature). Число сочетаний
// в заголовке считается от реального размера SECTIONS, не захардкожено.
//
// Стиль — под бренд: логотип из 4 цветных квадратов (как в шапке сайта),
// сочетания клавиш нарисованы как фиолетовые "кнопки"-чипы, а не голым
// текстом — визуально ближе к тому, как выглядят клавиши на сайте/в UI.
import { jsPDF } from 'jspdf'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

type Shortcut = [combo: string, action: string]

const SECTIONS: { title: string; items: Shortcut[] }[] = [
	{
		title: 'Windows — система',
		items: [
			['Win + D', 'Свернуть все окна / показать рабочий стол'],
			['Win + E', 'Открыть Проводник'],
			['Win + L', 'Заблокировать компьютер'],
			['Win + Tab', 'Представление задач'],
			['Alt + Tab', 'Переключение между окнами'],
			['Win + вверх / вниз', 'Развернуть / свернуть активное окно'],
			['Win + влево / вправо', 'Прикрепить окно к половине экрана'],
			['Win + Shift + S', 'Снимок фрагмента экрана'],
			['Win + .', 'Панель эмодзи'],
			['Win + R', 'Окно «Выполнить»'],
			['Win + I', 'Параметры системы'],
			['Win + V', 'История буфера обмена'],
			['Win + X', 'Меню быстрых ссылок (опытный пользователь)'],
			['Win + Ctrl + D', 'Новый виртуальный рабочий стол'],
			[
				'Win + Ctrl + влево / вправо',
				'Переключение виртуальных рабочих столов'
			],
			['Ctrl + Shift + Esc', 'Диспетчер задач'],
			['Alt + F4', 'Закрыть окно']
		]
	},
	{
		title: 'macOS — система',
		items: [
			['Cmd + Space', 'Spotlight-поиск'],
			['Cmd + Tab', 'Переключение между приложениями'],
			['Cmd + Q', 'Закрыть приложение полностью'],
			['Cmd + W', 'Закрыть окно / вкладку'],
			['Cmd + M', 'Свернуть окно'],
			['Cmd + H', 'Скрыть окно'],
			['Cmd + Shift + 3', 'Снимок всего экрана'],
			['Cmd + Shift + 4', 'Снимок фрагмента экрана'],
			['Cmd + Shift + 5', 'Меню записи экрана и скриншотов'],
			['Cmd + ,', 'Настройки приложения'],
			['Cmd + Option + Esc', 'Принудительно закрыть приложение'],
			['Cmd + Delete', 'Удалить файл в корзину'],
			['Control + Cmd + Q', 'Заблокировать экран'],
			['Control + Up', 'Mission Control'],
			['Cmd + Shift + N', 'Новая папка (Finder)']
		]
	},
	{
		title: 'Браузер (Chrome / Edge, Windows и Mac)',
		items: [
			['Ctrl/Cmd + T', 'Новая вкладка'],
			['Ctrl/Cmd + Shift + T', 'Восстановить закрытую вкладку'],
			['Ctrl/Cmd + W', 'Закрыть вкладку'],
			['Ctrl/Cmd + L', 'Перейти в адресную строку'],
			['Ctrl/Cmd + F', 'Поиск на странице'],
			['Ctrl/Cmd + D', 'Добавить в закладки'],
			['Ctrl/Cmd + Shift + N', 'Окно инкогнито'],
			['Ctrl + Tab', 'Следующая вкладка'],
			['Ctrl + Shift + Tab', 'Предыдущая вкладка'],
			['Ctrl/Cmd + R', 'Обновить страницу'],
			['Ctrl/Cmd + Shift + R', 'Обновить без кэша'],
			['Ctrl/Cmd + = / -', 'Увеличить / уменьшить масштаб'],
			['Ctrl/Cmd + 0', 'Сбросить масштаб'],
			['Alt/Cmd + влево', 'Назад по истории'],
			['Ctrl/Cmd + J', 'Открыть загрузки'],
			['Ctrl/Cmd + Shift + Delete', 'Очистить историю и кэш']
		]
	},
	{
		title: 'Работа с текстом (везде)',
		items: [
			['Ctrl/Cmd + C', 'Копировать'],
			['Ctrl/Cmd + V', 'Вставить'],
			['Ctrl/Cmd + X', 'Вырезать'],
			['Ctrl/Cmd + Z', 'Отменить'],
			['Ctrl/Cmd + Shift + Z', 'Повторить отменённое'],
			['Ctrl/Cmd + A', 'Выделить всё'],
			['Ctrl/Cmd + F', 'Найти'],
			['Ctrl + H', 'Найти и заменить'],
			['Ctrl/Cmd + B', 'Жирный шрифт'],
			['Ctrl/Cmd + I', 'Курсив'],
			['Ctrl/Cmd + U', 'Подчёркнутый'],
			['Ctrl/Cmd + S', 'Сохранить'],
			['Ctrl/Cmd + P', 'Печать'],
			['Ctrl + Backspace', 'Удалить слово целиком'],
			['Ctrl/Option + влево / вправо', 'Перемещение по словам'],
			['Home / End', 'В начало / конец строки'],
			['Ctrl/Cmd + Home / End', 'В начало / конец документа']
		]
	},
	{
		title: 'Excel / Google Таблицы',
		items: [
			['Ctrl/Cmd + ;', 'Вставить сегодняшнюю дату'],
			['Ctrl + Shift + ;', 'Вставить текущее время'],
			['Alt + = (Excel)', 'Автосумма'],
			['Ctrl + Пробел', 'Выделить весь столбец'],
			['Shift + Пробел', 'Выделить всю строку'],
			['Ctrl + стрелка', 'Перейти к краю данных'],
			['Ctrl + Shift + стрелка', 'Выделить до края данных'],
			['F2', 'Редактировать ячейку'],
			['Ctrl + 1 (Excel)', 'Формат ячеек'],
			['Ctrl + D', 'Заполнить вниз значением сверху'],
			['Ctrl + Shift + L (Sheets)', 'Включить фильтр'],
			['Ctrl + Home / End', 'В начало / конец листа']
		]
	},
	{
		title: 'Видеозвонки (Zoom / Google Meet)',
		items: [
			['Alt + A (Zoom)', 'Вкл/выкл микрофон'],
			['Ctrl/Cmd + Shift + V (Zoom)', 'Вкл/выкл камеру'],
			['Ctrl + D (Meet)', 'Вкл/выкл микрофон'],
			['Ctrl + E (Meet)', 'Вкл/выкл камеру'],
			['Пробел (удерживать, Zoom)', 'Временно включить микрофон']
		]
	},
	{
		title: 'PowerPoint / Google Slides',
		items: [
			['F5', 'Начать показ слайдов с начала'],
			['Shift + F5', 'Начать показ с текущего слайда'],
			['Esc', 'Выйти из показа'],
			['Ctrl/Cmd + M', 'Новый слайд'],
			['Ctrl/Cmd + D', 'Дублировать слайд'],
			['B', 'Чёрный экран во время показа'],
			['W', 'Белый экран во время показа']
		]
	}
]

const TOTAL_SHORTCUTS = SECTIONS.reduce((sum, s) => sum + s.items.length, 0)
const BASE_URL = 'https://pixeltool.pro'

// Брендовые цвета — как в шапке сайта (4 квадрата логотипа) и primary-кнопки.
const LOGO_COLORS: [number, number, number][] = [
	[239, 68, 68], // red
	[234, 179, 8], // yellow
	[34, 197, 94], // green
	[59, 130, 246] // blue
]
const PRIMARY: [number, number, number] = [45, 45, 48] // тёмно-серый — как в референсе-кейкапе пользователя
const INK: [number, number, number] = [17, 24, 39]
const MUTED: [number, number, number] = [107, 114, 128]

function run() {
	const fontPath = join(process.cwd(), 'public/fonts/Roboto-Regular.ttf')
	const fontBase64 = readFileSync(fontPath).toString('base64')

	const doc = new jsPDF({ unit: 'pt', format: 'a4' })
	doc.addFileToVFS('Roboto-Regular.ttf', fontBase64)
	doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
	doc.setFont('Roboto')

	const margin = 56
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
		doc.setTextColor(...(opts.color ?? INK))
		const lines = doc.splitTextToSize(value, maxWidth)
		ensureSpace(lines.length * size * 1.3)
		doc.text(lines, margin, y)
		y += lines.length * size * 1.3 + (opts.gap ?? 0)
	}

	// Логотип: 2x2 цветных квадрата со скруглением, как в шапке сайта.
	const drawLogo = (x: number, top: number, size: number) => {
		const gap = size * 0.14
		const cell = (size - gap) / 2
		const r = cell * 0.3
		const positions: [number, number][] = [
			[x, top],
			[x + cell + gap, top],
			[x, top + cell + gap],
			[x + cell + gap, top + cell + gap]
		]
		positions.forEach(([px, py], i) => {
			doc.setFillColor(...LOGO_COLORS[i])
			doc.roundedRect(px, py, cell, cell, r, r, 'F')
		})
	}

	// Каждая клавиша — отдельный "кейкап"-чип (не вся комбинация одним чипом),
	// между ними — обычный текст "+", как физические клавиши в ряд.
	const CHIP_FONT_SIZE = 9.5
	const CHIP_PAD_X = 7
	const CHIP_PAD_Y = 4
	const CHIP_HEIGHT = CHIP_FONT_SIZE * 1.25 + CHIP_PAD_Y * 2
	const PLUS_GAP = 6 // отступ по обе стороны знака "+"
	const ICON_SIZE = CHIP_FONT_SIZE * 0.95

	// Цвета теней/блика — заранее просчитанные сплошные оттенки (alpha-blend
	// вручную), а не GState-прозрачность: часть PDF-вьюверов (например,
	// PDF.js в Chrome) рендерит полупрозрачные слои некорректно — серым
	// поверх цвета вместо честного альфа-смешения. Сплошные цвета рендерятся
	// одинаково везде.
	const SHADOW_COLOR: [number, number, number] = [199, 199, 199] // ~22% чёрного по белому фону
	const BASE_COLOR: [number, number, number] = [20, 20, 20] // тёмная "глубина" клавиши
	const HIGHLIGHT_COLOR: [number, number, number] = [83, 83, 85] // ~18% белого поверх PRIMARY

	const isWinKey = (token: string) => token.trim().toLowerCase() === 'win'

	// Иконка Windows — 4 квадрата 2x2, монохромная (в отличие от цветного
	// логотипа PixelTool), чтобы просто читаться на тёмной клавише.
	const drawWinIcon = (cx: number, cy: number, size: number) => {
		const gap = size * 0.16
		const cell = (size - gap) / 2
		doc.setFillColor(255, 255, 255)
		;[
			[cx - cell - gap / 2, cy - cell - gap / 2],
			[cx + gap / 2, cy - cell - gap / 2],
			[cx - cell - gap / 2, cy + gap / 2],
			[cx + gap / 2, cy + gap / 2]
		].forEach(([px, py]) => doc.rect(px, py, cell, cell, 'F'))
	}

	const keyChipWidth = (token: string) => {
		if (isWinKey(token)) return ICON_SIZE + CHIP_PAD_X * 2
		doc.setFontSize(CHIP_FONT_SIZE)
		return doc.getTextWidth(token) + CHIP_PAD_X * 2
	}

	// "Кейкап" — имитация физической клавиши через слои (без градиентов/blur,
	// которых в jsPDF нет): тень → тёмная база (глубина) → светлая "грань"
	// со сдвигом (bevel) → блик сверху → контент. Вдохновлено референсом
	// пользователя (CSS-кейкап с Uiverse.io).
	const drawKeyChip = (token: string, x: number, topY: number) => {
		const chipWidth = keyChipWidth(token)
		const r = 3

		doc.setFillColor(...SHADOW_COLOR)
		doc.roundedRect(x + 1, topY + 1.5, chipWidth, CHIP_HEIGHT, r, r, 'F')

		doc.setFillColor(...BASE_COLOR)
		doc.roundedRect(x, topY, chipWidth, CHIP_HEIGHT, r, r, 'F')

		const bevel = 1.4
		doc.setFillColor(...PRIMARY)
		doc.roundedRect(
			x,
			topY,
			chipWidth - bevel,
			CHIP_HEIGHT - bevel,
			r * 0.85,
			r * 0.85,
			'F'
		)

		doc.setFillColor(...HIGHLIGHT_COLOR)
		doc.roundedRect(
			x + 1,
			topY + 1,
			chipWidth - bevel - 2,
			(CHIP_HEIGHT - bevel) * 0.45,
			r * 0.7,
			r * 0.7,
			'F'
		)

		if (isWinKey(token)) {
			drawWinIcon(x + chipWidth / 2, topY + CHIP_HEIGHT / 2, ICON_SIZE)
		} else {
			doc.setFontSize(CHIP_FONT_SIZE)
			doc.setTextColor(255, 255, 255)
			doc.text(token, x + CHIP_PAD_X, topY + CHIP_HEIGHT / 2 + CHIP_FONT_SIZE * 0.35)
		}
		return chipWidth
	}

	// Ряд клавиш комбинации: каждая — свой кейкап, между ними — текстовый "+".
	const drawComboRow = (combo: string, x: number, topY: number) => {
		const tokens = combo.split(' + ')
		let cursorX = x
		doc.setFontSize(CHIP_FONT_SIZE)

		tokens.forEach((token, i) => {
			if (i > 0) {
				doc.setTextColor(...MUTED)
				doc.text('+', cursorX, topY + CHIP_HEIGHT / 2 + CHIP_FONT_SIZE * 0.35)
				cursorX += doc.getTextWidth('+') + PLUS_GAP
			}
			cursorX += drawKeyChip(token, cursorX, topY) + PLUS_GAP
		})
		return { width: cursorX - x - PLUS_GAP, height: CHIP_HEIGHT }
	}

	// ---- Шапка: логотип + название бренда ----
	const logoSize = 20
	drawLogo(margin, y, logoSize)
	doc.setFontSize(15)
	doc.setTextColor(...INK)
	doc.text('PixelTool', margin + logoSize + 10, y + logoSize * 0.72)
	y += logoSize + 22

	text(`${TOTAL_SHORTCUTS} горячих клавиш на каждый день`, 21, { gap: 6 })
	text(
		'Windows, macOS, браузер, работа с текстом, таблицы, видеозвонки и презентации — всё, что реально экономит время, в одном месте.',
		12,
		{ color: MUTED, gap: 22 }
	)

	// Шире, чем раньше: теперь тут не один чип, а ряд отдельных клавиш + "+".
	const col1Width = 210
	const col2X = margin + col1Width + 14

	SECTIONS.forEach(section => {
		ensureSpace(36)
		// Цветной акцент-бар слева от заголовка секции — фирменный штрих
		// вместо голого чёрного текста.
		doc.setFillColor(...PRIMARY)
		doc.roundedRect(margin, y - 10, 4, 15, 2, 2, 'F')
		doc.setFontSize(14)
		doc.setTextColor(...INK)
		doc.text(section.title, margin + 12, y)
		y += 18

		section.items.forEach(([combo, action]) => {
			doc.setFontSize(10.5)
			const actionLines = doc.splitTextToSize(
				action,
				maxWidth - col1Width - 14
			)
			const actionHeight = actionLines.length * 10.5 * 1.3
			const rowHeight = Math.max(CHIP_HEIGHT, actionHeight)

			ensureSpace(rowHeight + 6)

			drawComboRow(combo, margin, y)
			doc.setFontSize(10.5)
			doc.setTextColor(55, 65, 81)
			doc.text(
				actionLines,
				col2X,
				y + rowHeight / 2 - ((actionLines.length - 1) * 10.5 * 1.3) / 2 + 3
			)

			y += rowHeight + 6
		})
		y += 12
	})

	ensureSpace(40)
	text(`Больше инструментов: ${BASE_URL}/tools — «Всё нужное под рукой».`, 11, {
		color: MUTED
	})

	const outDir = join(process.cwd(), 'public/downloads')
	mkdirSync(outDir, { recursive: true })
	const outPath = join(outDir, 'pixeltool-goryachie-klavishi.pdf')
	writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')))
	console.log(`Written: ${outPath} (${TOTAL_SHORTCUTS} shortcuts)`)
}

run()

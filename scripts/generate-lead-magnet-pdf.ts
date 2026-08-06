// Разовая генерация статического PDF для лид-магнита (сайдбар: форма email).
// Готовый файл коммитится в public/downloads — API-роут просто прикрепляет
// его к письму, ничего не рендерит на лету (жёсткая зависимость от
// Cyrillic-шрифта в рантайме не нужна). Перегенерировать: npx tsx scripts/generate-lead-magnet-pdf.ts
//
// Тема — «горячие клавиши» (Wordstat: 202 453 показов/мес, чистый интент,
// проверено 02.08.2026 — см. память lead-magnet-feature). Число сочетаний
// в заголовке считается от реального размера SECTIONS, не захардкожено.
//
// Стиль: логотип из 4 цветных квадратов (как в шапке сайта), каждая клавиша
// комбинации — отдельный тёмно-серый 3D-кейкап (по референсу пользователя,
// CSS-кейкап с Uiverse.io), между ними — обычный текст "+".
import { jsPDF } from 'jspdf'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

type Shortcut = [combo: string, action: string]

const SECTIONS: { title: string; items: Shortcut[] }[] = [
	{
		title: 'Горячие клавиши для Windows',
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
			['Alt + F4', 'Закрыть окно'],
			['Ctrl + Alt + Delete', 'Экран блокировки / смена пользователя'],
			['Win + ,', 'Временно посмотреть рабочий стол (пока зажато)'],
			['Win + G', 'Игровая панель Xbox Game Bar']
		]
	},
	{
		title: 'Горячие клавиши для macOS',
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
			['Cmd + Shift + N', 'Новая папка (Finder)'],
			['Cmd + Shift + .', 'Показать скрытые файлы (Finder)'],
			['Cmd + N', 'Новое окно Finder'],
			['Cmd + I', 'Информация о файле (Get Info)']
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
			['Ctrl/Cmd + Shift + Delete', 'Очистить историю и кэш'],
			['F11', 'Полноэкранный режим'],
			['Ctrl/Cmd + Shift + B', 'Показать / скрыть панель закладок']
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
			['Ctrl/Cmd + Home / End', 'В начало / конец документа'],
			['Ctrl/Cmd + Shift + V', 'Вставить без форматирования']
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
			['Ctrl + Home / End', 'В начало / конец листа'],
			['Alt + Enter', 'Новая строка внутри ячейки'],
			['Ctrl + PageDown / PageUp', 'Переключение между листами']
		]
	},
	{
		title: 'Видеозвонки: Zoom',
		items: [
			['Alt + A', 'Вкл/выкл микрофон'],
			['Ctrl/Cmd + Shift + V', 'Вкл/выкл камеру'],
			['Пробел (удерживать)', 'Временно включить микрофон']
		]
	},
	{
		title: 'Видеозвонки: Google Meet',
		items: [
			['Ctrl + D', 'Вкл/выкл микрофон'],
			['Ctrl + E', 'Вкл/выкл камеру']
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

const PRIMARY: [number, number, number] = [45, 45, 48] // тёмно-серый — как в референсе-кейкапе пользователя
const INK: [number, number, number] = [17, 24, 39]
const MUTED: [number, number, number] = [107, 114, 128]

function run() {
	const fontPath = join(process.cwd(), 'public/fonts/Roboto-Regular.ttf')
	const fontBase64 = readFileSync(fontPath).toString('base64')

	// Реальные иконки (SVG пользователя, растеризованы в белый PNG заранее —
	// jsPDF не рендерит SVG в Node без DOM, addSvgAsImage требует document/canvas).
	const cmdIconBase64 = readFileSync(
		join(process.cwd(), 'assets/pdf-icons/cmd-icon.png')
	).toString('base64')
	const appleIconBase64 = readFileSync(
		join(process.cwd(), 'assets/pdf-icons/apple-icon.png')
	).toString('base64')
	const appleIconBlackBase64 = readFileSync(
		join(process.cwd(), 'assets/pdf-icons/apple-icon-black.png')
	).toString('base64')

	// compress: true — Flate на потоки страниц и встроенный шрифт. Без него
	// jsPDF пишет содержимое страниц открытым текстом: в шпаргалке из одного
	// текста это давало 677 КБ на страницы и 93 КБ на шрифт (файл весил 1,3 МБ).
	const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true })
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

	// Настоящий логотип — 3x3 диагональная мозаика на белом скруглённом
	// фоне, точные цвета из components/layout/Header/widgets/LogoLink.tsx
	// (не приблизительная реконструкция).
	const LOGO_GRID: [number, number, number][][] = [
		[
			[232, 67, 48],
			[253, 133, 15],
			[255, 205, 0]
		],
		[
			[253, 133, 15],
			[255, 205, 0],
			[112, 199, 39]
		],
		[
			[255, 205, 0],
			[112, 199, 39],
			[45, 150, 215]
		]
	]

	const drawLogo = (x: number, top: number, size: number) => {
		doc.setFillColor(255, 255, 255)
		doc.roundedRect(x, top, size, size, size * 0.195, size * 0.195, 'F')
		const pad = size * 0.207
		const cell = (size - pad * 2) / 3
		LOGO_GRID.forEach((row, r) => {
			row.forEach((color, c) => {
				doc.setFillColor(...color)
				doc.rect(x + pad + c * cell, top + pad + r * cell, cell, cell, 'F')
			})
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
	const isCmdKey = (token: string) => token.trim().toLowerCase() === 'cmd'
	// "Ctrl/Cmd" и подобные составные метки — тоже получают иконку ⌘, но с
	// полным текстом токена (не заменяем "Ctrl/" на иконку).
	const containsCmd = (token: string) => /\bcmd\b/i.test(token)

	// Слова направлений в данных (напр. "вверх / вниз") — рисуются как
	// стрелки-иконки, не текстом. ↑/↓ есть в Roboto (проверено через cmap),
	// ←/→ в шрифте отсутствуют — для них векторный треугольник той же
	// величины, чтобы визуально не отличались от ↑/↓.
	const DIRECTION_WORDS: Record<string, 'up' | 'down' | 'left' | 'right'> = {
		вверх: 'up',
		вниз: 'down',
		влево: 'left',
		вправо: 'right'
	}

	const isDirectionPair = (token: string) => {
		const parts = token.split(' / ').map(p => p.trim())
		return parts.length === 2 && parts.every(p => p in DIRECTION_WORDS)
	}

	type ChipContent =
		| { kind: 'text'; value: string }
		| { kind: 'iconText'; icon: 'win' | 'cmd'; label: string }
		| { kind: 'arrow'; dir: 'up' | 'down' | 'left' | 'right' }

	const ICON_TEXT_GAP = 4

	// Иконка Windows — 4 квадрата 2x2, монохромная (в отличие от цветного
	// логотипа PixelTool). Белая — на тёмной клавише, чёрная — в заголовке
	// секции на белом фоне страницы.
	const drawWinIcon = (
		cx: number,
		cy: number,
		size: number,
		color: [number, number, number] = [255, 255, 255]
	) => {
		const gap = size * 0.16
		const cell = (size - gap) / 2
		doc.setFillColor(...color)
		;[
			[cx - cell - gap / 2, cy - cell - gap / 2],
			[cx + gap / 2, cy - cell - gap / 2],
			[cx - cell - gap / 2, cy + gap / 2],
			[cx + gap / 2, cy + gap / 2]
		].forEach(([px, py]) => doc.rect(px, py, cell, cell, 'F'))
	}

	// Иконки Cmd (⌘) и Apple — растровые (SVG пользователя, jsPDF не рендерит
	// SVG в Node без DOM — addSvgAsImage требует document/canvas).
	// alias — чтобы одна и та же иконка, нарисованная десятки раз, встраивалась
	// в файл один раз. 'SLOW' — Flate на сам растр: jsPDF по умолчанию кладёт
	// картинку сырыми пикселями (256×256 RGB = 196 КБ на иконку размером 8pt).
	const drawCmdIcon = (cx: number, cy: number, size: number) => {
		doc.addImage(
			cmdIconBase64,
			'PNG',
			cx - size / 2,
			cy - size / 2,
			size,
			size,
			'cmd-icon',
			'SLOW'
		)
	}
	const drawAppleIcon = (
		cx: number,
		cy: number,
		size: number,
		black = false
	) => {
		doc.addImage(
			black ? appleIconBlackBase64 : appleIconBase64,
			'PNG',
			cx - size / 2,
			cy - size / 2,
			size,
			size,
			black ? 'apple-icon-black' : 'apple-icon',
			'SLOW'
		)
	}

	// Все 4 стрелки — векторные треугольники одного стиля (раньше ↑/↓ были
	// текстовым глифом шрифта, а ←/→ — залитым треугольником: визуально не
	// совпадали по толщине/форме).
	const drawArrowIcon = (
		cx: number,
		cy: number,
		size: number,
		dir: 'up' | 'down' | 'left' | 'right'
	) => {
		doc.setFillColor(255, 255, 255)
		const w = size * 0.6
		const h = size * 0.55
		switch (dir) {
			case 'up':
				doc.triangle(
					cx,
					cy - h / 2,
					cx - w / 2,
					cy + h / 2,
					cx + w / 2,
					cy + h / 2,
					'F'
				)
				break
			case 'down':
				doc.triangle(
					cx,
					cy + h / 2,
					cx - w / 2,
					cy - h / 2,
					cx + w / 2,
					cy - h / 2,
					'F'
				)
				break
			case 'left':
				doc.triangle(
					cx - w / 2,
					cy,
					cx + w / 2,
					cy - h / 2,
					cx + w / 2,
					cy + h / 2,
					'F'
				)
				break
			case 'right':
				doc.triangle(
					cx + w / 2,
					cy,
					cx - w / 2,
					cy - h / 2,
					cx - w / 2,
					cy + h / 2,
					'F'
				)
				break
		}
	}

	const chipContentWidth = (content: ChipContent) => {
		if (content.kind === 'arrow') return ICON_SIZE + CHIP_PAD_X * 2
		doc.setFontSize(CHIP_FONT_SIZE)
		if (content.kind === 'iconText') {
			return (
				ICON_SIZE +
				ICON_TEXT_GAP +
				doc.getTextWidth(content.label) +
				CHIP_PAD_X * 2
			)
		}
		return doc.getTextWidth(content.value) + CHIP_PAD_X * 2
	}

	// "Кейкап" — имитация физической клавиши через слои (без градиентов/blur,
	// которых в jsPDF нет): тень → тёмная база (глубина) → светлая "грань"
	// со сдвигом (bevel) → блик сверху → контент. Вдохновлено референсом
	// пользователя (CSS-кейкап с Uiverse.io).
	const drawChip = (content: ChipContent, x: number, topY: number) => {
		const chipWidth = chipContentWidth(content)
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

		const cy = topY + CHIP_HEIGHT / 2
		if (content.kind === 'arrow') {
			drawArrowIcon(x + chipWidth / 2, cy, ICON_SIZE, content.dir)
		} else if (content.kind === 'iconText') {
			const iconCx = x + CHIP_PAD_X + ICON_SIZE / 2
			if (content.icon === 'win') drawWinIcon(iconCx, cy, ICON_SIZE)
			else drawCmdIcon(iconCx, cy, ICON_SIZE)
			doc.setFontSize(CHIP_FONT_SIZE)
			doc.setTextColor(255, 255, 255)
			doc.text(
				content.label,
				x + CHIP_PAD_X + ICON_SIZE + ICON_TEXT_GAP,
				topY + CHIP_HEIGHT / 2 + CHIP_FONT_SIZE * 0.35
			)
		} else {
			doc.setFontSize(CHIP_FONT_SIZE)
			doc.setTextColor(255, 255, 255)
			doc.text(
				content.value,
				x + CHIP_PAD_X,
				topY + CHIP_HEIGHT / 2 + CHIP_FONT_SIZE * 0.35
			)
		}
		return chipWidth
	}

	// Ряд клавиш комбинации: каждая — свой кейкап, между ними — текстовый "+"
	// (или "/" внутри пары направлений вроде "влево / вправо").
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

			if (isDirectionPair(token)) {
				token
					.split(' / ')
					.map(p => p.trim())
					.forEach((word, j) => {
						if (j > 0) {
							doc.setTextColor(...MUTED)
							doc.text(
								'/',
								cursorX,
								topY + CHIP_HEIGHT / 2 + CHIP_FONT_SIZE * 0.35
							)
							cursorX += doc.getTextWidth('/') + PLUS_GAP
						}
						cursorX +=
							drawChip(
								{ kind: 'arrow', dir: DIRECTION_WORDS[word] },
								cursorX,
								topY
							) + PLUS_GAP
					})
				return
			}

			let content: ChipContent
			if (isWinKey(token))
				content = { kind: 'iconText', icon: 'win', label: 'Win' }
			else if (isCmdKey(token))
				content = { kind: 'iconText', icon: 'cmd', label: 'Cmd' }
			else if (containsCmd(token))
				content = { kind: 'iconText', icon: 'cmd', label: token }
			else content = { kind: 'text', value: token }
			cursorX += drawChip(content, cursorX, topY) + PLUS_GAP
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

	const SECTION_ICONS: Record<string, 'win' | 'apple' | undefined> = {
		'Горячие клавиши для Windows': 'win',
		'Горячие клавиши для macOS': 'apple'
	}

	SECTIONS.forEach((section, sectionIndex) => {
		// Отступ в 2 строки перед каждой секцией (кроме первой — она и так
		// начинается сразу под подзаголовком шпаргалки).
		if (sectionIndex > 0) y += 11 * 1.3 * 2
		ensureSpace(36)

		let textX = margin
		const iconKind = SECTION_ICONS[section.title]
		if (iconKind) {
			const iconSize = 16
			const cx = margin + iconSize / 2
			const cy = y - 5
			if (iconKind === 'win') drawWinIcon(cx, cy, iconSize, INK)
			else drawAppleIcon(cx, cy, iconSize, true)
			textX = margin + iconSize + 8
		}

		doc.setFontSize(14)
		doc.setTextColor(...INK)
		doc.text(section.title, textX, y)
		y += 18

		section.items.forEach(([combo, action]) => {
			doc.setFontSize(10.5)
			const actionLines = doc.splitTextToSize(action, maxWidth - col1Width - 14)
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

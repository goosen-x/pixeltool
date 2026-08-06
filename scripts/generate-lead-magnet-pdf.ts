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

// Данные хранят обе раскладки сразу: k('Ctrl + T', 'Cmd + T') — разные
// сочетания под Windows и macOS, простая строка — одинаковое на обеих.
// Пустая строка в одной из позиций = в этой ОС аналога нет, строка выпадает.
// Третий элемент — необязательная сноска (мелким серым под описанием);
// она тоже может отличаться по ОС.
type OsKeys = { win: string; mac: string }
type Keys = string | OsKeys
type Note = string | { win?: string; mac?: string }
type Item = [keys: Keys, action: string, note?: Note]

const k = (win: string, mac: string): OsKeys => ({ win, mac })

type Section = { title: string; os?: 'win' | 'mac'; items: Item[] }

const SECTIONS: Section[] = [
	{
		title: 'Горячие клавиши для Windows',
		os: 'win',
		items: [
			['Win + D', 'Свернуть все окна / показать рабочий стол'],
			['Win + E', 'Открыть Проводник'],
			['Win + L', 'Заблокировать компьютер'],
			['Win + Tab', 'Представление задач'],
			['Alt + Tab', 'Переключение между окнами'],
			['Alt + Esc', 'Переключение окон в порядке открытия'],
			['Win + вверх / вниз', 'Развернуть / свернуть активное окно'],
			['Win + влево / вправо', 'Прикрепить окно к половине экрана'],
			['Win + Shift + влево / вправо', 'Перенести окно на другой монитор'],
			['Win + Home', 'Свернуть всё, кроме активного окна'],
			['Win + M', 'Свернуть все окна'],
			['Win + Shift + S', 'Снимок фрагмента экрана'],
			['Win + PrintScreen', 'Снимок всего экрана сразу в файл'],
			['Win + .', 'Панель эмодзи'],
			['Win + R', 'Окно «Выполнить»'],
			['Win + S', 'Поиск по системе'],
			['Win + I', 'Параметры системы'],
			['Win + A', 'Быстрые настройки'],
			['Win + N', 'Центр уведомлений'],
			['Win + V', 'История буфера обмена'],
			['Win + X', 'Меню быстрых ссылок', 'правый клик по «Пуск»'],
			['Win + P', 'Проецирование на второй экран'],
			['Win + K', 'Подключить беспроводной экран'],
			['Win + U', 'Специальные возможности'],
			['Win + Пробел', 'Переключить раскладку клавиатуры'],
			['Win + Ctrl + D', 'Новый виртуальный рабочий стол'],
			[
				'Win + Ctrl + влево / вправо',
				'Переключение виртуальных рабочих столов'
			],
			['Ctrl + Shift + Esc', 'Диспетчер задач'],
			['Alt + F4', 'Закрыть окно'],
			['Ctrl + Alt + Delete', 'Экран блокировки / смена пользователя'],
			['Win + ,', 'Временно посмотреть рабочий стол', 'пока зажато'],
			['Win + G', 'Игровая панель Xbox Game Bar'],
			['F2', 'Переименовать выбранный файл'],
			['Shift + Delete', 'Удалить файл мимо корзины'],
			['Ctrl + Shift + N', 'Новая папка в Проводнике'],
			['Alt + влево / вправо', 'Назад / вперёд в Проводнике'],
			['Alt + Enter', 'Свойства выбранного файла']
		]
	},
	{
		title: 'Горячие клавиши для macOS',
		os: 'mac',
		items: [
			['Cmd + Space', 'Spotlight-поиск'],
			['Ctrl + Cmd + Space', 'Панель эмодзи и символов'],
			['Cmd + Tab', 'Переключение между приложениями'],
			['Cmd + `', 'Переключение окон одного приложения'],
			['Cmd + Q', 'Закрыть приложение полностью'],
			['Cmd + W', 'Закрыть окно / вкладку'],
			['Cmd + Option + W', 'Закрыть все окна приложения'],
			['Cmd + M', 'Свернуть окно'],
			['Cmd + Option + M', 'Свернуть все окна приложения'],
			['Cmd + H', 'Скрыть окно'],
			['Cmd + Option + H', 'Скрыть все остальные приложения'],
			['Cmd + Shift + 3', 'Снимок всего экрана'],
			['Cmd + Shift + 4', 'Снимок фрагмента экрана'],
			['Cmd + Shift + 5', 'Меню записи экрана и скриншотов'],
			['Cmd + ,', 'Настройки приложения'],
			['Cmd + Option + Esc', 'Принудительно закрыть приложение'],
			['Cmd + Delete', 'Удалить файл в корзину'],
			['Cmd + Shift + Delete', 'Очистить корзину'],
			['Ctrl + Cmd + Q', 'Заблокировать экран'],
			['Ctrl + вверх', 'Mission Control'],
			['Ctrl + вниз', 'Все окна текущего приложения'],
			['Ctrl + влево / вправо', 'Переключение рабочих столов'],
			['Ctrl + Cmd + F', 'Полноэкранный режим приложения'],
			['Cmd + Option + D', 'Показать / скрыть Dock'],
			['Cmd + N', 'Новое окно Finder'],
			['Cmd + Shift + N', 'Новая папка (Finder)'],
			['Cmd + Shift + .', 'Показать скрытые файлы (Finder)'],
			['Cmd + I', 'Информация о файле (Get Info)'],
			['Пробел', 'Быстрый просмотр файла'],
			['Cmd + Option + V', 'Переместить файл', 'после Cmd + C'],
			['Cmd + Shift + A', 'Папка «Программы»'],
			['Cmd + Shift + U', 'Папка «Утилиты»'],
			['Cmd + Shift + D', 'Рабочий стол (Finder)'],
			['Cmd + Shift + O', 'Папка «Документы»'],
			['Cmd + Shift + G', 'Перейти к папке по пути'],
			['Cmd + Option + I', 'Общая информация о файлах'],
			['Cmd + Ctrl + Shift + 4', 'Снимок фрагмента в буфер обмена'],
			['Cmd + Option + Пробел', 'Поиск Spotlight в окне Finder'],
			['Cmd + Ctrl + вправо', 'Следующий рабочий стол'],
			['Fn + Fn', 'Диктовка голосом']
		]
	},
	{
		title: 'Браузер',
		items: [
			[k('Ctrl + T', 'Cmd + T'), 'Новая вкладка'],
			[
				k('Ctrl + Shift + T', 'Cmd + Shift + T'),
				'Восстановить закрытую вкладку'
			],
			[k('Ctrl + W', 'Cmd + W'), 'Закрыть вкладку'],
			[k('Ctrl + L', 'Cmd + L'), 'Перейти в адресную строку'],
			[k('Ctrl + F', 'Cmd + F'), 'Поиск на странице'],
			[k('Ctrl + D', 'Cmd + D'), 'Добавить в закладки'],
			[
				k('Ctrl + Shift + N', 'Cmd + Shift + N'),
				'Окно инкогнито',
				{
					win: 'в Firefox — Ctrl + Shift + P',
					mac: 'в Firefox — Cmd + Shift + P'
				}
			],
			['Ctrl + Tab', 'Следующая вкладка'],
			['Ctrl + Shift + Tab', 'Предыдущая вкладка'],
			[k('Ctrl + R', 'Cmd + R'), 'Обновить страницу'],
			[
				k('Ctrl + Shift + R', 'Cmd + Shift + R'),
				'Обновить без кэша',
				{ mac: 'в Safari — Cmd + Option + R' }
			],
			[k('Ctrl + = / -', 'Cmd + = / -'), 'Увеличить / уменьшить масштаб'],
			[k('Ctrl + 0', 'Cmd + 0'), 'Сбросить масштаб'],
			[k('Alt + влево', 'Cmd + влево'), 'Назад по истории'],
			[
				k('Ctrl + J', 'Cmd + Shift + J'),
				'Открыть загрузки',
				{ mac: 'в Safari — Cmd + Option + L' }
			],
			[
				k('Ctrl + Shift + Delete', 'Cmd + Shift + Delete'),
				'Очистить историю и кэш'
			],
			[k('F11', 'Ctrl + Cmd + F'), 'Полноэкранный режим'],
			[
				k('Ctrl + Shift + B', 'Cmd + Shift + B'),
				'Показать / скрыть панель закладок'
			]
		]
	},
	{
		title: 'Работа с текстом',
		items: [
			[k('Ctrl + C', 'Cmd + C'), 'Копировать'],
			[k('Ctrl + V', 'Cmd + V'), 'Вставить'],
			[k('Ctrl + X', 'Cmd + X'), 'Вырезать'],
			[k('Ctrl + Z', 'Cmd + Z'), 'Отменить'],
			[
				k('Ctrl + Y', 'Cmd + Shift + Z'),
				'Повторить отменённое',
				{ win: 'или Ctrl + Shift + Z' }
			],
			[k('Ctrl + A', 'Cmd + A'), 'Выделить всё'],
			[k('Ctrl + F', 'Cmd + F'), 'Найти'],
			[k('Ctrl + H', ''), 'Найти и заменить'],
			[k('Ctrl + B', 'Cmd + B'), 'Жирный шрифт'],
			[k('Ctrl + I', 'Cmd + I'), 'Курсив'],
			[k('Ctrl + U', 'Cmd + U'), 'Подчёркнутый'],
			[k('Ctrl + S', 'Cmd + S'), 'Сохранить'],
			[k('Ctrl + P', 'Cmd + P'), 'Печать'],
			[k('Ctrl + Backspace', 'Option + Backspace'), 'Удалить слово целиком'],
			[
				k('Ctrl + влево / вправо', 'Option + влево / вправо'),
				'Перемещение по словам'
			],
			[k('Home / End', 'Cmd + влево / вправо'), 'В начало / конец строки'],
			[
				k('Ctrl + Home / End', 'Cmd + вверх / вниз'),
				'В начало / конец документа'
			],
			[
				k('Ctrl + Shift + V', 'Cmd + Shift + V'),
				'Вставить без форматирования',
				{ mac: 'в Word — Cmd + Ctrl + V' }
			]
		]
	},
	{
		title: 'Excel / Google Таблицы',
		items: [
			[k('Ctrl + ;', 'Cmd + ;'), 'Вставить сегодняшнюю дату'],
			[k('Ctrl + Shift + ;', 'Cmd + Shift + ;'), 'Вставить текущее время'],
			[k('Alt + =', 'Cmd + Shift + T'), 'Автосумма'],
			[
				'Ctrl + Пробел',
				'Выделить весь столбец',
				{ mac: 'может конфликтовать со сменой раскладки' }
			],
			['Shift + Пробел', 'Выделить всю строку'],
			[
				k(
					'Ctrl + влево / вправо / вверх / вниз',
					'Cmd + влево / вправо / вверх / вниз'
				),
				'Перейти к краю данных'
			],
			[
				k(
					'Ctrl + Shift + влево / вправо / вверх / вниз',
					'Cmd + Shift + влево / вправо / вверх / вниз'
				),
				'Выделить до края данных'
			],
			[k('F2', 'Ctrl + U'), 'Редактировать ячейку'],
			[k('Ctrl + 1', 'Cmd + 1'), 'Формат ячеек'],
			[k('Ctrl + D', 'Cmd + D'), 'Заполнить вниз значением сверху'],
			[k('Ctrl + Shift + L', 'Cmd + Shift + L'), 'Включить фильтр'],
			[k('Ctrl + Home / End', ''), 'В начало / конец листа'],
			[k('Alt + Enter', 'Ctrl + Option + Enter'), 'Новая строка внутри ячейки'],
			[k('Ctrl + PageDown / PageUp', ''), 'Переключение между листами']
		]
	},
	{
		title: 'Видеозвонки: Zoom',
		items: [
			[k('Alt + A', 'Cmd + Shift + A'), 'Вкл/выкл микрофон'],
			[k('Alt + V', 'Cmd + Shift + V'), 'Вкл/выкл камеру'],
			[k('Alt + S', 'Cmd + Shift + S'), 'Демонстрация экрана'],
			['Пробел', 'Временно включить микрофон', 'удерживая']
		]
	},
	{
		title: 'Видеозвонки: Google Meet',
		items: [
			[k('Ctrl + D', 'Cmd + D'), 'Вкл/выкл микрофон'],
			[k('Ctrl + E', 'Cmd + E'), 'Вкл/выкл камеру']
		]
	},
	{
		title: 'PowerPoint / Google Slides',
		items: [
			[k('F5', 'Cmd + Shift + Enter'), 'Начать показ слайдов с начала'],
			[k('Shift + F5', 'Cmd + Enter'), 'Начать показ с текущего слайда'],
			['Esc', 'Выйти из показа'],
			[k('Ctrl + M', 'Cmd + Shift + N'), 'Новый слайд'],
			[k('Ctrl + Shift + D', 'Cmd + Shift + D'), 'Дублировать слайд'],
			['B', 'Чёрный экран во время показа'],
			['W', 'Белый экран во время показа']
		]
	}
]

type Variant = 'win' | 'mac'

const pick = (value: Keys | Note | undefined, os: Variant): string => {
	if (!value) return ''
	if (typeof value === 'string') return value
	return (value as Record<string, string>)[os] ?? ''
}

// Секции чужой ОС выкидываются целиком, строки без аналога — поштучно.
const sectionsFor = (os: Variant) =>
	SECTIONS.filter(section => !section.os || section.os === os).map(section => ({
		...section,
		items: section.items.filter(([keys]) => pick(keys, os) !== '')
	}))

const countFor = (os: Variant) =>
	sectionsFor(os).reduce((sum, s) => sum + s.items.length, 0)
const BASE_URL = 'https://pixeltool.pro'

const PRIMARY: [number, number, number] = [45, 45, 48] // тёмно-серый — как в референсе-кейкапе пользователя
const INK: [number, number, number] = [17, 24, 39]
const MUTED: [number, number, number] = [107, 114, 128]

function run(os: Variant) {
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

	// Логотипы брендов — официальные марки, растеризованы из SVG в тёмный PNG
	// (тот же приём, что с ⌘: jsPDF не рендерит SVG в Node).
	const BRAND_FILES = [
		'chrome',
		'firefox',
		'safari',
		'zoom',
		'text-size',
		'google-meet',
		'google-sheets',
		'google-slides'
	] as const
	type Brand = (typeof BRAND_FILES)[number]
	const brandIcons = Object.fromEntries(
		BRAND_FILES.map(name => [
			name,
			readFileSync(
				join(process.cwd(), `assets/pdf-icons/${name}.png`)
			).toString('base64')
		])
	) as Record<Brand, string>

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

	// Уголок с картинкой баннера в правом верхнем углу каждой страницы. Форма
	// (скруглённый внутренний угол + два вогнутых стыка) вырезана прозрачностью
	// прямо в PNG — в jsPDF нет ни масок, ни clip-path, рисовать её дугами
	// пришлось бы вручную. Готовит его scripts/_corner.mjs из card-banner-v2.png.
	const CORNER_W = 87
	const CORNER_H = 87
	const cornerBase64 = readFileSync(
		join(process.cwd(), 'assets/pdf-icons/page-corner.png')
	).toString('base64')

	const drawPageCorner = () => {
		doc.addImage(
			cornerBase64,
			'PNG',
			pageWidth - CORNER_W,
			0,
			CORNER_W,
			CORNER_H,
			'page-corner',
			'SLOW'
		)
	}

	// На страницах-продолжениях контент начинается ниже уголка, иначе первые
	// строки описаний уезжают под картинку (колонка описаний доходит до 539pt,
	// а уголок занимает от 463pt).
	const contentTop = CORNER_H + 14
	let y = margin

	const ensureSpace = (needed: number) => {
		if (y + needed > pageHeight - margin) {
			doc.addPage()
			drawPageCorner()
			// Логотип с названием — только на страницах-продолжениях: на первой
			// он уже есть в шапке.
			drawLogo(PAGE_LOGO_LEFT, PAGE_LOGO_TOP, PAGE_LOGO_SIZE)
			doc.setFontSize(12)
			doc.setTextColor(...INK)
			doc.text(
				'PixelTool',
				PAGE_LOGO_LEFT + PAGE_LOGO_SIZE + 8,
				PAGE_LOGO_TOP + PAGE_LOGO_SIZE * 0.74
			)
			y = contentTop
		}
	}

	drawPageCorner()

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

	// Метка бренда на страницах-продолжениях: прижата к левому верхнему углу,
	// зеркально уголку справа. Отступ меньше общего поля страницы — иначе
	// метка висит посреди пустоты, а не читается как угловой элемент.
	const PAGE_LOGO_SIZE = 18
	const PAGE_LOGO_LEFT = 28
	const PAGE_LOGO_TOP = 22

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
	// Пробел на настоящей клавиатуре — самая длинная клавиша, поэтому чип
	// растягиваем до фиксированной ширины, а не по ширине слова.
	const SPACE_CHIP_WIDTH = 85
	const isSpaceKey = (label: string) => /^(space|пробел)$/i.test(label.trim())

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
	const isTabKey = (token: string) => token.trim().toLowerCase() === 'tab'
	const isShiftKey = (token: string) => token.trim().toLowerCase() === 'shift'
	const isEnterKey = (token: string) =>
		/^(enter|return|ввод)$/i.test(token.trim())
	const isBackspaceKey = (token: string) => /^backspace$/i.test(token.trim())
	// Только Option: Alt на Windows-клавиатуре ничем не помечен, иконка ⌥ там
	// сбивала бы с толку. Ctrl по той же причине остаётся текстом.
	const isOptionKey = (token: string) => /^option$/i.test(token.trim())

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

	type IconKind =
		| 'win'
		| 'cmd'
		| 'tab'
		| 'shift'
		| 'enter'
		| 'backspace'
		| 'option'

	type ChipContent =
		| { kind: 'text'; value: string }
		// iconSide: 'right' — для Enter, у него ↵ на настоящей клавише стоит
		// справа от слова, а не слева как ⌘/⊞ на своих.
		| {
				kind: 'iconText'
				icon: IconKind
				label: string
				iconSide?: 'left' | 'right'
		  }
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

	// Иконки Tab и Shift — обводка в один контур, поэтому рисуются векторно
	// прямо здесь (в отличие от ⌘/Apple, которые пришлось растеризовать):
	// геометрия снята с SVG пользователя в системе координат 24×24.
	const iconPen = (size: number, color: [number, number, number]) => {
		const k = size / 24
		doc.setDrawColor(...color)
		doc.setLineWidth(2 * k) // stroke-width="2" из SVG
		doc.setLineCap('round')
		doc.setLineJoin('round')
		return k
	}
	// Толщина линии — общая настройка документа, поэтому после иконки
	// возвращаем её к исходной, иначе «потолстеют» рамки и разделители дальше.
	const iconPenReset = () => {
		doc.setLineWidth(0.2)
		doc.setLineCap('butt')
		doc.setLineJoin('miter')
	}

	// Tab — две горизонтальные стрелки: верхняя вправо, нижняя влево.
	const drawTabIcon = (
		cx: number,
		cy: number,
		size: number,
		color: [number, number, number] = [255, 255, 255]
	) => {
		const k = iconPen(size, color)
		const px = (x: number) => cx + (x - 12) * k
		const py = (y: number) => cy + (y - 12) * k

		doc.line(px(4), py(7), px(20), py(7))
		doc.lines(
			[
				[4 * k, 4 * k],
				[-4 * k, 4 * k]
			],
			px(16),
			py(3),
			[1, 1],
			'S'
		)

		doc.line(px(4), py(17), px(20), py(17))
		doc.lines(
			[
				[-4 * k, -4 * k],
				[4 * k, -4 * k]
			],
			px(8),
			py(21),
			[1, 1],
			'S'
		)
		iconPenReset()
	}

	// Shift — контур стрелки вверх с «ножкой». Скругления углов (r=1 в SVG)
	// на размере 9 pt неразличимы, поэтому контур ломаный, но со скруглёнными
	// стыками линий — визуально это то же самое.
	const drawShiftIcon = (
		cx: number,
		cy: number,
		size: number,
		color: [number, number, number] = [255, 255, 255]
	) => {
		const k = iconPen(size, color)
		const outline: [number, number][] = [
			[12, 3.4], // остриё
			[19.7, 11.1],
			[19.0, 12],
			[15, 12],
			[15, 20],
			[9, 20],
			[9, 12],
			[5.0, 12],
			[4.3, 11.1]
		]
		const deltas: [number, number][] = outline
			.slice(1)
			.map(([x, y], i) => [(x - outline[i][0]) * k, (y - outline[i][1]) * k])
		doc.lines(
			deltas,
			cx + (outline[0][0] - 12) * k,
			cy + (outline[0][1] - 12) * k,
			[1, 1],
			'S',
			true // замкнуть контур обратно на остриё
		)
		iconPenReset()
	}

	// Enter — стрелка влево с «коленом» вверх справа (↵).
	const drawEnterIcon = (
		cx: number,
		cy: number,
		size: number,
		color: [number, number, number] = [255, 255, 255]
	) => {
		const k = iconPen(size, color)
		const px = (x: number) => cx + (x - 12) * k
		const py = (y: number) => cy + (y - 12) * k

		doc.lines(
			[
				[0, 10 * k],
				[-13 * k, 0]
			],
			px(20),
			py(5),
			[1, 1],
			'S'
		)
		doc.lines(
			[
				[-5 * k, -5 * k],
				[5 * k, -5 * k]
			],
			px(12),
			py(20),
			[1, 1],
			'S'
		)
		iconPenReset()
	}

	// Backspace — стрелка влево, упирающаяся в «корпус» клавиши (⌫).
	const drawBackspaceIcon = (
		cx: number,
		cy: number,
		size: number,
		color: [number, number, number] = [255, 255, 255]
	) => {
		const k = iconPen(size, color)
		const px = (x: number) => cx + (x - 12) * k
		const py = (y: number) => cy + (y - 12) * k

		// Пятиугольный контур: остриё слева, прямой срез справа.
		doc.lines(
			[
				[6 * k, -6 * k],
				[9 * k, 0],
				[0, 12 * k],
				[-9 * k, 0]
			],
			px(3),
			py(12),
			[1, 1],
			'S',
			true
		)
		// Крестик внутри
		doc.line(px(10), py(9), px(16), py(15))
		doc.line(px(16), py(9), px(10), py(15))
		iconPenReset()
	}

	// Option (⌥) — ломаная слева-вниз-направо плюс отдельная верхняя черта.
	const drawOptionIcon = (
		cx: number,
		cy: number,
		size: number,
		color: [number, number, number] = [255, 255, 255]
	) => {
		const k = iconPen(size, color)
		const px = (x: number) => cx + (x - 12) * k
		const py = (y: number) => cy + (y - 12) * k

		doc.lines(
			[
				[6 * k, 0],
				[6 * k, 12 * k],
				[6 * k, 0]
			],
			px(3),
			py(6),
			[1, 1],
			'S'
		)
		doc.line(px(14), py(6), px(21), py(6))
		iconPenReset()
	}

	// ---- Иконки заголовков секций (рисуются тёмными на белом) ----

	const drawTextIcon = (
		cx: number,
		cy: number,
		size: number,
		color: [number, number, number]
	) => {
		const k = iconPen(size, color)
		const px = (x: number) => cx + (x - 12) * k
		const py = (y: number) => cy + (y - 12) * k
		doc.line(px(4), py(6), px(20), py(6))
		doc.line(px(4), py(12), px(16), py(12))
		doc.line(px(4), py(18), px(20), py(18))
		iconPenReset()
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
		const natural = doc.getTextWidth(content.value) + CHIP_PAD_X * 2
		return isSpaceKey(content.value)
			? Math.max(natural, SPACE_CHIP_WIDTH)
			: natural
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
			const ICON_DRAWERS: Record<
				IconKind,
				(cx: number, cy: number, size: number) => void
			> = {
				win: drawWinIcon,
				cmd: drawCmdIcon,
				tab: drawTabIcon,
				shift: drawShiftIcon,
				enter: drawEnterIcon,
				backspace: drawBackspaceIcon,
				option: drawOptionIcon
			}

			const onRight = content.iconSide === 'right'
			const iconCx = onRight
				? x + chipWidth - CHIP_PAD_X - ICON_SIZE / 2
				: x + CHIP_PAD_X + ICON_SIZE / 2
			const labelX = onRight
				? x + CHIP_PAD_X
				: x + CHIP_PAD_X + ICON_SIZE + ICON_TEXT_GAP

			ICON_DRAWERS[content.icon](iconCx, cy, ICON_SIZE)
			doc.setFontSize(CHIP_FONT_SIZE)
			doc.setTextColor(255, 255, 255)
			doc.text(
				content.label,
				labelX,
				topY + CHIP_HEIGHT / 2 + CHIP_FONT_SIZE * 0.35
			)
		} else {
			doc.setFontSize(CHIP_FONT_SIZE)
			doc.setTextColor(255, 255, 255)
			// По центру, а не от левого паддинга: у чипов обычной ширины это то
			// же самое, но растянутый «Пробел» иначе прижал бы слово влево.
			doc.text(
				content.value,
				x + (chipWidth - doc.getTextWidth(content.value)) / 2,
				topY + CHIP_HEIGHT / 2 + CHIP_FONT_SIZE * 0.35
			)
		}
		return chipWidth
	}

	// Одна клавиша → содержимое кейкапа. Порядок проверок важен: "Ctrl/Cmd"
	// сюда уже не попадает (разделяется выше), но одиночный "Cmd" — да.
	const chipContentFor = (key: string): ChipContent => {
		if (key in DIRECTION_WORDS)
			return { kind: 'arrow', dir: DIRECTION_WORDS[key] }
		if (isWinKey(key)) return { kind: 'iconText', icon: 'win', label: 'Win' }
		if (isCmdKey(key)) return { kind: 'iconText', icon: 'cmd', label: 'Cmd' }
		if (isTabKey(key)) return { kind: 'iconText', icon: 'tab', label: 'Tab' }
		if (isShiftKey(key))
			return { kind: 'iconText', icon: 'shift', label: 'Shift' }
		if (isEnterKey(key))
			return {
				kind: 'iconText',
				icon: 'enter',
				label: key.trim(),
				iconSide: 'right'
			}
		if (isBackspaceKey(key))
			return { kind: 'iconText', icon: 'backspace', label: key.trim() }
		if (isOptionKey(key))
			return { kind: 'iconText', icon: 'option', label: key.trim() }
		return { kind: 'text', value: key }
	}

	// Ряд клавиш комбинации: каждая — свой кейкап, между ними — текстовый "+".
	// Альтернативы через "/" ("Ctrl/Cmd", "Home / End", "влево / вправо") — это
	// РАЗНЫЕ клавиши, поэтому рисуются двумя кейкапами со слешем между ними,
	// а не одной кнопкой с косой чертой внутри.
	const drawComboRow = (combo: string, x: number, topY: number) => {
		const tokens = combo.split(' + ')
		let cursorX = x
		doc.setFontSize(CHIP_FONT_SIZE)

		const drawSeparator = (sign: '+' | '/') => {
			doc.setTextColor(...MUTED)
			doc.text(sign, cursorX, topY + CHIP_HEIGHT / 2 + CHIP_FONT_SIZE * 0.35)
			cursorX += doc.getTextWidth(sign) + PLUS_GAP
		}

		tokens.forEach((token, i) => {
			if (i > 0) drawSeparator('+')

			token
				.split('/')
				.map(p => p.trim())
				.filter(Boolean)
				.forEach((key, j) => {
					if (j > 0) drawSeparator('/')
					cursorX += drawChip(chipContentFor(key), cursorX, topY) + PLUS_GAP
				})
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

	text(`${countFor(os)} горячих клавиш на каждый день`, 21, { gap: 6 })
	text(
		`${os === 'win' ? 'Windows' : 'macOS'}, браузер, работа с текстом, таблицы, видеозвонки и презентации — всё, что реально экономит время, в одном месте.`,
		12,
		{ color: MUTED, gap: 22 }
	)

	// Шире, чем раньше: теперь тут не один чип, а ряд отдельных клавиш + "+".
	const col1Width = 272
	const col2X = margin + col1Width + 14

	type SectionIcon = 'win' | 'apple' | 'text' | Brand

	// Массив: у секции может быть несколько логотипов (браузеры, таблицы).
	const SECTION_ICONS: Record<string, SectionIcon[] | undefined> = {
		'Горячие клавиши для Windows': ['win'],
		'Горячие клавиши для macOS': ['apple'],
		Браузер: ['chrome', 'firefox', 'safari'],
		'Работа с текстом': ['text-size'],
		'Excel / Google Таблицы': ['google-sheets'],
		'Видеозвонки: Zoom': ['zoom'],
		'Видеозвонки: Google Meet': ['google-meet'],
		'PowerPoint / Google Slides': ['google-slides']
	}

	sectionsFor(os).forEach((section, sectionIndex) => {
		// Отступ в 2 строки перед каждой секцией (кроме первой — она и так
		// начинается сразу под подзаголовком шпаргалки).
		if (sectionIndex > 0) y += 11 * 1.3 * 2
		// Заголовку мало места «под себя»: иначе секция начинается в самом низу
		// страницы и одна-две строки уезжают на следующую, отрываясь от шапки.
		// Требуем место под заголовок и первые три строки (или под всю секцию,
		// если она короче) — тогда короткие разделы переносятся целиком.
		ensureSpace(36 + Math.min(section.items.length, 3) * (CHIP_HEIGHT + 6))

		let textX = margin
		const icons: SectionIcon[] | undefined = SECTION_ICONS[section.title]
		if (icons) {
			const iconSize = 16
			const cy = y - 5
			icons.forEach((icon, i) => {
				const cx = margin + iconSize / 2 + i * (iconSize + 5)
				if (icon === 'win') drawWinIcon(cx, cy, iconSize, INK)
				else if (icon === 'apple') drawAppleIcon(cx, cy, iconSize, true)
				else if (icon === 'text') drawTextIcon(cx, cy, iconSize, INK)
				else
					doc.addImage(
						brandIcons[icon],
						'PNG',
						cx - iconSize / 2,
						cy - iconSize / 2,
						iconSize,
						iconSize,
						`brand-${icon}`,
						'SLOW'
					)
			})
			textX = margin + icons.length * iconSize + (icons.length - 1) * 5 + 8
		}

		doc.setFontSize(14)
		doc.setTextColor(...INK)
		doc.text(section.title, textX, y)
		y += 18

		const NOTE_SIZE = 8.5
		const textWidth = maxWidth - col1Width - 14

		section.items.forEach(([rawKeys, action, rawNote]) => {
			const combo = pick(rawKeys, os)
			const note = pick(rawNote, os)
			doc.setFontSize(10.5)
			const actionLines = doc.splitTextToSize(action, textWidth)
			const actionHeight = actionLines.length * 10.5 * 1.3

			doc.setFontSize(NOTE_SIZE)
			const noteLines = note ? doc.splitTextToSize(note, textWidth) : []
			const noteHeight = noteLines.length * NOTE_SIZE * 1.3

			const textBlockHeight = actionHeight + noteHeight
			const rowHeight = Math.max(CHIP_HEIGHT, textBlockHeight)

			ensureSpace(rowHeight + 6)

			// Сочетания рисуются свободно вправо и молча наехали бы на колонку
			// описаний — предупреждаем при сборке, чтобы это не всплыло в PDF.
			const { width: comboWidth } = drawComboRow(combo, margin, y)
			if (comboWidth > col1Width) {
				console.warn(
					`⚠ «${combo}» шире колонки: ${Math.round(comboWidth)} pt при лимите ${col1Width}`
				)
			}

			// Описание и сноска центрируются как один блок относительно кейкапов.
			let textY = y + rowHeight / 2 - textBlockHeight / 2 + 10.5

			doc.setFontSize(10.5)
			doc.setTextColor(55, 65, 81)
			doc.text(actionLines, col2X, textY)
			textY += actionHeight

			if (noteLines.length) {
				doc.setFontSize(NOTE_SIZE)
				doc.setTextColor(...MUTED)
				doc.text(noteLines, col2X, textY)
			}

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
	const outPath = join(
		outDir,
		`pixeltool-goryachie-klavishi-${os === 'win' ? 'windows' : 'macos'}.pdf`
	)
	writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')))
	console.log(`Written: ${outPath} (${countFor(os)} shortcuts)`)
}

// Заголовок обещает «100 горячих клавиш» — если в какой-то из версий их
// стало не столько, сборка должна падать, а не тихо врать в PDF.
for (const os of ['win', 'mac'] as Variant[]) {
	const n = countFor(os)
	if (n !== 100) {
		throw new Error(
			`В версии ${os} получилось ${n} сочетаний вместо 100 — поправь SECTIONS`
		)
	}
	run(os)
}

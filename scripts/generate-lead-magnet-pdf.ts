// Разовая генерация статического PDF для лид-магнита (сайдбар: форма email).
// Готовый файл коммитится в public/downloads — API-роут просто прикрепляет
// его к письму, ничего не рендерит на лету (жёсткая зависимость от
// Cyrillic-шрифта в рантайме не нужна). Перегенерировать: npx tsx scripts/generate-lead-magnet-pdf.ts
import { jsPDF } from 'jspdf'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const TOOLS: { title: string; description: string; path: string }[] = [
	{
		title: 'Генератор QR-кодов',
		description:
			'QR для ссылки, Wi-Fi или мобильного приложения — готовый код за секунды.',
		path: 'qr-generator'
	},
	{
		title: 'Сканер QR-кодов',
		description:
			'Считывает QR через камеру или с загруженной картинки прямо в браузере.',
		path: 'qr-scanner'
	},
	{
		title: 'Генератор паролей',
		description:
			'Надёжные пароли под любые требования — длина, символы, похожие символы.',
		path: 'password-generator'
	},
	{
		title: 'Генератор случайных чисел',
		description:
			'Честный случайный выбор в диапазоне — для розыгрышей и решений.',
		path: 'random-number-generator'
	},
	{
		title: 'Рандомайзер команд',
		description:
			'Разбивает список людей на равные команды или группы за один клик.',
		path: 'team-randomizer'
	},
	{
		title: 'Бросок костей',
		description:
			'Виртуальные кубики для настольных игр — без физического набора под рукой.',
		path: 'dice-roller'
	},
	{
		title: 'Фавикон из картинки',
		description:
			'Конвертирует PNG/JPG в favicon.ico нужных размеров одним архивом.',
		path: 'favicon-generator'
	},
	{
		title: 'Список эмодзи',
		description:
			'Быстрый поиск и копирование эмодзи по названию или категории.',
		path: 'emoji-list'
	},
	{
		title: 'Проверка размера изображений',
		description:
			'Узнать реальные размеры и вес картинки перед загрузкой на сайт.',
		path: 'image-size-checker'
	},
	{
		title: 'Таймер и секундомер',
		description:
			'Обратный отсчёт или секундомер в браузере — без установки приложений.',
		path: 'timer-countdown'
	}
]

const BASE_URL = 'https://pixeltool.pro'

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
		doc.setTextColor(...(opts.color ?? [17, 24, 39]))
		const lines = doc.splitTextToSize(value, maxWidth)
		ensureSpace(lines.length * size * 1.3)
		doc.text(lines, margin, y)
		y += lines.length * size * 1.3 + (opts.gap ?? 0)
	}

	text('PixelTool: 10 инструментов, которые экономят время', 22, { gap: 8 })
	text(
		'Короткая подборка бесплатных браузерных инструментов без установки и регистрации — на каждый день.',
		12,
		{ color: [107, 114, 128], gap: 20 }
	)

	TOOLS.forEach((tool, index) => {
		ensureSpace(60)
		text(`${index + 1}. ${tool.title}`, 14, { gap: 4 })
		text(tool.description, 11, { color: [75, 85, 99], gap: 4 })
		text(`${BASE_URL}/tools/${tool.path}`, 10, {
			color: [124, 58, 237],
			gap: 18
		})
	})

	ensureSpace(40)
	text(`Все инструменты: ${BASE_URL}/tools — «Всё нужное под рукой».`, 11, {
		color: [107, 114, 128]
	})

	const outDir = join(process.cwd(), 'public/downloads')
	mkdirSync(outDir, { recursive: true })
	const outPath = join(outDir, 'pixeltool-10-tools.pdf')
	writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')))
	console.log('Written:', outPath)
}

run()

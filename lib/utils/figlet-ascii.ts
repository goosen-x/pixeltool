import type FigletDefault from 'figlet'

export type FigletFontName =
	| 'Doom'
	| 'ANSI Shadow'
	| 'BlurVision ASCII'
	| 'Shaded Blocky'
	| 'RubiFont'
	| 'Alpha'

export const FIGLET_FONTS: [FigletFontName, string][] = [
	['Doom', 'Doom'],
	['ANSI Shadow', 'ANSI Shadow'],
	['BlurVision ASCII', 'Blur Vision'],
	['Shaded Blocky', 'Shaded Blocky'],
	['RubiFont', 'RubiFont'],
	['Alpha', 'Alpha']
]

const FIGLET_FONT_NAMES: readonly string[] = FIGLET_FONTS.map(([name]) => name)

export function isFigletFont(font: string): font is FigletFontName {
	return FIGLET_FONT_NAMES.includes(font)
}

let figletPromise: Promise<typeof FigletDefault> | null = null

/**
 * Грузит только ядро рендера `figlet` (парсинг .flf + сглаживание) и ровно
 * шесть нужных шрифтов — через публичные подпути пакета `figlet/fonts/<Имя>`,
 * каждый отдельным модулем. Бандлер утаскивает только их, а не остальные
 * ~320 шрифтов пакета (там суммарно ~9.5 МБ). Промис одноразовый: шрифты
 * регистрируются один раз за всё время жизни страницы, повторные вызовы
 * получают уже готовый инстанс.
 */
function loadFiglet(): Promise<typeof FigletDefault> {
	if (!figletPromise) {
		figletPromise = Promise.all([
			import('figlet'),
			import('figlet/fonts/Doom'),
			import('figlet/fonts/ANSI Shadow'),
			import('figlet/fonts/BlurVision ASCII'),
			import('figlet/fonts/Shaded Blocky'),
			import('figlet/fonts/RubiFont'),
			import('figlet/fonts/Alpha')
		]).then(
			([
				figletModule,
				doom,
				ansiShadow,
				blurVision,
				shadedBlocky,
				rubiFont,
				alpha
			]) => {
				const figlet = figletModule.default

				// На отсутствующий шрифт браузерная сборка по умолчанию пытается
				// сама сходить в сеть за .flf — нам нужны только эти шесть,
				// зарегистрированных локально, без скрытых сетевых запросов.
				figlet.defaults({ fetchFontIfMissing: false })

				figlet.parseFont('Doom', doom.default)
				figlet.parseFont('ANSI Shadow', ansiShadow.default)
				figlet.parseFont('BlurVision ASCII', blurVision.default)
				figlet.parseFont('Shaded Blocky', shadedBlocky.default)
				figlet.parseFont('RubiFont', rubiFont.default)
				figlet.parseFont('Alpha', alpha.default)

				return figlet
			}
		)
	}
	return figletPromise
}

/**
 * Рисует текст выбранным FIGlet-шрифтом. Ни один из шести не знает
 * кириллицы, а «Alpha» — ещё и цифр с пунктуацией (см. lib/data — там же
 * проверено на практике: непонятный символ библиотека молча пропускает,
 * вплоть до пустой строки на чисто кириллическом тексте). Вместо этого текст
 * режется на подряд идущие куски «шрифт умеет» / «не умеет»: первые рисуются
 * через сам figlet (с его же сглаживанием), вторые — обычным текстом первой
 * строкой высоты шрифта, остальные строки куска пустые. Тот же принцип,
 * что и в ascii-converter.ts для «Мелкого» шрифта.
 */
export async function figletTextToAscii(
	text: string,
	font: FigletFontName
): Promise<string> {
	const figlet = await loadFiglet()
	// loadFont типизирован как FontMetadata | null, но эти шесть шрифтов уже
	// зарегистрированы в loadFiglet() выше — реально null тут не бывает.
	const height = (await figlet.loadFont(font))?.height ?? 8

	const chars = Array.from(text)
	const supported = new Set<string>()
	for (const char of new Set(chars)) {
		if (char === ' ') {
			supported.add(char)
			continue
		}
		if (figlet.textSync(char, { font }).trim().length > 0) {
			supported.add(char)
		}
	}

	const runs: { supported: boolean; text: string }[] = []
	for (const char of chars) {
		const charSupported = supported.has(char)
		const last = runs[runs.length - 1]
		if (last && last.supported === charSupported) {
			last.text += char
		} else {
			runs.push({ supported: charSupported, text: char })
		}
	}

	const blocks = runs.map(run =>
		run.supported
			? figlet.textSync(run.text, { font }).split('\n')
			: Array.from({ length: height }, (_, row) =>
					row === 0 ? run.text : ' '.repeat(run.text.length)
				)
	)

	const lines: string[] = []
	for (let row = 0; row < height; row++) {
		lines.push(blocks.map(block => block[row] ?? '').join(''))
	}
	return lines.join('\n')
}

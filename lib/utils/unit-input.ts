/**
 * Ввод и вывод чисел в конвертере единиц (components/tools/UnitConverterWidget).
 *
 * parseFloat напрямую ломался на привычной русской записи: «1 000» читалось
 * как 1, «12абв» молча становилось 12. Здесь пробелы-разделители разрядов
 * выкидываются, запятая принимается как десятичная, а всё остальное считается
 * ошибкой ввода.
 */
export function parseUnitInput(raw: string): number | null {
	const normalized = raw
		.replace(/[\s  ]/g, '')
		.replace(',', '.')
		.replace(/^\+/, '')
		.replace(/^[−–]/, '-')
	if (normalized === '') return null
	if (!/^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(normalized)) return null
	const value = Number(normalized)
	return Number.isFinite(value) ? value : null
}

const SUPERSCRIPT: Record<string, string> = {
	'-': '⁻',
	'0': '⁰',
	'1': '¹',
	'2': '²',
	'3': '³',
	'4': '⁴',
	'5': '⁵',
	'6': '⁶',
	'7': '⁷',
	'8': '⁸',
	'9': '⁹'
}

/**
 * Раньше результат округлялся до 6 знаков после запятой, и всё мельче
 * миллионной превращалось в «0»: 1 м в световых годах, 1 мг в тоннах.
 * Теперь мелкие и огромные числа идут в научной записи с 6 значащими
 * цифрами, а обычные — как раньше, до 6 знаков после запятой.
 */
export function formatUnitResult(value: number): string {
	if (value === 0 || Object.is(value, -0)) return '0'
	const abs = Math.abs(value)
	if (abs < 1e-4 || abs >= 1e15) {
		const [mantissa, exponent] = value.toExponential(5).split('e')
		const m = Number(mantissa).toLocaleString('ru-RU', {
			maximumFractionDigits: 5
		})
		const e = String(Number(exponent))
			.split('')
			.map(ch => SUPERSCRIPT[ch])
			.join('')
		return `${m} × 10${e}`
	}
	if (abs < 1) {
		return value.toLocaleString('ru-RU', { maximumSignificantDigits: 6 })
	}
	return value.toLocaleString('ru-RU', { maximumFractionDigits: 6 })
}

/**
 * Число для подстановки обратно в поле ввода (кнопка «поменять местами»):
 * без научной записи с символами ×/⁻, чтобы parseUnitInput его прочитал,
 * и без хвоста плавающей точки вида 39.37007874015748.
 */
export function toInputString(value: number): string {
	const abs = Math.abs(value)
	if (value !== 0 && (abs < 1e-4 || abs >= 1e15)) {
		return value.toExponential(5).replace(/\.?0+e/, 'e').replace('.', ',')
	}
	return Number(value.toPrecision(10)).toString().replace('.', ',')
}

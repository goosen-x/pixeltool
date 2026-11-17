/**
 * Расчёт ламината раскладкой, а не формулой «площадь / площадь доски + 10%».
 *
 * Доски кладутся рядами вдоль длины комнаты. Каждый ряд начинается куском
 * нужной длины (зависит от смещения), дальше целые доски, в конце обрезок
 * по стене. Отпиленные хвосты складываются в запас и идут в начало или конец
 * следующих рядов, если подходят по длине: так работает укладчик. Поэтому
 * число досок честное для конкретной комнаты, а схема на странице рисует
 * ровно ту раскладку, по которой посчитан результат.
 */

export type LaminateOffset = 'free' | 'half' | 'third'

export interface LaminateInput {
	/** Комната, м. */
	roomLength: number
	roomWidth: number
	/** Доска, мм. */
	boardLength: number
	boardWidth: number
	boardsPerPack: number
	offset: LaminateOffset
	/** Ширина дверного проёма, м: под плинтус там не нужно. 0 — без двери. */
	doorWidth: number
}

export interface LaminatePiece {
	/** Откуда начинается кусок вдоль ряда, м. */
	x: number
	length: number
	/** Кусок отпилен (не целая доска). */
	cut: boolean
}

export interface LaminateRow {
	/** Отступ ряда от стены поперёк досок, м. */
	y: number
	/** Ширина ряда: у последнего ряда доски распиливают вдоль. */
	width: number
	pieces: LaminatePiece[]
}

export interface LaminateResult {
	floorArea: number
	rows: LaminateRow[]
	/** Сколько целых досок уйдёт с учётом обрезков. */
	boards: number
	packs: number
	/** Доски, которые останутся в последней упаковке. */
	spareBoards: number
	packArea: number
	boughtArea: number
	/** Какая доля купленного уйдёт в обрезки, %. */
	wastePercent: number
	/** Плинтус: длина по периметру без двери и число планок по 2,5 м. */
	plinthLength: number
	plinthPieces: number
	/** Подложка, м²: стелется встык, считается по площади. */
	underlayArea: number
}

/** Зазор у стен на расширение ламината, м (стандартные 10 мм). */
export const EXPANSION_GAP = 0.01
/** Кусок короче 30 см в ряду не кладут: замок на нём не держит. */
export const MIN_PIECE = 0.3
export const PLINTH_LENGTH = 2.5

/**
 * Запас обрезков: берём самый короткий подходящий кусок, остаток длиннее
 * min возвращается в запас. Если подходящего нет, распиливаем новую доску.
 */
function cutter(full: number, min: number) {
	const pool: number[] = []
	let used = 0
	return {
		take(length: number) {
			if (length >= full - 1e-9) {
				used++
				return
			}
			let best = -1
			for (let i = 0; i < pool.length; i++)
				if (pool[i] >= length - 1e-9 && (best < 0 || pool[i] < pool[best]))
					best = i
			let source: number
			if (best >= 0) source = pool.splice(best, 1)[0]
			else {
				used++
				source = full
			}
			const rest = source - length
			if (rest >= min - 1e-9) pool.push(rest)
		},
		get used() {
			return used
		},
		/** Длины обрезков в запасе: из них выбирают начало ряда. */
		get pool() {
			return pool.slice()
		}
	}
}

export function layoutLaminate(input: LaminateInput): {
	rows: LaminateRow[]
	boards: number
} {
	const L = input.roomLength - 2 * EXPANSION_GAP
	const W = input.roomWidth - 2 * EXPANSION_GAP
	const bl = input.boardLength / 1000
	const bw = input.boardWidth / 1000
	const rowCount = Math.ceil(W / bw - 1e-9)
	const cut = cutter(bl, MIN_PIECE)
	const rows: LaminateRow[] = []
	let prevEnd = 0
	let prevJoints: number[] = []

	// стыки ряда, если начать его куском start
	const jointsFor = (start: number) => {
		const out: number[] = []
		for (let x = start; x < L - 1e-6; x += bl) out.push(x)
		return out
	}
	// стыки соседних рядов должны расходиться хотя бы на 30 см
	const staggered = (joints: number[]) =>
		joints.every(j => prevJoints.every(p => Math.abs(j - p) >= MIN_PIECE - 1e-9))

	// ряд, если начать его куском start: укорачиваем начало, когда конец
	// ряда выходит короче 30 см
	const plan = (raw: number) => {
		let start = Math.min(raw, L)
		let end = (L - start) % bl
		if (end > 1e-9 && end < MIN_PIECE && start - (MIN_PIECE - end) >= MIN_PIECE) {
			start -= MIN_PIECE - end
			end = (L - start) % bl
		}
		if (bl - end < 1e-9) end = 0
		const full = Math.round((L - start - end) / bl)
		return { start, full, end }
	}
	const valid = (p: ReturnType<typeof plan>) =>
		p.start >= Math.min(MIN_PIECE, L) - 1e-9 &&
		(p.end <= 1e-9 || p.end >= MIN_PIECE - 1e-9) &&
		staggered(jointsFor(p.start))

	for (let i = 0; i < rowCount; i++) {
		// комната короче доски: ряд из одного куска, стыков нет
		let nominal: number
		if (L <= bl + 1e-9) nominal = L
		else if (input.offset === 'half') nominal = i % 2 === 0 ? bl : bl / 2
		else if (input.offset === 'third') nominal = bl - ((i % 3) * bl) / 3
		// свободное смещение: ряд начинается хвостом прошлого ряда
		else nominal = i > 0 && prevEnd > 0 ? bl - prevEnd : bl

		// если по шаблону стыки встают в линию или конец слишком короткий,
		// пробуем обрезки из запаса и доли доски
		const candidates = [
			nominal,
			...cut.pool.sort((a, b) => b - a),
			bl,
			(bl * 2) / 3,
			bl / 2,
			bl / 3
		].filter(c => c >= MIN_PIECE - 1e-9 || c === L)
		const chosen = candidates.map(plan).find(valid) ?? plan(nominal)
		const { start, full, end } = chosen

		const pieces: LaminatePiece[] = []
		let x = 0
		const put = (length: number) => {
			if (length <= 1e-9) return
			const isCut = length < bl - 1e-9
			pieces.push({ x, length, cut: isCut })
			cut.take(length)
			x += length
		}
		put(start)
		for (let k = 0; k < full; k++) put(bl)
		put(end)
		prevEnd = end > 1e-9 ? end : 0
		prevJoints = pieces.slice(1).map(p => p.x)

		const y = i * bw
		rows.push({ y, width: Math.min(bw, W - y), pieces })
	}

	return { rows, boards: cut.used }
}

/** Плинтус по стенам: каждая стена своими планками, обрезки идут на другие стены. */
function plinth(roomLength: number, roomWidth: number, doorWidth: number) {
	const walls = [roomLength, roomLength, roomWidth, Math.max(roomWidth - doorWidth, 0)]
	const cut = cutter(PLINTH_LENGTH, 0.1)
	for (const wall of walls) {
		let rest = wall
		while (rest > 1e-9) {
			const piece = Math.min(rest, PLINTH_LENGTH)
			cut.take(piece)
			rest -= piece
		}
	}
	return {
		plinthLength: walls.reduce((a, b) => a + b, 0),
		plinthPieces: cut.used
	}
}

export function calculateLaminate(input: LaminateInput): LaminateResult {
	const { rows, boards } = layoutLaminate(input)
	const boardArea = (input.boardLength / 1000) * (input.boardWidth / 1000)
	const packs = Math.ceil(boards / input.boardsPerPack)
	const packArea = boardArea * input.boardsPerPack
	const floorArea = input.roomLength * input.roomWidth
	const boughtArea = packs * packArea
	const laid = (input.roomLength - 2 * EXPANSION_GAP) * (input.roomWidth - 2 * EXPANSION_GAP)
	return {
		floorArea,
		rows,
		boards,
		packs,
		spareBoards: packs * input.boardsPerPack - boards,
		packArea,
		boughtArea,
		wastePercent: Math.max(0, ((boards * boardArea - laid) / (boards * boardArea)) * 100),
		...plinth(input.roomLength, input.roomWidth, input.doorWidth),
		underlayArea: Math.ceil(floorArea)
	}
}

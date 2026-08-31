import {
	ageFromBirthDate,
	getArcana,
	YEARS_MATRIX_SECTOR_KEYS,
	type Arcana,
	type FullDestinyMatrixResult,
	type FullPointKey
} from './destiny-matrix'

export interface CurrentPeriod {
	key: FullPointKey
	arcana: Arcana
	sectorStart: number
	sectorEnd: number
	text: string
}

export interface AgeSectorInfo {
	key: FullPointKey
	arcana: Arcana
	sectorStart: number
	sectorEnd: number
}

/**
 * Выбор в схеме матрицы судьбы: либо обычная точка (day, f, center...) —
 * её роль в структуре схемы, либо сектор кольца матрицы лет — что этот
 * же узел означает как возрастной период. Формально это одна и та же
 * точка с одним и тем же арканом, но со смыслом «что это за черта» и
 * «что происходит в этом возрасте» — разными по сути, поэтому и
 * выбираются, и показываются в детальной карточке раздельно (не через
 * общий active, который раньше путал клик по кольцу с точкой схемы).
 */
export type DestinyMatrixSelection =
	| { kind: 'point'; key: FullPointKey }
	| { kind: 'age'; sectorIndex: number }

function computeSector(
	result: FullDestinyMatrixResult,
	sectorIndex: number
): AgeSectorInfo {
	const key = YEARS_MATRIX_SECTOR_KEYS[sectorIndex]
	return {
		key,
		arcana: getArcana(result[key]),
		sectorStart: sectorIndex * 10,
		sectorEnd: sectorIndex * 10 + 9
	}
}

/** Индекс сектора (0-7), в котором сейчас находится человек по дате рождения. */
export function getCurrentAgeSectorIndex(birthDate: string): number {
	const age = ageFromBirthDate(birthDate)
	return Math.floor(age / 10) % 8
}

/** Данные сектора матрицы лет по индексу (0-7) — для любого сектора, не
 * только текущего, чтобы клик по кольцу мог показать любой возрастной
 * период, не только «сейчас». */
export function getAgeSectorInfo(
	result: FullDestinyMatrixResult,
	sectorIndex: number
): AgeSectorInfo {
	return computeSector(result, sectorIndex)
}

/**
 * Текст возрастного периода. isCurrent меняет рамку с «сейчас/скоро» на
 * нейтральную «в этом возрасте» — иначе кликнутый, но не текущий период
 * читался бы так, будто это про сегодняшний день человека.
 */
export function buildAgePeriodText(
	arcana: Arcana,
	sectorStart: number,
	sectorEnd: number,
	isCurrent: boolean
): string {
	if (isCurrent) {
		return `Ближайшие годы, с ${sectorStart} до ${sectorEnd} лет, проходят под влиянием аркана ${arcana.number} (${arcana.name}). ${arcana.meaning} Эта тема сейчас звучит громче остальных и задаёт тон происходящему.`
	}
	return `С ${sectorStart} до ${sectorEnd} лет действует аркан ${arcana.number} (${arcana.name}). ${arcana.meaning} Это заметная тема именно этого периода жизни.`
}

/**
 * Точка текущего десятилетия (day/f/month/g/year/h/fourth/i) всегда
 * входит ещё в какой-нибудь другой раздел сплошного текста (личность,
 * родовые линии), поэтому карточный текст для неё там уже есть — брать
 * его же для «Текущего периода» значило бы дублировать абзац дважды.
 * Вместо этого собираем отдельный текст из общего значения аркана
 * (короче и не пересекается ни с одним из 528 текстов датасета) плюс
 * возрастная рамка. Общий источник для страницы (DestinyMatrixNarrative)
 * и PDF (DestinyMatrixPdf), чтобы текст не разошёлся между ними.
 */
export function getCurrentPeriod(
	result: FullDestinyMatrixResult,
	birthDate: string
): CurrentPeriod {
	const sectorIndex = getCurrentAgeSectorIndex(birthDate)
	const info = computeSector(result, sectorIndex)
	const text = buildAgePeriodText(
		info.arcana,
		info.sectorStart,
		info.sectorEnd,
		true
	)
	return { ...info, text }
}

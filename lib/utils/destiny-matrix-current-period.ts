import {
	ageFromBirthDate,
	getArcana,
	getYearsMatrixSector,
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
	const age = ageFromBirthDate(birthDate)
	const points = YEARS_MATRIX_SECTOR_KEYS.map(key => result[key]) as [
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number
	]
	const sector = getYearsMatrixSector(age, points)
	const key = YEARS_MATRIX_SECTOR_KEYS[sector.sectorIndex]
	const arcana = getArcana(sector.arcanaNumber)
	const sectorStart = sector.sectorStart
	const sectorEnd = sector.sectorEnd - 1

	const text = `Ближайшие годы, с ${sectorStart} до ${sectorEnd} лет, проходят под влиянием аркана ${arcana.number} (${arcana.name}). ${arcana.meaning} Эта тема сейчас звучит громче остальных и задаёт тон происходящему.`

	return { key, arcana, sectorStart, sectorEnd, text }
}

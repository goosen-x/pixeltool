'use server'

import { getPositionalMeaning } from '@/lib/data/destiny-matrix-meanings'
import { getNarrativeMeaning } from '@/lib/data/destiny-matrix-narrative'
import {
	getArcana,
	type FullDestinyMatrixResult,
	type FullPointKey
} from '@/lib/utils/destiny-matrix'
import { NARRATIVE_KEYS } from '@/lib/utils/destiny-matrix-narrative-sections'

/**
 * Server Action: текст 550-комбинационного датасета живёт только на
 * сервере, клиент получает ровно одну строку под текущую точку вместо
 * всего датасета в бандле. Возвращает null, пока текст для этой пары
 * (позиция, аркан) ещё не написан — компонент в этом случае показывает
 * общий arcana.meaning.
 */
export async function fetchPositionalMeaning(
	key: FullPointKey,
	arcanaNumber: number
): Promise<string | null> {
	return getPositionalMeaning(key, arcanaNumber)
}

/**
 * Server Action: карточные тексты сразу для нескольких точек за один
 * запрос — вкладка «Родовые линии, любовь, деньги, талант» показывает до
 * 6 точек разом, и раньше каждая карточка дёргала fetchPositionalMeaning
 * сама по себе (до 6 round trip'ов на одно переключение вкладки).
 * Возвращает только точки, для которых текст уже написан — вызывающий
 * компонент сам падает на общий arcana.meaning для отсутствующих ключей.
 */
export async function fetchPositionalMeanings(
	keys: FullPointKey[],
	result: FullDestinyMatrixResult
): Promise<Partial<Record<FullPointKey, string>>> {
	const entries = keys
		.map(key => {
			const text = getPositionalMeaning(key, result[key])
			return text ? ([key, text] as const) : null
		})
		.filter((entry): entry is readonly [FullPointKey, string] => entry !== null)
	return Object.fromEntries(entries)
}

/**
 * Server Action: весь сплошной текст матрицы судьбы за один запрос,
 * вместо 24 отдельных round trip'ов по одному на точку. Для каждой
 * точки — текст, написанный для связного чтения (getNarrativeMeaning),
 * иначе карточный текст (getPositionalMeaning), иначе общее значение
 * аркана — так блок работает уже сейчас, до того как датасет
 * lib/data/destiny-matrix-narrative заполнен.
 */
export async function fetchNarrativeBlock(
	result: FullDestinyMatrixResult
): Promise<Partial<Record<FullPointKey, string>>> {
	const entries = NARRATIVE_KEYS.map(key => {
		const arcanaNumber = result[key]
		const text =
			getNarrativeMeaning(key, arcanaNumber) ??
			getPositionalMeaning(key, arcanaNumber) ??
			getArcana(arcanaNumber).meaning
		return [key, text] as const
	})
	return Object.fromEntries(entries)
}

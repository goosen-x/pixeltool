import type { FullPointKey } from '@/lib/utils/destiny-matrix'
import { CORE_MEANINGS } from './core'
import { FAMILY_MEANINGS } from './family'
import { DIAGONAL_MEANINGS } from './diagonal'
import { KARMIC_TAIL_MEANINGS } from './karmic-tail'
import { FAMILY_DIAGONAL_MEANINGS } from './family-diagonal'
import { LOVE_MONEY_MEANINGS } from './love-money'
import type { PositionalMeaningsFile } from './types'

const ALL_MEANINGS: PositionalMeaningsFile = {
	...CORE_MEANINGS,
	...FAMILY_MEANINGS,
	...DIAGONAL_MEANINGS,
	...KARMIC_TAIL_MEANINGS,
	...FAMILY_DIAGONAL_MEANINGS,
	...LOVE_MONEY_MEANINGS
}

/**
 * Трактовка аркана в контексте конкретной позиции матрицы, если она уже
 * написана, иначе null — вызывающий код молча падает на общий
 * arcana.meaning. Файл только серверный (импортируется исключительно из
 * actions.ts с 'use server'), поэтому все 550 текстов не попадают в
 * клиентский бандл.
 */
export function getPositionalMeaning(
	key: FullPointKey,
	arcanaNumber: number
): string | null {
	return ALL_MEANINGS[key]?.[arcanaNumber] ?? null
}

import type { FullPointKey } from '@/lib/utils/destiny-matrix'
import type { PositionalMeaningsFile } from '../destiny-matrix-meanings/types'
import { INTRO_NARRATIVE } from './intro'
import { MALE_LINE_NARRATIVE } from './male-line'
import { FEMALE_LINE_NARRATIVE } from './female-line'
import { LOVE_MONEY_TALENT_NARRATIVE } from './love-money-talent'

const ALL_NARRATIVE: PositionalMeaningsFile = {
	...INTRO_NARRATIVE,
	...MALE_LINE_NARRATIVE,
	...FEMALE_LINE_NARRATIVE,
	...LOVE_MONEY_TALENT_NARRATIVE
}

/**
 * Текст точки, написанный для связного чтения подряд (см.
 * docs/research/destiny-matrix-narrative-prompt.md), или null, пока он
 * не написан. Вызывающий код в этом случае падает на
 * getPositionalMeaning (карточный текст), а если и того нет — на общий
 * arcana.meaning.
 */
export function getNarrativeMeaning(
	key: FullPointKey,
	arcanaNumber: number
): string | null {
	return ALL_NARRATIVE[key]?.[arcanaNumber] ?? null
}

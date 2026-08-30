'use server'

import { getPositionalMeaning } from '@/lib/data/destiny-matrix-meanings'
import type { FullPointKey } from '@/lib/utils/destiny-matrix'

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

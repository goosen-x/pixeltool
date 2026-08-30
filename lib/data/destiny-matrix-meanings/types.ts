import type { FullPointKey } from '@/lib/utils/destiny-matrix'

/**
 * Трактовка одного аркана (1-22) в контексте конкретной позиции матрицы —
 * не общее значение карты (оно уже есть в ARCANA.meaning), а то, что она
 * означает именно на этом месте схемы. Ключ отсутствует, пока текст не
 * написан: getPositionalMeaning() в index.ts возвращает null и вызывающий
 * код молча падает на общий arcana.meaning, поэтому файлы можно заполнять
 * по одному арканy за раз, не ломая сборку.
 */
export type PositionMeanings = Partial<Record<number, string>>

export type PositionalMeaningsFile = Partial<Record<FullPointKey, PositionMeanings>>

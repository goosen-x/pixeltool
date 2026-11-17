import { createHash } from 'crypto'
import type { NextRequest } from 'next/server'
import type { Pool } from 'pg'

/**
 * Журнал голосов (таблица rating_votes, см. lib/db/schema.sql).
 *
 * Пишется рядом с агрегатом и не должен ронять сам голос: если журнал не
 * записался, оценка всё равно засчитана, ошибка уходит в лог контейнера.
 */
const SALT = process.env.VOTE_HASH_SALT || 'pixeltool-rating-votes'

export function hashIp(ip: string): string {
	return createHash('sha256').update(`${SALT}:${ip}`).digest('hex').slice(0, 16)
}

export async function logVote(
	db: Pool,
	request: NextRequest,
	ip: string,
	vote: { kind: 'tool' | 'blog'; targetId: string; value: number }
): Promise<void> {
	try {
		await db.query(
			`INSERT INTO rating_votes (kind, target_id, value, ip_hash, user_agent)
			 VALUES ($1, $2, $3, $4, $5)`,
			[
				vote.kind,
				vote.targetId,
				vote.value,
				ip === 'unknown' ? null : hashIp(ip),
				request.headers.get('user-agent')?.slice(0, 300) ?? null
			]
		)
	} catch (error) {
		console.error('Голос засчитан, но не записан в журнал:', error)
	}
}

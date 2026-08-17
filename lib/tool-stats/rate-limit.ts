export interface RateLimiter {
	/** true — запрос разрешён (и учтён), false — лимит исчерпан */
	check(key: string): boolean
}

export function createRateLimiter(
	limit: number,
	windowMs: number
): RateLimiter {
	const hits = new Map<string, number[]>()

	return {
		check(key: string): boolean {
			const now = Date.now()
			const existing = (hits.get(key) ?? []).filter(t => now - t < windowMs)

			if (existing.length >= limit) {
				// Ключ с уже пустой историей (после фильтрации истёкших меток) не
				// хранит и не блокирует ничего полезного — не оставляем его в Map.
				if (existing.length === 0) {
					hits.delete(key)
				} else {
					hits.set(key, existing)
				}
				return false
			}

			existing.push(now)
			hits.set(key, existing)
			return true
		}
	}
}

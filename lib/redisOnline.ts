import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

const redis = new Redis(REDIS_URL, {
	lazyConnect: true,
	maxRetriesPerRequest: 1,
	enableOfflineQueue: false,
	retryStrategy: () => null // Don't retry on connection failure
})

// Suppress error events to prevent unhandled error crashes
redis.on('error', err => {
	console.warn('Redis connection error (will use fallback):', err.message)
})

const PROJECT = 'pixeltool'
const TTL_SEC = 120
const CACHE_TTL_MS = 2000 // Cache for 2 seconds

let isRedisAvailable = false
let cachedCount = 0
let cacheTimestamp = 0

// Try to connect on first use
async function ensureConnection(): Promise<boolean> {
	if (isRedisAvailable) return true

	try {
		await redis.connect()
		isRedisAvailable = true
		console.log('✅ Redis connected successfully')
		return true
	} catch (e) {
		console.warn('⚠️ Redis unavailable, using fallback mode')
		return false
	}
}

export async function heartbeat(sessionId: string, widgetId?: string) {
	if (!sessionId) return

	const connected = await ensureConnection()
	if (!connected) return // Silently fail if Redis unavailable

	try {
		const key = `online:${PROJECT}:${sessionId}`
		await redis.setex(key, TTL_SEC, '1')
	} catch (e) {
		console.warn('Heartbeat failed:', e)
		isRedisAvailable = false
	}
}

export async function getOnlineCount(): Promise<number> {
	// Return cached value if still valid
	const now = Date.now()
	if (now - cacheTimestamp < CACHE_TTL_MS) {
		return cachedCount
	}

	const connected = await ensureConnection()
	if (!connected) return 0 // Return 0 if Redis unavailable

	try {
		let cursor = '0'
		let count = 0
		do {
			const [next, keys] = await redis.scan(
				cursor,
				'MATCH',
				`online:${PROJECT}:*`,
				'COUNT',
				'1000'
			)
			count += keys.length
			cursor = next
		} while (cursor !== '0')

		// Update cache
		cachedCount = count
		cacheTimestamp = now

		return count
	} catch (e) {
		console.warn('getOnlineCount failed:', e)
		isRedisAvailable = false
		return 0
	}
}

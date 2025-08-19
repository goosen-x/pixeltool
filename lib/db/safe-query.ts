import { sql } from './connection'

// Wrapper function for safe database queries with timeout handling
export async function safeQuery<T>(
	queryFn: () => Promise<T>,
	fallback: T,
	queryName?: string
): Promise<T> {
	try {
		return await queryFn()
	} catch (error: any) {
		const isTimeout =
			error?.message?.includes('timeout') ||
			error?.message?.includes('TimeoutError') ||
			error?.code === 'ECONNREFUSED' ||
			error?.code === 'ETIMEDOUT'

		if (isTimeout) {
			console.warn(
				`Database query timeout${queryName ? ` for ${queryName}` : ''} - using fallback`
			)
		} else {
			console.error(
				`Database query error${queryName ? ` for ${queryName}` : ''}:`,
				error?.message || error
			)
		}

		return fallback
	}
}

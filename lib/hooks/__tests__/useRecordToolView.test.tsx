import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { ToolStatsProvider } from '@/components/providers/ToolStatsProvider'
import { useRecordToolView } from '../useRecordToolView'
import { todayViewKey } from '@/lib/tool-stats/storage-keys'

function ViewProbe({ toolId }: { toolId: string }) {
	useRecordToolView(toolId)
	return null
}

function mockFetch() {
	return vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
		if (!init?.method || init.method === 'GET') {
			return Promise.resolve({ ok: true, json: async () => ({}) })
		}
		return Promise.resolve({ ok: true, json: async () => ({ views: 1 }) })
	})
}

function mockFetchWithFailingPost() {
	return vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
		if (!init?.method || init.method === 'GET') {
			return Promise.resolve({ ok: true, json: async () => ({}) })
		}
		return Promise.resolve({ ok: false, json: async () => ({}) })
	})
}

describe('useRecordToolView', () => {
	beforeEach(() => {
		localStorage.clear()
		vi.stubGlobal('fetch', mockFetch())
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('отправляет просмотр при первом заходе за день и запоминает флаг', async () => {
		render(
			<ToolStatsProvider>
				<ViewProbe toolId='qr-generator' />
			</ToolStatsProvider>
		)

		await waitFor(() => {
			expect(localStorage.getItem(todayViewKey('qr-generator'))).not.toBeNull()
		})

		const postCalls = (fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
			([, init]) => init?.method === 'POST'
		)
		expect(postCalls).toHaveLength(1)
	})

	it('не отправляет повторно, если сегодня уже засчитано', async () => {
		localStorage.setItem(todayViewKey('qr-generator'), '1')

		render(
			<ToolStatsProvider>
				<ViewProbe toolId='qr-generator' />
			</ToolStatsProvider>
		)

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith('/api/tool-stats')
		})

		const postCalls = (fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
			([, init]) => init?.method === 'POST'
		)
		expect(postCalls).toHaveLength(0)
	})

	it('не запоминает флаг, если сервер ответил ошибкой на POST', async () => {
		vi.stubGlobal('fetch', mockFetchWithFailingPost())

		render(
			<ToolStatsProvider>
				<ViewProbe toolId='qr-generator' />
			</ToolStatsProvider>
		)

		await waitFor(() => {
			const postCalls = (fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
				([, init]) => init?.method === 'POST'
			)
			expect(postCalls).toHaveLength(1)
		})

		await new Promise(resolve => setTimeout(resolve, 0))

		expect(localStorage.getItem(todayViewKey('qr-generator'))).toBeNull()
	})
})

import { describe, it, expect } from 'vitest'
import { framesToGif } from '@/lib/utils/pixel-art-gif'
import type { PixelFrame } from '@/lib/utils/pixel-art'

function frame(color: string | null, delayMs = 100): PixelFrame {
	return {
		id: Math.random().toString(36).slice(2),
		grid: [[color]],
		delayMs
	}
}

describe('framesToGif', () => {
	it('пишет валидную сигнатуру GIF89a', () => {
		const bytes = framesToGif([frame('#ff0000')], 1)
		const signature = String.fromCharCode(...bytes.slice(0, 6))
		expect(signature).toBe('GIF89a')
	})

	it('заканчивается трейлером 0x3B', () => {
		const bytes = framesToGif([frame('#ff0000')], 1)
		expect(bytes[bytes.length - 1]).toBe(0x3b)
	})

	it('несколько кадров дают больший файл, чем один', () => {
		const one = framesToGif([frame('#ff0000')], 1)
		const two = framesToGif([frame('#ff0000'), frame('#00ff00')], 1)
		expect(two.length).toBeGreaterThan(one.length)
	})

	it('прозрачная клетка не ломает кодирование', () => {
		const bytes = framesToGif([frame(null)], 1)
		const signature = String.fromCharCode(...bytes.slice(0, 6))
		expect(signature).toBe('GIF89a')
	})
})

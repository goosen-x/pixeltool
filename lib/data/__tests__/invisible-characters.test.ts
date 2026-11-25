import { afterEach, describe, expect, it, vi } from 'vitest'
import {
	FALLBACK_LIMIT,
	getFallbackChars,
	getInvisibleChar,
	invisibleCharacters,
	invisiblePlatforms
} from '@/lib/data/invisible-characters'
import { copyInvisible } from '@/lib/tools/copy-invisible'

describe('getFallbackChars', () => {
	it('у каждой площадки есть запасные символы, и основной среди них не повторяется', () => {
		for (const platform of invisiblePlatforms) {
			const fallbacks = getFallbackChars(platform.id)
			expect(fallbacks).toHaveLength(FALLBACK_LIMIT)
			const primary = getInvisibleChar(platform.charId as string)
			expect(fallbacks.map(c => c.char)).not.toContain(primary)
			expect(new Set(fallbacks.map(c => c.char)).size).toBe(fallbacks.length)
		}
	})

	it('для TikTok первым запасным идёт Braille Blank, а не тот же Hangul Filler', () => {
		const [first] = getFallbackChars('tiktok')
		expect(first.codepoint).toBe('U+2800')
		expect(first.char).toBe('⠀')
	})

	it('для ВК запасные сдвоены, как и основной символ', () => {
		const fallbacks = getFallbackChars('vk')
		expect(fallbacks[0].char).toBe('ㅤㅤ')
		expect(fallbacks.every(c => [...c.char].length === 2)).toBe(true)
		expect(fallbacks.map(c => c.char)).not.toContain('ٴٴ')
	})

	it('неизвестная площадка даёт пустой список', () => {
		expect(getFallbackChars('nope')).toEqual([])
	})

	it('все символы непустые и совпадают с заявленным кодпоинтом', () => {
		for (const c of invisibleCharacters) {
			const code = c.codepoint.split(' ')[0].replace('U+', '')
			expect(c.char.codePointAt(0)).toBe(parseInt(code, 16))
		}
	})
})

describe('copyInvisible', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
		vi.restoreAllMocks()
	})

	it('пишет через navigator.clipboard, когда он есть', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined)
		vi.stubGlobal('navigator', { clipboard: { writeText } })
		await expect(copyInvisible('ㅤ')).resolves.toBe(true)
		expect(writeText).toHaveBeenCalledWith('ㅤ')
	})

	it('без clipboard API копирует через скрытое поле (встроенные браузеры)', async () => {
		vi.stubGlobal('navigator', {})
		const exec = vi.fn().mockReturnValue(true)
		Object.defineProperty(document, 'execCommand', {
			value: exec,
			configurable: true
		})
		await expect(copyInvisible('͏')).resolves.toBe(true)
		expect(exec).toHaveBeenCalledWith('copy')
		expect(document.querySelector('textarea')).toBeNull()
	})

	it('если clipboard отклонил запись, тоже пробует запасной путь', async () => {
		const writeText = vi.fn().mockRejectedValue(new Error('denied'))
		vi.stubGlobal('navigator', { clipboard: { writeText } })
		const exec = vi.fn().mockReturnValue(false)
		Object.defineProperty(document, 'execCommand', {
			value: exec,
			configurable: true
		})
		await expect(copyInvisible('​')).resolves.toBe(false)
		expect(exec).toHaveBeenCalledWith('copy')
	})
})

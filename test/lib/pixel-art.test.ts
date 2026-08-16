import { describe, it, expect } from 'vitest'
import {
	createEmptyGrid,
	hexToRgb,
	colorDistance,
	nearestColor,
	imageDataToGrid,
	resizeGrid
} from '@/lib/utils/pixel-art'

describe('createEmptyGrid', () => {
	it('создаёт квадратную сетку заданного размера, вся из null', () => {
		const grid = createEmptyGrid(4)
		expect(grid).toHaveLength(4)
		expect(grid.every(row => row.length === 4)).toBe(true)
		expect(grid.every(row => row.every(cell => cell === null))).toBe(true)
	})

	it('строки — независимые массивы, а не общая ссылка', () => {
		const grid = createEmptyGrid(2)
		grid[0][0] = '#ff0000'
		expect(grid[1][0]).toBeNull()
	})
})

describe('hexToRgb', () => {
	it('разбирает 6-значный hex', () => {
		expect(hexToRgb('#ff0000')).toEqual([255, 0, 0])
		expect(hexToRgb('#00ff00')).toEqual([0, 255, 0])
		expect(hexToRgb('#0000ff')).toEqual([0, 0, 255])
	})

	it('работает без решётки', () => {
		expect(hexToRgb('ffffff')).toEqual([255, 255, 255])
	})
})

describe('colorDistance', () => {
	it('ноль для одинаковых цветов', () => {
		expect(colorDistance([10, 20, 30], [10, 20, 30])).toBe(0)
	})

	it('больше для более непохожих цветов', () => {
		const closeDist = colorDistance([0, 0, 0], [10, 10, 10])
		const farDist = colorDistance([0, 0, 0], [255, 255, 255])
		expect(farDist).toBeGreaterThan(closeDist)
	})
})

describe('nearestColor', () => {
	const palette = ['#000000', '#ffffff', '#ff0000']

	it('находит точное совпадение', () => {
		expect(nearestColor('#ffffff', palette)).toBe('#ffffff')
	})

	it('находит ближайший цвет для промежуточного оттенка', () => {
		// тёмно-серый ближе к чёрному, чем к белому или красному
		expect(nearestColor('#1a1a1a', palette)).toBe('#000000')
	})

	it('пустая палитра возвращает исходный цвет как есть', () => {
		expect(nearestColor('#123456', [])).toBe('#123456')
	})
})

describe('resizeGrid', () => {
	it('увеличение сетки сохраняет старые пиксели и добивает null', () => {
		const grid = createEmptyGrid(2)
		grid[0][0] = '#ff0000'
		grid[1][1] = '#00ff00'

		const resized = resizeGrid(grid, 4)

		expect(resized).toHaveLength(4)
		expect(resized[0][0]).toBe('#ff0000')
		expect(resized[1][1]).toBe('#00ff00')
		expect(resized[3][3]).toBeNull()
	})

	it('уменьшение сетки обрезает пиксели за новой границей', () => {
		const grid = createEmptyGrid(4)
		grid[0][0] = '#ff0000'
		grid[3][3] = '#00ff00'

		const resized = resizeGrid(grid, 2)

		expect(resized).toHaveLength(2)
		expect(resized[0][0]).toBe('#ff0000')
		// пиксель [3][3] был за пределами новой сетки 2×2 — потерян
		expect(resized.flat()).not.toContain('#00ff00')
	})

	it('тот же размер возвращает копию, а не ту же сетку', () => {
		const grid = createEmptyGrid(2)
		const resized = resizeGrid(grid, 2)
		resized[0][0] = '#ff0000'
		expect(grid[0][0]).toBeNull()
	})
})

describe('imageDataToGrid', () => {
	it('даунсемплит изображение до сетки нужного размера', () => {
		// 2×2 картинка: чёрный/белый по диагонали
		const source = {
			width: 2,
			height: 2,
			data: new Uint8ClampedArray([
				0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255
			])
		}
		const grid = imageDataToGrid(source, 2, ['#000000', '#ffffff'])
		expect(grid).toHaveLength(2)
		expect(grid[0]).toHaveLength(2)
		expect(grid[0][0]).toBe('#000000')
		expect(grid[0][1]).toBe('#ffffff')
	})

	it('квантует цвета к ближайшему из палитры', () => {
		const source = {
			width: 1,
			height: 1,
			data: new Uint8ClampedArray([10, 10, 10, 255])
		}
		const grid = imageDataToGrid(source, 1, ['#000000', '#ffffff'])
		expect(grid[0][0]).toBe('#000000')
	})

	it('прозрачные пиксели (alpha=0) становятся null', () => {
		const source = {
			width: 1,
			height: 1,
			data: new Uint8ClampedArray([255, 0, 0, 0])
		}
		const grid = imageDataToGrid(source, 1, ['#000000', '#ffffff'])
		expect(grid[0][0]).toBeNull()
	})
})

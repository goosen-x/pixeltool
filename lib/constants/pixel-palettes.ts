export interface PixelPalette {
	id: string
	name: string
	colors: string[]
}

/**
 * Ретро-палитры — приём подсмотрен у конкурента (Pixelater.net держит 200+
 * палитр игровых консолей). Не тянем их все, четырёх узнаваемых достаточно:
 * это и фича, и повод для статьи в блог («палитра как в Game Boy»).
 */
export const PIXEL_PALETTES: PixelPalette[] = [
	{
		id: 'standard',
		name: 'Стандартная',
		colors: [
			'#000000',
			'#ffffff',
			'#7f7f7f',
			'#c3c3c3',
			'#ff0000',
			'#ff7f00',
			'#ffff00',
			'#7fff00',
			'#00ff00',
			'#00ff7f',
			'#00ffff',
			'#007fff',
			'#0000ff',
			'#7f00ff',
			'#ff00ff',
			'#ff007f',
			'#7f3f00',
			'#3f1f00',
			'#ffd700',
			'#a52a2a',
			'#ff69b4',
			'#40e0d0',
			'#9370db',
			'#2e8b57'
		]
	},
	{
		id: 'gameboy',
		name: 'Game Boy',
		colors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f']
	},
	{
		id: 'nes',
		name: 'NES',
		colors: [
			'#000000',
			'#fcfcfc',
			'#f8f8f8',
			'#bcbcbc',
			'#7c7c7c',
			'#a4e4fc',
			'#3cbcfc',
			'#0078f8',
			'#0000fc',
			'#b8b8f8',
			'#6888fc',
			'#0058f8',
			'#0000bc',
			'#d8b8f8',
			'#9878f8',
			'#6844fc',
			'#4428bc',
			'#f8b8f8',
			'#f878f8',
			'#d800cc',
			'#940084',
			'#f8a4c0',
			'#f85898',
			'#e40058',
			'#a80020',
			'#f0d0b0',
			'#f87858',
			'#f83800',
			'#a81000',
			'#fce0a8',
			'#fca044',
			'#e45c10',
			'#881400',
			'#f8d878',
			'#f8b800',
			'#ac7c00',
			'#503000'
		]
	},
	{
		id: 'pico8',
		name: 'PICO-8',
		colors: [
			'#000000',
			'#1d2b53',
			'#7e2553',
			'#008751',
			'#ab5236',
			'#5f574f',
			'#c2c3c7',
			'#fff1e8',
			'#ff004d',
			'#ffa300',
			'#ffec27',
			'#00e436',
			'#29adff',
			'#83769c',
			'#ff77a8',
			'#ffccaa'
		]
	}
]

export const DEFAULT_PALETTE_ID = 'standard'

export function getPaletteById(id: string): PixelPalette {
	return PIXEL_PALETTES.find(p => p.id === id) ?? PIXEL_PALETTES[0]
}

import { asciiCharsets, type AsciiCharset } from '@/lib/data/ascii-art-data'

export interface AsciiOptions {
	width?: number
	height?: number
	charset?: AsciiCharset
	invert?: boolean
	colored?: boolean
	fontSize?: number
}

export function textToAscii(
	text: string,
	font: 'standard' | 'small' | 'big' = 'standard'
): string {
	// Simple ASCII text generation
	const fonts: Record<string, Record<string, string[]>> = {
		standard: {
			A: ['  A  ', ' A A ', 'AAAAA', 'A   A', 'A   A'],
			B: ['BBBB ', 'B   B', 'BBBB ', 'B   B', 'BBBB '],
			C: [' CCC ', 'C   C', 'C    ', 'C   C', ' CCC '],
			D: ['DDD  ', 'D  D ', 'D   D', 'D  D ', 'DDD  '],
			E: ['EEEEE', 'E    ', 'EEE  ', 'E    ', 'EEEEE'],
			F: ['FFFFF', 'F    ', 'FFF  ', 'F    ', 'F    '],
			G: [' GGG ', 'G    ', 'G  GG', 'G   G', ' GGG '],
			H: ['H   H', 'H   H', 'HHHHH', 'H   H', 'H   H'],
			I: ['IIIII', '  I  ', '  I  ', '  I  ', 'IIIII'],
			J: ['JJJJJ', '    J', '    J', 'J   J', ' JJJ '],
			K: ['K   K', 'K  K ', 'KK   ', 'K  K ', 'K   K'],
			L: ['L    ', 'L    ', 'L    ', 'L    ', 'LLLLL'],
			M: ['M   M', 'MM MM', 'M M M', 'M   M', 'M   M'],
			N: ['N   N', 'NN  N', 'N N N', 'N  NN', 'N   N'],
			O: [' OOO ', 'O   O', 'O   O', 'O   O', ' OOO '],
			P: ['PPPP ', 'P   P', 'PPPP ', 'P    ', 'P    '],
			Q: [' QQQ ', 'Q   Q', 'Q   Q', 'Q  Q ', ' QQ Q'],
			R: ['RRRR ', 'R   R', 'RRRR ', 'R  R ', 'R   R'],
			S: [' SSS ', 'S    ', ' SSS ', '    S', ' SSS '],
			T: ['TTTTT', '  T  ', '  T  ', '  T  ', '  T  '],
			U: ['U   U', 'U   U', 'U   U', 'U   U', ' UUU '],
			V: ['V   V', 'V   V', 'V   V', ' V V ', '  V  '],
			W: ['W   W', 'W   W', 'W W W', 'W W W', ' W W '],
			X: ['X   X', ' X X ', '  X  ', ' X X ', 'X   X'],
			Y: ['Y   Y', ' Y Y ', '  Y  ', '  Y  ', '  Y  '],
			Z: ['ZZZZZ', '   Z ', '  Z  ', ' Z   ', 'ZZZZZ'],
			' ': ['     ', '     ', '     ', '     ', '     '],
			'!': ['  !  ', '  !  ', '  !  ', '     ', '  !  '],
			'?': [' ??? ', '?   ?', '   ? ', '  ?  ', '  ?  '],
			'0': [' 000 ', '0   0', '0   0', '0   0', ' 000 '],
			'1': ['  1  ', ' 11  ', '  1  ', '  1  ', '11111'],
			'2': [' 222 ', '2   2', '   2 ', '  2  ', '22222'],
			'3': [' 333 ', '3   3', '  33 ', '3   3', ' 333 '],
			'4': ['4   4', '4   4', '44444', '    4', '    4'],
			'5': ['55555', '5    ', '5555 ', '    5', '5555 '],
			'6': [' 666 ', '6    ', '6666 ', '6   6', ' 666 '],
			'7': ['77777', '    7', '   7 ', '  7  ', ' 7   '],
			'8': [' 888 ', '8   8', ' 888 ', '8   8', ' 888 '],
			'9': [' 999 ', '9   9', ' 9999', '    9', ' 999 ']
		},
		small: {
			A: ['/-\\', '|-|'],
			B: ['|3', '|3'],
			C: ['(', '('],
			D: ['|)', '|)'],
			E: ['[-', '[-'],
			F: ['|=', '|'],
			G: ['(_', '(_'],
			H: ['|-|', '|-|'],
			I: ['|', '|'],
			J: ['_|', '_|'],
			K: ['|<', '|<'],
			L: ['|_', '|_'],
			M: ['|\\/|', '|  |'],
			N: ['|\\|', '| |'],
			O: ['()', '()'],
			P: ['|>', '|'],
			Q: ['()_', '()_'],
			R: ['|2', '|\\'],
			S: ['5', '5'],
			T: ['7', '|'],
			U: ['|_|', '|_|'],
			V: ['\\/', ' \\'],
			W: ['\\/\\/', '   '],
			X: ['><', '><'],
			Y: ['`/', ' |'],
			Z: ['2', '2'],
			' ': ['  ', '  ']
		},
		big: {
			// Simplified for space
			A: ['    A    ', '   A A   ', '  AAAAA  ', ' A     A ', 'A       A'],
			B: ['BBBBBB  ', 'B     B ', 'BBBBBB  ', 'B     B ', 'BBBBBB  ']
			// ... more letters
		}
	}

	const selectedFont = fonts[font] || fonts.standard
	const upperText = text.toUpperCase()
	const lines: string[] = []
	const lineCount = selectedFont[Object.keys(selectedFont)[0]]?.length || 5

	for (let i = 0; i < lineCount; i++) {
		let line = ''
		for (const char of upperText) {
			const charPattern = selectedFont[char] || selectedFont[' ']
			line += (charPattern[i] || '') + ' '
		}
		lines.push(line)
	}

	return lines.join('\n')
}

export function imageToAscii(
	imageData: ImageData,
	options: AsciiOptions = {}
): string {
	const { width = 80, height = 40, charset = 'basic', invert = false } = options

	const chars = asciiCharsets[charset]
	const charArray = invert ? chars.split('').reverse().join('') : chars

	// Calculate aspect ratio
	const aspectRatio = imageData.width / imageData.height
	const outputWidth = width
	const outputHeight = Math.round(width / aspectRatio / 2) // Divide by 2 for char aspect ratio

	// Create canvas for resizing
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')!

	canvas.width = outputWidth
	canvas.height = outputHeight

	// Create temporary canvas with original image
	const tempCanvas = document.createElement('canvas')
	const tempCtx = tempCanvas.getContext('2d')!
	tempCanvas.width = imageData.width
	tempCanvas.height = imageData.height
	tempCtx.putImageData(imageData, 0, 0)

	// Draw resized image
	ctx.drawImage(tempCanvas, 0, 0, outputWidth, outputHeight)

	const resizedData = ctx.getImageData(0, 0, outputWidth, outputHeight)
	const pixels = resizedData.data

	let ascii = ''

	for (let y = 0; y < outputHeight; y++) {
		for (let x = 0; x < outputWidth; x++) {
			const i = (y * outputWidth + x) * 4

			// Get RGB values
			const r = pixels[i]
			const g = pixels[i + 1]
			const b = pixels[i + 2]

			// Convert to grayscale
			const brightness = (r + g + b) / 3

			// Map brightness to character
			const charIndex = Math.floor((brightness / 255) * (charArray.length - 1))
			ascii += charArray[charIndex]
		}
		ascii += '\n'
	}

	return ascii
}

export function createAsciiImage(
	ascii: string,
	options: {
		fontSize?: number
		fontFamily?: string
		color?: string
		background?: string
	} = {}
): string {
	const {
		fontSize = 10,
		fontFamily = 'monospace',
		color = '#000000',
		background = '#FFFFFF'
	} = options

	const lines = ascii.split('\n')
	const maxLineLength = Math.max(...lines.map(line => line.length))

	// Create canvas
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')!

	// Set font
	ctx.font = `${fontSize}px ${fontFamily}`

	// Measure text dimensions
	const metrics = ctx.measureText('M') // Use 'M' for consistent width
	const charWidth = metrics.width
	const lineHeight = fontSize * 1.2

	// Set canvas size
	canvas.width = maxLineLength * charWidth + 20 // Add padding
	canvas.height = lines.length * lineHeight + 20

	// Fill background
	ctx.fillStyle = background
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// Draw text
	ctx.fillStyle = color
	ctx.font = `${fontSize}px ${fontFamily}`
	ctx.textBaseline = 'top'

	lines.forEach((line, y) => {
		ctx.fillText(line, 10, 10 + y * lineHeight)
	})

	return canvas.toDataURL('image/png')
}

export function downloadAsciiAsImage(
	ascii: string,
	filename: string,
	options?: any
) {
	const dataUrl = createAsciiImage(ascii, options)

	const link = document.createElement('a')
	link.href = dataUrl
	link.download = filename
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

export function downloadAsciiAsText(ascii: string, filename: string) {
	const blob = new Blob([ascii], { type: 'text/plain' })
	const url = URL.createObjectURL(blob)

	const link = document.createElement('a')
	link.href = url
	link.download = filename
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)

	URL.revokeObjectURL(url)
}

import jsQR from 'jsqr'

export interface DecodableImageData {
	data: Uint8ClampedArray
	width: number
	height: number
}

export function decodeImageData(imageData: DecodableImageData): string | null {
	const result = jsQR(imageData.data, imageData.width, imageData.height)
	return result ? result.data : null
}

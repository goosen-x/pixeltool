declare module 'gifenc' {
	export interface GIFEncoderWriteFrameOptions {
		palette?: [number, number, number, number][] | [number, number, number][]
		transparent?: boolean
		transparentIndex?: number
		delay?: number
		repeat?: number
		colorDepth?: number
		dispose?: number
	}

	export interface GIFEncoderInstance {
		writeFrame(
			indexedPixels: Uint8Array,
			width: number,
			height: number,
			options?: GIFEncoderWriteFrameOptions
		): void
		finish(): void
		bytes(): Uint8Array
	}

	export function GIFEncoder(options?: {
		initialCapacity?: number
		auto?: boolean
	}): GIFEncoderInstance
}

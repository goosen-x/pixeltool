declare module 'utif' {
	export interface IFD {
		width?: number
		height?: number
		[tag: string]: unknown
	}

	export function decode(buffer: ArrayBuffer | Uint8Array): IFD[]
	export function decodeImage(
		buffer: ArrayBuffer | Uint8Array,
		ifd: IFD,
		ifds?: IFD[]
	): void
	export function toRGBA8(ifd: IFD): Uint8Array
	export function encodeImage(
		rgba: ArrayBuffer | Uint8Array,
		width: number,
		height: number,
		metadata?: Record<string, unknown>
	): ArrayBuffer
}

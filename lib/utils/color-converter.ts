// Color conversion utilities

export interface RGB {
	r: number
	g: number
	b: number
}

export interface RGBA extends RGB {
	a: number
}

export interface HSL {
	h: number
	s: number
	l: number
}

export interface HSLA extends HSL {
	a: number
}

export interface HSB {
	h: number
	s: number
	b: number
}

export interface CMYK {
	c: number
	m: number
	y: number
	k: number
}

export interface XYZ {
	x: number
	y: number
	z: number
}

export interface LAB {
	l: number
	a: number
	b: number
}

// HEX to RGB
export function hexToRgb(hex: string): RGB | null {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	if (!result) {
		// Try 3-digit hex
		const shortResult = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex)
		if (!shortResult) return null
		return {
			r: parseInt(shortResult[1] + shortResult[1], 16),
			g: parseInt(shortResult[2] + shortResult[2], 16),
			b: parseInt(shortResult[3] + shortResult[3], 16)
		}
	}
	return {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	}
}

// RGB to HEX
export function rgbToHex(rgb: RGB): string {
	const toHex = (n: number) => {
		const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
		return hex.length === 1 ? '0' + hex : hex
	}
	return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

// RGB to HSL
export function rgbToHsl(rgb: RGB): HSL {
	const r = rgb.r / 255
	const g = rgb.g / 255
	const b = rgb.b / 255

	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	let h = 0
	let s = 0
	const l = (max + min) / 2

	if (max !== min) {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6
				break
			case g:
				h = ((b - r) / d + 2) / 6
				break
			case b:
				h = ((r - g) / d + 4) / 6
				break
		}
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100)
	}
}

// HSL to RGB
export function hslToRgb(hsl: HSL): RGB {
	const h = hsl.h / 360
	const s = hsl.s / 100
	const l = hsl.l / 100

	let r, g, b

	if (s === 0) {
		r = g = b = l
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1
			if (t > 1) t -= 1
			if (t < 1 / 6) return p + (q - p) * 6 * t
			if (t < 1 / 2) return q
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
			return p
		}

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s
		const p = 2 * l - q
		r = hue2rgb(p, q, h + 1 / 3)
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h - 1 / 3)
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	}
}

// RGB to HSB/HSV
export function rgbToHsb(rgb: RGB): HSB {
	const r = rgb.r / 255
	const g = rgb.g / 255
	const b = rgb.b / 255

	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	const d = max - min
	let h = 0
	const s = max === 0 ? 0 : d / max
	const v = max

	if (max !== min) {
		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6
				break
			case g:
				h = ((b - r) / d + 2) / 6
				break
			case b:
				h = ((r - g) / d + 4) / 6
				break
		}
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		b: Math.round(v * 100)
	}
}

// RGB to CMYK
export function rgbToCmyk(rgb: RGB): CMYK {
	const r = rgb.r / 255
	const g = rgb.g / 255
	const b = rgb.b / 255

	const k = 1 - Math.max(r, g, b)
	const c = (1 - r - k) / (1 - k) || 0
	const m = (1 - g - k) / (1 - k) || 0
	const y = (1 - b - k) / (1 - k) || 0

	return {
		c: Math.round(c * 100),
		m: Math.round(m * 100),
		y: Math.round(y * 100),
		k: Math.round(k * 100)
	}
}

// CMYK to RGB
export function cmykToRgb(cmyk: CMYK): RGB {
	const c = cmyk.c / 100
	const m = cmyk.m / 100
	const y = cmyk.y / 100
	const k = cmyk.k / 100

	const r = 255 * (1 - c) * (1 - k)
	const g = 255 * (1 - m) * (1 - k)
	const b = 255 * (1 - y) * (1 - k)

	return {
		r: Math.round(r),
		g: Math.round(g),
		b: Math.round(b)
	}
}

// RGB to XYZ
export function rgbToXyz(rgb: RGB): XYZ {
	let r = rgb.r / 255
	let g = rgb.g / 255
	let b = rgb.b / 255

	// Apply gamma correction
	r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
	g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
	b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

	// Observer = 2°, Illuminant = D65
	const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375
	const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175
	const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041

	return {
		x: x * 100,
		y: y * 100,
		z: z * 100
	}
}

// XYZ to RGB
export function xyzToRgb(xyz: XYZ): RGB {
	const x = xyz.x / 100
	const y = xyz.y / 100
	const z = xyz.z / 100

	// Observer = 2°, Illuminant = D65
	let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314
	let g = x * -0.969266 + y * 1.8760108 + z * 0.041556
	let b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252

	// Apply gamma correction
	r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : r * 12.92
	g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : g * 12.92
	b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : b * 12.92

	return {
		r: Math.round(Math.max(0, Math.min(255, r * 255))),
		g: Math.round(Math.max(0, Math.min(255, g * 255))),
		b: Math.round(Math.max(0, Math.min(255, b * 255)))
	}
}

// XYZ to LAB
export function xyzToLab(xyz: XYZ): LAB {
	// Observer = 2°, Illuminant = D65
	let x = xyz.x / 95.047
	let y = xyz.y / 100.0
	let z = xyz.z / 108.883

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116

	const l = 116 * y - 16
	const a = 500 * (x - y)
	const b = 200 * (y - z)

	return {
		l: Math.round(l),
		a: Math.round(a),
		b: Math.round(b)
	}
}

// LAB to XYZ
export function labToXyz(lab: LAB): XYZ {
	let y = (lab.l + 16) / 116
	let x = lab.a / 500 + y
	let z = y - lab.b / 200

	const x3 = Math.pow(x, 3)
	const y3 = Math.pow(y, 3)
	const z3 = Math.pow(z, 3)

	x = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787
	y = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787
	z = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787

	// Observer = 2°, Illuminant = D65
	return {
		x: x * 95.047,
		y: y * 100.0,
		z: z * 108.883
	}
}

// Convenience functions
export function rgbToLab(rgb: RGB): LAB {
	return xyzToLab(rgbToXyz(rgb))
}

export function labToRgb(lab: LAB): RGB {
	return xyzToRgb(labToXyz(lab))
}

// RGBA to RGB with background
export function rgbaToRgb(rgba: RGBA, background: RGB): RGB {
	const alpha = rgba.a
	return {
		r: Math.round(rgba.r * alpha + background.r * (1 - alpha)),
		g: Math.round(rgba.g * alpha + background.g * (1 - alpha)),
		b: Math.round(rgba.b * alpha + background.b * (1 - alpha))
	}
}

// Get websafe color
export function getWebsafeColor(hex: string): string {
	const rgb = hexToRgb(hex)
	if (!rgb) return '#000'

	const toWebsafe = (value: number) => {
		const websafeValues = [0, 51, 102, 153, 204, 255]
		return websafeValues.reduce((prev, curr) =>
			Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
		)
	}

	return rgbToHex({
		r: toWebsafe(rgb.r),
		g: toWebsafe(rgb.g),
		b: toWebsafe(rgb.b)
	})
}

// Format functions
export function formatRgb(rgb: RGB, precision?: number): string {
	return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

export function formatRgba(rgba: RGBA, precision?: number): string {
	const a = precision !== undefined ? rgba.a.toFixed(precision) : rgba.a
	return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${a})`
}

export function formatRgbPercent(rgb: RGB, precision?: number): string {
	const p = precision ?? 0
	return `rgb(${((rgb.r / 255) * 100).toFixed(p)}%, ${((rgb.g / 255) * 100).toFixed(p)}%, ${((rgb.b / 255) * 100).toFixed(p)}%)`
}

export function formatRgbaPercent(rgba: RGBA, precision?: number): string {
	const p = precision ?? 0
	const a = precision !== undefined ? rgba.a.toFixed(precision) : rgba.a
	return `rgba(${((rgba.r / 255) * 100).toFixed(p)}%, ${((rgba.g / 255) * 100).toFixed(p)}%, ${((rgba.b / 255) * 100).toFixed(p)}%, ${a})`
}

export function formatHsl(hsl: HSL, precision?: number): string {
	return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
}

export function formatHsla(hsla: HSLA, precision?: number): string {
	const a = precision !== undefined ? hsla.a.toFixed(precision) : hsla.a
	return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${a})`
}

export function formatCmyk(cmyk: CMYK, precision?: number): string {
	return `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`
}

export function formatHsb(hsb: HSB, precision?: number): string {
	return `${hsb.h}, ${hsb.s}%, ${hsb.b}%`
}

export function formatXyz(xyz: XYZ, precision?: number): string {
	const p = precision ?? 0
	return `${xyz.x.toFixed(p)}, ${xyz.y.toFixed(p)}, ${xyz.z.toFixed(p)}`
}

export function formatLab(lab: LAB, precision?: number): string {
	const p = precision ?? 0
	return `${lab.l.toFixed(p)}, ${lab.a.toFixed(p)}, ${lab.b.toFixed(p)}`
}

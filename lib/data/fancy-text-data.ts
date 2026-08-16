export interface FontStyle {
	name: string
	description: string
	convert: (text: string) => string
}

export interface FontStyles {
	[key: string]: FontStyle
}

// Character mappings for different font styles
export const fontStyles: FontStyles = {
	outlined: {
		name: 'Outlined',
		description: 'Hollow style font, perfect for headers',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '𝔸',
				B: '𝔹',
				C: 'ℂ',
				D: '𝔻',
				E: '𝔼',
				F: '𝔽',
				G: '𝔾',
				H: 'ℍ',
				I: '𝕀',
				J: '𝕁',
				K: '𝕂',
				L: '𝕃',
				M: '𝕄',
				N: 'ℕ',
				O: '𝕆',
				P: 'ℙ',
				Q: 'ℚ',
				R: 'ℝ',
				S: '𝕊',
				T: '𝕋',
				U: '𝕌',
				V: '𝕍',
				W: '𝕎',
				X: '𝕏',
				Y: '𝕐',
				Z: 'ℤ',
				a: '𝕒',
				b: '𝕓',
				c: '𝕔',
				d: '𝕕',
				e: '𝕖',
				f: '𝕗',
				g: '𝕘',
				h: '𝕙',
				i: '𝕚',
				j: '𝕛',
				k: '𝕜',
				l: '𝕝',
				m: '𝕞',
				n: '𝕟',
				o: '𝕠',
				p: '𝕡',
				q: '𝕢',
				r: '𝕣',
				s: '𝕤',
				t: '𝕥',
				u: '𝕦',
				v: '𝕧',
				w: '𝕨',
				x: '𝕩',
				y: '𝕪',
				z: '𝕫',
				'0': '𝟘',
				'1': '𝟙',
				'2': '𝟚',
				'3': '𝟛',
				'4': '𝟜',
				'5': '𝟝',
				'6': '𝟞',
				'7': '𝟟',
				'8': '𝟠',
				'9': '𝟡'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},

	smallCaps: {
		name: 'Small Caps',
		description:
			'Elegant text where lowercase letters appear as small capitals',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				a: 'ᴀ',
				b: 'ʙ',
				c: 'ᴄ',
				d: 'ᴅ',
				e: 'ᴇ',
				f: 'ғ',
				g: 'ɢ',
				h: 'ʜ',
				i: 'ɪ',
				j: 'ᴊ',
				k: 'ᴋ',
				l: 'ʟ',
				m: 'ᴍ',
				n: 'ɴ',
				o: 'ᴏ',
				p: 'ᴘ',
				q: 'ǫ',
				r: 'ʀ',
				s: 's',
				t: 'ᴛ',
				u: 'ᴜ',
				v: 'ᴠ',
				w: 'ᴡ',
				x: 'x',
				y: 'ʏ',
				z: 'ᴢ'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},

	bubble: {
		name: 'Bubble Text',
		description: 'Circular bubble-like characters',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: 'Ⓐ',
				B: 'Ⓑ',
				C: 'Ⓒ',
				D: 'Ⓓ',
				E: 'Ⓔ',
				F: 'Ⓕ',
				G: 'Ⓖ',
				H: 'Ⓗ',
				I: 'Ⓘ',
				J: 'Ⓙ',
				K: 'Ⓚ',
				L: 'Ⓛ',
				M: 'Ⓜ',
				N: 'Ⓝ',
				O: 'Ⓞ',
				P: 'Ⓟ',
				Q: 'Ⓠ',
				R: 'Ⓡ',
				S: 'Ⓢ',
				T: 'Ⓣ',
				U: 'Ⓤ',
				V: 'Ⓥ',
				W: 'Ⓦ',
				X: 'Ⓧ',
				Y: 'Ⓨ',
				Z: 'Ⓩ',
				a: 'ⓐ',
				b: 'ⓑ',
				c: 'ⓒ',
				d: 'ⓓ',
				e: 'ⓔ',
				f: 'ⓕ',
				g: 'ⓖ',
				h: 'ⓗ',
				i: 'ⓘ',
				j: 'ⓙ',
				k: 'ⓚ',
				l: 'ⓛ',
				m: 'ⓜ',
				n: 'ⓝ',
				o: 'ⓞ',
				p: 'ⓟ',
				q: 'ⓠ',
				r: 'ⓡ',
				s: 'ⓢ',
				t: 'ⓣ',
				u: 'ⓤ',
				v: 'ⓥ',
				w: 'ⓦ',
				x: 'ⓧ',
				y: 'ⓨ',
				z: 'ⓩ',
				'0': '⓪',
				'1': '①',
				'2': '②',
				'3': '③',
				'4': '④',
				'5': '⑤',
				'6': '⑥',
				'7': '⑦',
				'8': '⑧',
				'9': '⑨'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},

	square: {
		name: 'Square Text',
		description: 'Squared characters for modern look',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '🄰',
				B: '🄱',
				C: '🄲',
				D: '🄳',
				E: '🄴',
				F: '🄵',
				G: '🄶',
				H: '🄷',
				I: '🄸',
				J: '🄹',
				K: '🄺',
				L: '🄻',
				M: '🄼',
				N: '🄽',
				O: '🄾',
				P: '🄿',
				Q: '🅀',
				R: '🅁',
				S: '🅂',
				T: '🅃',
				U: '🅄',
				V: '🅅',
				W: '🅆',
				X: '🅇',
				Y: '🅈',
				Z: '🅉',
				a: '🄰',
				b: '🄱',
				c: '🄲',
				d: '🄳',
				e: '🄴',
				f: '🄵',
				g: '🄶',
				h: '🄷',
				i: '🄸',
				j: '🄹',
				k: '🄺',
				l: '🄻',
				m: '🄼',
				n: '🄽',
				o: '🄾',
				p: '🄿',
				q: '🅀',
				r: '🅁',
				s: '🅂',
				t: '🅃',
				u: '🅄',
				v: '🅅',
				w: '🅆',
				x: '🅇',
				y: '🅈',
				z: '🅉'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},

	bold: {
		name: 'Bold',
		description: 'Bold mathematical alphanumeric symbols',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '𝐀',
				B: '𝐁',
				C: '𝐂',
				D: '𝐃',
				E: '𝐄',
				F: '𝐅',
				G: '𝐆',
				H: '𝐇',
				I: '𝐈',
				J: '𝐉',
				K: '𝐊',
				L: '𝐋',
				M: '𝐌',
				N: '𝐍',
				O: '𝐎',
				P: '𝐏',
				Q: '𝐐',
				R: '𝐑',
				S: '𝐒',
				T: '𝐓',
				U: '𝐔',
				V: '𝐕',
				W: '𝐖',
				X: '𝐗',
				Y: '𝐘',
				Z: '𝐙',
				a: '𝐚',
				b: '𝐛',
				c: '𝐜',
				d: '𝐝',
				e: '𝐞',
				f: '𝐟',
				g: '𝐠',
				h: '𝐡',
				i: '𝐢',
				j: '𝐣',
				k: '𝐤',
				l: '𝐥',
				m: '𝐦',
				n: '𝐧',
				o: '𝐨',
				p: '𝐩',
				q: '𝐪',
				r: '𝐫',
				s: '𝐬',
				t: '𝐭',
				u: '𝐮',
				v: '𝐯',
				w: '𝐰',
				x: '𝐱',
				y: '𝐲',
				z: '𝐳',
				'0': '𝟎',
				'1': '𝟏',
				'2': '𝟐',
				'3': '𝟑',
				'4': '𝟒',
				'5': '𝟓',
				'6': '𝟔',
				'7': '𝟕',
				'8': '𝟖',
				'9': '𝟗'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},

	italic: {
		name: 'Italic',
		description: 'Italic mathematical alphanumeric symbols',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '𝐴',
				B: '𝐵',
				C: '𝐶',
				D: '𝐷',
				E: '𝐸',
				F: '𝐹',
				G: '𝐺',
				H: '𝐻',
				I: '𝐼',
				J: '𝐽',
				K: '𝐾',
				L: '𝐿',
				M: '𝑀',
				N: '𝑁',
				O: '𝑂',
				P: '𝑃',
				Q: '𝑄',
				R: '𝑅',
				S: '𝑆',
				T: '𝑇',
				U: '𝑈',
				V: '𝑉',
				W: '𝑊',
				X: '𝑋',
				Y: '𝑌',
				Z: '𝑍',
				a: '𝑎',
				b: '𝑏',
				c: '𝑐',
				d: '𝑑',
				e: '𝑒',
				f: '𝑓',
				g: '𝑔',
				h: 'ℎ',
				i: '𝑖',
				j: '𝑗',
				k: '𝑘',
				l: '𝑙',
				m: '𝑚',
				n: '𝑛',
				o: '𝑜',
				p: '𝑝',
				q: '𝑞',
				r: '𝑟',
				s: '𝑠',
				t: '𝑡',
				u: '𝑢',
				v: '𝑣',
				w: '𝑤',
				x: '𝑥',
				y: '𝑦',
				z: '𝑧'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},

	boldItalic: {
		name: 'Bold Italic',
		description: 'Bold italic mathematical alphanumeric symbols',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '𝑨',
				B: '𝑩',
				C: '𝑪',
				D: '𝑫',
				E: '𝑬',
				F: '𝑭',
				G: '𝑮',
				H: '𝑯',
				I: '𝑰',
				J: '𝑱',
				K: '𝑲',
				L: '𝑳',
				M: '𝑴',
				N: '𝑵',
				O: '𝑶',
				P: '𝑷',
				Q: '𝑸',
				R: '𝑹',
				S: '𝑺',
				T: '𝑻',
				U: '𝑼',
				V: '𝑽',
				W: '𝑾',
				X: '𝑿',
				Y: '𝒀',
				Z: '𝒁',
				a: '𝒂',
				b: '𝒃',
				c: '𝒄',
				d: '𝒅',
				e: '𝒆',
				f: '𝒇',
				g: '𝒈',
				h: '𝒉',
				i: '𝒊',
				j: '𝒋',
				k: '𝒌',
				l: '𝒍',
				m: '𝒎',
				n: '𝒏',
				o: '𝒐',
				p: '𝒑',
				q: '𝒒',
				r: '𝒓',
				s: '𝒔',
				t: '𝒕',
				u: '𝒖',
				v: '𝒗',
				w: '𝒘',
				x: '𝒙',
				y: '𝒚',
				z: '𝒛'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},

	monospace: {
		name: 'Monospace',
		description: 'Monospace mathematical alphanumeric symbols',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '𝙰',
				B: '𝙱',
				C: '𝙲',
				D: '𝙳',
				E: '𝙴',
				F: '𝙵',
				G: '𝙶',
				H: '𝙷',
				I: '𝙸',
				J: '𝙹',
				K: '𝙺',
				L: '𝙻',
				M: '𝙼',
				N: '𝙽',
				O: '𝙾',
				P: '𝙿',
				Q: '𝚀',
				R: '𝚁',
				S: '𝚂',
				T: '𝚃',
				U: '𝚄',
				V: '𝚅',
				W: '𝚆',
				X: '𝚇',
				Y: '𝚈',
				Z: '𝚉',
				a: '𝚊',
				b: '𝚋',
				c: '𝚌',
				d: '𝚍',
				e: '𝚎',
				f: '𝚏',
				g: '𝚐',
				h: '𝚑',
				i: '𝚒',
				j: '𝚓',
				k: '𝚔',
				l: '𝚕',
				m: '𝚖',
				n: '𝚗',
				o: '𝚘',
				p: '𝚙',
				q: '𝚚',
				r: '𝚛',
				s: '𝚜',
				t: '𝚝',
				u: '𝚞',
				v: '𝚟',
				w: '𝚠',
				x: '𝚡',
				y: '𝚢',
				z: '𝚣',
				'0': '𝟶',
				'1': '𝟷',
				'2': '𝟸',
				'3': '𝟹',
				'4': '𝟺',
				'5': '𝟻',
				'6': '𝟼',
				'7': '𝟽',
				'8': '𝟾',
				'9': '𝟿'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},

	script: {
		name: 'Script',
		description: 'Script mathematical alphanumeric symbols',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '𝒜',
				B: 'ℬ',
				C: '𝒞',
				D: '𝒟',
				E: 'ℰ',
				F: 'ℱ',
				G: '𝒢',
				H: 'ℋ',
				I: 'ℐ',
				J: '𝒥',
				K: '𝒦',
				L: 'ℒ',
				M: 'ℳ',
				N: '𝒩',
				O: '𝒪',
				P: '𝒫',
				Q: '𝒬',
				R: 'ℛ',
				S: '𝒮',
				T: '𝒯',
				U: '𝒰',
				V: '𝒱',
				W: '𝒲',
				X: '𝒳',
				Y: '𝒴',
				Z: '𝒵',
				a: '𝒶',
				b: '𝒷',
				c: '𝒸',
				d: '𝒹',
				e: 'ℯ',
				f: '𝒻',
				g: 'ℊ',
				h: '𝒽',
				i: '𝒾',
				j: '𝒿',
				k: '𝓀',
				l: '𝓁',
				m: '𝓂',
				n: '𝓃',
				o: 'ℴ',
				p: '𝓅',
				q: '𝓆',
				r: '𝓇',
				s: '𝓈',
				t: '𝓉',
				u: '𝓊',
				v: '𝓋',
				w: '𝓌',
				x: '𝓍',
				y: '𝓎',
				z: '𝓏'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},

	fraktur: {
		name: 'Fraktur',
		description: 'Fraktur mathematical alphanumeric symbols',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '𝔄',
				B: '𝔅',
				C: 'ℭ',
				D: '𝔇',
				E: '𝔈',
				F: '𝔉',
				G: '𝔊',
				H: 'ℌ',
				I: 'ℑ',
				J: '𝔍',
				K: '𝔎',
				L: '𝔏',
				M: '𝔐',
				N: '𝔑',
				O: '𝔒',
				P: '𝔓',
				Q: '𝔔',
				R: 'ℜ',
				S: '𝔖',
				T: '𝔗',
				U: '𝔘',
				V: '𝔙',
				W: '𝔚',
				X: '𝔛',
				Y: '𝔜',
				Z: 'ℨ',
				a: '𝔞',
				b: '𝔟',
				c: '𝔠',
				d: '𝔡',
				e: '𝔢',
				f: '𝔣',
				g: '𝔤',
				h: '𝔥',
				i: '𝔦',
				j: '𝔧',
				k: '𝔨',
				l: '𝔩',
				m: '𝔪',
				n: '𝔫',
				o: '𝔬',
				p: '𝔭',
				q: '𝔮',
				r: '𝔯',
				s: '𝔰',
				t: '𝔱',
				u: '𝔲',
				v: '𝔳',
				w: '𝔴',
				x: '𝔵',
				y: '𝔶',
				z: '𝔷'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},

	upsideDown: {
		name: 'Upside Down',
		description: 'Upside down text effect',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '∀',
				B: 'ᗺ',
				C: 'Ɔ',
				D: 'ᗡ',
				E: 'Ǝ',
				F: 'ᖴ',
				G: 'פ',
				H: 'H',
				I: 'I',
				J: 'ſ',
				K: 'ʞ',
				L: '˥',
				M: 'W',
				N: 'N',
				O: 'O',
				P: 'Ԁ',
				Q: 'Q',
				R: 'ᴚ',
				S: 'S',
				T: '┴',
				U: '∩',
				V: 'Λ',
				W: 'M',
				X: 'X',
				Y: '⅄',
				Z: 'Z',
				a: 'ɐ',
				b: 'q',
				c: 'ɔ',
				d: 'p',
				e: 'ǝ',
				f: 'ɟ',
				g: 'ƃ',
				h: 'ɥ',
				i: 'ᴉ',
				j: 'ɾ',
				k: 'ʞ',
				l: 'l',
				m: 'ɯ',
				n: 'u',
				o: 'o',
				p: 'd',
				q: 'b',
				r: 'ɹ',
				s: 's',
				t: 'ʇ',
				u: 'n',
				v: 'ʌ',
				w: 'ʍ',
				x: 'x',
				y: 'ʎ',
				z: 'z',
				'0': '0',
				'1': 'Ɩ',
				'2': 'ᄅ',
				'3': 'Ɛ',
				'4': 'ㄣ',
				'5': 'ϛ',
				'6': '9',
				'7': 'ㄥ',
				'8': '8',
				'9': '6',
				'?': '¿',
				'!': '¡',
				'.': '˙',
				',': "'",
				"'": ',',
				'"': '„',
				'(': ')',
				')': '(',
				'[': ']',
				']': '[',
				'{': '}',
				'}': '{'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.reverse()
				.join('')
		}
	},

	superscript: {
		name: 'Superscript',
		description: 'Superscript characters',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				a: 'ᵃ',
				b: 'ᵇ',
				c: 'ᶜ',
				d: 'ᵈ',
				e: 'ᵉ',
				f: 'ᶠ',
				g: 'ᵍ',
				h: 'ʰ',
				i: 'ⁱ',
				j: 'ʲ',
				k: 'ᵏ',
				l: 'ˡ',
				m: 'ᵐ',
				n: 'ⁿ',
				o: 'ᵒ',
				p: 'ᵖ',
				r: 'ʳ',
				s: 'ˢ',
				t: 'ᵗ',
				u: 'ᵘ',
				v: 'ᵛ',
				w: 'ʷ',
				x: 'ˣ',
				y: 'ʸ',
				z: 'ᶻ',
				A: 'ᴬ',
				B: 'ᴮ',
				D: 'ᴰ',
				E: 'ᴱ',
				G: 'ᴳ',
				H: 'ᴴ',
				I: 'ᴵ',
				J: 'ᴶ',
				K: 'ᴷ',
				L: 'ᴸ',
				M: 'ᴹ',
				N: 'ᴺ',
				O: 'ᴼ',
				P: 'ᴾ',
				R: 'ᴿ',
				T: 'ᵀ',
				U: 'ᵁ',
				V: 'ⱽ',
				W: 'ᵂ',
				'0': '⁰',
				'1': '¹',
				'2': '²',
				'3': '³',
				'4': '⁴',
				'5': '⁵',
				'6': '⁶',
				'7': '⁷',
				'8': '⁸',
				'9': '⁹',
				'+': '⁺',
				'-': '⁻',
				'=': '⁼',
				'(': '⁽',
				')': '⁾'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},

	strikethrough: {
		name: 'Strikethrough',
		description: 'Зачёркнутый текст — работает в Telegram, VK и большинстве чатов',
		// Комбинирующий символ U+0336 (COMBINING LONG STROKE OVERLAY) рисует
		// черту через предыдущий символ — таблица соответствий тут не нужна,
		// приём работает на любом алфавите и знаках препинания. Ставится
		// после каждого символа, а не через join — иначе первый символ
		// остаётся без черты.
		convert: (text: string) =>
			text
				.split('')
				.map(char => char + '̶')
				.join('')
	}
}

// Zalgo text generation
const zalgoChars = {
	up: [
		'\u030d',
		'\u030e',
		'\u0304',
		'\u0305',
		'\u033f',
		'\u0311',
		'\u0306',
		'\u0310',
		'\u0352',
		'\u0357',
		'\u0351',
		'\u0307',
		'\u0308',
		'\u030a',
		'\u0342',
		'\u0343',
		'\u0344',
		'\u034a',
		'\u034b',
		'\u034c',
		'\u0303',
		'\u0302',
		'\u030c',
		'\u0350',
		'\u0300',
		'\u0301',
		'\u030b',
		'\u030f',
		'\u0312',
		'\u0313',
		'\u0314',
		'\u033d',
		'\u0309',
		'\u0363',
		'\u0364',
		'\u0365',
		'\u0366',
		'\u0367',
		'\u0368',
		'\u0369',
		'\u036a',
		'\u036b',
		'\u036c',
		'\u036d',
		'\u036e',
		'\u036f',
		'\u033e',
		'\u035b'
	],
	middle: [
		'\u0315',
		'\u031b',
		'\u0340',
		'\u0341',
		'\u0358',
		'\u0321',
		'\u0322',
		'\u0327',
		'\u0328',
		'\u0334',
		'\u0335',
		'\u0336',
		'\u034f',
		'\u035c',
		'\u035d',
		'\u035e',
		'\u035f',
		'\u0360',
		'\u0362',
		'\u0338',
		'\u0337',
		'\u0361',
		'\u0489'
	],
	down: [
		'\u0316',
		'\u0317',
		'\u0318',
		'\u0319',
		'\u031c',
		'\u031d',
		'\u031e',
		'\u031f',
		'\u0320',
		'\u0324',
		'\u0325',
		'\u0326',
		'\u0329',
		'\u032a',
		'\u032b',
		'\u032c',
		'\u032d',
		'\u032e',
		'\u032f',
		'\u0330',
		'\u0331',
		'\u0332',
		'\u0333',
		'\u0339',
		'\u033a',
		'\u033b',
		'\u033c',
		'\u0345',
		'\u0347',
		'\u0348',
		'\u0349',
		'\u034d',
		'\u034e',
		'\u0353',
		'\u0354',
		'\u0355',
		'\u0356',
		'\u0359',
		'\u035a',
		'\u0323'
	]
}

export function generateZalgoText(text: string, intensity: number): string {
	const intensityFactor = Math.max(1, Math.floor(intensity / 10))

	return text
		.split('')
		.map(char => {
			if (char === ' ' || char === '\n') return char

			let zalgoChar = char

			// Add combining characters based on intensity
			for (let i = 0; i < intensityFactor; i++) {
				if (Math.random() < 0.7) {
					const upChar =
						zalgoChars.up[Math.floor(Math.random() * zalgoChars.up.length)]
					zalgoChar += upChar
				}

				if (Math.random() < 0.5) {
					const middleChar =
						zalgoChars.middle[
							Math.floor(Math.random() * zalgoChars.middle.length)
						]
					zalgoChar += middleChar
				}

				if (Math.random() < 0.7) {
					const downChar =
						zalgoChars.down[Math.floor(Math.random() * zalgoChars.down.length)]
					zalgoChar += downChar
				}
			}

			return zalgoChar
		})
		.join('')
}

// Default example texts for different styles
export const exampleTexts = [
	'Hello World',
	'Lorem ipsum',
	'Sample Text',
	'Fancy Style',
	'Beautiful Text',
	'Typography',
	'Creative Design',
	'Modern Look'
]

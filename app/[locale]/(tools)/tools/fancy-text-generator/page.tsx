'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Type, Skull, Minus, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Font styles with their character mappings
const fontStyles = {
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
				.map(char => {
					const lower = char.toLowerCase()
					return char === lower ? map[lower] || char : char
				})
				.join('')
		}
	},
	bubble: {
		name: 'Bubble Text',
		description: 'Fun, round letters in bubble style',
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
		description: 'Bold and geometric text with modern emphasis',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '🅰',
				B: '🅱',
				C: '🅲',
				D: '🅳',
				E: '🅴',
				F: '🅵',
				G: '🅶',
				H: '🅷',
				I: '🅸',
				J: '🅹',
				K: '🅺',
				L: '🅻',
				M: '🅼',
				N: '🅽',
				O: '🅾',
				P: '🅿',
				Q: '🆀',
				R: '🆁',
				S: '🆂',
				T: '🆃',
				U: '🆄',
				V: '🆅',
				W: '🆆',
				X: '🆇',
				Y: '🆈',
				Z: '🆉'
			}
			return text
				.split('')
				.map(char => map[char.toUpperCase()] || char)
				.join('')
		}
	},
	bold: {
		name: 'Bold',
		description: 'Bold text for emphasis',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '𝗔',
				B: '𝗕',
				C: '𝗖',
				D: '𝗗',
				E: '𝗘',
				F: '𝗙',
				G: '𝗚',
				H: '𝗛',
				I: '𝗜',
				J: '𝗝',
				K: '𝗞',
				L: '𝗟',
				M: '𝗠',
				N: '𝗡',
				O: '𝗢',
				P: '𝗣',
				Q: '𝗤',
				R: '𝗥',
				S: '𝗦',
				T: '𝗧',
				U: '𝗨',
				V: '𝗩',
				W: '𝗪',
				X: '𝗫',
				Y: '𝗬',
				Z: '𝗭',
				a: '𝗮',
				b: '𝗯',
				c: '𝗰',
				d: '𝗱',
				e: '𝗲',
				f: '𝗳',
				g: '𝗴',
				h: '𝗵',
				i: '𝗶',
				j: '𝗷',
				k: '𝗸',
				l: '𝗹',
				m: '𝗺',
				n: '𝗻',
				o: '𝗼',
				p: '𝗽',
				q: '𝗾',
				r: '𝗿',
				s: '𝘀',
				t: '𝘁',
				u: '𝘂',
				v: '𝘃',
				w: '𝘄',
				x: '𝘅',
				y: '𝘆',
				z: '𝘇',
				'0': '𝟬',
				'1': '𝟭',
				'2': '𝟮',
				'3': '𝟯',
				'4': '𝟰',
				'5': '𝟱',
				'6': '𝟲',
				'7': '𝟳',
				'8': '𝟴',
				'9': '𝟵'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},
	italic: {
		name: 'Italic',
		description: 'Slanted text for style',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '𝘈',
				B: '𝘉',
				C: '𝘊',
				D: '𝘋',
				E: '𝘌',
				F: '𝘍',
				G: '𝘎',
				H: '𝘏',
				I: '𝘐',
				J: '𝘑',
				K: '𝘒',
				L: '𝘓',
				M: '𝘔',
				N: '𝘕',
				O: '𝘖',
				P: '𝘗',
				Q: '𝘘',
				R: '𝘙',
				S: '𝘚',
				T: '𝘛',
				U: '𝘜',
				V: '𝘝',
				W: '𝘞',
				X: '𝘟',
				Y: '𝘠',
				Z: '𝘡',
				a: '𝘢',
				b: '𝘣',
				c: '𝘤',
				d: '𝘥',
				e: '𝘦',
				f: '𝘧',
				g: '𝘨',
				h: '𝘩',
				i: '𝘪',
				j: '𝘫',
				k: '𝘬',
				l: '𝘭',
				m: '𝘮',
				n: '𝘯',
				o: '𝘰',
				p: '𝘱',
				q: '𝘲',
				r: '𝘳',
				s: '𝘴',
				t: '𝘵',
				u: '𝘶',
				v: '𝘷',
				w: '𝘸',
				x: '𝘹',
				y: '𝘺',
				z: '𝘻'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},
	boldItalic: {
		name: 'Bold Italic',
		description: 'Combined bold and italic style',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '𝙄',
				B: '𝙅',
				C: '𝙆',
				D: '𝙇',
				E: '𝙈',
				F: '𝙉',
				G: '𝙊',
				H: '𝙋',
				I: '𝙌',
				J: '𝙍',
				K: '𝙎',
				L: '𝙏',
				M: '𝙐',
				N: '𝙑',
				O: '𝙒',
				P: '𝙓',
				Q: '𝙔',
				R: '𝙕',
				S: '𝙖',
				T: '𝙗',
				U: '𝙘',
				V: '𝙙',
				W: '𝙚',
				X: '𝙛',
				Y: '𝙜',
				Z: '𝙝',
				a: '𝙖',
				b: '𝙗',
				c: '𝙘',
				d: '𝙙',
				e: '𝙚',
				f: '𝙛',
				g: '𝙜',
				h: '𝙝',
				i: '𝙞',
				j: '𝙟',
				k: '𝙠',
				l: '𝙡',
				m: '𝙢',
				n: '𝙣',
				o: '𝙤',
				p: '𝙥',
				q: '𝙦',
				r: '𝙧',
				s: '𝙨',
				t: '𝙩',
				u: '𝙪',
				v: '𝙫',
				w: '𝙬',
				x: '𝙭',
				y: '𝙮',
				z: '𝙯'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},
	monospace: {
		name: 'Monospace',
		description: 'Fixed-width typewriter style',
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
		description: 'Handwriting style text for elegant designs',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '𝓐',
				B: '𝓑',
				C: '𝓒',
				D: '𝓓',
				E: '𝓔',
				F: '𝓕',
				G: '𝓖',
				H: '𝓗',
				I: '𝓘',
				J: '𝓙',
				K: '𝓚',
				L: '𝓛',
				M: '𝓜',
				N: '𝓝',
				O: '𝓞',
				P: '𝓟',
				Q: '𝓠',
				R: '𝓡',
				S: '𝓢',
				T: '𝓣',
				U: '𝓤',
				V: '𝓥',
				W: '𝓦',
				X: '𝓧',
				Y: '𝓨',
				Z: '𝓩',
				a: '𝓪',
				b: '𝓫',
				c: '𝓬',
				d: '𝓭',
				e: '𝓮',
				f: '𝓯',
				g: '𝓰',
				h: '𝓱',
				i: '𝓲',
				j: '𝓳',
				k: '𝓴',
				l: '𝓵',
				m: '𝓶',
				n: '𝓷',
				o: '𝓸',
				p: '𝓹',
				q: '𝓺',
				r: '𝓻',
				s: '𝓼',
				t: '𝓽',
				u: '𝓾',
				v: '𝓿',
				w: '𝔀',
				x: '𝔁',
				y: '𝔂',
				z: '𝔃'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},
	fraktur: {
		name: 'Fraktur',
		description: 'Old English / Gothic style',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '𝕬',
				B: '𝕭',
				C: '𝕮',
				D: '𝕯',
				E: '𝕰',
				F: '𝕱',
				G: '𝕲',
				H: '𝕳',
				I: '𝕴',
				J: '𝕵',
				K: '𝕶',
				L: '𝕷',
				M: '𝕸',
				N: '𝕹',
				O: '𝕺',
				P: '𝕻',
				Q: '𝕼',
				R: '𝕽',
				S: '𝕾',
				T: '𝕿',
				U: '𝖀',
				V: '𝖁',
				W: '𝖂',
				X: '𝖃',
				Y: '𝖄',
				Z: '𝖅',
				a: '𝖆',
				b: '𝖇',
				c: '𝖈',
				d: '𝖉',
				e: '𝖊',
				f: '𝖋',
				g: '𝖌',
				h: '𝖍',
				i: '𝖎',
				j: '𝖏',
				k: '𝖐',
				l: '𝖑',
				m: '𝖒',
				n: '𝖓',
				o: '𝖔',
				p: '𝖕',
				q: '𝖖',
				r: '𝖗',
				s: '𝖘',
				t: '𝖙',
				u: '𝖚',
				v: '𝖛',
				w: '𝖜',
				x: '𝖝',
				y: '𝖞',
				z: '𝖟'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	},
	upsideDown: {
		name: 'Upside Down',
		description: 'Playful, flipped text for unique messages',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: '∀',
				B: 'ᙠ',
				C: 'Ɔ',
				D: 'ᗡ',
				E: 'Ǝ',
				F: 'Ⅎ',
				G: '⅁',
				H: 'H',
				I: 'I',
				J: 'ſ',
				K: 'ʞ',
				L: '˥',
				M: 'W',
				N: 'N',
				O: 'O',
				P: 'Ԁ',
				Q: 'Ό',
				R: 'ᴚ',
				S: 'S',
				T: '⊥',
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
				i: 'ı',
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
				'9': '6'
			}
			return text
				.split('')
				.reverse()
				.map(char => map[char] || char)
				.join('')
		}
	},
	superscript: {
		name: 'Superscript',
		description: 'Raised characters, perfect for mathematical expressions',
		convert: (text: string) => {
			const map: { [key: string]: string } = {
				A: 'ᴬ',
				B: 'ᴮ',
				C: 'ᶜ',
				D: 'ᴰ',
				E: 'ᴱ',
				F: 'ᶠ',
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
				Q: 'Q',
				R: 'ᴿ',
				S: 'ˢ',
				T: 'ᵀ',
				U: 'ᵁ',
				V: 'ⱽ',
				W: 'ᵂ',
				X: 'ˣ',
				Y: 'ʸ',
				Z: 'ᶻ',
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
				q: 'q',
				r: 'ʳ',
				s: 'ˢ',
				t: 'ᵗ',
				u: 'ᵘ',
				v: 'ᵛ',
				w: 'ʷ',
				x: 'ˣ',
				y: 'ʸ',
				z: 'ᶻ',
				'0': '⁰',
				'1': '¹',
				'2': '²',
				'3': '³',
				'4': '⁴',
				'5': '⁵',
				'6': '⁶',
				'7': '⁷',
				'8': '⁸',
				'9': '⁹'
			}
			return text
				.split('')
				.map(char => map[char] || char)
				.join('')
		}
	}
}

// Zalgo text generation
const zalgoMarks = {
	above: [
		'̀',
		'́',
		'̂',
		'̃',
		'̄',
		'̅',
		'̆',
		'̇',
		'̈',
		'̉',
		'̊',
		'̋',
		'̌',
		'̍',
		'̎',
		'̏',
		'̐',
		'̑',
		'̒',
		'̓',
		'̔',
		'̕',
		'̖',
		'̗',
		'̘',
		'̙',
		'̚',
		'̛',
		'̜',
		'̝',
		'̞',
		'̟',
		'̠',
		'̡',
		'̢',
		'̣',
		'̤',
		'̥',
		'̦',
		'̧',
		'̨',
		'̩',
		'̪',
		'̫',
		'̬',
		'̭',
		'̮',
		'̯',
		'̰',
		'̱',
		'̲',
		'̳',
		'̴',
		'̵',
		'̶',
		'̷',
		'̸',
		'̹',
		'̺',
		'̻',
		'̼',
		'̽',
		'̾',
		'̿',
		'̀',
		'́',
		'͂',
		'̓',
		'̈́',
		'ͅ',
		'͆',
		'͇',
		'͈',
		'͉',
		'͊',
		'͋',
		'͌',
		'͍',
		'͎',
		'͏',
		'͐',
		'͑',
		'͒',
		'͓',
		'͔',
		'͕',
		'͖',
		'͗',
		'͘',
		'͙',
		'͚',
		'͛',
		'͜',
		'͝',
		'͞',
		'͟',
		'͠',
		'͡',
		'͢',
		'ͣ',
		'ͤ',
		'ͥ',
		'ͦ',
		'ͧ',
		'ͨ',
		'ͩ',
		'ͪ',
		'ͫ',
		'ͬ',
		'ͭ',
		'ͮ',
		'ͯ'
	],
	below: [
		'̥',
		'̦',
		'̧',
		'̨',
		'̩',
		'̪',
		'̫',
		'̬',
		'̭',
		'̮',
		'̯',
		'̰',
		'̱',
		'̲',
		'̳',
		'̹',
		'̺',
		'̻',
		'̼',
		'ͅ',
		'͇',
		'͈',
		'͉',
		'͍',
		'͎',
		'͓',
		'͔',
		'͕',
		'͖',
		'͙',
		'͚',
		'҉'
	],
	middle: ['̴', '̵', '̶', '̷', '̸', '҈', '҉'],
	// Add some Cyrillic combining marks for extra effect
	cyrillic: ['҇', '҈', '҉']
}

function generateZalgoText(text: string, intensity: number = 50): string {
	// Intensity from 0-100, where 50 is moderate
	const maxMarks = Math.floor((intensity / 100) * 15) // Max 15 marks per character at 100%
	const minMarks = Math.floor((intensity / 100) * 3) // Min 3 marks at 100%

	return text
		.split('')
		.map(char => {
			if (char === ' ' || char === '\n' || char === '\t') return char

			let result = char
			const numMarks =
				Math.floor(Math.random() * (maxMarks - minMarks + 1)) + minMarks

			for (let i = 0; i < numMarks; i++) {
				const markType = Math.random()
				let marks

				if (markType < 0.4) {
					marks = zalgoMarks.above
				} else if (markType < 0.7) {
					marks = zalgoMarks.below
				} else if (markType < 0.9) {
					marks = zalgoMarks.middle
				} else {
					marks = zalgoMarks.cyrillic
				}

				result += marks[Math.floor(Math.random() * marks.length)]
			}

			return result
		})
		.join('')
}

export default function FancyTextGeneratorPage() {
	const [inputText, setInputText] = useState('Lorem ipsum')
	const [copiedStyle, setCopiedStyle] = useState<string | null>(null)
	const [mounted, setMounted] = useState(false)
	const [zalgoIntensity, setZalgoIntensity] = useState(50)
	const [zalgoText, setZalgoText] = useState('')

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		setZalgoText(generateZalgoText(inputText, zalgoIntensity))
	}, [inputText, zalgoIntensity])

	const copyToClipboard = async (text: string, style: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedStyle(style)
			toast.success('Text copied to clipboard')
			setTimeout(() => setCopiedStyle(null), 2000)
		} catch (err) {
			toast.error('Failed to copy text')
		}
	}

	if (!mounted) {
		return (
			<div className='max-w-6xl mx-auto space-y-8'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight mb-2'>
						Fancy Text Generator
					</h1>
					<p className='text-muted-foreground'>
						Transform your text into beautiful Unicode styles
					</p>
				</div>
				<div className='animate-pulse space-y-8'>
					<div className='h-20 bg-muted rounded-lg'></div>
					<div className='h-96 bg-muted rounded-lg'></div>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Input Section */}
			<Card className='p-6'>
				<Label
					htmlFor='text-input'
					className='text-base font-semibold mb-2 block'
				>
					Enter Your Text
				</Label>
				<div className='relative'>
					<Input
						id='text-input'
						type='text'
						value={inputText}
						onChange={e => setInputText(e.target.value)}
						placeholder='Type your text here...'
						className='pr-10 text-lg'
					/>
					<Type className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
				</div>
				<p className='text-sm text-muted-foreground mt-2'>
					Note: Best results with English letters only
				</p>
			</Card>

			{/* Font Styles */}
			<div className='space-y-4'>
				<h2 className='text-xl font-semibold'>Available Styles</h2>
				<div className='grid gap-4'>
					{Object.entries(fontStyles).map(([key, style]) => {
						const convertedText = style.convert(inputText)
						const isCopied = copiedStyle === key

						return (
							<Card key={key} className='p-4 hover:shadow-md transition-shadow'>
								<div className='flex items-start justify-between gap-4'>
									<div className='flex-1 min-w-0'>
										<h3 className='font-semibold text-sm mb-1'>{style.name}</h3>
										<p className='text-xs text-muted-foreground mb-3'>
											{style.description}
										</p>
										<div className='p-3 bg-muted rounded-md'>
											<p className='text-lg break-all font-mono'>
												{convertedText}
											</p>
										</div>
									</div>
									<Button
										variant='outline'
										size='sm'
										onClick={() => copyToClipboard(convertedText, key)}
										className={cn(
											'shrink-0',
											isCopied && 'bg-green-500/10 border-green-500'
										)}
									>
										{isCopied ? (
											<>
												<Check className='w-4 h-4 mr-1' />
												Copied
											</>
										) : (
											<>
												<Copy className='w-4 h-4 mr-1' />
												Copy
											</>
										)}
									</Button>
								</div>
							</Card>
						)
					})}

					{/* Zalgo Text Card */}
					<Card className='p-4 hover:shadow-md transition-shadow border-red-500/20'>
						<div className='flex items-start justify-between gap-4'>
							<div className='flex-1 min-w-0'>
								<div className='flex items-center gap-2 mb-1'>
									<Skull className='w-4 h-4 text-red-500' />
									<h3 className='font-semibold text-sm'>Zalgo Text</h3>
								</div>
								<p className='text-xs text-muted-foreground mb-3'>
									Corrupted, glitchy text for creepy effects
								</p>

								{/* Intensity Control */}
								<div className='mb-3 space-y-2'>
									<div className='flex items-center justify-between'>
										<Label className='text-xs'>Horror Level</Label>
										<span className='text-xs text-muted-foreground'>
											{zalgoIntensity}%
										</span>
									</div>
									<div className='flex items-center gap-2'>
										<Button
											variant='outline'
											size='icon'
											className='h-6 w-6'
											onClick={() =>
												setZalgoIntensity(Math.max(0, zalgoIntensity - 10))
											}
										>
											<Minus className='h-3 w-3' />
										</Button>
										<Slider
											value={[zalgoIntensity]}
											onValueChange={([value]) => setZalgoIntensity(value)}
											max={100}
											step={10}
											className='flex-1'
										/>
										<Button
											variant='outline'
											size='icon'
											className='h-6 w-6'
											onClick={() =>
												setZalgoIntensity(Math.min(100, zalgoIntensity + 10))
											}
										>
											<Plus className='h-3 w-3' />
										</Button>
									</div>
									<Button
										variant='ghost'
										size='sm'
										className='w-full h-7 text-xs'
										onClick={() =>
											setZalgoText(generateZalgoText(inputText, zalgoIntensity))
										}
									>
										Regenerate Zalgo
									</Button>
								</div>

								<div className='p-3 bg-muted rounded-md'>
									<p className='text-lg break-all font-mono'>{zalgoText}</p>
								</div>
							</div>
							<Button
								variant='outline'
								size='sm'
								onClick={() => copyToClipboard(zalgoText, 'zalgo')}
								className={cn(
									'shrink-0',
									copiedStyle === 'zalgo' && 'bg-green-500/10 border-green-500'
								)}
							>
								{copiedStyle === 'zalgo' ? (
									<>
										<Check className='w-4 h-4 mr-1' />
										Copied
									</>
								) : (
									<>
										<Copy className='w-4 h-4 mr-1' />
										Copy
									</>
								)}
							</Button>
						</div>
					</Card>
				</div>
			</div>

			{/* How to Use */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4'>How to Use</h3>
				<ol className='space-y-2 text-sm text-muted-foreground'>
					<li>1. Enter your text in the input field above</li>
					<li>2. Browse through the different font styles</li>
					<li>
						3. For Zalgo text, adjust the horror level slider to control
						intensity
					</li>
					<li>4. Click the Copy button next to your preferred style</li>
					<li>
						5. Paste anywhere — works on VK, Facebook, Instagram, Twitter, and
						more!
					</li>
				</ol>
			</Card>

			{/* What is Zalgo Text */}
			<Card className='p-6 border-red-500/20'>
				<h3 className='font-semibold mb-4 flex items-center gap-2'>
					<Skull className='w-5 h-5 text-red-500' />
					What is Zalgo Text?
				</h3>
				<div className='space-y-3 text-sm text-muted-foreground'>
					<p>
						Zalgo text, also known as &quot;creepy text&quot; or &quot;glitch text&quot;, uses
						combining Unicode characters (U+0300~U+036F range) to create a
						corrupted, chaotic appearance. Named after the creepypasta character
						Zalgo, it represents digital horror and corruption.
					</p>
					<div className='bg-muted/50 p-3 rounded-md font-mono text-xs space-y-1'>
						<div>A + ͛ = A͛</div>
						<div>A + ͛ + ̂ = A͛̂</div>
						<div>A + ͛ + ̂ + ̥ = Ḁ͛̂</div>
						<div>A + ͛ + ̂ + ̥ + ̰ = Ḁ̰͛̂</div>
					</div>
					<p>
						The intensity slider controls how many combining marks are added to
						each character. Higher intensity creates more chaotic and
						&quot;corrupted&quot; text, perfect for horror-themed content or creepypasta
						stories.
					</p>
				</div>
			</Card>

			{/* Why Choose */}
			<Card className='p-6'>
				<h3 className='font-semibold mb-4'>Why Choose Our Font Generator?</h3>
				<div className='grid md:grid-cols-2 gap-4 text-sm'>
					<div>
						<h4 className='font-medium mb-1'>Universal Compatibility</h4>
						<p className='text-muted-foreground'>
							Works on any platform without installing fonts
						</p>
					</div>
					<div>
						<h4 className='font-medium mb-1'>Instant Conversion</h4>
						<p className='text-muted-foreground'>
							See your text transformed in real-time
						</p>
					</div>
					<div>
						<h4 className='font-medium mb-1'>Wide Style Selection</h4>
						<p className='text-muted-foreground'>
							From elegant scripts to creepy Zalgo text
						</p>
					</div>
					<div>
						<h4 className='font-medium mb-1'>Social Media Ready</h4>
						<p className='text-muted-foreground'>
							Perfect for making your posts stand out
						</p>
					</div>
				</div>
			</Card>
		</div>
	)
}

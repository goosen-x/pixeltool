export type CaseType = 
  | 'uppercase'
  | 'lowercase'
  | 'capitalize'
  | 'title'
  | 'sentence'
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'CONSTANT_CASE'
  | 'dot.case'
  | 'path/case'
  | 'Header-Case'
  | 'Train-Case'
  | 'alternating'
  | 'inverse'
  | 'reverse'
  | 'sponge'

export function convertCase(text: string, type: CaseType): string {
  if (!text) return ''
  
  switch (type) {
    case 'uppercase':
      return text.toUpperCase()

    case 'lowercase':
      return text.toLowerCase()

    case 'capitalize':
      return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')

    case 'title':
      const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet']
      return text
        .split(' ')
        .map((word, index) => {
          if (index === 0 || !smallWords.includes(word.toLowerCase())) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          }
          return word.toLowerCase()
        })
        .join(' ')

    case 'sentence':
      return text
        .split('. ')
        .map(sentence => {
          const trimmed = sentence.trim()
          if (trimmed.length === 0) return ''
          return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
        })
        .join('. ')

    case 'camelCase':
      return text
        .split(/[\s_-]+/)
        .map((word, index) => {
          if (index === 0) {
            return word.toLowerCase()
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        })
        .join('')

    case 'PascalCase':
      return text
        .split(/[\s_-]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('')

    case 'snake_case':
      return text
        .trim()
        .replace(/[\s-]+/g, '_')
        .toLowerCase()

    case 'kebab-case':
      return text
        .trim()
        .replace(/[\s_]+/g, '-')
        .toLowerCase()

    case 'CONSTANT_CASE':
      return text
        .trim()
        .replace(/[\s-]+/g, '_')
        .toUpperCase()

    case 'dot.case':
      return text
        .trim()
        .replace(/[\s_-]+/g, '.')
        .toLowerCase()

    case 'path/case':
      return text
        .trim()
        .replace(/[\s_-]+/g, '/')
        .toLowerCase()

    case 'Header-Case':
      return text
        .split(/[\s_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('-')

    case 'Train-Case':
      return text
        .split(/[\s_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('-')

    case 'alternating':
      return text
        .split('')
        .map((char, index) => index % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
        .join('')

    case 'inverse':
      return text
        .split('')
        .map(char => char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase())
        .join('')

    case 'reverse':
      return text.split('').reverse().join('')

    case 'sponge':
      return text
        .split('')
        .map(char => Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase())
        .join('')

    default:
      return text
  }
}

export function getTextStats(text: string) {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      sentences: 0
    }
  }

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim().split(/\s+/).filter(word => word.length > 0).length,
    lines: text.split('\n').length,
    sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  }
}
export type GradientType = 'linear' | 'radial' | 'conic'
export type LinearDirection = 'to top' | 'to bottom' | 'to left' | 'to right' | 'to top left' | 'to top right' | 'to bottom left' | 'to bottom right' | 'custom'
export type RadialShape = 'circle' | 'ellipse'
export type RadialSize = 'closest-side' | 'farthest-side' | 'closest-corner' | 'farthest-corner'

export interface ColorStop {
  id: string
  color: string
  position: number
  opacity: number
}

export interface GradientSettings {
  type: GradientType
  linearDirection: LinearDirection
  linearAngle: number
  radialShape: RadialShape
  radialSize: RadialSize
  radialPositionX: number
  radialPositionY: number
  conicAngle: number
  conicPositionX: number
  conicPositionY: number
  repeating: boolean
  colorStops: ColorStop[]
}

export interface PresetGradient {
  name: string
  category: string
  settings: Partial<GradientSettings>
}

export const PRESET_GRADIENTS: PresetGradient[] = [
  {
    name: 'Закат',
    category: 'nature',
    settings: {
      type: 'linear',
      linearDirection: 'to bottom',
      colorStops: [
        { id: '1', color: '#ff6b6b', position: 0, opacity: 100 },
        { id: '2', color: '#feca57', position: 50, opacity: 100 },
        { id: '3', color: '#48dbfb', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Океан',
    category: 'nature',
    settings: {
      type: 'linear',
      linearDirection: 'to bottom right',
      colorStops: [
        { id: '1', color: '#0575e6', position: 0, opacity: 100 },
        { id: '2', color: '#021b79', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Радуга',
    category: 'nature',
    settings: {
      type: 'linear',
      linearDirection: 'to right',
      colorStops: [
        { id: '1', color: '#ff0000', position: 0, opacity: 100 },
        { id: '2', color: '#ff8800', position: 17, opacity: 100 },
        { id: '3', color: '#ffff00', position: 33, opacity: 100 },
        { id: '4', color: '#00ff00', position: 50, opacity: 100 },
        { id: '5', color: '#00ffff', position: 67, opacity: 100 },
        { id: '6', color: '#0000ff', position: 83, opacity: 100 },
        { id: '7', color: '#ff00ff', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Пламя',
    category: 'effects',
    settings: {
      type: 'radial',
      radialShape: 'ellipse',
      radialSize: 'farthest-corner',
      colorStops: [
        { id: '1', color: '#ffeb3b', position: 0, opacity: 100 },
        { id: '2', color: '#ff9800', position: 40, opacity: 100 },
        { id: '3', color: '#f44336', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Северное сияние',
    category: 'effects',
    settings: {
      type: 'linear',
      linearDirection: 'to top right',
      colorStops: [
        { id: '1', color: '#667eea', position: 0, opacity: 100 },
        { id: '2', color: '#764ba2', position: 50, opacity: 100 },
        { id: '3', color: '#f093fb', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Металлик',
    category: 'material',
    settings: {
      type: 'linear',
      linearDirection: 'to bottom',
      colorStops: [
        { id: '1', color: '#c0c0c0', position: 0, opacity: 100 },
        { id: '2', color: '#ffffff', position: 50, opacity: 100 },
        { id: '3', color: '#c0c0c0', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Стекло',
    category: 'material',
    settings: {
      type: 'linear',
      linearDirection: 'to bottom',
      colorStops: [
        { id: '1', color: '#ffffff', position: 0, opacity: 50 },
        { id: '2', color: '#f0f0f0', position: 100, opacity: 80 }
      ]
    }
  },
  {
    name: 'Золото',
    category: 'material',
    settings: {
      type: 'linear',
      linearDirection: 'to bottom',
      colorStops: [
        { id: '1', color: '#ffd700', position: 0, opacity: 100 },
        { id: '2', color: '#ffb347', position: 50, opacity: 100 },
        { id: '3', color: '#ff8c00', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Медь',
    category: 'material',
    settings: {
      type: 'linear',
      linearDirection: 'to bottom',
      colorStops: [
        { id: '1', color: '#b87333', position: 0, opacity: 100 },
        { id: '2', color: '#daa520', position: 50, opacity: 100 },
        { id: '3', color: '#cd853f', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Неон',
    category: 'effects',
    settings: {
      type: 'linear',
      linearDirection: 'to right',
      colorStops: [
        { id: '1', color: '#00ffff', position: 0, opacity: 100 },
        { id: '2', color: '#ff00ff', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Космос',
    category: 'effects',
    settings: {
      type: 'radial',
      radialShape: 'circle',
      radialSize: 'farthest-corner',
      colorStops: [
        { id: '1', color: '#000000', position: 0, opacity: 100 },
        { id: '2', color: '#1a1a2e', position: 50, opacity: 100 },
        { id: '3', color: '#16213e', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Мятный',
    category: 'cool',
    settings: {
      type: 'linear',
      linearDirection: 'to top',
      colorStops: [
        { id: '1', color: '#00d4aa', position: 0, opacity: 100 },
        { id: '2', color: '#7209b7', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Персиковый',
    category: 'warm',
    settings: {
      type: 'linear',
      linearDirection: 'to right',
      colorStops: [
        { id: '1', color: '#ffccbc', position: 0, opacity: 100 },
        { id: '2', color: '#ff8a65', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Лавандовый',
    category: 'cool',
    settings: {
      type: 'linear',
      linearDirection: 'to bottom right',
      colorStops: [
        { id: '1', color: '#e1bee7', position: 0, opacity: 100 },
        { id: '2', color: '#9c27b0', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Изумрудный',
    category: 'cool',
    settings: {
      type: 'linear',
      linearDirection: 'to top left',
      colorStops: [
        { id: '1', color: '#50c9c3', position: 0, opacity: 100 },
        { id: '2', color: '#96deda', position: 100, opacity: 100 }
      ]
    }
  }
]

// Default gradient settings
export const DEFAULT_GRADIENT_SETTINGS: GradientSettings = {
  type: 'linear',
  linearDirection: 'to bottom',
  linearAngle: 180,
  radialShape: 'ellipse',
  radialSize: 'farthest-corner',
  radialPositionX: 50,
  radialPositionY: 50,
  conicAngle: 0,
  conicPositionX: 50,
  conicPositionY: 50,
  repeating: false,
  colorStops: [
    { id: '1', color: '#3b82f6', position: 0, opacity: 100 },
    { id: '2', color: '#8b5cf6', position: 100, opacity: 100 }
  ]
}

// Utility functions
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function generateGradientCSS(settings: GradientSettings): string {
  const { type, colorStops, repeating } = settings
  const prefix = repeating ? 'repeating-' : ''

  const stops = colorStops
    .sort((a, b) => a.position - b.position)
    .map(stop => {
      const rgba = hexToRgba(stop.color, stop.opacity / 100)
      return `${rgba} ${stop.position}%`
    })
    .join(', ')

  switch (type) {
    case 'linear': {
      const direction = settings.linearDirection === 'custom' 
        ? `${settings.linearAngle}deg`
        : settings.linearDirection
      return `${prefix}linear-gradient(${direction}, ${stops})`
    }

    case 'radial': {
      const { radialShape, radialSize, radialPositionX, radialPositionY } = settings
      const position = `at ${radialPositionX}% ${radialPositionY}%`
      return `${prefix}radial-gradient(${radialShape} ${radialSize} ${position}, ${stops})`
    }

    case 'conic': {
      const { conicAngle, conicPositionX, conicPositionY } = settings
      const from = `from ${conicAngle}deg`
      const position = `at ${conicPositionX}% ${conicPositionY}%`
      return `${prefix}conic-gradient(${from} ${position}, ${stops})`
    }

    default:
      return `linear-gradient(to bottom, ${stops})`
  }
}

// Random color generator
export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// Random gradient generator
export function generateRandomGradient(): GradientSettings {
  const types: GradientType[] = ['linear', 'radial', 'conic']
  const linearDirections: LinearDirection[] = [
    'to top', 'to bottom', 'to left', 'to right', 
    'to top left', 'to top right', 'to bottom left', 'to bottom right'
  ]
  const radialShapes: RadialShape[] = ['circle', 'ellipse']
  const radialSizes: RadialSize[] = ['closest-side', 'farthest-side', 'closest-corner', 'farthest-corner']

  const type = types[Math.floor(Math.random() * types.length)]
  
  const colorStops: ColorStop[] = [
    { id: generateId(), color: generateRandomColor(), position: 0, opacity: 100 },
    { id: generateId(), color: generateRandomColor(), position: 100, opacity: 100 }
  ]

  // Sometimes add a third color stop
  if (Math.random() > 0.5) {
    colorStops.splice(1, 0, {
      id: generateId(),
      color: generateRandomColor(),
      position: 50,
      opacity: 100
    })
  }

  return {
    type,
    linearDirection: linearDirections[Math.floor(Math.random() * linearDirections.length)],
    linearAngle: Math.floor(Math.random() * 360),
    radialShape: radialShapes[Math.floor(Math.random() * radialShapes.length)],
    radialSize: radialSizes[Math.floor(Math.random() * radialSizes.length)],
    radialPositionX: Math.floor(Math.random() * 100),
    radialPositionY: Math.floor(Math.random() * 100),
    conicAngle: Math.floor(Math.random() * 360),
    conicPositionX: Math.floor(Math.random() * 100),
    conicPositionY: Math.floor(Math.random() * 100),
    repeating: Math.random() > 0.8, // 20% chance of repeating
    colorStops
  }
}

// Get gradient categories
export function getGradientCategories(): string[] {
  const categories = new Set(PRESET_GRADIENTS.map(gradient => gradient.category))
  return Array.from(categories).sort()
}

// Get gradients by category
export function getGradientsByCategory(category: string): PresetGradient[] {
  return PRESET_GRADIENTS.filter(gradient => gradient.category === category)
}

// Search gradients
export function searchGradients(query: string): PresetGradient[] {
  const lowerQuery = query.toLowerCase()
  return PRESET_GRADIENTS.filter(gradient => 
    gradient.name.toLowerCase().includes(lowerQuery) ||
    gradient.category.toLowerCase().includes(lowerQuery)
  )
}
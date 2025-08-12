# Business Logic Extraction Guide

This guide explains how to extract business logic from widget pages into reusable hooks, following best practices for maintainability and testability.

## Overview

Business logic extraction involves:
1. Moving calculations and state management to custom hooks
2. Separating UI components from business logic
3. Creating reusable, testable functions
4. Improving code organization and maintainability

## Benefits

- **Reusability**: Logic can be shared across components
- **Testability**: Easier to unit test pure functions
- **Maintainability**: Clear separation of concerns
- **Type Safety**: Better TypeScript support
- **Performance**: Optimized with proper memoization

## Architecture

```
lib/hooks/widgets/
├── index.ts                    # Main exports
├── useCalculator.ts           # Generic calculator hook
├── useConverter.ts            # Generic converter hook
├── useGenerator.ts            # Generic generator hook
├── useBMICalculator.ts        # Specific BMI calculator logic
├── useAsciiArtGenerator.ts    # ASCII art generator logic
└── usePercentageCalculator.ts # Percentage calculator logic
```

## Generic Hooks

### 1. Calculator Hook

For widgets that perform calculations:

```typescript
import { useCalculator } from '@/lib/hooks/widgets'

const calculator = useCalculator({
  fields: {
    principal: '',
    rate: '',
    time: ''
  },
  calculate: (fields) => {
    const p = parseFloat(fields.principal)
    const r = parseFloat(fields.rate) / 100
    const t = parseFloat(fields.time)
    
    return {
      interest: p * r * t,
      total: p + (p * r * t)
    }
  },
  validate: (fields) => {
    const errors: Record<string, string> = {}
    if (!fields.principal) errors.principal = 'Required'
    if (!fields.rate) errors.rate = 'Required'
    return errors
  },
  autoCalculate: true
})
```

### 2. Converter Hook

For unit conversion widgets:

```typescript
import { useConverter } from '@/lib/hooks/widgets'

const converter = useConverter({
  categories: [
    {
      id: 'length',
      name: 'Length',
      baseUnit: 'meter',
      units: [
        { id: 'meter', name: 'Meter', symbol: 'm', factor: 1 },
        { id: 'kilometer', name: 'Kilometer', symbol: 'km', factor: 1000 }
      ]
    }
  ],
  precision: 6
})
```

### 3. Generator Hook

For widgets that generate values:

```typescript
import { useGenerator } from '@/lib/hooks/widgets'

const generator = useGenerator({
  generate: async (options) => {
    // Generate logic here
    return generatedValue
  },
  validate: (options) => {
    if (!options.length) return 'Length is required'
    return null
  },
  maxHistory: 20
})
```

## Step-by-Step Extraction

### Step 1: Identify Business Logic

Look for:
- State management
- Calculations
- Validations
- Data transformations
- API calls

### Step 2: Create Custom Hook

```typescript
// lib/hooks/widgets/useMyWidget.ts
export function useMyWidget() {
  const [state, setState] = useState()
  
  const calculate = useCallback(() => {
    // Business logic here
  }, [dependencies])
  
  return {
    state,
    calculate,
    // ... other exports
  }
}
```

### Step 3: Extract Types

```typescript
export interface MyWidgetInput {
  field1: string
  field2: number
}

export interface MyWidgetResult {
  result: number
  formatted: string
}
```

### Step 4: Refactor Component

```typescript
// Before
export default function MyWidget() {
  const [value, setValue] = useState('')
  // ... lots of logic
  
  return <div>...</div>
}

// After
import { useMyWidget } from '@/lib/hooks/widgets'

export default function MyWidget() {
  const { state, calculate } = useMyWidget()
  
  return <div>...</div>
}
```

## Real Examples

### BMI Calculator

```typescript
// Before: 700+ lines in page component
// After: 300 lines in hook + 400 lines in component

export function useBMICalculator() {
  // All calculation logic
  const calculateBMI = useCallback(() => {
    // BMI formula
  }, [])
  
  const calculateBodyFat = useCallback(() => {
    // Body fat formula
  }, [])
  
  return {
    input,
    result,
    updateField,
    calculate,
    reset
  }
}
```

### Percentage Calculator

```typescript
export function usePercentageCalculator() {
  // Different calculation types
  const calculatePercentOfNumber = useCallback(() => {
    const result = (value * percentage) / 100
    return result
  }, [value, percentage])
  
  // Auto-calculate on input change
  useEffect(() => {
    calculate()
  }, [inputs])
  
  return {
    activeType,
    results,
    updateValue,
    copyResult
  }
}
```

## Best Practices

### 1. Pure Functions

Extract calculations as pure functions:

```typescript
// Good
export const calculateBMI = (weightKg: number, heightM: number): number => {
  return weightKg / (heightM * heightM)
}

// Use in hook
const bmi = calculateBMI(weight, height)
```

### 2. Proper Memoization

Use useCallback and useMemo appropriately:

```typescript
const expensiveCalculation = useMemo(() => {
  return performExpensiveOperation(data)
}, [data])

const handleCalculate = useCallback(() => {
  // Calculation logic
}, [dependencies])
```

### 3. Error Handling

Include proper error handling:

```typescript
const calculate = useCallback(() => {
  try {
    const result = performCalculation()
    setResult(result)
    return { success: true, result }
  } catch (error) {
    toast.error('Calculation failed')
    return { success: false, error }
  }
}, [])
```

### 4. Type Safety

Use TypeScript generics:

```typescript
export function useWidget<TInput, TResult>(
  config: WidgetConfig<TInput, TResult>
) {
  // Type-safe implementation
}
```

### 5. State Management

Keep related state together:

```typescript
// Good
const [formData, setFormData] = useState({
  field1: '',
  field2: '',
  field3: ''
})

// Update single field
const updateField = (name: string, value: any) => {
  setFormData(prev => ({ ...prev, [name]: value }))
}
```

## Testing

Extracted logic is easier to test:

```typescript
// __tests__/hooks/useBMICalculator.test.ts
import { renderHook, act } from '@testing-library/react-hooks'
import { useBMICalculator } from '@/lib/hooks/widgets'

describe('useBMICalculator', () => {
  it('calculates BMI correctly', () => {
    const { result } = renderHook(() => useBMICalculator())
    
    act(() => {
      result.current.updateField('weight', '70')
      result.current.updateField('height', '175')
    })
    
    expect(result.current.result?.bmi).toBeCloseTo(22.86)
  })
})
```

## Migration Checklist

- [ ] Identify all business logic in component
- [ ] Create types/interfaces
- [ ] Create custom hook file
- [ ] Extract state management
- [ ] Extract calculations
- [ ] Extract validations
- [ ] Add proper memoization
- [ ] Update component to use hook
- [ ] Add unit tests
- [ ] Update documentation

## Common Patterns

### Auto-calculation

```typescript
useEffect(() => {
  if (hasRequiredInputs()) {
    calculate()
  }
}, [inputs, calculate])
```

### History Management

```typescript
const [history, setHistory] = useState<Result[]>([])

const addToHistory = (result: Result) => {
  setHistory(prev => [result, ...prev].slice(0, MAX_HISTORY))
}
```

### Copy to Clipboard

```typescript
const copyResult = useCallback(() => {
  const text = formatResult(result)
  navigator.clipboard.writeText(text)
  toast.success('Copied!')
}, [result])
```

### Reset Functionality

```typescript
const reset = useCallback(() => {
  setInput(defaultValues)
  setResult(null)
  setErrors({})
  toast.success('Reset complete')
}, [defaultValues])
```

## Conclusion

Extracting business logic improves:
- Code organization
- Reusability
- Testability
- Maintainability
- Performance

Follow these patterns to create clean, maintainable widget code.
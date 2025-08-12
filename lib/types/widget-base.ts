import { ReactNode } from 'react'

// Base widget configuration
export interface BaseWidgetConfig {
  title: string
  description: string
  icon?: ReactNode
  category: string
  keywords?: string[]
}

// Common widget props
export interface BaseWidgetProps {
  locale: string
  className?: string
}

// Calculator widget specific
export interface CalculatorResult {
  value: number | string
  label: string
  unit?: string
  description?: string
}

export interface CalculatorWidgetProps extends BaseWidgetProps {
  onCalculate?: (result: CalculatorResult) => void
}

// Formatter/Converter widget specific
export interface FormatterResult {
  output: string
  format?: string
  isValid: boolean
  error?: string
}

export interface FormatterWidgetProps extends BaseWidgetProps {
  onFormat?: (result: FormatterResult) => void
  placeholder?: string
  initialValue?: string
}

// Generator widget specific
export interface GeneratorOptions {
  [key: string]: any
}

export interface GeneratorResult {
  output: string | string[]
  metadata?: Record<string, any>
}

export interface GeneratorWidgetProps extends BaseWidgetProps {
  onGenerate?: (result: GeneratorResult) => void
  options?: GeneratorOptions
}

// Validator widget specific
export interface ValidationResult {
  isValid: boolean
  errors?: string[]
  warnings?: string[]
  suggestions?: string[]
}

export interface ValidatorWidgetProps extends BaseWidgetProps {
  onValidate?: (result: ValidationResult) => void
  realtime?: boolean
}

// Info/Display widget specific
export interface InfoWidgetProps extends BaseWidgetProps {
  refreshInterval?: number
  onRefresh?: () => void
}

// Common widget features
export interface WidgetFeatures {
  copy?: boolean
  download?: boolean
  share?: boolean
  save?: boolean
  reset?: boolean
  history?: boolean
  fullscreen?: boolean
}

// Widget state management
export interface WidgetState<T = any> {
  data: T
  loading: boolean
  error: string | null
  history: T[]
}

// Widget actions
export interface WidgetActions {
  onCopy?: (content: string) => void
  onDownload?: (filename: string, content: string | Blob) => void
  onShare?: (data: any) => void
  onSave?: (data: any) => void
  onReset?: () => void
  onHistorySelect?: (item: any) => void
}
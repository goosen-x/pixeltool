import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

export type UnitSystem = 'metric' | 'imperial'
export type Gender = 'male' | 'female'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'

export interface BMIInput {
  weight: string
  height: string
  feet: string
  inches: string
  age: string
  gender: Gender
  activityLevel: ActivityLevel
  unitSystem: UnitSystem
  waist?: string
  neck?: string
  hip?: string
}

export interface BMIResult {
  bmi: number
  category: string
  categoryColor: string
  healthRisk: string
  idealWeight: { min: number; max: number }
  weightToLose: number
  weightToGain: number
  calories: {
    maintenance: number
    mildLoss: number
    loss: number
    mildGain: number
    gain: number
  }
}

export interface HealthMetrics {
  waistToHeight: number
  bodyFat: number
  leanMass: number
}

export interface BMICategory {
  min: number
  max: number
  name: string
  color: string
  risk: string
}

const BMI_CATEGORIES: BMICategory[] = [
  { min: 0, max: 16, name: 'Severely Underweight', color: 'text-red-600', risk: 'Very High' },
  { min: 16, max: 18.5, name: 'Underweight', color: 'text-yellow-600', risk: 'Increased' },
  { min: 18.5, max: 25, name: 'Normal', color: 'text-green-600', risk: 'Minimal' },
  { min: 25, max: 30, name: 'Overweight', color: 'text-yellow-600', risk: 'Increased' },
  { min: 30, max: 35, name: 'Obese Class I', color: 'text-orange-600', risk: 'High' },
  { min: 35, max: 40, name: 'Obese Class II', color: 'text-red-600', risk: 'Very High' },
  { min: 40, max: 100, name: 'Obese Class III', color: 'text-red-800', risk: 'Extremely High' }
]

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9
}

export function useBMICalculator(initialValues?: Partial<BMIInput>) {
  const [input, setInput] = useState<BMIInput>({
    weight: '',
    height: '',
    feet: '',
    inches: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    unitSystem: 'metric',
    waist: '',
    neck: '',
    hip: '',
    ...initialValues
  })

  const [result, setResult] = useState<BMIResult | null>(null)
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Calculate BMR using Mifflin-St Jeor equation
  const calculateBMR = useCallback((weight: number, height: number, age: number, gender: Gender): number => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161
    }
  }, [])

  // Calculate body fat using US Navy formula
  const calculateBodyFat = useCallback((
    waist: number, 
    neck: number, 
    hip: number, 
    height: number, 
    gender: Gender
  ): number => {
    if (gender === 'male') {
      return 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450
    } else {
      return 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450
    }
  }, [])

  // Main calculation function
  const calculate = useCallback(() => {
    const { weight, height, feet, inches, unitSystem, age, gender, activityLevel, waist, neck, hip } = input
    
    if (!weight || (!height && (!feet || !inches))) {
      setResult(null)
      setHealthMetrics(null)
      return
    }

    let weightKg = parseFloat(weight)
    let heightCm: number

    if (unitSystem === 'imperial') {
      weightKg = weightKg * 0.453592 // lbs to kg
      const totalInches = parseInt(feet || '0') * 12 + parseInt(inches || '0')
      heightCm = totalInches * 2.54
    } else {
      heightCm = parseFloat(height)
    }

    const heightM = heightCm / 100
    const bmi = weightKg / (heightM * heightM)

    const category = BMI_CATEGORIES.find(cat => bmi >= cat.min && bmi < cat.max) || BMI_CATEGORIES[0]

    // Calculate ideal weight range (BMI 18.5-25)
    const idealWeightMin = 18.5 * heightM * heightM
    const idealWeightMax = 25 * heightM * heightM

    // Calculate weight difference
    const weightToLose = Math.max(0, weightKg - idealWeightMax)
    const weightToGain = Math.max(0, idealWeightMin - weightKg)

    // Calculate BMR and calorie needs
    const bmr = calculateBMR(weightKg, heightCm, parseInt(age || '30'), gender)
    const maintenanceCalories = bmr * ACTIVITY_MULTIPLIERS[activityLevel]

    const bmiResult: BMIResult = {
      bmi,
      category: category.name,
      categoryColor: category.color,
      healthRisk: category.risk,
      idealWeight: {
        min: unitSystem === 'imperial' ? idealWeightMin / 0.453592 : idealWeightMin,
        max: unitSystem === 'imperial' ? idealWeightMax / 0.453592 : idealWeightMax
      },
      weightToLose: unitSystem === 'imperial' ? weightToLose / 0.453592 : weightToLose,
      weightToGain: unitSystem === 'imperial' ? weightToGain / 0.453592 : weightToGain,
      calories: {
        maintenance: Math.round(maintenanceCalories),
        mildLoss: Math.round(maintenanceCalories - 250),
        loss: Math.round(maintenanceCalories - 500),
        mildGain: Math.round(maintenanceCalories + 250),
        gain: Math.round(maintenanceCalories + 500)
      }
    }

    setResult(bmiResult)

    // Calculate additional health metrics if provided
    if (waist && neck) {
      const waistCm = unitSystem === 'imperial' ? parseFloat(waist) * 2.54 : parseFloat(waist)
      const neckCm = unitSystem === 'imperial' ? parseFloat(neck) * 2.54 : parseFloat(neck)
      const hipCm = hip ? (unitSystem === 'imperial' ? parseFloat(hip) * 2.54 : parseFloat(hip)) : 0

      const waistToHeight = waistCm / heightCm
      const bodyFat = calculateBodyFat(waistCm, neckCm, hipCm, heightCm, gender)
      const leanMass = weightKg * (1 - bodyFat / 100)

      setHealthMetrics({
        waistToHeight,
        bodyFat,
        leanMass: unitSystem === 'imperial' ? leanMass / 0.453592 : leanMass
      })
    }
  }, [input, calculateBMR, calculateBodyFat])

  // Auto-calculate when inputs change
  useEffect(() => {
    calculate()
  }, [calculate])

  // Update single field
  const updateField = useCallback((field: keyof BMIInput, value: string | Gender | ActivityLevel | UnitSystem) => {
    setInput(prev => ({ ...prev, [field]: value }))
  }, [])

  // Update multiple fields
  const updateFields = useCallback((fields: Partial<BMIInput>) => {
    setInput(prev => ({ ...prev, ...fields }))
  }, [])

  // Reset all fields
  const reset = useCallback(() => {
    setInput({
      weight: '',
      height: '',
      feet: '',
      inches: '',
      age: '',
      gender: 'male',
      activityLevel: 'moderate',
      unitSystem: 'metric',
      waist: '',
      neck: '',
      hip: ''
    })
    setResult(null)
    setHealthMetrics(null)
    setShowAdvanced(false)
    toast.success('Data reset')
  }, [])

  // Load example data
  const loadExample = useCallback(() => {
    const exampleData: Partial<BMIInput> = input.unitSystem === 'metric' 
      ? {
          weight: '70',
          height: '175',
          age: '30',
          waist: '80',
          neck: '37',
          hip: input.gender === 'female' ? '95' : undefined
        }
      : {
          weight: '154',
          feet: '5',
          inches: '9',
          age: '30',
          waist: '31.5',
          neck: '14.5',
          hip: input.gender === 'female' ? '37.5' : undefined
        }
    
    updateFields(exampleData)
    setShowAdvanced(true)
    toast.success('Example loaded')
  }, [input.unitSystem, input.gender, updateFields])

  // Copy results to clipboard
  const copyResults = useCallback(() => {
    if (!result) {
      toast.error('No results to copy')
      return
    }

    const { unitSystem } = input
    const unit = unitSystem === 'metric' ? 'kg' : 'lbs'
    
    const text = `
BMI Calculator Results

BMI: ${result.bmi.toFixed(1)}
Category: ${result.category}
Health Risk: ${result.healthRisk}

Ideal Weight: ${result.idealWeight.min.toFixed(1)}-${result.idealWeight.max.toFixed(1)} ${unit}
${result.weightToLose > 0 ? `Weight to Lose: ${result.weightToLose.toFixed(1)} ${unit}` : ''}
${result.weightToGain > 0 ? `Weight to Gain: ${result.weightToGain.toFixed(1)} ${unit}` : ''}

Calories:
• Maintenance: ${result.calories.maintenance} kcal/day
• Mild Weight Loss: ${result.calories.mildLoss} kcal/day
• Weight Loss: ${result.calories.loss} kcal/day

${healthMetrics ? `
Additional Metrics:
• Waist-to-Height Ratio: ${healthMetrics.waistToHeight.toFixed(2)}
• Body Fat: ${healthMetrics.bodyFat.toFixed(1)}%
• Lean Mass: ${healthMetrics.leanMass.toFixed(1)} ${unit}
` : ''}
    `.trim()

    navigator.clipboard.writeText(text)
    toast.success('Results copied!')
  }, [result, healthMetrics, input])

  // Get BMI visualization percentage
  const getBMIVisualization = useCallback((bmi: number): number => {
    const minBMI = 15
    const maxBMI = 40
    const normalized = (bmi - minBMI) / (maxBMI - minBMI)
    return Math.max(0, Math.min(100, normalized * 100))
  }, [])

  return {
    // State
    input,
    result,
    healthMetrics,
    showAdvanced,
    
    // Actions
    updateField,
    updateFields,
    calculate,
    reset,
    loadExample,
    copyResults,
    setShowAdvanced,
    
    // Utilities
    getBMIVisualization,
    
    // Constants
    BMI_CATEGORIES,
    ACTIVITY_MULTIPLIERS
  }
}
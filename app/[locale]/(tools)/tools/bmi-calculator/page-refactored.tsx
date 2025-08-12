'use client'

import { useState } from 'react'
import { Activity, Weight, Ruler, User } from 'lucide-react'
import { toast } from 'sonner'
import { 
  WidgetContainer, 
  WidgetInput, 
  WidgetResult, 
  WidgetInfo,
  type InputField 
} from '@/components/widgets/base'
import type { BaseWidgetConfig } from '@/lib/types/widget-base'

// BMI calculation logic
function calculateBMI(weight: number, height: number, unit: string) {
  const heightInM = unit === 'metric' ? height / 100 : height * 0.0254
  const weightInKg = unit === 'metric' ? weight : weight * 0.453592
  return weightInKg / (heightInM * heightInM)
}

function getBMICategory(bmi: number) {
  if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500' }
  if (bmi < 25) return { category: 'Normal', color: 'text-green-500' }
  if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500' }
  if (bmi < 35) return { category: 'Obese Class I', color: 'text-orange-500' }
  if (bmi < 40) return { category: 'Obese Class II', color: 'text-red-500' }
  return { category: 'Obese Class III', color: 'text-red-700' }
}

export default function BMICalculatorRefactored({ params }: { params: { locale: string } }) {
  const [results, setResults] = useState<any>(null)

  const config: BaseWidgetConfig = {
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and get personalized health insights',
    icon: <Weight className="w-6 h-6" />,
    category: 'Health & Fitness',
    keywords: ['bmi', 'body mass index', 'health', 'weight', 'fitness']
  }

  const fields: InputField[] = [
    {
      name: 'unit',
      label: 'Unit System',
      type: 'radio',
      value: 'metric',
      options: [
        { label: 'Metric (kg, cm)', value: 'metric' },
        { label: 'Imperial (lbs, in)', value: 'imperial' }
      ]
    },
    {
      name: 'weight',
      label: 'Weight',
      type: 'number',
      placeholder: 'Enter your weight',
      required: true,
      min: 1,
      max: 500,
      icon: <Weight className="w-4 h-4" />
    },
    {
      name: 'height', 
      label: 'Height',
      type: 'number',
      placeholder: 'Enter your height',
      required: true,
      min: 1,
      max: 300,
      icon: <Ruler className="w-4 h-4" />
    },
    {
      name: 'age',
      label: 'Age (optional)',
      type: 'number',
      placeholder: 'Enter your age',
      min: 1,
      max: 120,
      icon: <User className="w-4 h-4" />
    },
    {
      name: 'gender',
      label: 'Gender (optional)',
      type: 'radio',
      value: 'male',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]
    },
    {
      name: 'activity',
      label: 'Activity Level',
      type: 'select',
      value: 'moderate',
      options: [
        { label: 'Sedentary (little or no exercise)', value: 'sedentary' },
        { label: 'Lightly active (1-3 days/week)', value: 'light' },
        { label: 'Moderately active (3-5 days/week)', value: 'moderate' },
        { label: 'Very active (6-7 days/week)', value: 'active' },
        { label: 'Extra active (physical job)', value: 'very-active' }
      ],
      icon: <Activity className="w-4 h-4" />
    }
  ]

  const handleCalculate = (data: Record<string, any>) => {
    const { weight, height, unit, age, gender, activity } = data
    
    if (!weight || !height) {
      toast.error('Please enter weight and height')
      return
    }

    const bmi = calculateBMI(Number(weight), Number(height), unit)
    const { category, color } = getBMICategory(bmi)
    
    // Calculate ideal weight range (BMI 18.5-24.9)
    const heightInM = unit === 'metric' ? Number(height) / 100 : Number(height) * 0.0254
    const idealMin = 18.5 * heightInM * heightInM
    const idealMax = 24.9 * heightInM * heightInM
    
    const currentWeight = unit === 'metric' ? Number(weight) : Number(weight) * 0.453592
    const weightToLose = Math.max(0, currentWeight - idealMax)
    const weightToGain = Math.max(0, idealMin - currentWeight)

    // Calculate BMR and calories
    let bmr = 0
    if (age && gender) {
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * currentWeight) + (4.799 * Number(height)) - (5.677 * Number(age))
      } else {
        bmr = 447.593 + (9.247 * currentWeight) + (3.098 * Number(height)) - (4.330 * Number(age))
      }
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very-active': 1.9
    }

    const maintenance = bmr * activityMultipliers[activity as keyof typeof activityMultipliers]

    setResults({
      bmi,
      category,
      color,
      idealWeight: {
        min: unit === 'metric' ? idealMin : idealMin * 2.20462,
        max: unit === 'metric' ? idealMax : idealMax * 2.20462
      },
      weightToLose: unit === 'metric' ? weightToLose : weightToLose * 2.20462,
      weightToGain: unit === 'metric' ? weightToGain : weightToGain * 2.20462,
      calories: bmr > 0 ? {
        maintenance: Math.round(maintenance),
        mildLoss: Math.round(maintenance - 250),
        loss: Math.round(maintenance - 500),
        mildGain: Math.round(maintenance + 250),
        gain: Math.round(maintenance + 500)
      } : null
    })
  }

  const resultItems = results ? [
    {
      label: 'BMI',
      value: results.bmi.toFixed(1),
      highlighted: true
    },
    {
      label: 'Category',
      value: results.category,
      highlighted: true
    },
    {
      label: 'Ideal Weight Range',
      value: `${results.idealWeight.min.toFixed(1)} - ${results.idealWeight.max.toFixed(1)}`,
      unit: results.unit === 'metric' ? 'kg' : 'lbs'
    },
    ...(results.weightToLose > 0 ? [{
      label: 'Weight to Lose',
      value: results.weightToLose.toFixed(1),
      unit: results.unit === 'metric' ? 'kg' : 'lbs'
    }] : []),
    ...(results.weightToGain > 0 ? [{
      label: 'Weight to Gain',
      value: results.weightToGain.toFixed(1),
      unit: results.unit === 'metric' ? 'kg' : 'lbs'
    }] : [])
  ] : []

  const calorieResults = results?.calories ? [
    {
      label: 'Maintenance',
      value: results.calories.maintenance,
      unit: 'cal/day',
      description: 'To maintain current weight'
    },
    {
      label: 'Mild Weight Loss',
      value: results.calories.mildLoss,
      unit: 'cal/day',
      description: '0.25 kg/week loss'
    },
    {
      label: 'Weight Loss',
      value: results.calories.loss,
      unit: 'cal/day',
      description: '0.5 kg/week loss'
    }
  ] : []

  return (
    <WidgetContainer
      config={config}
      features={{
        reset: true,
        share: true,
        download: true
      }}
      actions={{
        onReset: () => setResults(null),
        onShare: () => {
          if (results) {
            const text = `My BMI: ${results.bmi.toFixed(1)} (${results.category})`
            navigator.share({ text })
          }
        }
      }}
    >
      <div className="space-y-6">
        <WidgetInput
          fields={fields}
          onSubmit={handleCalculate}
          submitLabel="Calculate BMI"
          layout="grid"
        />

        {results && (
          <>
            <WidgetResult
              title="BMI Results"
              results={resultItems}
              layout="grid"
              showCopy={true}
            />

            {results.calories && (
              <WidgetResult
                title="Daily Calorie Recommendations"
                results={calorieResults}
                layout="list"
                showCopy={true}
              />
            )}
          </>
        )}

        <WidgetInfo
          howToUse={[
            'Select your preferred unit system (metric or imperial)',
            'Enter your weight and height',
            'Optionally add age, gender, and activity level for calorie calculations',
            'Click "Calculate BMI" to see your results',
            'View your BMI category and health recommendations'
          ]}
          features={[
            'Accurate BMI calculation using standard formula',
            'Support for both metric and imperial units',
            'BMI category classification (WHO standards)',
            'Ideal weight range calculation',
            'Daily calorie recommendations based on activity level',
            'BMR calculation using Mifflin-St Jeor equation'
          ]}
          tips={[
            'BMI is a screening tool, not a diagnostic measure',
            'Athletes may have high BMI due to muscle mass',
            'Consider waist circumference for better health assessment',
            'Consult healthcare professionals for personalized advice'
          ]}
          warnings={[
            'BMI may not be accurate for athletes, elderly, or children',
            'This tool is for general guidance only',
            'Pregnant women should not use BMI as a health indicator'
          ]}
        />
      </div>
    </WidgetContainer>
  )
}
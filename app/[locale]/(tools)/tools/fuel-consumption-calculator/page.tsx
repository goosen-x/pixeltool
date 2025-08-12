'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  Fuel,
  Copy,
  RefreshCw,
  Car,
  Calculator,
  TrendingUp,
  MapPin,
  DollarSign,
  Gauge,
  Route,
  Info,
  Zap,
  Truck,
  TreePine
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type CalculationMode = 'consumption' | 'average'

interface CalculationResult {
  fuelNeeded: number
  totalCost: number
  costPerKm: number
  co2Emissions: number
}

interface VehiclePreset {
  name: string
  icon: any
  avgConsumption: number
  category: string
}

const VEHICLE_PRESETS: VehiclePreset[] = [
  { name: 'Малолитражка', icon: Car, avgConsumption: 5.0, category: 'city' },
  { name: 'Городской авто', icon: Car, avgConsumption: 7.0, category: 'city' },
  { name: 'Седан', icon: Car, avgConsumption: 8.0, category: 'sedan' },
  { name: 'Кроссовер', icon: Car, avgConsumption: 9.0, category: 'crossover' },
  { name: 'Внедорожник', icon: Truck, avgConsumption: 12.0, category: 'suv' },
  { name: 'Минивэн', icon: Truck, avgConsumption: 10.0, category: 'minivan' },
  { name: 'Электромобиль', icon: Zap, avgConsumption: 0.15, category: 'electric' },
  { name: 'Гибрид', icon: Zap, avgConsumption: 4.0, category: 'hybrid' }
]

const FUEL_TYPES = [
  { id: 'gasoline-92', name: 'АИ-92', pricePerLiter: 51.5, co2PerLiter: 2.31 },
  { id: 'gasoline-95', name: 'АИ-95', pricePerLiter: 55.2, co2PerLiter: 2.31 },
  { id: 'gasoline-98', name: 'АИ-98', pricePerLiter: 62.8, co2PerLiter: 2.31 },
  { id: 'diesel', name: 'Дизель', pricePerLiter: 61.5, co2PerLiter: 2.68 },
  { id: 'gas', name: 'Газ', pricePerLiter: 28.9, co2PerLiter: 1.51 },
  { id: 'electric', name: 'Электро (кВт·ч)', pricePerLiter: 5.5, co2PerLiter: 0 }
]

const COMMON_ROUTES = [
  { name: 'Москва - Санкт-Петербург', distance: 715 },
  { name: 'Москва - Нижний Новгород', distance: 420 },
  { name: 'Москва - Казань', distance: 820 },
  { name: 'Москва - Екатеринбург', distance: 1790 },
  { name: 'Москва - Сочи', distance: 1620 },
  { name: 'Городская поездка', distance: 50 }
]

export default function FuelConsumptionCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>('consumption')
  const [avgConsumption, setAvgConsumption] = useState('8')
  const [distance, setDistance] = useState('100')
  const [pricePerLiter, setPricePerLiter] = useState('55.2')
  const [selectedFuelType, setSelectedFuelType] = useState(FUEL_TYPES[1]) // АИ-95
  
  // Для расчета среднего расхода
  const [totalFuelUsed, setTotalFuelUsed] = useState('50')
  const [totalDistance, setTotalDistance] = useState('650')
  
  const [result, setResult] = useState<CalculationResult>({
    fuelNeeded: 0,
    totalCost: 0,
    costPerKm: 0,
    co2Emissions: 0
  })
  const [averageConsumptionResult, setAverageConsumptionResult] = useState(0)

  useEffect(() => {
    if (mode === 'consumption') {
      calculateFuelConsumption()
    } else {
      calculateAverageConsumption()
    }
  }, [mode, avgConsumption, distance, pricePerLiter, totalFuelUsed, totalDistance, selectedFuelType])

  const calculateFuelConsumption = () => {
    const consumption = parseFloat(avgConsumption) || 0
    const dist = parseFloat(distance) || 0
    const price = parseFloat(pricePerLiter) || 0

    if (consumption > 0 && dist > 0) {
      const fuelNeeded = (consumption * dist) / 100
      const totalCost = fuelNeeded * price
      const costPerKm = totalCost / dist
      const co2Emissions = fuelNeeded * selectedFuelType.co2PerLiter

      setResult({
        fuelNeeded,
        totalCost,
        costPerKm,
        co2Emissions
      })
    } else {
      setResult({
        fuelNeeded: 0,
        totalCost: 0,
        costPerKm: 0,
        co2Emissions: 0
      })
    }
  }

  const calculateAverageConsumption = () => {
    const fuel = parseFloat(totalFuelUsed) || 0
    const dist = parseFloat(totalDistance) || 0

    if (fuel > 0 && dist > 0) {
      const avgConsumption = (fuel / dist) * 100
      setAverageConsumptionResult(avgConsumption)
    } else {
      setAverageConsumptionResult(0)
    }
  }

  const copyResult = () => {
    let textToCopy = ''
    
    if (mode === 'consumption') {
      textToCopy = `Расход топлива:
Расстояние: ${distance} км
Средний расход: ${avgConsumption} л/100км
Необходимо топлива: ${result.fuelNeeded.toFixed(2)} л
Стоимость: ${result.totalCost.toFixed(2)} ₽
Стоимость на км: ${result.costPerKm.toFixed(2)} ₽/км`
    } else {
      textToCopy = `Средний расход топлива:
Использовано топлива: ${totalFuelUsed} л
Пройдено: ${totalDistance} км
Средний расход: ${averageConsumptionResult.toFixed(2)} л/100км`
    }

    navigator.clipboard.writeText(textToCopy)
    toast.success('Результат скопирован!')
  }

  const resetCalculator = () => {
    setAvgConsumption('8')
    setDistance('100')
    setPricePerLiter('55.2')
    setTotalFuelUsed('50')
    setTotalDistance('650')
    setSelectedFuelType(FUEL_TYPES[1])
    toast.success('Калькулятор сброшен')
  }

  const loadVehiclePreset = (preset: VehiclePreset) => {
    if (preset.category === 'electric') {
      setAvgConsumption(preset.avgConsumption.toString())
      setSelectedFuelType(FUEL_TYPES[5]) // Электро
      setPricePerLiter(FUEL_TYPES[5].pricePerLiter.toString())
    } else {
      setAvgConsumption(preset.avgConsumption.toString())
    }
    toast.success(`Загружен: ${preset.name}`)
  }

  const loadRoute = (route: typeof COMMON_ROUTES[0]) => {
    setDistance(route.distance.toString())
    toast.success(`Маршрут: ${route.name}`)
  }

  const selectFuelType = (fuel: typeof FUEL_TYPES[0]) => {
    setSelectedFuelType(fuel)
    setPricePerLiter(fuel.pricePerLiter.toString())
  }

  const getFuelEfficiencyRating = (consumption: number): { label: string; color: string; icon: any } => {
    if (consumption === 0) return { label: 'Н/Д', color: 'text-gray-500', icon: Info }
    if (consumption <= 5) return { label: 'Отлично', color: 'text-green-600', icon: TreePine }
    if (consumption <= 7) return { label: 'Хорошо', color: 'text-green-500', icon: TreePine }
    if (consumption <= 9) return { label: 'Средне', color: 'text-yellow-600', icon: Gauge }
    if (consumption <= 12) return { label: 'Высокий', color: 'text-blue-600', icon: Gauge }
    return { label: 'Очень высокий', color: 'text-red-600', icon: Gauge }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Mode Selection */}
      <Card className="p-6">
        <RadioGroup value={mode} onValueChange={(value: CalculationMode) => setMode(value)}>
          <div className="grid md:grid-cols-2 gap-4">
            <div 
              className={cn(
                "relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors",
                mode === 'consumption' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
              )}
              onClick={() => setMode('consumption')}
            >
              <RadioGroupItem value="consumption" id="consumption" />
              <Label htmlFor="consumption" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  <span className="font-medium">Рассчитать расход и стоимость</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  На основе расстояния и среднего расхода
                </p>
              </Label>
            </div>

            <div 
              className={cn(
                "relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors",
                mode === 'average' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
              )}
              onClick={() => setMode('average')}
            >
              <RadioGroupItem value="average" id="average" />
              <Label htmlFor="average" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">Рассчитать средний расход</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  На основе пройденного расстояния и использованного топлива
                </p>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Calculator */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              {mode === 'consumption' ? (
                <>
                  {/* Fuel Type Selection */}
                  <div>
                    <Label>Тип топлива</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {FUEL_TYPES.map((fuel) => (
                        <Button
                          key={fuel.id}
                          variant={selectedFuelType.id === fuel.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => selectFuelType(fuel)}
                          className="justify-between"
                        >
                          <span>{fuel.name}</span>
                          <span className="text-xs">{fuel.pricePerLiter}₽</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Average Consumption */}
                  <div>
                    <Label htmlFor="avg-consumption">
                      Средний расход топлива
                      <span className="text-muted-foreground ml-2">
                        ({selectedFuelType.id === 'electric' ? 'кВт·ч/100км' : 'л/100км'})
                      </span>
                    </Label>
                    <Input
                      id="avg-consumption"
                      type="number"
                      value={avgConsumption}
                      onChange={(e) => setAvgConsumption(e.target.value)}
                      placeholder="Например: 8"
                      className="mt-1"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  {/* Distance */}
                  <div>
                    <Label htmlFor="distance">Расстояние (км)</Label>
                    <Input
                      id="distance"
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder="Например: 100"
                      className="mt-1"
                      min="0"
                      step="1"
                    />
                  </div>

                  {/* Price per Liter */}
                  <div>
                    <Label htmlFor="price">
                      Цена за {selectedFuelType.id === 'electric' ? 'кВт·ч' : 'литр'} (₽)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={pricePerLiter}
                      onChange={(e) => setPricePerLiter(e.target.value)}
                      placeholder="Например: 55.2"
                      className="mt-1"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  {/* Results */}
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="font-semibold">Результаты расчета</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Fuel className="w-4 h-4" />
                          <span className="text-sm">Необходимо топлива</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {result.fuelNeeded.toFixed(2)} {selectedFuelType.id === 'electric' ? 'кВт·ч' : 'л'}
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm">Общая стоимость</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {result.totalCost.toFixed(2)} ₽
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Route className="w-4 h-4" />
                          <span className="text-sm">Стоимость на км</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {result.costPerKm.toFixed(2)} ₽/км
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <TreePine className="w-4 h-4" />
                          <span className="text-sm">Выбросы CO₂</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {result.co2Emissions.toFixed(2)} кг
                        </div>
                      </div>
                    </div>

                    {/* Efficiency Rating */}
                    <div className="p-4 rounded-lg bg-primary/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Экономичность</div>
                          <div className={cn(
                            "flex items-center gap-2 mt-1",
                            getFuelEfficiencyRating(parseFloat(avgConsumption)).color
                          )}>
                            {React.createElement(
                              getFuelEfficiencyRating(parseFloat(avgConsumption)).icon,
                              { className: "w-5 h-5" }
                            )}
                            <span className="font-medium">
                              {getFuelEfficiencyRating(parseFloat(avgConsumption)).label}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {avgConsumption} {selectedFuelType.id === 'electric' ? 'кВт·ч' : 'л'}/100км
                        </Badge>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Average Consumption Calculator */}
                  <div>
                    <Label htmlFor="total-fuel">Использовано топлива (литров)</Label>
                    <Input
                      id="total-fuel"
                      type="number"
                      value={totalFuelUsed}
                      onChange={(e) => setTotalFuelUsed(e.target.value)}
                      placeholder="Например: 50"
                      className="mt-1"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="total-distance">Пройденное расстояние (км)</Label>
                    <Input
                      id="total-distance"
                      type="number"
                      value={totalDistance}
                      onChange={(e) => setTotalDistance(e.target.value)}
                      placeholder="Например: 650"
                      className="mt-1"
                      min="0"
                      step="1"
                    />
                  </div>

                  {/* Average Result */}
                  <div className="p-6 rounded-lg bg-primary/10 text-center">
                    <div className="text-sm text-muted-foreground mb-2">Средний расход топлива</div>
                    <div className="text-4xl font-bold text-primary mb-2">
                      {averageConsumptionResult.toFixed(2)} л/100км
                    </div>
                    <div className={cn(
                      "flex items-center justify-center gap-2",
                      getFuelEfficiencyRating(averageConsumptionResult).color
                    )}>
                      {React.createElement(
                        getFuelEfficiencyRating(averageConsumptionResult).icon,
                        { className: "w-5 h-5" }
                      )}
                      <span className="font-medium">
                        {getFuelEfficiencyRating(averageConsumptionResult).label}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button onClick={copyResult} className="gap-2">
                  <Copy className="w-4 h-4" />
                  Копировать
                </Button>
                <Button onClick={resetCalculator} variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Сбросить
                </Button>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Советы по экономии топлива
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">Стиль вождения</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Плавное ускорение и торможение</li>
                  <li>• Поддержание постоянной скорости</li>
                  <li>• Оптимальные обороты двигателя</li>
                  <li>• Использование круиз-контроля</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Техническое состояние</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Правильное давление в шинах</li>
                  <li>• Чистые воздушные фильтры</li>
                  <li>• Качественное моторное масло</li>
                  <li>• Исправная система зажигания</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Vehicle Presets */}
          {mode === 'consumption' && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Car className="w-5 h-5" />
                Типы автомобилей
              </h3>

              <div className="space-y-2">
                {VEHICLE_PRESETS.map((preset, index) => (
                  <Button
                    key={index}
                    onClick={() => loadVehiclePreset(preset)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <preset.icon className="w-4 h-4" />
                      <span>{preset.name}</span>
                    </div>
                    <Badge variant="secondary">
                      {preset.avgConsumption} {preset.category === 'electric' ? 'кВт·ч' : 'л'}/100км
                    </Badge>
                  </Button>
                ))}
              </div>
            </Card>
          )}

          {/* Common Routes */}
          {mode === 'consumption' && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Популярные маршруты
              </h3>

              <div className="space-y-2">
                {COMMON_ROUTES.map((route, index) => (
                  <Button
                    key={index}
                    onClick={() => loadRoute(route)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between text-left"
                  >
                    <span className="truncate">{route.name}</span>
                    <Badge variant="secondary">{route.distance} км</Badge>
                  </Button>
                ))}
              </div>
            </Card>
          )}

          {/* Fuel Economy Classes */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Классы экономичности
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center gap-2 text-green-600">
                  <TreePine className="w-4 h-4" />
                  <span className="font-medium">Отлично</span>
                </div>
                <span className="text-muted-foreground">&lt; 5 л/100км</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center gap-2 text-green-500">
                  <TreePine className="w-4 h-4" />
                  <span className="font-medium">Хорошо</span>
                </div>
                <span className="text-muted-foreground">5-7 л/100км</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <div className="flex items-center gap-2 text-yellow-600">
                  <Gauge className="w-4 h-4" />
                  <span className="font-medium">Средне</span>
                </div>
                <span className="text-muted-foreground">7-9 л/100км</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600">
                  <Gauge className="w-4 h-4" />
                  <span className="font-medium">Высокий</span>
                </div>
                <span className="text-muted-foreground">9-12 л/100км</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
                <div className="flex items-center gap-2 text-red-600">
                  <Gauge className="w-4 h-4" />
                  <span className="font-medium">Очень высокий</span>
                </div>
                <span className="text-muted-foreground">&gt; 12 л/100км</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
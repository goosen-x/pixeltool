'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  Gift,
  Copy,
  RefreshCw,
  Heart,
  Star,
  Cake
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AgeData {
  years: number
  months: number
  days: number
  totalDays: number
  totalWeeks: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  nextBirthday: {
    date: Date
    daysUntil: number
    dayOfWeek: string
  }
  zodiacSign: string
  chineseZodiac: string
  lifeStage: string
}

const ZODIAC_SIGNS = [
  { name: 'Козерог', start: '12-22', end: '01-19' },
  { name: 'Водолей', start: '01-20', end: '02-18' },
  { name: 'Рыбы', start: '02-19', end: '03-20' },
  { name: 'Овен', start: '03-21', end: '04-19' },
  { name: 'Телец', start: '04-20', end: '05-20' },
  { name: 'Близнецы', start: '05-21', end: '06-20' },
  { name: 'Рак', start: '06-21', end: '07-22' },
  { name: 'Лев', start: '07-23', end: '08-22' },
  { name: 'Дева', start: '08-23', end: '09-22' },
  { name: 'Весы', start: '09-23', end: '10-22' },
  { name: 'Скорпион', start: '10-23', end: '11-21' },
  { name: 'Стрелец', start: '11-22', end: '12-21' }
]

const CHINESE_ZODIAC = [
  'Крыса', 'Бык', 'Тигр', 'Кролик', 'Дракон', 'Змея',
  'Лошадь', 'Коза', 'Обезьяна', 'Петух', 'Собака', 'Свинья'
]

const LIFE_STAGES = [
  { name: 'Младенец', min: 0, max: 1 },
  { name: 'Малыш', min: 1, max: 3 },
  { name: 'Дошкольник', min: 3, max: 6 },
  { name: 'Школьник', min: 6, max: 12 },
  { name: 'Подросток', min: 12, max: 18 },
  { name: 'Молодой взрослый', min: 18, max: 30 },
  { name: 'Взрослый', min: 30, max: 50 },
  { name: 'Средний возраст', min: 50, max: 65 },
  { name: 'Пожилой', min: 65, max: 80 },
  { name: 'Преклонный возраст', min: 80, max: 150 }
]

const DAY_NAMES = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 
  'Четверг', 'Пятница', 'Суббота'
]

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState('')
  const [ageData, setAgeData] = useState<AgeData | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const getZodiacSign = (date: Date): string => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const dateStr = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    
    for (const sign of ZODIAC_SIGNS) {
      const [startMonth, startDay] = sign.start.split('-').map(Number)
      const [endMonth, endDay] = sign.end.split('-').map(Number)
      
      if (startMonth === endMonth) {
        if (month === startMonth && day >= startDay && day <= endDay) {
          return sign.name
        }
      } else {
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
          return sign.name
        }
      }
    }
    
    return ZODIAC_SIGNS[0].name // Козерог как fallback
  }

  const getChineseZodiac = (year: number): string => {
    const baseYear = 1900 // Год крысы
    const index = (year - baseYear) % 12
    return CHINESE_ZODIAC[index]
  }

  const getLifeStage = (age: number): string => {
    const stage = LIFE_STAGES.find(s => age >= s.min && age < s.max)
    return stage ? stage.name : 'Неопределенный возраст'
  }

  const calculateAge = (birthDate: Date): AgeData => {
    const now = new Date()
    const birth = new Date(birthDate)
    
    // Проверка на будущую дату
    if (birth > now) {
      throw new Error('Дата рождения не может быть в будущем')
    }

    // Расчет возраста
    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    let days = now.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      days += lastMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    // Общие данные
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalHours = totalDays * 24
    const totalMinutes = totalHours * 60
    const totalSeconds = totalMinutes * 60

    // Следующий день рождения
    const nextBirthYear = now.getFullYear()
    let nextBirthday = new Date(nextBirthYear, birth.getMonth(), birth.getDate())
    
    if (nextBirthday < now) {
      nextBirthday = new Date(nextBirthYear + 1, birth.getMonth(), birth.getDate())
    }
    
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const dayOfWeek = DAY_NAMES[nextBirthday.getDay()]

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBirthday: {
        date: nextBirthday,
        daysUntil: daysUntilBirthday,
        dayOfWeek
      },
      zodiacSign: getZodiacSign(birth),
      chineseZodiac: getChineseZodiac(birth.getFullYear()),
      lifeStage: getLifeStage(years)
    }
  }

  const handleCalculate = () => {
    if (!birthDate) {
      toast.error('Пожалуйста, введите дату рождения')
      return
    }

    setIsCalculating(true)
    
    setTimeout(() => {
      try {
        const birth = new Date(birthDate)
        const result = calculateAge(birth)
        setAgeData(result)
        toast.success('Возраст рассчитан!')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Ошибка при расчете возраста')
        setAgeData(null)
      } finally {
        setIsCalculating(false)
      }
    }, 300)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Скопировано в буфер обмена!')
  }

  const formatAgeText = (data: AgeData): string => {
    return `Мне ${data.years} лет, ${data.months} месяцев и ${data.days} дней
Всего дней прожито: ${data.totalDays.toLocaleString()}
До следующего дня рождения: ${data.nextBirthday.daysUntil} дней
Знак зодиака: ${data.zodiacSign}
Китайский гороскоп: ${data.chineseZodiac}`
  }

  const reset = () => {
    setBirthDate('')
    setAgeData(null)
    toast.success('Данные сброшены')
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ru-RU')
  }

  // Автоматический расчет при изменении даты
  useEffect(() => {
    if (birthDate) {
      const timer = setTimeout(() => {
        handleCalculate()
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setAgeData(null)
    }
  }, [birthDate])

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Input Section */}
      <Card className="p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <Label htmlFor="birthdate">Дата рождения</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-1"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="flex items-end gap-2">
            <Button 
              onClick={handleCalculate}
              disabled={isCalculating || !birthDate}
              className="flex items-center gap-2"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Расчет...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Рассчитать
                </>
              )}
            </Button>
            
            <Button onClick={reset} variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {ageData && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Age Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-500" />
              Ваш возраст
            </h3>
            
            <div className="space-y-4">
              {/* Main Age Display */}
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {ageData.years}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {ageData.years === 1 ? 'год' : ageData.years < 5 ? 'года' : 'лет'}
                </div>
                
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">{ageData.months}</div>
                    <div className="text-muted-foreground">месяцев</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{ageData.days}</div>
                    <div className="text-muted-foreground">дней</div>
                  </div>
                </div>
              </div>

              {/* Detailed Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {formatNumber(ageData.totalDays)}
                  </div>
                  <div className="text-sm text-muted-foreground">дней прожито</div>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {formatNumber(ageData.totalWeeks)}
                  </div>
                  <div className="text-sm text-muted-foreground">недель</div>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {formatNumber(ageData.totalHours)}
                  </div>
                  <div className="text-sm text-muted-foreground">часов</div>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {formatNumber(ageData.totalMinutes)}
                  </div>
                  <div className="text-sm text-muted-foreground">минут</div>
                </div>
              </div>

              <Button 
                onClick={() => copyToClipboard(formatAgeText(ageData))}
                variant="outline"
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Скопировать информацию о возрасте
              </Button>
            </div>
          </Card>

          {/* Additional Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Дополнительная информация
            </h3>
            
            <div className="space-y-4">
              {/* Next Birthday */}
              <div className="p-4 bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Cake className="w-4 h-4 text-pink-500" />
                  <span className="font-medium">Следующий день рождения</span>
                </div>
                <div className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {ageData.nextBirthday.daysUntil === 0 ? 'Сегодня!' : 
                   ageData.nextBirthday.daysUntil === 1 ? 'Завтра!' : 
                   `Через ${ageData.nextBirthday.daysUntil} дней`}
                </div>
                <div className="text-sm text-muted-foreground">
                  {ageData.nextBirthday.date.toLocaleDateString('ru-RU')} ({ageData.nextBirthday.dayOfWeek})
                </div>
              </div>

              {/* Life Stage */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Жизненный этап</span>
                </div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {ageData.lifeStage}
                </div>
              </div>

              {/* Zodiac Signs */}
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg border">
                  <div className="font-medium text-purple-700 dark:text-purple-300 mb-1">
                    Знак зодиака
                  </div>
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {ageData.zodiacSign}
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-amber-50 to-blue-50 dark:from-amber-950/20 dark:to-blue-950/20 rounded-lg border">
                  <div className="font-medium text-amber-700 dark:text-amber-300 mb-1">
                    Китайский гороскоп
                  </div>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    Год {ageData.chineseZodiac}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!ageData && !isCalculating && (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Введите дату рождения для расчета возраста</p>
            <p className="text-sm mt-2">
              Узнайте свой точный возраст в различных единицах времени
            </p>
          </div>
        </Card>
      )}

      {/* Info */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-4">О калькуляторе возраста</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">Что рассчитывается</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Точный возраст в годах, месяцах и днях</li>
                <li>• Общее количество прожитых дней, недель, часов</li>
                <li>• Время до следующего дня рождения</li>
                <li>• Знак зодиака и китайский гороскоп</li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">Интересные факты</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Учитываются високосные годы</li>
                <li>• Определяется жизненный этап</li>
                <li>• Показывается день недели для следующего ДР</li>
                <li>• Все расчеты выполняются в реальном времени</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
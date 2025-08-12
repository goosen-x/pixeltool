import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'

export interface Timezone {
  name: string
  offset: string
  cities: string[]
  abbr: string
}

export interface CityTime {
  id: string
  city: string
  timezone: string
  time: string
  date: string
  offset: string
  isDST: boolean
  isDay: boolean
  hour: number
  minute: number
  second: number
}

export interface TimeConversion {
  fromTime: string
  fromDate: string
  fromTimezone: string
  toTimezone: string
  result: {
    time: string
    date: string
    dayDifference: number
  } | null
}

export const popularTimezones: Timezone[] = [
  {
    name: 'UTC',
    offset: '+00:00',
    cities: ['London (Winter)', 'Reykjavik', 'Accra'],
    abbr: 'UTC'
  },
  {
    name: 'Europe/London',
    offset: '+00:00',
    cities: ['London', 'Dublin', 'Lisbon'],
    abbr: 'GMT'
  },
  {
    name: 'Europe/Paris',
    offset: '+01:00',
    cities: ['Paris', 'Berlin', 'Rome'],
    abbr: 'CET'
  },
  {
    name: 'Europe/Moscow',
    offset: '+03:00',
    cities: ['Moscow', 'Istanbul', 'Riyadh'],
    abbr: 'MSK'
  },
  {
    name: 'Asia/Dubai',
    offset: '+04:00',
    cities: ['Dubai', 'Muscat', 'Tbilisi'],
    abbr: 'GST'
  },
  {
    name: 'Asia/Kolkata',
    offset: '+05:30',
    cities: ['Mumbai', 'Delhi', 'Bangalore'],
    abbr: 'IST'
  },
  {
    name: 'Asia/Shanghai',
    offset: '+08:00',
    cities: ['Beijing', 'Shanghai', 'Hong Kong'],
    abbr: 'CST'
  },
  {
    name: 'Asia/Tokyo',
    offset: '+09:00',
    cities: ['Tokyo', 'Seoul', 'Osaka'],
    abbr: 'JST'
  },
  {
    name: 'Australia/Sydney',
    offset: '+11:00',
    cities: ['Sydney', 'Melbourne', 'Canberra'],
    abbr: 'AEDT'
  },
  {
    name: 'Pacific/Auckland',
    offset: '+13:00',
    cities: ['Auckland', 'Wellington'],
    abbr: 'NZDT'
  },
  {
    name: 'America/New_York',
    offset: '-05:00',
    cities: ['New York', 'Toronto', 'Miami'],
    abbr: 'EST'
  },
  {
    name: 'America/Chicago',
    offset: '-06:00',
    cities: ['Chicago', 'Houston', 'Mexico City'],
    abbr: 'CST'
  },
  {
    name: 'America/Denver',
    offset: '-07:00',
    cities: ['Denver', 'Phoenix', 'Calgary'],
    abbr: 'MST'
  },
  {
    name: 'America/Los_Angeles',
    offset: '-08:00',
    cities: ['Los Angeles', 'San Francisco', 'Seattle'],
    abbr: 'PST'
  },
  {
    name: 'America/Sao_Paulo',
    offset: '-03:00',
    cities: ['São Paulo', 'Rio de Janeiro', 'Buenos Aires'],
    abbr: 'BRT'
  }
]

export const allTimezones = Intl.supportedValuesOf('timeZone')

interface UseWorldTimeOptions {
  translations?: {
    alreadyAdded: string
    cityAdded: string
    enterTimeDate: string
    invalidDateTime: string
  }
}

export function useWorldTime(options: UseWorldTimeOptions = {}) {
  const { translations } = options

  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedCities, setSelectedCities] = useState<CityTime[]>([])
  const [conversion, setConversion] = useState<TimeConversion>({
    fromTime: '',
    fromDate: '',
    fromTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    toTimezone: 'UTC',
    result: null
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('clocks')

  // Initialize component and load saved data
  useEffect(() => {
    setMounted(true)
    const now = new Date()
    setConversion(prev => ({
      ...prev,
      fromTime: now.toTimeString().slice(0, 5),
      fromDate: now.toISOString().slice(0, 10)
    }))
  }, [])

  // Load saved cities from localStorage
  useEffect(() => {
    if (!mounted) return
    
    const saved = localStorage.getItem('worldTimeCities')
    if (saved) {
      const cities = JSON.parse(saved)
      updateCityTimes(cities)
    } else {
      // Add default cities
      const defaultCities = [
        { city: 'New York', timezone: 'America/New_York' },
        { city: 'London', timezone: 'Europe/London' },
        { city: 'Tokyo', timezone: 'Asia/Tokyo' }
      ]
      defaultCities.forEach(city => addCity(city.city, city.timezone))
    }
  }, [mounted])

  // Update times every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      updateCityTimes(selectedCities)
    }, 1000)

    return () => clearInterval(timer)
  }, [selectedCities])

  const getTimezoneOffset = useCallback((timezone: string): string => {
    const now = new Date()
    const date = new Date()
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60)

    const sign = offset >= 0 ? '+' : '-'
    const absOffset = Math.abs(offset)
    const hours = Math.floor(absOffset)
    const minutes = (absOffset - hours) * 60

    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }, [])

  const isDaylightSavingTime = useCallback((timezone: string): boolean => {
    const now = new Date()
    const jan = new Date(now.getFullYear(), 0, 1)
    const jul = new Date(now.getFullYear(), 6, 1)

    const janOffset = getTimezoneOffset(timezone)
    const julOffset = getTimezoneOffset(timezone)

    return janOffset !== julOffset
  }, [getTimezoneOffset])

  const updateCityTimes = useCallback((cities: any[]) => {
    const updated = cities.map(city => {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: city.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: city.timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })

      const time = formatter.format(now)
      const [hourStr, minuteStr, secondStr] = time.split(':')
      const hour = parseInt(hourStr)
      const minute = parseInt(minuteStr)
      const second = parseInt(secondStr)
      const isDay = hour >= 6 && hour < 18

      const offset = getTimezoneOffset(city.timezone)

      return {
        ...city,
        time,
        date: dateFormatter.format(now),
        offset,
        isDay,
        isDST: isDaylightSavingTime(city.timezone),
        hour,
        minute,
        second
      }
    })
    setSelectedCities(updated)
  }, [getTimezoneOffset, isDaylightSavingTime])

  const addCity = useCallback((cityName: string, timezone: string) => {
    if (selectedCities.some(c => c.timezone === timezone)) {
      toast.error(translations?.alreadyAdded || 'City already added')
      return
    }

    const newCity = {
      id: crypto.randomUUID(),
      city: cityName,
      timezone,
      time: '',
      date: '',
      offset: '',
      isDST: false,
      isDay: true,
      hour: 0,
      minute: 0,
      second: 0
    }

    const updated = [...selectedCities, newCity]
    updateCityTimes(updated)
    localStorage.setItem(
      'worldTimeCities',
      JSON.stringify(updated.map(c => ({ city: c.city, timezone: c.timezone })))
    )
    toast.success(translations?.cityAdded?.replace('{city}', cityName) || `${cityName} added`)
  }, [selectedCities, updateCityTimes, translations])

  const removeCity = useCallback((id: string) => {
    const updated = selectedCities.filter(c => c.id !== id)
    setSelectedCities(updated)
    localStorage.setItem(
      'worldTimeCities',
      JSON.stringify(updated.map(c => ({ city: c.city, timezone: c.timezone })))
    )
  }, [selectedCities])

  const convertTime = useCallback(() => {
    if (!conversion.fromTime || !conversion.fromDate) {
      toast.error(translations?.enterTimeDate || 'Please enter time and date')
      return
    }

    try {
      const fromDateTime = new Date(`${conversion.fromDate}T${conversion.fromTime}:00`)

      // Create date in source timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: conversion.toTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })

      const parts = formatter.formatToParts(fromDateTime)
      const getPart = (type: string) =>
        parts.find(p => p.type === type)?.value || ''

      const resultTime = `${getPart('hour')}:${getPart('minute')}`
      const resultDate = `${getPart('year')}-${getPart('month')}-${getPart('day')}`

      // Calculate day difference
      const fromDate = new Date(conversion.fromDate)
      const toDate = new Date(resultDate)
      const dayDiff = Math.round(
        (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      setConversion(prev => ({
        ...prev,
        result: {
          time: resultTime,
          date: resultDate,
          dayDifference: dayDiff
        }
      }))
    } catch (error) {
      toast.error(translations?.invalidDateTime || 'Invalid date/time')
    }
  }, [conversion, translations])

  const updateConversion = useCallback((updates: Partial<TimeConversion>) => {
    setConversion(prev => ({ ...prev, ...updates }))
  }, [])

  const filteredTimezones = useMemo(() => 
    allTimezones.filter(tz =>
      tz.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  )

  return {
    // State
    mounted,
    currentTime,
    selectedCities,
    conversion,
    searchTerm,
    activeTab,
    filteredTimezones,

    // Actions
    setSearchTerm,
    setActiveTab,
    addCity,
    removeCity,
    convertTime,
    updateConversion,

    // Data
    popularTimezones,
    allTimezones
  }
}
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Type,
  Copy,
  RefreshCw,
  FileText,
  Hash,
  Clock,
  BarChart3,
  Zap,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  Search
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  readingTime: number
  speakingTime: number
  avgWordLength: number
  avgSentenceLength: number
  longestWord: string
  commonWords: { word: string; count: number }[]
}

interface PlatformLimit {
  name: string
  icon: any
  limit: number
  type: 'characters' | 'words'
  description: string
  color: string
}

const PLATFORM_LIMITS: PlatformLimit[] = [
  { 
    name: 'Twitter', 
    icon: Twitter, 
    limit: 280, 
    type: 'characters', 
    description: 'Твит',
    color: 'text-sky-500'
  },
  { 
    name: 'Facebook', 
    icon: Facebook, 
    limit: 63206, 
    type: 'characters', 
    description: 'Пост',
    color: 'text-blue-600'
  },
  { 
    name: 'Instagram', 
    icon: Instagram, 
    limit: 2200, 
    type: 'characters', 
    description: 'Подпись',
    color: 'text-pink-600'
  },
  { 
    name: 'LinkedIn', 
    icon: Linkedin, 
    limit: 3000, 
    type: 'characters', 
    description: 'Пост',
    color: 'text-blue-700'
  },
  { 
    name: 'Google Title', 
    icon: Search, 
    limit: 60, 
    type: 'characters', 
    description: 'SEO заголовок',
    color: 'text-green-600'
  },
  { 
    name: 'Google Description', 
    icon: Search, 
    limit: 160, 
    type: 'characters', 
    description: 'SEO описание',
    color: 'text-green-600'
  },
  { 
    name: 'SMS', 
    icon: MessageSquare, 
    limit: 160, 
    type: 'characters', 
    description: 'Одно сообщение',
    color: 'text-purple-600'
  },
  { 
    name: 'WhatsApp', 
    icon: MessageSquare, 
    limit: 65536, 
    type: 'characters', 
    description: 'Сообщение',
    color: 'text-green-500'
  }
]

const COMMON_STOP_WORDS = [
  'и', 'в', 'не', 'на', 'я', 'с', 'что', 'а', 'по', 'он', 'она', 'это', 'к', 'но',
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 'for', 'not', 'on'
]

export default function TextCounterPage() {
  const [text, setText] = useState('')
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
    avgWordLength: 0,
    avgSentenceLength: 0,
    longestWord: '',
    commonWords: []
  })
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformLimit | null>(null)

  useEffect(() => {
    analyzeText(text)
  }, [text])

  const analyzeText = (inputText: string) => {
    if (!inputText) {
      setStats({
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        speakingTime: 0,
        avgWordLength: 0,
        avgSentenceLength: 0,
        longestWord: '',
        commonWords: []
      })
      return
    }

    // Character counts
    const characters = inputText.length
    const charactersNoSpaces = inputText.replace(/\s/g, '').length

    // Word count
    const words = inputText.trim().split(/\s+/).filter(word => word.length > 0)
    const wordCount = words.length

    // Sentence count (basic)
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const sentenceCount = sentences.length

    // Paragraph count
    const paragraphs = inputText.split(/\n\n+/).filter(p => p.trim().length > 0)
    const paragraphCount = paragraphs.length

    // Reading time (200 words per minute)
    const readingTime = Math.ceil(wordCount / 200)

    // Speaking time (150 words per minute)
    const speakingTime = Math.ceil(wordCount / 150)

    // Average word length
    const totalWordLength = words.reduce((sum, word) => sum + word.length, 0)
    const avgWordLength = wordCount > 0 ? totalWordLength / wordCount : 0

    // Average sentence length
    const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0

    // Longest word
    const longestWord = words.reduce((longest, word) => 
      word.length > longest.length ? word : longest, ''
    )

    // Common words (excluding stop words)
    const wordFrequency: { [key: string]: number } = {}
    words.forEach(word => {
      const lowercaseWord = word.toLowerCase().replace(/[^а-яa-z0-9]/g, '')
      if (lowercaseWord && !COMMON_STOP_WORDS.includes(lowercaseWord)) {
        wordFrequency[lowercaseWord] = (wordFrequency[lowercaseWord] || 0) + 1
      }
    })

    const commonWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }))

    setStats({
      characters,
      charactersNoSpaces,
      words: wordCount,
      sentences: sentenceCount,
      paragraphs: paragraphCount,
      readingTime,
      speakingTime,
      avgWordLength,
      avgSentenceLength,
      longestWord,
      commonWords
    })
  }

  const copyStats = () => {
    const statsText = `
Статистика текста:

Символы: ${stats.characters}
Символы без пробелов: ${stats.charactersNoSpaces}
Слова: ${stats.words}
Предложения: ${stats.sentences}
Абзацы: ${stats.paragraphs}

Время чтения: ~${stats.readingTime} мин
Время озвучивания: ~${stats.speakingTime} мин

Средняя длина слова: ${stats.avgWordLength.toFixed(1)} символов
Средняя длина предложения: ${stats.avgSentenceLength.toFixed(1)} слов
Самое длинное слово: ${stats.longestWord}

Частые слова:
${stats.commonWords.map(({ word, count }) => `• ${word} (${count})`).join('\n')}
    `.trim()

    navigator.clipboard.writeText(statsText)
    toast.success('Статистика скопирована!')
  }

  const copyText = () => {
    navigator.clipboard.writeText(text)
    toast.success('Текст скопирован!')
  }

  const clearText = () => {
    setText('')
    setSelectedPlatform(null)
    toast.success('Текст очищен')
  }

  const loadExample = () => {
    const exampleText = `Счетчик символов и слов - это важный инструмент для создания контента. Он помогает оптимизировать тексты для социальных сетей и SEO.

Каждая платформа имеет свои ограничения. Twitter позволяет использовать только 280 символов. Instagram дает больше пространства - до 2200 символов для подписи.

SEO-оптимизация требует особого внимания к длине заголовков и описаний. Google обычно показывает первые 60 символов заголовка и 160 символов описания в результатах поиска.`

    setText(exampleText)
    toast.success('Пример загружен')
  }

  const getPlatformProgress = (platform: PlatformLimit): number => {
    const value = platform.type === 'characters' ? stats.characters : stats.words
    return Math.min((value / platform.limit) * 100, 100)
  }

  const getPlatformStatus = (platform: PlatformLimit) => {
    const value = platform.type === 'characters' ? stats.characters : stats.words
    const percentage = (value / platform.limit) * 100

    if (percentage <= 80) {
      return { color: 'text-green-600', icon: CheckCircle, status: 'Оптимально' }
    } else if (percentage <= 100) {
      return { color: 'text-yellow-600', icon: AlertCircle, status: 'Близко к лимиту' }
    } else {
      return { color: 'text-red-600', icon: AlertCircle, status: 'Превышен лимит' }
    }
  }

  const highlightKeywords = () => {
    if (stats.commonWords.length === 0) return text

    let highlightedText = text
    stats.commonWords.forEach(({ word }) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      highlightedText = highlightedText.replace(regex, `**${word}**`)
    })
    return highlightedText
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Text Input */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="text-input" className="text-base">
                Введите или вставьте текст
              </Label>
              <div className="flex gap-2">
                <Button onClick={loadExample} variant="outline" size="sm">
                  Пример
                </Button>
                <Button onClick={copyText} variant="outline" size="sm" disabled={!text}>
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать
                </Button>
                <Button onClick={clearText} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Очистить
                </Button>
              </div>
            </div>

            <Textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Начните вводить или вставьте текст для анализа..."
              className="min-h-[400px] resize-y"
            />

            {/* Quick Stats Bar */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{stats.characters}</strong> символов
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{stats.words}</strong> слов
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{stats.sentences}</strong> предложений
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  ~<strong>{stats.readingTime}</strong> мин чтения
                </span>
              </div>
            </div>
          </Card>

          {/* Platform Limits */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Лимиты платформ
            </h3>

            <div className="space-y-3">
              {PLATFORM_LIMITS.map((platform) => {
                const progress = getPlatformProgress(platform)
                const status = getPlatformStatus(platform)
                const Icon = platform.icon
                const StatusIcon = status.icon

                return (
                  <div
                    key={`${platform.name}-${platform.description}`}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedPlatform?.name === platform.name && selectedPlatform?.description === platform.description
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setSelectedPlatform(platform)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("w-4 h-4", platform.color)} />
                        <span className="font-medium">{platform.name}</span>
                        <span className="text-sm text-muted-foreground">• {platform.description}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={cn("w-4 h-4", status.color)} />
                        <span className={cn("text-sm", status.color)}>
                          {platform.type === 'characters' ? stats.characters : stats.words}/{platform.limit}
                        </span>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          {/* Detailed Stats */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Подробная статистика
              </h3>
              <Button onClick={copyStats} variant="outline" size="sm">
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Character Stats */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Символы</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Всего символов:</span>
                    <span className="font-mono font-medium">{stats.characters}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Без пробелов:</span>
                    <span className="font-mono font-medium">{stats.charactersNoSpaces}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Пробелов:</span>
                    <span className="font-mono font-medium">
                      {stats.characters - stats.charactersNoSpaces}
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Structure */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Структура текста</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Слов:</span>
                    <span className="font-mono font-medium">{stats.words}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Предложений:</span>
                    <span className="font-mono font-medium">{stats.sentences}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Абзацев:</span>
                    <span className="font-mono font-medium">{stats.paragraphs}</span>
                  </div>
                </div>
              </div>

              {/* Reading Metrics */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Время</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Время чтения:</span>
                    <span className="font-medium">~{stats.readingTime} мин</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Время озвучивания:</span>
                    <span className="font-medium">~{stats.speakingTime} мин</span>
                  </div>
                </div>
              </div>

              {/* Averages */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Средние значения</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Длина слова:</span>
                    <span className="font-mono font-medium">
                      {stats.avgWordLength.toFixed(1)} симв.
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Длина предложения:</span>
                    <span className="font-mono font-medium">
                      {stats.avgSentenceLength.toFixed(1)} слов
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Word Analysis */}
          {stats.words > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Анализ слов
              </h3>

              <div className="space-y-4">
                {stats.longestWord && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Самое длинное слово
                    </h4>
                    <Badge variant="secondary" className="font-mono">
                      {stats.longestWord} ({stats.longestWord.length} симв.)
                    </Badge>
                  </div>
                )}

                {stats.commonWords.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Частые слова
                    </h4>
                    <div className="space-y-2">
                      {stats.commonWords.map(({ word, count }) => (
                        <div key={word} className="flex items-center justify-between">
                          <span className="font-mono text-sm">{word}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Selected Platform Info */}
          {selectedPlatform && (
            <Card className="p-6 border-primary">
              <div className="flex items-center gap-2 mb-3">
                <selectedPlatform.icon className={cn("w-5 h-5", selectedPlatform.color)} />
                <h4 className="font-semibold">{selectedPlatform.name}</h4>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{selectedPlatform.description}</p>
                <div className="flex justify-between">
                  <span>Лимит:</span>
                  <span className="font-medium">
                    {selectedPlatform.limit} {selectedPlatform.type === 'characters' ? 'символов' : 'слов'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Использовано:</span>
                  <span className="font-medium">
                    {selectedPlatform.type === 'characters' ? stats.characters : stats.words}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Осталось:</span>
                  <span className="font-medium">
                    {Math.max(0, selectedPlatform.limit - (selectedPlatform.type === 'characters' ? stats.characters : stats.words))}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Tips */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Советы по оптимизации текста
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">SEO оптимизация</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Заголовок: 50-60 символов</li>
              <li>• Описание: 150-160 символов</li>
              <li>• URL: короткий и понятный</li>
              <li>• Ключевые слова: 2-3% плотность</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Социальные сети</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Twitter: используйте хештеги</li>
              <li>• Instagram: эмодзи привлекают внимание</li>
              <li>• LinkedIn: профессиональный тон</li>
              <li>• Facebook: визуальный контент</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Читабельность</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Короткие предложения (15-20 слов)</li>
              <li>• Простые слова предпочтительнее</li>
              <li>• Используйте абзацы</li>
              <li>• Добавляйте подзаголовки</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
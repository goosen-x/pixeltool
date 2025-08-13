'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Grid3X3,
  Plus,
  Minus,
  Shuffle,
  Copy,
  Share,
  Download,
  RefreshCw,
  CheckCircle,
  Circle,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { useTranslations } from 'next-intl'

interface BingoCell {
  id: string
  text: string
  isCompleted: boolean
  isFree?: boolean
}

interface BingoTemplate {
  name: string
  items: string[]
}

export default function BingoGeneratorPage() {
  const t = useTranslations('widgets.bingoGenerator')
  const [gridSize, setGridSize] = useState(5)
  const [bingoItems, setBingoItems] = useState<string[]>([''])
  const [bingoGrid, setBingoGrid] = useState<BingoCell[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<string>('')
  const [shareUrl, setShareUrl] = useState<string>('')

  // Default bingo templates
  const templates: BingoTemplate[] = [
    {
      name: t('templates.meeting.name'),
      items: [
        t('templates.meeting.items.0'),
        t('templates.meeting.items.1'),
        t('templates.meeting.items.2'),
        t('templates.meeting.items.3'),
        t('templates.meeting.items.4'),
        t('templates.meeting.items.5'),
        t('templates.meeting.items.6'),
        t('templates.meeting.items.7'),
        t('templates.meeting.items.8'),
        t('templates.meeting.items.9'),
        t('templates.meeting.items.10'),
        t('templates.meeting.items.11'),
        t('templates.meeting.items.12'),
        t('templates.meeting.items.13'),
        t('templates.meeting.items.14'),
        t('templates.meeting.items.15'),
        t('templates.meeting.items.16'),
        t('templates.meeting.items.17'),
        t('templates.meeting.items.18'),
        t('templates.meeting.items.19'),
        t('templates.meeting.items.20'),
        t('templates.meeting.items.21'),
        t('templates.meeting.items.22'),
        t('templates.meeting.items.23'),
        t('templates.meeting.items.24')
      ]
    },
    {
      name: t('templates.travel.name'),
      items: [
        t('templates.travel.items.0'),
        t('templates.travel.items.1'),
        t('templates.travel.items.2'),
        t('templates.travel.items.3'),
        t('templates.travel.items.4'),
        t('templates.travel.items.5'),
        t('templates.travel.items.6'),
        t('templates.travel.items.7'),
        t('templates.travel.items.8'),
        t('templates.travel.items.9'),
        t('templates.travel.items.10'),
        t('templates.travel.items.11'),
        t('templates.travel.items.12'),
        t('templates.travel.items.13'),
        t('templates.travel.items.14'),
        t('templates.travel.items.15'),
        t('templates.travel.items.16'),
        t('templates.travel.items.17'),
        t('templates.travel.items.18'),
        t('templates.travel.items.19'),
        t('templates.travel.items.20'),
        t('templates.travel.items.21'),
        t('templates.travel.items.22'),
        t('templates.travel.items.23'),
        t('templates.travel.items.24')
      ]
    }
  ]

  // Initialize grid on load and when size changes
  useEffect(() => {
    generateBingoGrid()
  }, [gridSize, bingoItems, generateBingoGrid])

  // Load shared bingo from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sharedData = params.get('data')
    
    if (sharedData) {
      try {
        const decodedData = JSON.parse(atob(sharedData))
        setGridSize(decodedData.size || 5)
        setBingoItems(decodedData.items || [''])
        if (decodedData.completed) {
          // Apply completed state after grid generation
          setTimeout(() => {
            setBingoGrid(prev => prev.map(cell => ({
              ...cell,
              isCompleted: decodedData.completed.includes(cell.id)
            })))
          }, 100)
        }
      } catch (error) {
        toast.error(t('toast.invalidShareUrl'))
      }
    }
  }, [t])

  const generateBingoGrid = useCallback(() => {
    const totalCells = gridSize * gridSize
    const centerIndex = Math.floor(totalCells / 2)
    const isCenterFree = gridSize % 2 === 1
    
    // Filter out empty items
    const validItems = bingoItems.filter(item => item.trim() !== '')
    
    if (validItems.length === 0) {
      setBingoGrid([])
      return
    }

    // Create shuffled items array
    let shuffledItems = [...validItems]
    
    // If we need more items than available, repeat them
    while (shuffledItems.length < totalCells) {
      shuffledItems = [...shuffledItems, ...validItems]
    }
    
    // Shuffle the items
    for (let i = shuffledItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]]
    }

    // Create grid cells
    const newGrid: BingoCell[] = []
    for (let i = 0; i < totalCells; i++) {
      const isCenter = isCenterFree && i === centerIndex
      newGrid.push({
        id: `cell-${i}`,
        text: isCenter ? t('freeSpace') : shuffledItems[i] || '',
        isCompleted: isCenter, // Free space starts completed
        isFree: isCenter
      })
    }

    setBingoGrid(newGrid)
  }, [gridSize, bingoItems, t])

  const addBingoItem = () => {
    setBingoItems([...bingoItems, ''])
  }

  const removeBingoItem = (index: number) => {
    if (bingoItems.length > 1) {
      const newItems = bingoItems.filter((_, i) => i !== index)
      setBingoItems(newItems)
    }
  }

  const updateBingoItem = (index: number, value: string) => {
    const newItems = [...bingoItems]
    newItems[index] = value
    setBingoItems(newItems)
  }

  const loadTemplate = (templateName: string) => {
    const template = templates.find(t => t.name === templateName)
    if (template) {
      setBingoItems(template.items)
      setCurrentTemplate(templateName)
      toast.success(t('toast.templateLoaded'))
    }
  }

  const toggleCell = (cellId: string) => {
    setBingoGrid(prev => prev.map(cell => 
      cell.id === cellId ? { ...cell, isCompleted: !cell.isCompleted } : cell
    ))
  }

  const resetGrid = () => {
    setBingoGrid(prev => prev.map(cell => ({ 
      ...cell, 
      isCompleted: cell.isFree || false 
    })))
    toast.success(t('toast.gridReset'))
  }

  const shuffleGrid = () => {
    generateBingoGrid()
    toast.success(t('toast.gridShuffled'))
  }

  const checkBingo = (): boolean => {
    const completedCells = bingoGrid.filter(cell => cell.isCompleted).map(cell => 
      bingoGrid.indexOf(cell)
    )

    // Check rows
    for (let row = 0; row < gridSize; row++) {
      let rowComplete = true
      for (let col = 0; col < gridSize; col++) {
        const index = row * gridSize + col
        if (!completedCells.includes(index)) {
          rowComplete = false
          break
        }
      }
      if (rowComplete) return true
    }

    // Check columns
    for (let col = 0; col < gridSize; col++) {
      let colComplete = true
      for (let row = 0; row < gridSize; row++) {
        const index = row * gridSize + col
        if (!completedCells.includes(index)) {
          colComplete = false
          break
        }
      }
      if (colComplete) return true
    }

    // Check diagonals
    let diagonal1Complete = true
    let diagonal2Complete = true
    
    for (let i = 0; i < gridSize; i++) {
      if (!completedCells.includes(i * gridSize + i)) {
        diagonal1Complete = false
      }
      if (!completedCells.includes(i * gridSize + (gridSize - 1 - i))) {
        diagonal2Complete = false
      }
    }

    return diagonal1Complete || diagonal2Complete
  }

  const generateShareUrl = () => {
    const completedIds = bingoGrid.filter(cell => cell.isCompleted).map(cell => cell.id)
    const shareData = {
      size: gridSize,
      items: bingoItems.filter(item => item.trim() !== ''),
      completed: completedIds
    }
    
    const encodedData = btoa(JSON.stringify(shareData))
    const url = `${window.location.origin}${window.location.pathname}?data=${encodedData}`
    
    navigator.clipboard.writeText(url)
    setShareUrl(url)
    toast.success(t('toast.shareUrlCopied'))
  }

  const exportAsText = () => {
    let textOutput = `${t('title')}\n\n`
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const index = row * gridSize + col
        const cell = bingoGrid[index]
        const status = cell.isCompleted ? '✅' : '⬜'
        textOutput += `${status} ${cell.text}\n`
      }
      textOutput += '\n'
    }
    
    const blob = new Blob([textOutput], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bingo-card.txt'
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success(t('toast.exported'))
  }

  const hasBingo = checkBingo()
  const progress = bingoGrid.filter(cell => cell.isCompleted).length
  const progressPercentage = bingoGrid.length > 0 ? (progress / bingoGrid.length) * 100 : 0

  return (
    <WidgetLayout>
      {/* Settings Section */}
      <WidgetSection title={t('sections.settings')}>
        <div className="grid md:grid-cols-2 gap-6">
          <WidgetInput 
            label={t('inputs.gridSize.label')} 
            description={t('inputs.gridSize.description')}
          >
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setGridSize(Math.max(3, gridSize - 1))}
                variant="outline" 
                size="sm"
                disabled={gridSize <= 3}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-2xl font-bold w-8 text-center">{gridSize}</span>
              <Button 
                onClick={() => setGridSize(Math.min(7, gridSize + 1))}
                variant="outline" 
                size="sm"
                disabled={gridSize >= 7}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Badge variant="outline">{gridSize}x{gridSize}</Badge>
            </div>
          </WidgetInput>

          <div className="space-y-3">
            <label className="text-sm font-medium">{t('inputs.templates.label')}</label>
            <p className="text-xs text-muted-foreground">{t('inputs.templates.description')}</p>
            <div className="flex gap-2 flex-wrap">
              {templates.map(template => (
                <Button
                  key={template.name}
                  onClick={() => loadTemplate(template.name)}
                  variant={currentTemplate === template.name ? "default" : "outline"}
                  size="sm"
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </WidgetSection>

      {/* Bingo Items Input */}
      <WidgetSection title={t('sections.items')}>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t('sections.itemsDescription')}</p>
          
          {bingoItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-8">
                {index + 1}.
              </span>
              <Input
                value={item}
                onChange={(e) => updateBingoItem(index, e.target.value)}
                placeholder={t('inputs.bingoItem.placeholder')}
                className="flex-1"
              />
              <Button
                onClick={() => removeBingoItem(index)}
                variant="outline"
                size="sm"
                disabled={bingoItems.length <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <div className="flex gap-2">
            <Button onClick={addBingoItem} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {t('actions.addItem')}
            </Button>
            
            <Button onClick={shuffleGrid} variant="outline" size="sm">
              <Shuffle className="w-4 h-4 mr-2" />
              {t('actions.shuffle')}
            </Button>
          </div>
        </div>
      </WidgetSection>

      {/* Bingo Grid */}
      {bingoGrid.length > 0 && (
        <WidgetSection title={t('sections.bingoCard')}>
          <WidgetOutput>
            <div className="space-y-6">
              {/* Progress and Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant={hasBingo ? "default" : "outline"} className="flex items-center gap-2">
                    {hasBingo ? <CheckCircle className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                    {hasBingo ? t('status.bingo') : t('status.inProgress')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {progress}/{bingoGrid.length} ({progressPercentage.toFixed(0)}%)
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={resetGrid} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('actions.reset')}
                  </Button>
                  <Button onClick={generateShareUrl} variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    {t('actions.share')}
                  </Button>
                  <Button onClick={exportAsText} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    {t('actions.export')}
                  </Button>
                </div>
              </div>

              {/* Bingo Grid */}
              <div 
                className="grid gap-2 mx-auto max-w-2xl"
                style={{ 
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  aspectRatio: '1'
                }}
              >
                {bingoGrid.map((cell, index) => (
                  <button
                    key={cell.id}
                    onClick={() => !cell.isFree && toggleCell(cell.id)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-200 text-xs font-medium",
                      "hover:scale-105 active:scale-95",
                      "min-h-[80px] flex items-center justify-center text-center",
                      cell.isCompleted 
                        ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300"
                        : "bg-muted/30 border-muted-foreground/20 hover:border-primary/50",
                      cell.isFree && "bg-yellow-500/20 border-yellow-500 text-yellow-700 dark:text-yellow-300"
                    )}
                    disabled={cell.isFree}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-center">
                        {cell.isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Circle className="w-4 h-4 opacity-50" />
                        )}
                      </div>
                      <span className="leading-tight">{cell.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              {hasBingo && (
                <div className="text-center py-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {t('congratulations.title')}
                    </span>
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                  </div>
                  <p className="text-muted-foreground">{t('congratulations.message')}</p>
                </div>
              )}
            </div>
        </WidgetOutput>
        </WidgetSection>
      )}

      {/* Info Section */}
      <WidgetSection title={t('sections.about')}>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">{t('info.howToPlay')}</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• {t('info.features.createGrid')}</li>
                <li>• {t('info.features.clickCells')}</li>
                <li>• {t('info.features.getLine')}</li>
                <li>• {t('info.features.shareProgress')}</li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">{t('info.features.title')}</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• {t('info.features.customTemplates')}</li>
                <li>• {t('info.features.shareableLinks')}</li>
                <li>• {t('info.features.exportOptions')}</li>
                <li>• {t('info.features.progressTracking')}</li>
              </ul>
            </div>
          </div>
        </div>
      </WidgetSection>
    </WidgetLayout>
  )
}
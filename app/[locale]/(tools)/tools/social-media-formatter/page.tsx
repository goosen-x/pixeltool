'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles,
  Zap,
  Palette,
  Download,
  Upload,
  RotateCcw,
  Wand2,
  Heart
} from 'lucide-react'

// Import our new components
import { 
  PlatformSelector, 
  PresetTemplates, 
  Platform, 
  Template 
} from '@/components/tools/social-media-formatter'

// Zero-width characters for different purposes
const ZERO_WIDTH_SPACE = '\u200B'
const ZERO_WIDTH_NON_JOINER = '\u200C'
const ZERO_WIDTH_JOINER = '\u200D'
const WORD_JOINER = '\u2060'
const INVISIBLE_SEPARATOR = '\u2063'

interface FormatOption {
  id: string
  enabled: boolean
}

const formatOptions: { id: string; transform: (text: string) => string }[] = [
  {
    id: 'preserveSpaces',
    transform: (text: string) => {
      return text.replace(/ {2,}/g, match => {
        return match.split('').join(ZERO_WIDTH_SPACE)
      })
    }
  },
  {
    id: 'preserveNewlines',
    transform: (text: string) => {
      return text.replace(/\n{2,}/g, match => {
        return match.split('').join(ZERO_WIDTH_SPACE)
      })
    }
  },
  {
    id: 'addIndentation',
    transform: (text: string) => {
      const indent = '    '.split('').join(ZERO_WIDTH_SPACE)
      return text
        .split('\n')
        .map(line => {
          if (line.trim()) {
            return indent + line
          }
          return line
        })
        .join('\n')
    }
  },
  {
    id: 'centerText',
    transform: (text: string) => {
      const lines = text.split('\n')
      const maxLength = Math.max(...lines.map(line => line.length))

      return lines
        .map(line => {
          if (line.trim()) {
            const spaces = Math.floor((maxLength - line.trim().length) / 2)
            const padding = ' '.repeat(spaces).split('').join(ZERO_WIDTH_SPACE)
            return padding + line.trim() + padding
          }
          return line
        })
        .join('\n')
    }
  },
  {
    id: 'fullFormat',
    transform: (text: string) => {
      let result = text
      // Apply spaces preservation
      result = result.replace(/ {2,}/g, match => {
        return match.split('').join(ZERO_WIDTH_SPACE)
      })
      // Apply newlines preservation
      result = result.replace(/\n{2,}/g, match => {
        return match.split('').join(ZERO_WIDTH_SPACE)
      })
      return result
    }
  }
]

export default function SocialMediaFormatterPage() {
  const t = useTranslations('widgets.socialMediaFormatter')
  
  // State
  const [mounted, setMounted] = useState(false)
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram')
  const [formatOptionsState, setFormatOptionsState] = useState<FormatOption[]>([
    { id: 'preserveSpaces', enabled: true },
    { id: 'preserveNewlines', enabled: true },
    { id: 'addIndentation', enabled: false },
    { id: 'centerText', enabled: false },
    { id: 'fullFormat', enabled: false }
  ])
  const [copiedOutput, setCopiedOutput] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [autoFormat, setAutoFormat] = useState(true)

  // Character counts
  const inputCharCount = inputText.length
  const outputCharCount = outputText.length
  const invisibleCharsCount = outputCharCount - inputCharCount

  useEffect(() => {
    setMounted(true)
    
    // Load saved state from localStorage
    const savedState = localStorage.getItem('socialMediaFormatter')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        if (parsed.inputText) setInputText(parsed.inputText)
        if (parsed.selectedPlatform) setSelectedPlatform(parsed.selectedPlatform)
        if (parsed.formatOptions) setFormatOptionsState(parsed.formatOptions)
      } catch (error) {
        console.warn('Failed to load saved state:', error)
      }
    }
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    if (!mounted) return
    
    const stateToSave = {
      inputText,
      selectedPlatform,
      formatOptions: formatOptionsState
    }
    localStorage.setItem('socialMediaFormatter', JSON.stringify(stateToSave))
  }, [inputText, selectedPlatform, formatOptionsState, mounted])

  // Auto-format when options or text change
  useEffect(() => {
    if (autoFormat && inputText.trim()) {
      formatText()
    }
  }, [inputText, formatOptionsState, autoFormat])

  const formatText = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText('')
      return
    }

    let result = inputText

    // Apply enabled format options
    formatOptionsState.forEach(option => {
      if (option.enabled) {
        const formatter = formatOptions.find(f => f.id === option.id)
        if (formatter) {
          result = formatter.transform(result)
        }
      }
    })

    setOutputText(result)
  }, [inputText, formatOptionsState])

  const copyToClipboard = async () => {
    if (!outputText) {
      toast.error(t('toast.errorEmptyText'))
      return
    }

    try {
      await navigator.clipboard.writeText(outputText)
      setCopiedOutput(true)
      toast.success(t('toast.copiedToClipboard'))
      setTimeout(() => setCopiedOutput(false), 2000)
    } catch (err) {
      toast.error(t('toast.errorClipboard'))
    }
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInputText(text)
      toast.success(t('toast.pastedFromClipboard'))
    } catch (err) {
      toast.error(t('toast.errorClipboard'))
    }
  }

  const resetAll = () => {
    setInputText('')
    setOutputText('')
    setFormatOptionsState([
      { id: 'preserveSpaces', enabled: true },
      { id: 'preserveNewlines', enabled: true },
      { id: 'addIndentation', enabled: false },
      { id: 'centerText', enabled: false },
      { id: 'fullFormat', enabled: false }
    ])
    setSelectedPlatform('instagram')
    toast.success(t('toast.resetComplete'))
  }

  const clearText = () => {
    setInputText('')
    setOutputText('')
    toast.success(t('toast.textCleared'))
  }

  const applyTemplate = (template: Template) => {
    setInputText(template.example)
    toast.success(t('toast.templateApplied'))
    setShowTemplates(false)
  }

  const toggleFormatOption = (optionId: string) => {
    setFormatOptionsState(prev => 
      prev.map(option => 
        option.id === optionId 
          ? { ...option, enabled: !option.enabled }
          : option
      )
    )
  }

  if (!mounted) {
    return (
      <div className='max-w-7xl mx-auto space-y-8'>
        <div className='text-center space-y-4'>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-muted rounded-lg w-64 mx-auto'></div>
            <div className='h-4 bg-muted rounded w-96 mx-auto'></div>
          </div>
        </div>
        <div className='animate-pulse'>
          <div className='h-96 bg-muted rounded-lg'></div>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto space-y-8'>

      {/* Quick Actions */}
      <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-center gap-2 flex-wrap'>
            <Button 
              variant='outline' 
              size='sm'
              onClick={() => setShowTemplates(!showTemplates)}
              className='bg-white/50 dark:bg-gray-800/50'
            >
              <Wand2 className='w-4 h-4 mr-2' />
              {showTemplates ? 'Hide Templates' : 'Show Templates'}
            </Button>
            <Button 
              variant='outline' 
              size='sm'
              onClick={pasteFromClipboard}
              className='bg-white/50 dark:bg-gray-800/50'
            >
              <Upload className='w-4 h-4 mr-2' />
              {t('textInput.pasteFromClipboard')}
            </Button>
            <Button 
              variant='outline' 
              size='sm'
              onClick={() => setAutoFormat(!autoFormat)}
              className={cn(
                'bg-white/50 dark:bg-gray-800/50',
                autoFormat && 'bg-primary/10 border-primary'
              )}
            >
              <Zap className='w-4 h-4 mr-2' />
              {t('actions.autoFormat')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates Section */}
      {showTemplates && (
        <PresetTemplates 
          onSelectTemplate={applyTemplate}
          t={t}
        />
      )}

      {/* Main Editor */}
      <div className='grid lg:grid-cols-2 gap-8'>
        {/* Input Section */}
        <Card className='h-fit'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Sparkles className='w-5 h-5 text-primary' />
              {t('textInput.label')}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='input-text'>{t('textInput.label')}</Label>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline'>
                    {t('preview.characterCount', { count: inputCharCount })}
                  </Badge>
                </div>
              </div>
              
              <Textarea
                id='input-text'
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('textInput.placeholder')}
                className='min-h-[300px] font-mono text-sm resize-none'
                spellCheck={false}
              />
            </div>

            <div className='flex gap-2'>
              <Button 
                onClick={formatText}
                disabled={!inputText.trim()}
                className='flex-1'
              >
                <RefreshCw className='w-4 h-4 mr-2' />
                {t('actions.format')}
              </Button>
              <Button 
                onClick={clearText}
                variant='outline'
                disabled={!inputText.trim()}
              >
                <RotateCcw className='w-4 h-4 mr-2' />
                {t('textInput.clearText')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className='h-fit'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Copy className='w-5 h-5 text-green-600' />
              {t('preview.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='output-text'>{t('actions.copyFormatted')}</Label>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline'>
                    {t('preview.characterCount', { count: outputCharCount })}
                  </Badge>
                  {invisibleCharsCount > 0 && (
                    <Badge variant='secondary'>
                      {t('preview.invisibleChars', { count: invisibleCharsCount })}
                    </Badge>
                  )}
                </div>
              </div>
              
              <Textarea
                id='output-text'
                value={outputText}
                readOnly
                placeholder='Formatted text will appear here...'
                className='min-h-[300px] font-mono text-sm bg-muted/50 resize-none'
                spellCheck={false}
              />
            </div>

            <div className='flex gap-2'>
              <Button 
                onClick={copyToClipboard}
                disabled={!outputText}
                className='flex-1'
              >
                {copiedOutput ? (
                  <>
                    <Check className='w-4 h-4 mr-2' />
                    {t('actions.copy')}d!
                  </>
                ) : (
                  <>
                    <Copy className='w-4 h-4 mr-2' />
                    {t('actions.copyFormatted')}
                  </>
                )}
              </Button>
              <Button 
                onClick={resetAll}
                variant='outline'
              >
                <RotateCcw className='w-4 h-4 mr-2' />
                {t('actions.reset')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Format Options */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Palette className='w-5 h-5 text-orange-600' />
            {t('formatOptions.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-3'>
            {formatOptionsState.map((option) => (
              <Button
                key={option.id}
                variant={option.enabled ? 'default' : 'outline'}
                size='sm'
                onClick={() => toggleFormatOption(option.id)}
                className='justify-start h-auto p-3 flex-col items-start'
              >
                <span className='font-medium text-sm'>
                  {t(`formatOptions.${option.id}`)}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Platform Selector and Preview */}
      <PlatformSelector 
        selectedPlatform={selectedPlatform}
        onSelectPlatform={setSelectedPlatform}
        text={outputText || inputText}
        t={t}
      />

      {/* How it Works */}
      <Card className='bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-green-600' />
            {t('howItWorks.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-muted-foreground'>
            {t('howItWorks.description')}
          </p>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold'>
                  {step}
                </div>
                <span className='text-sm font-medium'>
                  {t(`howItWorks.step${step}`)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
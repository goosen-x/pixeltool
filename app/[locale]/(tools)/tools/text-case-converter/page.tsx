'use client'

import { useState, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'
import { Copy, Download, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WidgetWrapper } from '@/components/tools/WidgetWrapper'
import { useWidgetKeyboard, createConverterShortcuts } from '@/lib/hooks/widgets'

type CaseType = 
  | 'uppercase'
  | 'lowercase'
  | 'capitalize'
  | 'title'
  | 'sentence'
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'alternating'
  | 'inverse'

export default function TextCaseConverterPage() {
  const t = useTranslations('widgets.textCaseConverter')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [caseType, setCaseType] = useState<CaseType>('uppercase')

  const convertCase = useCallback((text: string, type: CaseType): string => {
    switch (type) {
      case 'uppercase':
        return text.toUpperCase()
      
      case 'lowercase':
        return text.toLowerCase()
      
      case 'capitalize':
        return text.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ')
      
      case 'title':
        const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet']
        return text.split(' ').map((word, index) => {
          if (index === 0 || !smallWords.includes(word.toLowerCase())) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          }
          return word.toLowerCase()
        }).join(' ')
      
      case 'sentence':
        return text.split('. ').map(sentence => {
          const trimmed = sentence.trim()
          if (trimmed.length === 0) return ''
          return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
        }).join('. ')
      
      case 'camelCase':
        return text
          .split(/[\s_-]+/)
          .map((word, index) => {
            if (index === 0) {
              return word.toLowerCase()
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          })
          .join('')
      
      case 'PascalCase':
        return text
          .split(/[\s_-]+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join('')
      
      case 'snake_case':
        return text
          .trim()
          .replace(/[\s-]+/g, '_')
          .toLowerCase()
      
      case 'kebab-case':
        return text
          .trim()
          .replace(/[\s_]+/g, '-')
          .toLowerCase()
      
      case 'alternating':
        return text.split('').map((char, index) => 
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        ).join('')
      
      case 'inverse':
        return text.split('').map(char => 
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        ).join('')
      
      default:
        return text
    }
  }, [])

  const handleConvert = useCallback(() => {
    const converted = convertCase(input, caseType)
    setOutput(converted)
  }, [input, caseType, convertCase])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output)
    toast.success(t('copied'))
  }, [output, t])

  const handleDownload = useCallback(() => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted-${caseType}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(t('downloaded'))
  }, [output, caseType, t])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
  }, [])

  // Keyboard shortcuts
  useWidgetKeyboard({
    widgetId: 'text-case-converter',
    shortcuts: createConverterShortcuts({
      convert: handleConvert,
      copy: handleCopy,
      reset: handleClear
    })
  })

  return (
    <WidgetWrapper>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('input')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('placeholder')}
              className="min-h-[300px] font-mono"
            />
            <div className="mt-4 flex gap-2">
              <Button onClick={handleClear} variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('clear')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('output')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              readOnly
              placeholder={t('outputPlaceholder')}
              className="min-h-[300px] font-mono"
            />
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={handleCopy} 
                variant="outline" 
                className="w-full"
                disabled={!output}
              >
                <Copy className="w-4 h-4 mr-2" />
                {t('copy')}
              </Button>
              <Button 
                onClick={handleDownload} 
                variant="outline" 
                className="w-full"
                disabled={!output}
              >
                <Download className="w-4 h-4 mr-2" />
                {t('download')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('settings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('caseType')}
              </label>
              <Select value={caseType} onValueChange={(value) => setCaseType(value as CaseType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uppercase">{t('cases.uppercase')}</SelectItem>
                  <SelectItem value="lowercase">{t('cases.lowercase')}</SelectItem>
                  <SelectItem value="capitalize">{t('cases.capitalize')}</SelectItem>
                  <SelectItem value="title">{t('cases.title')}</SelectItem>
                  <SelectItem value="sentence">{t('cases.sentence')}</SelectItem>
                  <SelectItem value="camelCase">{t('cases.camelCase')}</SelectItem>
                  <SelectItem value="PascalCase">{t('cases.PascalCase')}</SelectItem>
                  <SelectItem value="snake_case">{t('cases.snake_case')}</SelectItem>
                  <SelectItem value="kebab-case">{t('cases.kebab-case')}</SelectItem>
                  <SelectItem value="alternating">{t('cases.alternating')}</SelectItem>
                  <SelectItem value="inverse">{t('cases.inverse')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleConvert} 
              className="w-full" 
              size="lg"
              disabled={!input}
            >
              {t('convert')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('examples')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t('originalText')}</p>
              <code className="block p-2 bg-muted rounded">Hello World Example Text</code>
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-sm font-medium">{t('cases.uppercase')}:</span>
                <code>HELLO WORLD EXAMPLE TEXT</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-sm font-medium">{t('cases.lowercase')}:</span>
                <code>hello world example text</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-sm font-medium">{t('cases.capitalize')}:</span>
                <code>Hello World Example Text</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-sm font-medium">{t('cases.camelCase')}:</span>
                <code>helloWorldExampleText</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-sm font-medium">{t('cases.PascalCase')}:</span>
                <code>HelloWorldExampleText</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-sm font-medium">{t('cases.snake_case')}:</span>
                <code>hello_world_example_text</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-sm font-medium">{t('cases.kebab-case')}:</span>
                <code>hello-world-example-text</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </WidgetWrapper>
  )
}
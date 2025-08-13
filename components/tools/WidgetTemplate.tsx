'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { 
  WidgetLayout, 
  WidgetHero, 
  WidgetCard, 
  WidgetSection,
  WidgetGrid,
  WidgetGridCard 
} from '@/components/tools/WidgetLayout'
import {
  WidgetPrimaryButton,
  WidgetSecondaryButton,
  WidgetIconButton,
  WidgetButtonGroup
} from '@/components/tools/WidgetButtons'
import {
  WidgetInput,
  WidgetTextarea,
  WidgetCodeTextarea,
  WidgetCodeInput
} from '@/components/tools/WidgetInputs'
import { KeyboardShortcuts } from '@/components/tools/KeyboardShortcuts'
import { ShortcutsCard } from '@/components/tools/ShortcutsCard'
import { Copy, RefreshCw, Download } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Template for creating new widget components with the modern design system
 * 
 * Usage:
 * 1. Copy this template
 * 2. Replace "WidgetName" with your widget name
 * 3. Update the title and description
 * 4. Implement your widget logic
 * 5. Add translations to locale files
 */

export default function WidgetNamePage() {
  const t = useTranslations('widgets.widgetName')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  // Example functions
  const handleProcess = () => {
    // Your widget logic here
    setOutput(input.toUpperCase())
  }

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    toast.success(t('copied'))
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  // Keyboard shortcuts
  const shortcuts = [
    {
      key: 'Enter',
      meta: true,
      action: handleProcess,
      description: t('process')
    },
    {
      key: 'c',
      meta: true,
      action: handleCopy,
      description: t('copy')
    },
    {
      key: 'k',
      meta: true,
      action: handleClear,
      description: t('clear')
    }
  ]

  return (
    <WidgetLayout>
      <KeyboardShortcuts shortcuts={shortcuts} />
      
      {/* Hero Section */}
      <WidgetHero 
        title={t('title')}
        description={t('description')}
      />

      {/* Main Content */}
      <WidgetCard fullWidth>
        <WidgetSection>
          {/* Input Area */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('input.label')}</label>
            <WidgetTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('input.placeholder')}
              rows={6}
            />
          </div>

          {/* Action Buttons */}
          <WidgetButtonGroup>
            <WidgetPrimaryButton
              onClick={handleProcess}
              icon={<RefreshCw className="w-5 h-5" />}
              className="flex-1"
            >
              {t('process')}
            </WidgetPrimaryButton>
            <WidgetSecondaryButton
              onClick={handleClear}
              disabled={!input && !output}
            >
              {t('clear')}
            </WidgetSecondaryButton>
          </WidgetButtonGroup>

          {/* Output Area */}
          {output && (
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('output.label')}</label>
              <WidgetCodeTextarea
                value={output}
                readOnly
                rows={6}
                actions={
                  <WidgetIconButton onClick={handleCopy}>
                    <Copy className="w-4 h-4" />
                  </WidgetIconButton>
                }
              />
            </div>
          )}
        </WidgetSection>
      </WidgetCard>

      {/* Options/Settings (if needed) */}
      <WidgetGrid>
        <WidgetGridCard title={t('options.title')}>
          {/* Add your options here */}
        </WidgetGridCard>
        
        <WidgetGridCard title={t('info.title')}>
          {/* Add info/help content here */}
        </WidgetGridCard>
      </WidgetGrid>

      {/* Keyboard Shortcuts */}
      <ShortcutsCard
        shortcuts={[
          { keys: '⌘↵', description: t('shortcuts.process') },
          { keys: '⌘C', description: t('shortcuts.copy') },
          { keys: '⌘K', description: t('shortcuts.clear') }
        ]}
      />
    </WidgetLayout>
  )
}
#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'

async function fixBase64Encoder() {
	console.log('🔧 Fixing base64-encoder...')

	const filePath = path.join(
		process.cwd(),
		'app/[locale]/(tools)/tools/base64-encoder/page.tsx'
	)
	let content = await fs.readFile(filePath, 'utf-8')

	// Add WidgetOutput import
	if (!content.includes('import { WidgetOutput }')) {
		content = content.replace(
			"import { WidgetSection } from '@/components/widgets/WidgetSection'",
			"import { WidgetSection } from '@/components/widgets/WidgetSection'\nimport { WidgetOutput } from '@/components/widgets/WidgetOutput'"
		)
	}

	// Replace WidgetCard with WidgetSection
	content = content.replace(
		'<WidgetCard fullWidth>',
		`<WidgetSection
        icon={<Settings className="h-5 w-5" />}
        title="Настройки"
        description="Выберите режим работы"
      >`
	)

	content = content.replace(
		'</WidgetCard>\n\n      <WidgetGrid>',
		`</WidgetSection>

      <div className="grid lg:grid-cols-2 gap-6">`
	)

	// Replace first WidgetGridCard with WidgetSection
	content = content.replace(
		'<WidgetGridCard>\n            <div className="flex items-center justify-between mb-4">\n              <Label className="text-base">',
		`<WidgetSection
            icon={<FileInput className="h-5 w-5" />}
            title="Входные данные"
          >
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base">`
	)

	// Replace statistics WidgetGridCard with WidgetOutput
	content = content.replace(
		'<WidgetGridCard>\n              <h3 className="font-semibold mb-4">Статистика</h3>',
		`<WidgetOutput
              gradientFrom="from-primary/10"
              gradientTo="to-accent/10"
            >
              <h3 className="font-semibold mb-4">Статистика</h3>`
	)

	// Replace output WidgetGridCard with WidgetSection
	content = content.replace(
		"<WidgetGridCard>\n            <div className=\"flex items-center justify-between mb-4\">\n              <Label className=\"text-base\">\n                {mode === 'encode' ? 'Base64 результат' : 'Декодированные данные'}",
		`<WidgetSection
            icon={<FileOutput className="h-5 w-5" />}
            title={mode === 'encode' ? 'Base64 результат' : 'Декодированные данные'}
          >
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base">
                {mode === 'encode' ? 'Base64 результат' : 'Декодированные данные'}`
	)

	// Replace Actions WidgetGridCard
	content = content.replace(
		'<WidgetGridCard title="Действия">',
		`<WidgetSection
            icon={<Zap className="h-5 w-5" />}
            title="Действия"
          >`
	)

	// Replace closing tags
	content = content.replace(
		/          <\/WidgetGridCard>/g,
		'          </WidgetSection>'
	)
	content = content.replace(
		/            <\/WidgetGridCard>/g,
		'            </WidgetOutput>'
	)

	// Replace closing WidgetGrid
	content = content.replace('</WidgetGrid>', '</div>')

	// Replace examples WidgetGridCard
	content = content.replace(
		'<WidgetGridCard>\n            <h3 className="font-semibold mb-4 flex items-center gap-2">\n              <Sparkles className="w-5 h-5" />',
		`<WidgetSection
            icon={<Sparkles className="h-5 w-5" />}
            title="Примеры использования"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />`
	)

	// Replace last WidgetGridCard
	content = content.replace(
		'<WidgetGridCard>\n            <h3 className="font-semibold mb-4 flex items-center gap-2">\n              <Info className="w-4 h-4" />',
		`<WidgetSection
            icon={<Info className="h-5 w-5" />}
            title="Информация"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" />`
	)

	// Add missing imports
	if (!content.includes('FileInput')) {
		content = content.replace(
			"import { Copy, Download, RefreshCw, Upload, FileText, Link, Image, Settings, Info, AlertCircle, Sparkles, Loader2 } from 'lucide-react'",
			"import { Copy, Download, RefreshCw, Upload, FileText, Link, Image, Settings, Info, AlertCircle, Sparkles, Loader2, FileInput, FileOutput, Zap } from 'lucide-react'"
		)
	}

	await fs.writeFile(filePath, content, 'utf-8')
	console.log('✅ Fixed base64-encoder')
}

// Run the script
fixBase64Encoder().catch(console.error)

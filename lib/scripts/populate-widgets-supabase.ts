#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    process.env[key.trim()] = value.trim()
  }
})

import { createClient } from '@supabase/supabase-js'
import { widgets } from '@/lib/constants/widgets'

async function populateWidgets() {
  console.log('🚀 Populating widgets in Supabase...\n')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Get existing widgets to avoid duplicates
  const { data: existingWidgets } = await supabase
    .from('widgets')
    .select('id')
  
  const existingIds = new Set(existingWidgets?.map(w => w.id) || [])
  console.log(`Existing widgets in Supabase: ${existingIds.size}`)
  
  let inserted = 0
  let skipped = 0
  let failed = 0
  
  // Load translations
  const enMessages = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'messages/en.json'), 'utf-8'))
  const ruMessages = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'messages/ru.json'), 'utf-8'))
  
  // First pass: Insert all widgets without related widgets
  console.log('\n📝 First pass: Inserting widgets...\n')
  for (const widget of widgets) {
    try {
      // Skip if already exists
      if (existingIds.has(widget.id)) {
        console.log(`⏭️  Skipping: ${widget.id} (already exists)`)
        skipped++
        continue
      }
      
      // Insert widget
      const { error: widgetError } = await supabase
        .from('widgets')
        .insert({
          id: widget.id,
          slug: widget.path,
          icon: widget.icon ? widget.icon.name || widget.icon.displayName || widget.id : null,
          category: widget.category,
          is_new: false,
          is_popular: false
        })
      
      if (widgetError) {
        console.error(`❌ Failed to insert widget ${widget.id}:`, widgetError.message)
        console.error('   Widget data:', {
          id: widget.id,
          slug: widget.path,
          icon: widget.icon ? widget.icon.name || widget.icon.displayName || widget.id : null,
          category: widget.category
        })
        console.error('   Full error:', widgetError)
        failed++
        continue
      }
      
      // Insert translations
      const translations = [
        {
          widget_id: widget.id,
          locale: 'en',
          title: enMessages.widgets[widget.translationKey]?.title || widget.id,
          description: enMessages.widgets[widget.translationKey]?.description || ''
        },
        {
          widget_id: widget.id,
          locale: 'ru',
          title: ruMessages.widgets[widget.translationKey]?.title || widget.id,
          description: ruMessages.widgets[widget.translationKey]?.description || ''
        }
      ]
      
      const { error: translationError } = await supabase
        .from('widget_translations')
        .insert(translations)
      
      if (translationError) {
        console.error(`❌ Failed to insert translations for ${widget.id}:`, translationError.message)
        failed++
        continue
      }
      
      // Insert FAQs if available
      const enFaqs = enMessages.widgets[widget.translationKey]?.faqs || []
      const ruFaqs = ruMessages.widgets[widget.translationKey]?.faqs || []
      
      const faqs: any[] = []
      
      enFaqs.forEach((faq: any, index: number) => {
        faqs.push({
          widget_id: widget.id,
          locale: 'en',
          question: faq.question,
          answer: faq.answer,
          sort_order: index
        })
      })
      
      ruFaqs.forEach((faq: any, index: number) => {
        faqs.push({
          widget_id: widget.id,
          locale: 'ru',
          question: faq.question,
          answer: faq.answer,
          sort_order: index
        })
      })
      
      if (faqs.length > 0) {
        const { error: faqError } = await supabase
          .from('widget_faqs')
          .insert(faqs)
        
        if (faqError) {
          console.error(`⚠️  Failed to insert FAQs for ${widget.id}:`, faqError.message)
        }
      }
      
      // Insert tags
      if (widget.tags && widget.tags.length > 0) {
        const tags = widget.tags.map(tag => ({
          widget_id: widget.id,
          tag
        }))
        
        const { error: tagError } = await supabase
          .from('widget_tags')
          .insert(tags)
        
        if (tagError) {
          console.error(`⚠️  Failed to insert tags for ${widget.id}:`, tagError.message)
        }
      }
      
      // Skip related widgets in first pass
      
      console.log(`✅ Inserted: ${widget.id}`)
      inserted++
      
    } catch (error) {
      console.error(`❌ Error processing ${widget.id}:`, error)
      if (error instanceof Error) {
        console.error('   Error details:', error.message)
        console.error('   Stack:', error.stack)
      }
      failed++
    }
  }
  
  console.log('\n📊 First pass summary:')
  console.log(`✅ Inserted: ${inserted}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📝 Total widgets: ${widgets.length}`)
  
  // Second pass: Insert related widgets
  console.log('\n\n📝 Second pass: Inserting widget relationships...\n')
  let relationsInserted = 0
  let relationsFailed = 0
  
  for (const widget of widgets) {
    if (widget.recommendedTools && widget.recommendedTools.length > 0) {
      try {
        const related = widget.recommendedTools.map(toolId => ({
          widget_id: widget.id,
          related_widget_id: toolId
        }))
        
        const { error: relatedError } = await supabase
          .from('widget_related')
          .insert(related)
        
        if (relatedError) {
          console.error(`❌ Failed to insert relations for ${widget.id}:`, relatedError.message)
          relationsFailed++
        } else {
          console.log(`✅ Added ${related.length} relations for ${widget.id}`)
          relationsInserted += related.length
        }
      } catch (error) {
        console.error(`❌ Error inserting relations for ${widget.id}:`, error)
        relationsFailed++
      }
    }
  }
  
  console.log('\n📊 Relations summary:')
  console.log(`✅ Relations inserted: ${relationsInserted}`)
  console.log(`❌ Relations failed: ${relationsFailed}`)
  
  // Show final count
  const { count } = await supabase
    .from('widgets')
    .select('*', { count: 'exact', head: true })
  
  console.log(`\n✨ Total widgets in Supabase now: ${count}`)
  
  if (inserted > 0) {
    console.log('\n🎉 Widget population completed successfully!')
  }
}

// Run population
populateWidgets()
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

async function checkEvents() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Get recent events
  const { data: events, error } = await supabase
    .from('usage_events')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(10)
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log(`\n📊 Recent events (${events?.length || 0} found):\n`)
  
  if (events && events.length > 0) {
    events.forEach(event => {
      console.log(`${new Date(event.timestamp).toLocaleString()} - ${event.event_type} - ${event.widget_id}`)
    })
  } else {
    console.log('No events found yet. Visit a widget page to generate events.')
  }
  
  // Get statistics
  const { data: stats } = await supabase
    .from('usage_events')
    .select('widget_id, event_type')
  
  if (stats && stats.length > 0) {
    const widgetCounts: Record<string, number> = {}
    const eventTypeCounts: Record<string, number> = {}
    
    stats.forEach(event => {
      widgetCounts[event.widget_id] = (widgetCounts[event.widget_id] || 0) + 1
      eventTypeCounts[event.event_type] = (eventTypeCounts[event.event_type] || 0) + 1
    })
    
    console.log('\n📈 Statistics:')
    console.log('\nTop widgets by views:')
    Object.entries(widgetCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([widget, count]) => {
        console.log(`  ${widget}: ${count} events`)
      })
    
    console.log('\nEvent types:')
    Object.entries(eventTypeCounts)
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`)
      })
  }
}

checkEvents()
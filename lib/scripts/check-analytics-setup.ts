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

async function checkAnalyticsSetup() {
  console.log('🔍 Checking analytics setup in Supabase...\n')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // 1. Check if usage_events table exists
  console.log('1️⃣ Checking usage_events table...')
  try {
    const { count, error } = await supabase
      .from('usage_events')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Table not found or accessible:', error.message)
      console.log('   → Please run the migration SQL in Supabase dashboard')
    } else {
      console.log(`✅ Table exists with ${count || 0} events`)
    }
  } catch (error) {
    console.error('❌ Error checking table:', error)
  }
  
  // 2. Test inserting an event
  console.log('\n2️⃣ Testing event insertion...')
  try {
    const testEvent = {
      widget_id: 'test-widget',
      session_id: 'test-session-' + Date.now(),
      event_type: 'view',
      metadata: { test: true }
    }
    
    const { data, error } = await supabase
      .from('usage_events')
      .insert(testEvent)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Failed to insert event:', error.message)
      console.log('   → Check if RLS policies are correctly set')
    } else {
      console.log('✅ Successfully inserted test event')
      
      // Clean up test event
      await supabase
        .from('usage_events')
        .delete()
        .eq('id', data.id)
    }
  } catch (error) {
    console.error('❌ Error testing insertion:', error)
  }
  
  // 3. Test reading events
  console.log('\n3️⃣ Testing event reading...')
  try {
    const { data, error } = await supabase
      .from('usage_events')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('❌ Failed to read events:', error.message)
    } else {
      console.log(`✅ Can read events (found ${data?.length || 0} events)`)
    }
  } catch (error) {
    console.error('❌ Error reading events:', error)
  }
  
  // 4. Check widgets table
  console.log('\n4️⃣ Checking widgets table...')
  try {
    const { count, error } = await supabase
      .from('widgets')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Widgets table error:', error.message)
    } else {
      console.log(`✅ Widgets table has ${count || 0} widgets`)
      if (count === 0) {
        console.log('   → Run: npx tsx lib/scripts/populate-widgets-supabase.ts')
      }
    }
  } catch (error) {
    console.error('❌ Error checking widgets:', error)
  }
  
  // 5. Test analytics API endpoint
  console.log('\n5️⃣ Testing analytics API endpoint...')
  try {
    const response = await fetch('http://localhost:3000/api/analytics/stats/age-calculator')
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API endpoint working')
      console.log('   Sample response:', {
        viewsToday: data.viewsToday,
        totalViews: data.totalViews,
        averageSessionDuration: data.averageSessionDuration
      })
    } else {
      console.log('⚠️  API endpoint returned error (server might not be running)')
    }
  } catch (error) {
    console.log('⚠️  Cannot test API endpoint (server not running)')
  }
  
  console.log('\n✨ Setup check complete!')
  console.log('\nNext steps:')
  console.log('1. If any checks failed, run the safe migration SQL')
  console.log('2. Populate widgets if needed')
  console.log('3. Start the dev server and visit a widget page')
  console.log('4. Check Supabase dashboard for new events')
}

// Run check
checkAnalyticsSetup()
import { sql } from '@vercel/postgres'
import { supabase } from '@/lib/supabase/client'
import { isSupabaseConfigured } from './supabase-adapter'

let isDbReady: boolean | null = null

export async function checkWidgetsDbReady(): Promise<boolean> {
  // Return cached result if available
  if (isDbReady !== null) {
    return isDbReady
  }
  
  // Skip database check if explicitly disabled
  if (process.env.USE_WIDGET_CONSTANTS === 'true') {
    isDbReady = false
    return false
  }
  
  // Check if we should use Supabase
  if (isSupabaseConfigured()) {
    try {
      const { count, error } = await supabase
        .from('widgets')
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log('Supabase widgets table not ready:', error.message)
        isDbReady = false
        return false
      }
      
      isDbReady = (count || 0) > 0
      if (isDbReady) {
        console.log('✅ Using Supabase for widgets')
      }
      return isDbReady
    } catch (error) {
      isDbReady = false
      return false
    }
  }
  
  try {
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database timeout')), 1500) // 1.5 second timeout
    })
    
    // Check if widgets table exists and has data
    const queryPromise = sql`
      SELECT COUNT(*) as count 
      FROM widgets 
      WHERE EXISTS (
        SELECT 1 FROM widget_translations WHERE widget_id = widgets.id
      )
      LIMIT 1
    `
    
    // Race between query and timeout
    const result = await Promise.race([queryPromise, timeoutPromise])
    
    isDbReady = result.rows[0].count > 0
    return isDbReady
  } catch (error) {
    // Database not ready or tables don't exist
    if (process.env.NODE_ENV === 'development') {
      console.log('Widgets database not ready, using static data')
    }
    isDbReady = false
    return false
  }
}

// Reset cache (useful for testing)
export function resetDbReadyCache() {
  isDbReady = null
}
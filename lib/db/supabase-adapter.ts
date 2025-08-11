// Adapter to use Supabase instead of @vercel/postgres
// This provides a compatible interface for existing code

import { supabase } from '@/lib/supabase/client'

// Mock sql tagged template function for compatibility
export function sql(strings: TemplateStringsArray, ...values: any[]) {
  // Build the query string
  let query = strings[0]
  for (let i = 0; i < values.length; i++) {
    query += '$' + (i + 1) + strings[i + 1]
  }
  
  return {
    // Mock the @vercel/postgres interface
    rows: [] as any[],
    rowCount: 0,
    
    // Execute the query
    async execute() {
      throw new Error('Use Supabase client directly instead of sql template')
    }
  }
}

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Helper functions for common operations
export async function query<T = any>(
  tableName: string,
  options?: {
    select?: string
    where?: Record<string, any>
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
  }
): Promise<T[]> {
  let query = supabase.from(tableName).select(options?.select || '*')
  
  if (options?.where) {
    Object.entries(options.where).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }
  
  if (options?.orderBy) {
    query = query.order(options.orderBy.column, { 
      ascending: options.orderBy.ascending ?? true 
    })
  }
  
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Supabase query error:', error)
    throw error
  }
  
  return (data || []) as T[]
}

// Insert helper
export async function insert<T = any>(
  tableName: string,
  data: Record<string, any> | Record<string, any>[]
): Promise<T[]> {
  const { data: result, error } = await supabase
    .from(tableName)
    .insert(data)
    .select()
  
  if (error) {
    console.error('Supabase insert error:', error)
    throw error
  }
  
  return (result || []) as T[]
}

// Update helper
export async function update<T = any>(
  tableName: string,
  data: Record<string, any>,
  where: Record<string, any>
): Promise<T[]> {
  let query = supabase.from(tableName).update(data)
  
  Object.entries(where).forEach(([key, value]) => {
    query = query.eq(key, value)
  })
  
  const { data: result, error } = await query.select()
  
  if (error) {
    console.error('Supabase update error:', error)
    throw error
  }
  
  return (result || []) as T[]
}

// Delete helper
export async function remove(
  tableName: string,
  where: Record<string, any>
): Promise<void> {
  let query = supabase.from(tableName).delete()
  
  Object.entries(where).forEach(([key, value]) => {
    query = query.eq(key, value)
  })
  
  const { error } = await query
  
  if (error) {
    console.error('Supabase delete error:', error)
    throw error
  }
}
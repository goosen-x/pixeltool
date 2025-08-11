import { sql } from '@vercel/postgres'

export async function sqlWithRetry<T>(
  query: TemplateStringsArray | string,
  ...values: any[]
): Promise<T> {
  const maxRetries = 3
  const retryDelay = 1000 // 1 second
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // If it's a template string
      if (typeof query === 'object' && 'raw' in query) {
        return await sql(query, ...values) as T
      }
      // If it's a regular string
      return await sql.query(query as string, values) as T
    } catch (error: any) {
      console.log(`Database attempt ${attempt} failed:`, error.message)
      
      // If it's the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt))
      console.log(`Retrying database connection (attempt ${attempt + 1})...`)
    }
  }
  
  throw new Error('Failed to connect to database after all retries')
}

// Warm up function to wake up the database
export async function warmUpDatabase() {
  try {
    await sqlWithRetry`SELECT 1`
    console.log('Database warmed up successfully')
  } catch (error) {
    console.error('Failed to warm up database:', error)
  }
}
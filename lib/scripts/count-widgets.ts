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

async function countWidgets() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

	const supabase = createClient(supabaseUrl, supabaseKey)

	const { count, error } = await supabase
		.from('widgets')
		.select('*', { count: 'exact', head: true })

	if (error) {
		console.error('Error:', error)
	} else {
		console.log('Total widgets in Supabase:', count)
	}

	// List some widgets
	const { data: widgets } = await supabase
		.from('widgets')
		.select('id, slug')
		.limit(10)

	if (widgets && widgets.length > 0) {
		console.log('\nFirst 10 widgets:')
		widgets.forEach(w => console.log(`- ${w.id} (${w.slug})`))
	}
}

countWidgets()

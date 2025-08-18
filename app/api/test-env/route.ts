import { NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json({
		env: {
			DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
			POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not set',
			NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
			NODE_ENV: process.env.NODE_ENV
		}
	})
}

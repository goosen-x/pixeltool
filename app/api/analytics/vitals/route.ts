import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the Web Vitals data
    console.log('Web Vitals:', {
      metric: body.metric,
      value: body.value,
      id: body.id,
      url: body.url,
      timestamp: new Date().toISOString()
    })
    
    // Here you could send this data to your analytics service
    // Example: await sendToAnalytics(body)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing Web Vitals:', error)
    return NextResponse.json({ error: 'Failed to process Web Vitals' }, { status: 500 })
  }
}
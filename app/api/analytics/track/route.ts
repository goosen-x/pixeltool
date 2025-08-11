import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  console.log('📊 Analytics track endpoint called')
  
  try {
    const body = await request.json()
    console.log('📊 Track request:', body)
    const {
      widgetId,
      sessionId,
      eventType = 'view',
      locale,
      metadata = {}
    } = body
    
    if (!widgetId || !sessionId) {
      return NextResponse.json(
        { error: 'Widget ID and Session ID are required' },
        { status: 400 }
      )
    }
    
    // Get referrer from request headers
    const referrer = request.headers.get('referer') || null
    
    // Extract user agent from metadata or use request header
    const userAgent = metadata.userAgent || request.headers.get('user-agent') || null
    
    // Prepare event data
    const eventData = {
      widget_id: widgetId,
      session_id: sessionId,
      event_type: eventType,
      user_agent: userAgent,
      referrer: referrer,
      metadata: {
        ...metadata,
        locale
      }
    }
    
    console.log('📊 Inserting event data:', eventData)
    
    // Track the event
    const { data, error } = await supabaseServer
      .from('usage_events')
      .insert(eventData)
      .select()
      .single()
    
    if (error) {
      console.error('Analytics tracking error:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      // Don't fail the request - analytics should not break the app
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to track event'
      })
    }
    
    return NextResponse.json({
      success: true,
      eventId: data?.id,
      sessionId: sessionId
    })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    // Don't fail the request - analytics should not break the app
    return NextResponse.json({
      success: false,
      error: 'Failed to track event'
    })
  }
}
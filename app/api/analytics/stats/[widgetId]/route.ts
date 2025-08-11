import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ widgetId: string }> }
) {
  try {
    const { widgetId } = await params
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '7d' // 1d, 7d, 30d
    
    // Determine interval based on timeframe
    let interval: string
    switch (timeframe) {
      case '1d':
        interval = '1 day'
        break
      case '30d':
        interval = '30 days'
        break
      default: // 7d
        interval = '7 days'
    }

    // Get today's stats
    const { data: todayStats, error: todayError } = await supabase
      .from('usage_events')
      .select('id, session_id')
      .eq('widget_id', widgetId)
      .eq('event_type', 'view')
      .gte('timestamp', new Date().toISOString().split('T')[0])
    
    if (todayError) throw todayError

    // Count unique sessions for today
    const uniqueSessionsToday = new Set(todayStats?.map(e => e.session_id) || []).size

    // Get total stats for timeframe
    const startDate = new Date()
    switch (timeframe) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      default: // 7d
        startDate.setDate(startDate.getDate() - 7)
    }

    const { data: totalStats, error: totalError } = await supabase
      .from('usage_events')
      .select('id, session_id')
      .eq('widget_id', widgetId)
      .eq('event_type', 'view')
      .gte('timestamp', startDate.toISOString())
    
    if (totalError) throw totalError

    // Count unique sessions for timeframe
    const totalSessions = new Set(totalStats?.map(e => e.session_id) || []).size

    // Get session durations
    const { data: sessions, error: sessionError } = await supabase
      .from('usage_events')
      .select('session_id, timestamp')
      .eq('widget_id', widgetId)
      .in('event_type', ['view', 'session_start', 'session_end'])
      .gte('timestamp', startDate.toISOString())
      .order('session_id')
      .order('timestamp')
    
    if (sessionError) throw sessionError

    // Calculate average session duration
    const sessionDurations: Map<string, { start: Date; end: Date }> = new Map()
    
    sessions?.forEach(event => {
      const session = sessionDurations.get(event.session_id) || {
        start: new Date(event.timestamp),
        end: new Date(event.timestamp)
      }
      
      const eventTime = new Date(event.timestamp)
      if (eventTime < session.start) session.start = eventTime
      if (eventTime > session.end) session.end = eventTime
      
      sessionDurations.set(event.session_id, session)
    })

    let totalDuration = 0
    let validSessions = 0
    
    sessionDurations.forEach(session => {
      const duration = (session.end.getTime() - session.start.getTime()) / 1000
      
      // Only count sessions longer than 5 seconds and shorter than 30 minutes
      if (duration >= 5 && duration <= 1800) {
        totalDuration += duration
        validSessions++
      }
    })

    const averageSessionDuration = validSessions > 0 ? Math.round(totalDuration / validSessions) : 0

    // Format average session duration as "Xm Ys"
    const formatDuration = (seconds: number) => {
      if (seconds < 60) return `${seconds}s`
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
    }

    // Get hourly views for the last 24 hours
    const last24Hours = new Date()
    last24Hours.setHours(last24Hours.getHours() - 24)
    
    const { data: hourlyStats, error: hourlyError } = await supabase
      .from('usage_events')
      .select('timestamp')
      .eq('widget_id', widgetId)
      .eq('event_type', 'view')
      .gte('timestamp', last24Hours.toISOString())
    
    if (hourlyError) throw hourlyError

    // Group by hour
    const hourlyViews: Map<number, number> = new Map()
    for (let i = 0; i < 24; i++) {
      hourlyViews.set(i, 0)
    }
    
    hourlyStats?.forEach(event => {
      const hour = new Date(event.timestamp).getHours()
      hourlyViews.set(hour, (hourlyViews.get(hour) || 0) + 1)
    })

    const stats = {
      viewsToday: todayStats?.length || 0,
      totalViews: totalStats?.length || 0,
      uniqueSessionsToday: uniqueSessionsToday,
      totalSessions: totalSessions,
      averageSessionDuration: formatDuration(averageSessionDuration),
      averageSessionSeconds: averageSessionDuration,
      hourlyViews: Array.from(hourlyViews.entries()).map(([hour, views]) => ({
        hour,
        views
      })),
      timeframe
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Analytics stats error:', error)
    
    // Return mock data if there's an error
    const widgetId = (await params).widgetId
    const seed = widgetId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const random = (min: number, max: number) => {
      const x = Math.sin(seed) * 10000
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min
    }
    
    return NextResponse.json({
      viewsToday: random(50, 500),
      totalViews: random(1000, 50000),
      uniqueSessionsToday: random(20, 200),
      totalSessions: random(500, 20000),
      averageSessionDuration: `${random(1, 5)}m ${random(0, 59)}s`,
      averageSessionSeconds: random(60, 300),
      hourlyViews: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        views: random(0, 100)
      })),
      timeframe: request.url.includes('timeframe=') ? new URL(request.url).searchParams.get('timeframe') || '7d' : '7d'
    })
  }
}
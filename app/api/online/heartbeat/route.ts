import { NextResponse } from 'next/server'
import { heartbeat } from '@/lib/redisOnline'

export async function POST(req: Request) {
  try {
    const { sessionId, widgetId } = await req.json()
    if (!sessionId) {
      return NextResponse.json(
        { ok: false, error: 'sessionId required' },
        { status: 400 }
      )
    }
    await heartbeat(sessionId, widgetId)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Heartbeat error:', e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || 'PixelTool'
    const description = searchParams.get('description') || 'Professional Developer Tools'
    const locale = searchParams.get('locale') || 'en'
    
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '60px',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 40%),
                radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 40%),
                radial-gradient(circle at 40% 20%, rgba(34, 197, 94, 0.2) 0%, transparent 40%)
              `,
            }}
          />
          
          {/* Logo and Brand */}
          <div
            style={{
              position: 'absolute',
              top: 60,
              left: 60,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="512" height="512" rx="100" fill="url(#gradient)" />
              <path
                d="M320 170.667H362.667C386.24 170.667 405.333 189.76 405.333 213.333V298.667C405.333 322.24 386.24 341.333 362.667 341.333H320M192 341.333H149.333C125.76 341.333 106.667 322.24 106.667 298.667V213.333C106.667 189.76 125.76 170.667 149.333 170.667H192M170.667 256H341.333"
                stroke="white"
                strokeWidth="32"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="512" y2="512">
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <span
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: 'white',
              }}
            >
              PixelTool
            </span>
          </div>

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: 900,
              marginTop: 20,
            }}
          >
            {/* Title */}
            <h1
              style={{
                fontSize: title.length > 30 ? 48 : 64,
                fontWeight: 700,
                color: 'white',
                margin: 0,
                marginBottom: 24,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: description.length > 100 ? 20 : 24,
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                marginBottom: 40,
                lineHeight: 1.5,
                maxWidth: 800,
              }}
            >
              {description}
            </p>

            {/* Features */}
            <div
              style={{
                display: 'flex',
                gap: 40,
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 18,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11L12 14L22 4" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {locale === 'ru' ? 'Бесплатно' : 'Free Tool'}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 18,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {locale === 'ru' ? 'Мгновенно' : 'Instant'}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 18,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {locale === 'ru' ? 'В браузере' : 'Browser-based'}
              </div>
            </div>
          </div>

          {/* URL */}
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              fontSize: 16,
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.05em',
            }}
          >
            pixeltool.pro
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error('Failed to generate OG image:', e)
    
    return new Response('Failed to generate image', { status: 500 })
  }
}
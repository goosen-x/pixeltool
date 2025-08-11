import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          style={{
            width: '30px',
            height: '30px',
          }}
        >
          {/* Grid of 9 squares with no gaps */}
          <rect x="0" y="0" width="10" height="10" fill="#E84330" />
          <rect x="10" y="0" width="10" height="10" fill="#FD850F" />
          <rect x="20" y="0" width="10" height="10" fill="#FFCD00" />
          
          <rect x="0" y="10" width="10" height="10" fill="#FD850F" />
          <rect x="10" y="10" width="10" height="10" fill="#FFCD00" />
          <rect x="20" y="10" width="10" height="10" fill="#70C727" />
          
          <rect x="0" y="20" width="10" height="10" fill="#FFCD00" />
          <rect x="10" y="20" width="10" height="10" fill="#70C727" />
          <rect x="20" y="20" width="10" height="10" fill="#2D96D7" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
interface AnalogClockProps {
  hour: number
  minute: number
  second: number
  size?: number
  className?: string
}

export function AnalogClock({ 
  hour, 
  minute, 
  second, 
  size = 100, 
  className 
}: AnalogClockProps) {
  const hourAngle = (hour % 12) * 30 + minute * 0.5
  const minuteAngle = minute * 6 + second * 0.1
  const secondAngle = second * 6

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={`transform -rotate-90 ${className || ''}`}
    >
      {/* Clock face */}
      <circle cx="50" cy="50" r="48" fill="currentColor" className="text-background" />
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
      
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const angle = i * 30
        const isMainHour = i % 3 === 0
        const length = isMainHour ? 5 : 3
        const x1 = 50 + 40 * Math.cos((angle - 90) * Math.PI / 180)
        const y1 = 50 + 40 * Math.sin((angle - 90) * Math.PI / 180)
        const x2 = 50 + (40 - length) * Math.cos((angle - 90) * Math.PI / 180)
        const y2 = 50 + (40 - length) * Math.sin((angle - 90) * Math.PI / 180)
        
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={isMainHour ? 2 : 1}
            className="text-muted-foreground"
          />
        )
      })}
      
      {/* Hour hand */}
      <line
        x1="50"
        y1="50"
        x2={50 + 25 * Math.cos((hourAngle - 90) * Math.PI / 180)}
        y2={50 + 25 * Math.sin((hourAngle - 90) * Math.PI / 180)}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-foreground"
      />
      
      {/* Minute hand */}
      <line
        x1="50"
        y1="50"
        x2={50 + 35 * Math.cos((minuteAngle - 90) * Math.PI / 180)}
        y2={50 + 35 * Math.sin((minuteAngle - 90) * Math.PI / 180)}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-foreground"
      />
      
      {/* Second hand */}
      <line
        x1="50"
        y1="50"
        x2={50 + 38 * Math.cos((secondAngle - 90) * Math.PI / 180)}
        y2={50 + 38 * Math.sin((secondAngle - 90) * Math.PI / 180)}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        className="text-red-500"
      />
      
      {/* Center dot */}
      <circle cx="50" cy="50" r="3" fill="currentColor" className="text-foreground" />
    </svg>
  )
}
interface Props {
  value: number       // 0–1
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  children?: React.ReactNode
  className?: string
}

export default function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  color = '#0a4f2a',
  bgColor = '#E2D9C9',
  children,
  className = '',
}: Props) {
  const r       = (size - strokeWidth) / 2
  const circ    = 2 * Math.PI * r
  const offset  = circ * (1 - Math.min(Math.max(value, 0), 1))
  const cx      = size / 2

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

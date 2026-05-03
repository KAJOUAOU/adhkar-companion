import { useEffect } from 'react'
import CircularProgress from './CircularProgress'

interface Props {
  current:  number
  target:   number
  onTap:    () => void
  onReset:  () => void
  size?:    number
  variant?: 'light' | 'dark'
}

export default function Counter({ current, target, onTap, onReset, size = 140, variant = 'light' }: Props) {
  const done    = current >= target
  const pct     = Math.min(current / target, 1)
  const color   = done ? '#C9963A' : (variant === 'dark' ? '#C9963A' : '#0a4f2a')
  const bgColor = done ? '#FDE68A' : (variant === 'dark' ? 'rgba(255,255,255,0.12)' : '#E2D9C9')
  const numColor  = variant === 'dark' ? '#FFF5E0' : color
  const mutedColor = variant === 'dark' ? 'rgba(255,245,224,0.45)' : '#9CA3AF'

  // Keyboard: space bar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!done) onTap() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [done, onTap])

  return (
    <div className="flex flex-col items-center gap-3">
      <CircularProgress value={pct} size={size} strokeWidth={9} color={color} bgColor={bgColor}>
        <button
          onClick={() => { if (!done) onTap() }}
          className={`flex flex-col items-center justify-center rounded-full transition-transform active:scale-90 select-none
            ${done ? 'cursor-default' : 'cursor-pointer'}`}
          style={{ width: size - 28, height: size - 28 }}
          aria-label="Compter"
        >
          {done ? (
            <>
              <span className="text-3xl">✓</span>
              <span className="text-xs font-semibold mt-1" style={{ color: '#C9963A' }}>Accompli</span>
            </>
          ) : (
            <>
              <span className="text-4xl font-black tabular-nums leading-none" style={{ color: numColor }}>
                {current}
              </span>
              <span className="text-sm font-medium" style={{ color: mutedColor }}>/ {target}</span>
            </>
          )}
        </button>
      </CircularProgress>

      <div className="flex items-center gap-3 text-sm" style={{ color: mutedColor }}>
        {done ? (
          <span className="font-semibold text-sm" style={{ color: '#C9963A' }}>Bârakallâh fîk ✨</span>
        ) : (
          <span>Appuie pour compter</span>
        )}
        <button
          onClick={onReset}
          className="text-xs transition-colors underline underline-offset-2"
          style={{ color: mutedColor }}
        >
          Réinitialiser
        </button>
      </div>
    </div>
  )
}

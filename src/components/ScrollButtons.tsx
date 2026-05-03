import { useEffect, useState } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'

const THRESHOLD = 200 // px avant d'afficher les boutons

export default function ScrollButtons() {
  const [showTop,    setShowTop]    = useState(false)
  const [showBottom, setShowBottom] = useState(false)

  useEffect(() => {
    const update = () => {
      const scrollY      = window.scrollY
      const docHeight    = document.documentElement.scrollHeight
      const winHeight    = window.innerHeight
      const distFromBottom = docHeight - scrollY - winHeight

      setShowTop(scrollY > THRESHOLD)
      setShowBottom(distFromBottom > THRESHOLD)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const scrollTo = (pos: 'top' | 'bottom') => {
    window.scrollTo({
      top:      pos === 'top' ? 0 : document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  }

  if (!showTop && !showBottom) return null

  return (
    <div className="fixed right-4 bottom-24 z-50 flex flex-col gap-2">
      {showTop && (
        <button
          onClick={() => scrollTo('top')}
          aria-label="Remonter en haut"
          className="w-9 h-9 rounded-full flex items-center justify-center shadow-medium transition-all active:scale-90"
          style={{
            background: 'rgba(201,150,58,0.18)',
            border:     '1px solid rgba(201,150,58,0.35)',
            color:      '#8B5E0A',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <ArrowUp size={15} />
        </button>
      )}
      {showBottom && (
        <button
          onClick={() => scrollTo('bottom')}
          aria-label="Aller en bas"
          className="w-9 h-9 rounded-full flex items-center justify-center shadow-medium transition-all active:scale-90"
          style={{
            background: 'rgba(201,150,58,0.18)',
            border:     '1px solid rgba(201,150,58,0.35)',
            color:      '#8B5E0A',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <ArrowDown size={15} />
        </button>
      )}
    </div>
  )
}

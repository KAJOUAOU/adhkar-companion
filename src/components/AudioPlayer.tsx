import { VolumeX, Play, Pause, Loader2 } from 'lucide-react'
import type { AudioState } from '../types'
import { formatTime } from '../utils/timeUtils'

interface Props {
  adhkarId:   string
  audioUrl?:  string
  audioState: AudioState
  onPlay:     (id: string, url: string) => void
  onStop:     () => void
  className?: string
}

export default function AudioPlayer({
  adhkarId, audioUrl,
  audioState, onPlay, onStop,
  className = '',
}: Props) {
  const isThis   = audioState.currentId === adhkarId
  const isActive = isThis && audioState.isPlaying
  const loading  = isThis && audioState.isLoading

  if (!audioUrl) return null

  const handleClick = () => {
    if (isActive) { onStop(); return }
    onPlay(adhkarId, audioUrl)
  }

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
          ${isActive
            ? 'bg-forest-800 text-white shadow-soft'
            : 'bg-cream-200 dark:bg-night-700 text-forest-800 dark:text-cream-200 hover:bg-forest-100 dark:hover:bg-night-600'
          }`}
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : isActive ? (
          <Pause size={15} />
        ) : (
          <Play size={15} />
        )}
        <span>{isActive ? 'Pause' : 'Écouter'}</span>
      </button>

      {/* Barre de progression audio CDN */}
      {isThis && audioState.duration > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span>{formatTime(audioState.currentTime)}</span>
          <span>/</span>
          <span>{formatTime(audioState.duration)}</span>
        </div>
      )}

      {/* Erreur réseau */}
      {isThis && audioState.error && (
        <div className="flex items-center gap-1 text-xs text-red-400">
          <VolumeX size={13} />
          <span>Connexion requise</span>
        </div>
      )}
    </div>
  )
}

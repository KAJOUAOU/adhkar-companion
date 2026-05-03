import { useState } from 'react'
import { Heart, ChevronDown, ChevronUp, Check, RotateCcw } from 'lucide-react'
import type { AdhkarItem } from '../types'
import type { AudioState } from '../types'
import { applyTajweedHTML } from '../utils/tajweedUtils'
import AudioPlayer from './AudioPlayer'
import Counter from './Counter'

interface Props {
  item:          AdhkarItem
  isFavorite:    boolean
  isDone:        boolean
  counter:       number
  showTranslit:  boolean
  showTranslat:  boolean
  showMerit:     boolean
  arabicSize:    'md' | 'lg' | 'xl' | '2xl'
  audioState:    AudioState
  onFavorite:    () => void
  onTap:         () => void
  onReset:       () => void
  onMarkDone:    () => void
  onPlay:        (id: string, url: string) => void
  onStopAudio:   () => void
}

const ARABIC_SIZES: Record<string, string> = {
  md:  'text-2xl',
  lg:  'text-3xl',
  xl:  'text-[2.1rem]',
  '2xl': 'text-[2.5rem]',
}

export default function AdhkarCard({
  item, isFavorite, isDone, counter,
  showTranslit, showTranslat, showMerit,
  arabicSize, audioState,
  onFavorite, onTap, onReset, onMarkDone,
  onPlay, onStopAudio,
}: Props) {
  const [meritOpen, setMeritOpen] = useState(false)
  // Use first line only for subItems (tasbih) display in arabic area
  const displayArabic = item.subItems ? item.arabic.split('\n')[0] : item.arabic
  const tajweedHtml   = applyTajweedHTML(displayArabic)

  const PERIOD_LABEL: Record<string, string> = {
    both: 'Matin & Soir', morning: 'Matin', evening: 'Soir',
  }
  const PERIOD_COLOR: Record<string, string> = {
    both:    'bg-forest-100 text-forest-700 dark:bg-forest-900 dark:text-forest-300',
    morning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    evening: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  }

  return (
    <div className={`
      glass dark:glass-dark rounded-3xl overflow-hidden
      transition-all duration-300
      ${isDone ? 'ring-2 ring-gold-400/60 dark:ring-gold-600/50' : ''}
    `}>

      {/* Card header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
            ${isDone ? 'bg-gold-500 text-white' : 'bg-forest-800 text-white'}
          `}>
            {isDone ? '✓' : item.number}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-cream-100 text-sm leading-tight truncate">
              {item.title}
            </h3>
            <p className="font-arabic text-gray-500 dark:text-gray-400 text-sm">
              {item.titleAr}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${PERIOD_COLOR[item.period]}`}>
            {PERIOD_LABEL[item.period]}
          </span>
          {item.repeat > 1 && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-cream-200 text-gray-600 dark:bg-night-700 dark:text-gray-300">
              ×{item.repeat}
            </span>
          )}
          <button onClick={onFavorite} className="text-gray-300 hover:text-gold-500 transition-colors">
            <Heart size={18} fill={isFavorite ? '#C9963A' : 'none'} className={isFavorite ? 'text-gold-500' : ''} />
          </button>
        </div>
      </div>

      {/* Arabic text */}
      <div className="px-5 py-4 bg-gradient-to-b from-cream-50 to-white dark:from-night-900 dark:to-night-800 border-y border-cream-100 dark:border-white/5">
        <p
          className={`font-arabic leading-loose text-right dir-rtl text-gray-900 dark:text-cream-100 ${ARABIC_SIZES[arabicSize] || 'text-[2.1rem]'}`}
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: tajweedHtml }}
        />
      </div>

      {/* Transliteration */}
      {showTranslit && (
        <div className="px-5 py-3 border-b border-cream-100 dark:border-white/5">
          <p className="text-sm italic text-gray-500 dark:text-gray-400 leading-relaxed select-text cursor-text">
            {item.transliteration}
          </p>
        </div>
      )}

      {/* Translation */}
      {showTranslat && (
        <div className="px-5 py-3 border-b border-cream-100 dark:border-white/5">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed select-text cursor-text">
            {item.translationFr}
          </p>
        </div>
      )}

      {/* Counter */}
      {item.repeat > 1 && (
        <div className="px-5 py-4 flex justify-center border-b border-cream-100 dark:border-white/5">
          <Counter
            current={counter}
            target={item.repeat}
            onTap={onTap}
            onReset={onReset}
            size={120}
          />
        </div>
      )}

      {/* Actions row */}
      <div className="px-5 py-3 flex items-center justify-between gap-2 flex-wrap">
        <AudioPlayer
          adhkarId={item.id}
          audioUrl={item.audioArabicUrl}
          audioState={audioState}
          onPlay={onPlay}
          onStop={onStopAudio}
        />

        <div className="flex items-center gap-2">
          {item.repeat === 1 && !isDone && (
            <button
              onClick={onMarkDone}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-50 text-forest-700 hover:bg-forest-100 rounded-full text-xs font-semibold transition-colors dark:bg-forest-900/30 dark:text-forest-300"
            >
              <Check size={13} /> Récité
            </button>
          )}
          {isDone && item.repeat === 1 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cream-100 text-gray-500 hover:bg-cream-200 rounded-full text-xs transition-colors dark:bg-night-700"
            >
              <RotateCcw size={13} /> Refaire
            </button>
          )}

          {item.merit && (
            <button
              onClick={() => setMeritOpen(v => !v)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gold-50 text-gold-700 hover:bg-gold-100 rounded-full text-xs font-semibold transition-colors dark:bg-gold-900/20 dark:text-gold-400"
            >
              ✨ Mérite
              {meritOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>
      </div>

      {/* Merit panel */}
      {meritOpen && item.merit && (
        <div className="px-5 pb-4 pt-1 bg-gold-50 dark:bg-gold-900/10 border-t border-gold-100 dark:border-gold-800/20">
          {item.source && (
            <p className="text-[10px] font-bold text-gold-600 dark:text-gold-500 uppercase tracking-wide mb-1.5">
              {item.source}
            </p>
          )}
          <p className="text-sm text-gold-900 dark:text-gold-300 leading-relaxed select-text cursor-text">
            {item.merit}
          </p>
        </div>
      )}
    </div>
  )
}

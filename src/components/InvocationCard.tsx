import { useState } from 'react'
import { Heart, ExternalLink, Share2, CheckCheck } from 'lucide-react'
import type { InvocationItem, AudioState } from '../types'
import AudioPlayer from './AudioPlayer'
import { useSettings } from '../hooks/useSettings'
import { getT } from '../i18n'

interface Props {
  item:         InvocationItem
  isFavorite:   boolean
  showTranslit: boolean
  showTranslat: boolean
  arabicSize:   'md' | 'lg' | 'xl' | '2xl'
  audioState:   AudioState
  onFavorite:   () => void
  onPlay:       (id: string, url: string) => void
  onStopAudio:  () => void
}

const ARABIC_SIZES: Record<string, string> = {
  md:  'text-2xl',
  lg:  'text-3xl',
  xl:  'text-[2.1rem]',
  '2xl': 'text-[2.5rem]',
}

const CATEGORY_LABEL: Record<string, { fr: string; en: string }> = {
  coran:     { fr: 'Coran',       en: 'Quran' },
  khatma:    { fr: 'Khatma',      en: 'Khatma' },
  prophetic: { fr: 'Prophétique', en: 'Prophetic' },
}

const CATEGORY_COLOR: Record<string, string> = {
  coran:     'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  khatma:    'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  prophetic: 'bg-forest-100 text-forest-700 dark:bg-forest-900 dark:text-forest-300',
}

export default function InvocationCard({
  item, isFavorite, showTranslit, showTranslat,
  arabicSize, audioState,
  onFavorite, onPlay, onStopAudio,
}: Props) {
  const [copied, setCopied] = useState(false)
  const { settings } = useSettings()
  const tc = getT(settings.language).card
  const lang = settings.language

  const translation = (lang === 'en' && item.translationEn) ? item.translationEn : item.translationFr
  const categoryLabel = CATEGORY_LABEL[item.category][lang]

  const handleShare = async () => {
    const text = `${item.title} — ${item.titleAr}\n\n${item.arabic}\n\n${translation}\n\n— ${item.source}`
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text })
      } catch { /* annulé */ }
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="glass dark:glass-dark rounded-3xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            {item.number}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-cream-100 text-sm leading-tight">
              {item.title}
            </h3>
            <p className="font-arabic text-gray-500 dark:text-gray-400 text-sm">
              {item.titleAr}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLOR[item.category]}`}>
            {categoryLabel}
          </span>
          <button onClick={onFavorite} className="text-gray-300 hover:text-gold-500 transition-colors">
            <Heart size={18} fill={isFavorite ? '#C9963A' : 'none'} className={isFavorite ? 'text-gold-500' : ''} />
          </button>
        </div>
      </div>

      {/* Arabic */}
      <div className="px-5 py-4 bg-gradient-to-b from-cream-50 to-white dark:from-night-900 dark:to-night-800 border-y border-cream-100 dark:border-white/5">
        <p
          className={`font-arabic leading-loose text-right dir-rtl whitespace-pre-line text-gray-900 dark:text-cream-100 ${ARABIC_SIZES[arabicSize] || 'text-[2.1rem]'}`}
          dir="rtl"
        >
          {item.arabic}
        </p>
      </div>

      {/* Transliteration */}
      {showTranslit && item.transliteration && (
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
            {translation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-3 flex items-center justify-between gap-2 flex-wrap">
        <AudioPlayer
          adhkarId={item.id}
          audioUrl={item.audioArabicUrl}
          audioState={audioState}
          onPlay={onPlay}
          onStop={onStopAudio}
        />

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cream-100 text-gray-500 hover:bg-cream-200 rounded-full text-xs font-semibold transition-colors dark:bg-night-700 dark:text-gray-400"
            title="Partager"
          >
            {copied ? <CheckCheck size={13} className="text-forest-600" /> : <Share2 size={13} />}
            {copied ? tc.copied : tc.share}
          </button>
        </div>
      </div>

      {/* Source */}
      <div className="px-5 pb-4 pt-1 bg-gold-50/50 dark:bg-gold-900/10 border-t border-gold-100/50 dark:border-gold-800/20">
        {item.sourceUrl ? (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-700 dark:text-gold-400 uppercase tracking-wide hover:underline"
          >
            {item.source}
            <ExternalLink size={11} />
          </a>
        ) : (
          <p className="text-[11px] font-bold text-gold-700 dark:text-gold-400 uppercase tracking-wide">
            {item.source}
          </p>
        )}
        {item.grade && (
          <span className="ml-2 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
            · {item.grade}
          </span>
        )}
      </div>
    </div>
  )
}

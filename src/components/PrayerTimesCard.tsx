import { ChevronRight, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import { useSettings } from '../hooks/useSettings'

const PRAYER_LABELS: Record<string, { fr: string; en: string; emoji: string }> = {
  fajr:    { fr: 'Fajr',    en: 'Fajr',    emoji: '🌅' },
  sunrise: { fr: 'Lever',   en: 'Sunrise', emoji: '☀️' },
  dhuhr:   { fr: 'Dhuhr',   en: 'Dhuhr',   emoji: '☀️' },
  asr:     { fr: 'ʿAsr',    en: 'Asr',     emoji: '🌤️' },
  maghrib: { fr: 'Maghrib', en: 'Maghrib', emoji: '🌆' },
  isha:    { fr: 'ʿIshāʾ',  en: 'Isha',    emoji: '🌙' },
}

export default function PrayerTimesCard() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const { data, next, loading, error } = usePrayerTimes(settings.prayerCity, settings.prayerMethod)
  const lang = settings.language

  // État de chargement initial
  if (loading && !data) {
    return (
      <button
        onClick={() => navigate('/prayers')}
        className="w-full bg-white dark:bg-night-800 rounded-2xl p-4 shadow-soft border border-cream-200 dark:border-white/5 flex items-center gap-4 text-left active:scale-98 transition-transform"
      >
        <div className="w-11 h-11 bg-gold-100 dark:bg-gold-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Clock size={22} className="text-gold-600 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 dark:text-cream-100">
            {lang === 'en' ? 'Prayer times' : 'Horaires de prière'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {lang === 'en' ? 'Loading…' : 'Chargement…'}
          </p>
        </div>
        <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
      </button>
    )
  }

  // En cas d'erreur sans cache, on garde le bouton mais on indique l'état
  if (!data) {
    return (
      <button
        onClick={() => navigate('/prayers')}
        className="w-full bg-white dark:bg-night-800 rounded-2xl p-4 shadow-soft border border-cream-200 dark:border-white/5 flex items-center gap-4 text-left active:scale-98 transition-transform"
      >
        <div className="w-11 h-11 bg-gold-100 dark:bg-gold-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Clock size={22} className="text-gold-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 dark:text-cream-100">
            {lang === 'en' ? 'Prayer times' : 'Horaires de prière'}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
            {error
              ? (lang === 'en' ? 'Unable to load — tap to retry' : 'Impossible de charger — touchez pour réessayer')
              : (lang === 'en' ? 'Tap to view'                   : 'Toucher pour voir')}
          </p>
        </div>
        <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
      </button>
    )
  }

  const cityLabel = `${data.city.name}, ${data.city.country}`
  const remainingTxt = next
    ? next.remaining.hours > 0
      ? `${next.remaining.hours}h ${String(next.remaining.minutes).padStart(2, '0')}`
      : `${next.remaining.minutes} min`
    : ''

  return (
    <button
      onClick={() => navigate('/prayers')}
      className="w-full glass-gold dark:glass-dark rounded-2xl p-4 active:scale-98 transition-transform text-left"
    >
      {/* Ligne du haut : prochaine prière + ville */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl flex-shrink-0">{PRAYER_LABELS[next?.name ?? 'fajr']?.emoji ?? '🕌'}</span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
              {next?.isTomorrow
                ? (lang === 'en' ? 'Tomorrow · ' : 'Demain · ')
                : ''}
              {lang === 'en' ? 'Next prayer' : 'Prochaine prière'}
            </p>
            <p className="font-bold text-sm text-gray-900 dark:text-cream-100 truncate">
              {next ? PRAYER_LABELS[next.name]?.[lang] ?? next.label : '—'}
              <span className="text-gray-500 dark:text-gray-400 font-normal ml-1.5">
                · {next?.time}
              </span>
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <p className="text-base font-bold tabular-nums text-gold-700 dark:text-gold-300">
            {remainingTxt}
          </p>
          <p className="text-[9px] text-gray-400 -mt-0.5">{cityLabel}</p>
        </div>
      </div>

      {/* Mini-row des 6 horaires */}
      <div className="grid grid-cols-6 gap-1 pt-3 border-t border-gold-200/40 dark:border-white/5">
        {(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(p => {
          const isNext = next?.name === p
          return (
            <div
              key={p}
              className={`flex flex-col items-center py-1 rounded-lg ${
                isNext ? 'bg-gold-200/60 dark:bg-gold-900/40' : ''
              }`}
            >
              <span className={`text-[9px] font-semibold uppercase ${
                isNext ? 'text-gold-700 dark:text-gold-300' : 'text-gray-400'
              }`}>
                {PRAYER_LABELS[p][lang]}
              </span>
              <span className={`text-[11px] tabular-nums font-medium ${
                isNext ? 'text-gray-900 dark:text-cream-100 font-bold' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {data.timings[p]}
              </span>
            </div>
          )
        })}
      </div>
    </button>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, RefreshCw, Calendar, ChevronDown } from 'lucide-react'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import { useSettings } from '../hooks/useSettings'
import { PRESET_CITIES, DEFAULT_CITY } from '../services/prayerTimesService'
import IslamicPattern from '../components/IslamicPattern'
import SeoHead from './../components/SeoHead'
import type { PrayerCity } from '../types'

type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'

const PRAYER_LABELS: Record<PrayerKey, { fr: string; en: string; arabic: string; emoji: string }> = {
  fajr:    { fr: 'Fajr',    en: 'Fajr',    arabic: 'الفجر',    emoji: '🌅' },
  sunrise: { fr: 'Lever du soleil', en: 'Sunrise', arabic: 'الشروق', emoji: '☀️' },
  dhuhr:   { fr: 'Dhuhr',   en: 'Dhuhr',   arabic: 'الظهر',    emoji: '🌞' },
  asr:     { fr: 'ʿAsr',    en: 'Asr',     arabic: 'العصر',    emoji: '🌤️' },
  maghrib: { fr: 'Maghrib', en: 'Maghrib', arabic: 'المغرب',   emoji: '🌆' },
  isha:    { fr: 'ʿIshāʾ',  en: 'Isha',    arabic: 'العشاء',   emoji: '🌙' },
}

const PRAYER_ORDER: PrayerKey[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']

export default function Prayers() {
  const navigate = useNavigate()
  const { settings, updateSettings } = useSettings()
  const lang = settings.language
  const city = settings.prayerCity ?? DEFAULT_CITY

  const { data, next, loading, error, refresh } = usePrayerTimes(city)
  const [cityPickerOpen, setCityPickerOpen] = useState(false)

  const setCity = (c: PrayerCity) => {
    updateSettings('prayerCity', c)
    setCityPickerOpen(false)
  }

  const remainingTxt = next
    ? next.remaining.hours > 0
      ? `${next.remaining.hours}h ${String(next.remaining.minutes).padStart(2, '0')}min`
      : `${next.remaining.minutes} min`
    : ''

  const todayLabel = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="h-dvh flex flex-col overflow-hidden" style={{ background: 'var(--t-body-bg, #FAF7EE)' }}>
      <SeoHead
        title="Horaires de prière | Adhkar Companion"
        description="Horaires de prière (Fajr, Dhuhr, ʿAsr, Maghrib, ʿIshāʾ) calculés selon la méthode UOIF pour les villes francophones. Date hijri, prochaine prière et compte à rebours."
        canonical="/prayers"
        keywords="horaires prière, salat, fajr, dhuhr, asr, maghrib, isha, prière musulmane, mosquée, qibla"
      />

      {/* ── Header ────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{
          background: 'var(--t-hero, linear-gradient(150deg,#6E5010,#8B6914))',
          paddingTop:    'max(env(safe-area-inset-top, 0px), 30px)',
          paddingBottom: 16,
          paddingLeft:   20,
          paddingRight:  20,
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <IslamicPattern className="text-white" opacity={0.10} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 transition-colors"
              style={{ color: 'rgba(255,255,255,0.70)' }}
            >
              <ArrowLeft size={18} />
              <span className="text-sm">{lang === 'en' ? 'Back' : 'Retour'}</span>
            </button>
            <button
              onClick={() => refresh()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15"
              style={{ color: 'rgba(255,255,255,0.85)' }}
              disabled={loading}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span className="text-xs">{lang === 'en' ? 'Refresh' : 'Actualiser'}</span>
            </button>
          </div>

          <h1 className="text-2xl font-display font-bold leading-tight mb-0.5" style={{ color: 'var(--t-hero-text,#2C1A06)' }}>
            {lang === 'en' ? 'Prayer times' : 'Horaires de prière'}
          </h1>
          <button
            onClick={() => setCityPickerOpen(o => !o)}
            className="inline-flex items-center gap-1.5 mt-1 text-sm font-semibold opacity-85 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--t-hero-text,#2C1A06)' }}
          >
            <MapPin size={14} />
            {city.name}, {city.country}
            <ChevronDown size={14} className={`transition-transform ${cityPickerOpen ? 'rotate-180' : ''}`} />
          </button>
          <p className="text-xs opacity-65 mt-1" style={{ color: 'var(--t-hero-text,#2C1A06)' }}>
            <Calendar size={11} className="inline -mt-0.5 mr-1" />
            {todayLabel}
            {data?.hijri && (
              <span className="ml-2 opacity-80">· {data.hijri.day} {data.hijri.monthEn} {data.hijri.year}H</span>
            )}
          </p>
        </div>
      </div>

      {/* ── Body scrollable ────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-5 py-5 space-y-4 pb-24">

        {/* City picker */}
        {cityPickerOpen && (
          <div className="bg-white dark:bg-night-800 rounded-2xl p-3 shadow-soft border border-cream-200 dark:border-white/10 max-h-[240px] overflow-y-auto scrollbar-none">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 px-2 pb-2">
              {lang === 'en' ? 'Choose a city' : 'Choisir une ville'}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_CITIES.map(c => {
                const isCurrent = c.name === city.name && c.country === city.country
                return (
                  <button
                    key={`${c.name}-${c.country}`}
                    onClick={() => setCity(c)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 ${
                      isCurrent
                        ? 'bg-gold-100 text-gold-800 dark:bg-gold-900/40 dark:text-gold-200 ring-1 ring-gold-300'
                        : 'bg-cream-50 text-gray-700 dark:bg-night-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="block font-bold">{c.name}</span>
                    <span className="block text-[10px] opacity-60">{c.country}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Next prayer countdown */}
        {next && data && (
          <div
            className="rounded-2xl p-5 text-white shadow-medium"
            style={{ background: 'var(--t-primary-d, #5C4010)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                {next.isTomorrow
                  ? (lang === 'en' ? 'Tomorrow · Next prayer' : 'Demain · Prochaine prière')
                  : (lang === 'en' ? 'Next prayer' : 'Prochaine prière')}
              </p>
              <span className="text-2xl">{PRAYER_LABELS[next.name as PrayerKey]?.emoji}</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-3xl font-display font-bold">
                  {PRAYER_LABELS[next.name as PrayerKey]?.[lang] ?? next.label}
                </p>
                <p className="font-arabic text-lg opacity-80 mt-0.5" dir="rtl">
                  {PRAYER_LABELS[next.name as PrayerKey]?.arabic}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold tabular-nums">{next.time}</p>
                <p className="text-sm opacity-70 tabular-nums">
                  {lang === 'en' ? 'in ' : 'dans '}{remainingTxt}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Prayer rows */}
        {data && (
          <div className="bg-white dark:bg-night-800 rounded-2xl shadow-soft border border-cream-200 dark:border-white/5 overflow-hidden">
            {PRAYER_ORDER.map((p, idx) => {
              const isNext = next?.name === p
              const time = data.timings[p]
              return (
                <div
                  key={p}
                  className={`flex items-center justify-between px-4 py-3.5 ${
                    idx > 0 ? 'border-t border-cream-100 dark:border-white/5' : ''
                  } ${isNext ? 'bg-gold-50 dark:bg-gold-900/20' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl flex-shrink-0 w-8 text-center">{PRAYER_LABELS[p].emoji}</span>
                    <div>
                      <p className={`text-sm font-bold ${isNext ? 'text-gold-700 dark:text-gold-300' : 'text-gray-900 dark:text-cream-100'}`}>
                        {PRAYER_LABELS[p][lang]}
                      </p>
                      <p className="font-arabic text-xs text-gray-400" dir="rtl">
                        {PRAYER_LABELS[p].arabic}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isNext && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-200 text-gold-800 dark:bg-gold-700 dark:text-gold-100">
                        {lang === 'en' ? 'Next' : 'Prochaine'}
                      </span>
                    )}
                    <span className={`text-lg tabular-nums font-bold ${isNext ? 'text-gold-700 dark:text-gold-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {time}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Erreur (mais sans data, on l'a déjà géré au-dessus) */}
        {error && data && (
          <p className="text-xs text-amber-600 text-center px-4">
            {lang === 'en'
              ? 'Could not refresh — showing cached times.'
              : 'Impossible d\'actualiser — affichage des horaires en cache.'}
          </p>
        )}

        {/* Empty state */}
        {!data && !loading && (
          <div className="bg-white dark:bg-night-800 rounded-2xl p-6 text-center border border-cream-200 dark:border-white/5">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'en'
                ? 'Unable to load prayer times. Check your connection and tap Refresh.'
                : 'Impossible de charger les horaires. Vérifiez la connexion et touchez Actualiser.'}
            </p>
          </div>
        )}

        {/* Loading state (rare car le cache est presque toujours dispo) */}
        {loading && !data && (
          <div className="bg-white dark:bg-night-800 rounded-2xl p-6 text-center border border-cream-200 dark:border-white/5">
            <RefreshCw size={20} className="animate-spin mx-auto text-gold-500 mb-2" />
            <p className="text-sm text-gray-500">{lang === 'en' ? 'Loading…' : 'Chargement…'}</p>
          </div>
        )}

        {/* Note source */}
        <p className="text-[10px] text-center text-gray-400 leading-relaxed pt-2">
          {lang === 'en'
            ? 'Source: Aladhan API · Calculation method: UOIF (France)'
            : 'Source : API Aladhan · Méthode de calcul : UOIF (France)'}
        </p>
      </div>
    </div>
  )
}

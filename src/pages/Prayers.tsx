import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, RefreshCw, Calendar, ChevronDown, Search, X, Check, Sliders } from 'lucide-react'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import { useSettings } from '../hooks/useSettings'
import {
  PRESET_CITIES, DEFAULT_CITY, DEFAULT_METHOD, CALC_METHODS,
  searchCities, getMethodById,
  type CitySearchResult,
} from '../services/prayerTimesService'
import IslamicPattern from '../components/IslamicPattern'
import SeoHead from '../components/SeoHead'
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

type PanelState = 'closed' | 'city' | 'method'

export default function Prayers() {
  const navigate = useNavigate()
  const { settings, updateSettings } = useSettings()
  const lang = settings.language
  const city   = settings.prayerCity   ?? DEFAULT_CITY
  const method = settings.prayerMethod ?? DEFAULT_METHOD

  const { data, next, loading, error, refresh } = usePrayerTimes(city, method)

  const [panel, setPanel] = useState<PanelState>('closed')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CitySearchResult[]>([])
  const [searching, setSearching] = useState(false)

  const searchTimer = useRef<number | undefined>()

  // Recherche avec debounce 400 ms (Nominatim — courtoisie 1 req/sec)
  useEffect(() => {
    if (searchTimer.current) window.clearTimeout(searchTimer.current)
    if (query.trim().length < 2) {
      setResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    searchTimer.current = window.setTimeout(async () => {
      const r = await searchCities(query, lang)
      setResults(r)
      setSearching(false)
    }, 400)
    return () => { if (searchTimer.current) window.clearTimeout(searchTimer.current) }
  }, [query, lang])

  const setCity = (c: PrayerCity) => {
    updateSettings('prayerCity', c)
    setPanel('closed')
    setQuery('')
    setResults([])
  }

  const setMethod = (id: number) => {
    updateSettings('prayerMethod', id)
  }

  const remainingTxt = next
    ? next.remaining.hours > 0
      ? `${next.remaining.hours}h ${String(next.remaining.minutes).padStart(2, '0')}min`
      : `${next.remaining.minutes} min`
    : ''

  const todayLabel = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const currentMethod = getMethodById(method)

  return (
    <div className="h-dvh flex flex-col overflow-hidden" style={{ background: 'var(--t-body-bg, #FAF7EE)' }}>
      <SeoHead
        title="Horaires de prière | Adhkar Companion"
        description="Horaires de prière (Fajr, Dhuhr, ʿAsr, Maghrib, ʿIshāʾ) calculés selon les méthodes alignées Sunna (MWL 18°/17°). Recherche de ville mondiale, date hijri, prochaine prière."
        canonical="/prayers"
        keywords="horaires prière, salat, fajr, dhuhr, asr, maghrib, isha, sunna, MWL 18 degrés, mosquée, qibla"
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
            onClick={() => setPanel(panel === 'city' ? 'closed' : 'city')}
            className="inline-flex items-center gap-1.5 mt-1 text-sm font-semibold opacity-85 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--t-hero-text,#2C1A06)' }}
          >
            <MapPin size={14} />
            {city.name}, {city.country}
            <ChevronDown size={14} className={`transition-transform ${panel === 'city' ? 'rotate-180' : ''}`} />
          </button>
          <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--t-hero-text,#2C1A06)' }}>
            <span className="opacity-65">
              <Calendar size={11} className="inline -mt-0.5 mr-1" />
              {todayLabel}
            </span>
            {data?.hijri && (
              <span className="opacity-65">· {data.hijri.day} {data.hijri.monthEn} {data.hijri.year}H</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Body scrollable ────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-5 py-4 space-y-4 pb-24">

        {/* Panel : sélecteur de ville */}
        {panel === 'city' && (
          <div className="bg-white dark:bg-night-800 rounded-2xl shadow-soft border border-cream-200 dark:border-white/10 overflow-hidden">
            {/* Search bar */}
            <div className="p-3 border-b border-cream-100 dark:border-white/5">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search a city worldwide…' : 'Rechercher une ville (monde entier)…'}
                  className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl bg-cream-50 dark:bg-night-700 border border-cream-200 dark:border-white/10 text-gray-900 dark:text-cream-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-300"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => { setQuery(''); setResults([]) }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
                  >
                    <X size={14} className="text-gray-400" />
                  </button>
                )}
              </div>
              {searching && (
                <p className="text-[10px] text-gray-400 mt-1.5 ml-2">
                  {lang === 'en' ? 'Searching…' : 'Recherche…'}
                </p>
              )}
            </div>

            {/* Search results */}
            {query.trim().length >= 2 && (
              <div className="max-h-[280px] overflow-y-auto scrollbar-none">
                {results.length === 0 && !searching ? (
                  <p className="px-4 py-6 text-center text-xs text-gray-400">
                    {lang === 'en' ? 'No city found. Try another spelling.' : 'Aucune ville trouvée. Essaye une autre orthographe.'}
                  </p>
                ) : (
                  results.map((r, i) => (
                    <button
                      key={`${r.name}-${r.country}-${i}`}
                      onClick={() => setCity({ name: r.name, country: r.country, latitude: r.latitude, longitude: r.longitude })}
                      className="w-full text-left px-4 py-2.5 hover:bg-cream-50 dark:hover:bg-night-700 active:bg-cream-100 transition-colors border-t border-cream-100 dark:border-white/5 first:border-t-0"
                    >
                      <p className="text-sm font-bold text-gray-900 dark:text-cream-100">{r.name}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {r.region ? `${r.region}, ${r.country}` : r.country}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Preset cities (only when no search) */}
            {query.trim().length < 2 && (
              <>
                <p className="px-4 pt-3 text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
                  {lang === 'en' ? 'Quick picks' : 'Choix rapides'}
                </p>
                <div className="p-3 grid grid-cols-2 gap-1.5">
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
              </>
            )}
          </div>
        )}

        {/* Panel : sélecteur de méthode */}
        {panel === 'method' && (
          <div className="bg-white dark:bg-night-800 rounded-2xl shadow-soft border border-cream-200 dark:border-white/10 overflow-hidden">
            <div className="p-3 border-b border-cream-100 dark:border-white/5">
              <p className="text-sm font-bold text-gray-900 dark:text-cream-100">
                {lang === 'en' ? 'Calculation method' : 'Méthode de calcul'}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                {lang === 'en'
                  ? 'The method defines the angle of dawn (Fajr) and the rule for night (Isha). Sunnah-aligned methods use 18°+ for Fajr.'
                  : 'La méthode définit l\'angle de l\'aube (Fajr) et la règle pour la nuit (ʿIshāʾ). Les méthodes alignées Sunna utilisent 18°+ pour Fajr.'}
              </p>
            </div>
            <div className="max-h-[340px] overflow-y-auto scrollbar-none">
              {CALC_METHODS.map(m => {
                const isCurrent = m.id === method
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`w-full text-left px-4 py-3 transition-colors border-t border-cream-100 dark:border-white/5 first:border-t-0 ${
                      isCurrent ? 'bg-gold-50 dark:bg-gold-900/20' : 'hover:bg-cream-50 dark:hover:bg-night-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-gray-900 dark:text-cream-100">{m.shortName}</span>
                          {m.recommended && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300">
                              {lang === 'en' ? 'Recommended' : 'Recommandé'}
                            </span>
                          )}
                          {!m.sunnahAligned && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                              {lang === 'en' ? 'Lighter' : 'Allégé'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{m.name}</p>
                        <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1">
                          <span className="font-semibold">Fajr {m.fajrAngle}</span>
                          {' · '}
                          <span className="font-semibold">ʿIshāʾ {m.ishaRule}</span>
                          {' · '}
                          <span className="opacity-60">{m.region}</span>
                        </p>
                      </div>
                      {isCurrent && <Check size={18} className="text-gold-600 flex-shrink-0 mt-0.5" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Toolbar : ouvrir / fermer panels */}
        <div className="flex gap-2">
          <button
            onClick={() => setPanel(panel === 'city' ? 'closed' : 'city')}
            className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              panel === 'city'
                ? 'bg-gold-100 text-gold-800 dark:bg-gold-900/40 dark:text-gold-200'
                : 'bg-white text-gray-700 dark:bg-night-800 dark:text-gray-300 border border-cream-200 dark:border-white/5'
            }`}
          >
            <MapPin size={14} />
            {lang === 'en' ? 'Change city' : 'Changer de ville'}
          </button>
          <button
            onClick={() => setPanel(panel === 'method' ? 'closed' : 'method')}
            className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              panel === 'method'
                ? 'bg-gold-100 text-gold-800 dark:bg-gold-900/40 dark:text-gold-200'
                : 'bg-white text-gray-700 dark:bg-night-800 dark:text-gray-300 border border-cream-200 dark:border-white/5'
            }`}
          >
            <Sliders size={14} />
            {currentMethod?.shortName ?? 'Méthode'}
          </button>
        </div>

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

        {/* Erreur */}
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

        {loading && !data && (
          <div className="bg-white dark:bg-night-800 rounded-2xl p-6 text-center border border-cream-200 dark:border-white/5">
            <RefreshCw size={20} className="animate-spin mx-auto text-gold-500 mb-2" />
            <p className="text-sm text-gray-500">{lang === 'en' ? 'Loading…' : 'Chargement…'}</p>
          </div>
        )}

        {/* Note source + méthode active */}
        <p className="text-[10px] text-center text-gray-400 leading-relaxed pt-2">
          {lang === 'en' ? 'Source: Aladhan API · Method: ' : 'Source : API Aladhan · Méthode : '}
          <span className="font-semibold">{currentMethod?.shortName ?? `#${method}`}</span>
          {currentMethod?.sunnahAligned && (
            <span className="text-forest-600 dark:text-forest-400">
              {' · '}{lang === 'en' ? 'Sunnah-aligned' : 'aligné Sunna'}
            </span>
          )}
          <br />
          <span className="opacity-60">
            {lang === 'en' ? 'City search via Nominatim (OpenStreetMap)' : 'Recherche de ville via Nominatim (OpenStreetMap)'}
          </span>
        </p>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Moon, Star, RefreshCw, Calendar as CalIcon } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import IslamicPattern from '../components/IslamicPattern'
import SeoHead from '../components/SeoHead'

// ─── Types ──────────────────────────────────────────────────────────────────
interface HijriDay {
  gregorian: { day: string; month: { en: string; number: number }; year: string; weekday: { en: string } }
  hijri:     { day: string; month: { en: string; ar: string; number: number }; year: string; weekday: { en: string; ar: string } }
}

interface IslamicEvent {
  monthHijri: number          // 1-12
  day:        number          // 1-30
  name:       { fr: string; en: string }
  emoji:      string
  importance: 'major' | 'recommended' // major = Eid/Ramadan/Hajj, recommended = jeûnes/dates spéciales
}

// ─── Major Islamic events ───────────────────────────────────────────────────
const ISLAMIC_EVENTS: IslamicEvent[] = [
  { monthHijri: 1,  day: 1,  name: { fr: 'Ras as-Sana (Nouvel an hijri)',  en: 'Hijri New Year' },                   emoji: '🌙', importance: 'major' },
  { monthHijri: 1,  day: 10, name: { fr: 'ʿĀshūrāʾ (jeûne recommandé)',     en: 'Ashura (recommended fast)' },        emoji: '✨', importance: 'recommended' },
  { monthHijri: 3,  day: 12, name: { fr: 'Mawlid (avis variés)',            en: 'Mawlid (varying opinions)' },        emoji: '🌟', importance: 'recommended' },
  { monthHijri: 8,  day: 1,  name: { fr: 'Début Shaʿbān',                   en: 'Start of Shaban' },                  emoji: '🌙', importance: 'recommended' },
  { monthHijri: 9,  day: 1,  name: { fr: 'Début Ramadān',                   en: 'Start of Ramadan' },                 emoji: '🌙', importance: 'major' },
  { monthHijri: 9,  day: 27, name: { fr: 'Laylat al-Qadr (estimée)',        en: 'Laylat al-Qadr (estimated)' },       emoji: '⭐', importance: 'major' },
  { monthHijri: 10, day: 1,  name: { fr: 'ʿĪd al-Fiṭr',                     en: 'Eid al-Fitr' },                      emoji: '☪️', importance: 'major' },
  { monthHijri: 12, day: 1,  name: { fr: 'Début Dhū al-Ḥijjah (10 jours bénis)', en: 'Dhul-Hijjah begins (10 blessed days)' }, emoji: '🕋', importance: 'major' },
  { monthHijri: 12, day: 9,  name: { fr: 'Yawm ʿArafah (jeûne recommandé)', en: 'Day of Arafah (recommended fast)' }, emoji: '🤲', importance: 'major' },
  { monthHijri: 12, day: 10, name: { fr: 'ʿĪd al-Aḍḥā',                     en: 'Eid al-Adha' },                      emoji: '☪️', importance: 'major' },
]

const HIJRI_MONTHS_FR = [
  '', 'Muḥarram', 'Ṣafar', 'Rabīʿ al-Awwal', 'Rabīʿ al-Thānī',
  'Jumādā al-Ūlā', 'Jumādā al-Thāniyah', 'Rajab', 'Shaʿbān',
  'Ramaḍān', 'Shawwāl', 'Dhū al-Qaʿdah', 'Dhū al-Ḥijjah',
]
const HIJRI_MONTHS_AR = [
  '', 'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
]

// ─── Helpers ────────────────────────────────────────────────────────────────
function fmtGreg(d: Date, lang: 'fr' | 'en'): string {
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

async function gToH(date: Date): Promise<HijriDay | null> {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  const url = `https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const json = await res.json()
    return json.data as HijriDay
  } catch { return null }
}

async function hToG(hYear: number, hMonth: number, hDay: number): Promise<Date | null> {
  const dd = String(hDay).padStart(2, '0')
  const mm = String(hMonth).padStart(2, '0')
  const url = `https://api.aladhan.com/v1/hToG/${dd}-${mm}-${hYear}`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const json = await res.json()
    const greg = json.data?.gregorian
    if (!greg) return null
    return new Date(`${greg.year}-${String(greg.month.number).padStart(2,'0')}-${String(greg.day).padStart(2,'0')}T00:00:00`)
  } catch { return null }
}

// ─── Component ──────────────────────────────────────────────────────────────
interface UpcomingEvent extends IslamicEvent {
  gregorianDate: Date
  daysUntil:     number
  hijriYear:     number
}

export default function HijriCalendar() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const lang = settings.language

  const [today,    setToday]    = useState<HijriDay | null>(null)
  const [upcoming, setUpcoming] = useState<UpcomingEvent[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const t = await gToH(new Date())
      if (!t) throw new Error(lang === 'en' ? 'Failed to convert date' : 'Échec de la conversion de date')
      setToday(t)

      // Convertir tous les events des 2 prochaines années hijri en dates grégoriennes
      const currentHYear = parseInt(t.hijri.year, 10)
      const currentHMonth = t.hijri.month.number
      const currentHDay = parseInt(t.hijri.day, 10)
      const events: UpcomingEvent[] = []

      for (const evt of ISLAMIC_EVENTS) {
        // Détermine quelle année hijri vise l'event (cette année ou la suivante)
        const isUpcomingThisYear =
          evt.monthHijri > currentHMonth ||
          (evt.monthHijri === currentHMonth && evt.day >= currentHDay)
        const targetYear = isUpcomingThisYear ? currentHYear : currentHYear + 1

        const greg = await hToG(targetYear, evt.monthHijri, evt.day)
        if (!greg) continue
        const now = new Date(); now.setHours(0,0,0,0)
        const days = Math.round((greg.getTime() - now.getTime()) / 86400000)
        if (days < -3) continue   // skip events passés depuis plus de 3j
        events.push({ ...evt, gregorianDate: greg, daysUntil: days, hijriYear: targetYear })
      }

      events.sort((a, b) => a.daysUntil - b.daysUntil)
      setUpcoming(events)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() /* eslint-disable-next-line */ }, [])

  return (
    <div className="h-dvh flex flex-col overflow-hidden" style={{ background: 'var(--t-body-bg, #FAF7EE)' }}>
      <SeoHead
        title="Calendrier hijri | Adhkar Companion"
        description="Calendrier hijri (lunaire islamique) avec date du jour, événements à venir : Ramadan, Aïd al-Fitr, Aïd al-Adha, Ashura, Day of Arafah, Mawlid."
        canonical="/calendar"
        keywords="calendrier hijri, calendrier lunaire islamique, ramadan, eid, ashura, jour arafah, mawlid"
      />

      {/* Header */}
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
              onClick={load}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15"
              style={{ color: 'rgba(255,255,255,0.85)' }}
              disabled={loading}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span className="text-xs">{lang === 'en' ? 'Refresh' : 'Actualiser'}</span>
            </button>
          </div>

          <h1 className="text-2xl font-display font-bold leading-tight" style={{ color: 'var(--t-hero-text,#2C1A06)' }}>
            {lang === 'en' ? 'Hijri calendar' : 'Calendrier hijri'}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-5 py-5 space-y-4 pb-24">

        {/* Today big card */}
        {today && (
          <div className="rounded-2xl p-5 text-white shadow-medium" style={{ background: 'var(--t-primary-d, #5C4010)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                {lang === 'en' ? "Today's hijri date" : "Date hijri du jour"}
              </p>
              <Moon size={20} className="opacity-80" />
            </div>
            <p className="text-3xl font-display font-bold tabular-nums">
              {today.hijri.day} {HIJRI_MONTHS_FR[today.hijri.month.number]} {today.hijri.year}
            </p>
            <p className="font-arabic text-xl opacity-85 mt-1" dir="rtl">
              {today.hijri.day} {HIJRI_MONTHS_AR[today.hijri.month.number]} {today.hijri.year}هـ
            </p>
            <p className="text-xs opacity-65 mt-2">
              {fmtGreg(new Date(), lang)} ({today.gregorian.weekday.en})
            </p>
          </div>
        )}

        {/* Upcoming events */}
        {upcoming.length > 0 && (
          <div className="bg-white dark:bg-night-800 rounded-2xl shadow-soft border border-cream-200 dark:border-white/5 overflow-hidden">
            <div className="px-4 pt-3 pb-2 flex items-center gap-2">
              <Star size={14} className="text-gold-600 dark:text-gold-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
                {lang === 'en' ? 'Upcoming Islamic events' : 'Prochains événements islamiques'}
              </p>
            </div>
            {upcoming.map((evt, idx) => {
              const isMajor = evt.importance === 'major'
              const isToday = evt.daysUntil === 0
              const isPast  = evt.daysUntil < 0
              return (
                <div
                  key={`${evt.monthHijri}-${evt.day}-${evt.hijriYear}`}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    idx > 0 ? 'border-t border-cream-100 dark:border-white/5' : ''
                  } ${isToday ? 'bg-gold-50 dark:bg-gold-900/20' : ''}`}
                >
                  <span className="text-2xl flex-shrink-0">{evt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${isMajor ? 'text-gray-900 dark:text-cream-100' : 'text-gray-700 dark:text-gray-300'}`}>
                      {evt.name[lang]}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {evt.day} {HIJRI_MONTHS_FR[evt.monthHijri]} {evt.hijriYear}H · {fmtGreg(evt.gregorianDate, lang)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {isToday ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gold-200 text-gold-900 dark:bg-gold-700 dark:text-gold-100">
                        {lang === 'en' ? 'Today' : "Aujourd'hui"}
                      </span>
                    ) : isPast ? (
                      <span className="text-[10px] text-gray-400">
                        {lang === 'en' ? 'Past' : 'Passé'}
                      </span>
                    ) : (
                      <span className={`text-sm font-bold tabular-nums ${isMajor ? 'text-gold-700 dark:text-gold-300' : 'text-gray-600 dark:text-gray-400'}`}>
                        J-{evt.daysUntil}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Loading/error/empty */}
        {loading && !today && (
          <div className="bg-white dark:bg-night-800 rounded-2xl p-6 text-center border border-cream-200 dark:border-white/5">
            <RefreshCw size={20} className="animate-spin mx-auto text-gold-500 mb-2" />
            <p className="text-sm text-gray-500">{lang === 'en' ? 'Loading…' : 'Chargement…'}</p>
          </div>
        )}
        {error && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-2xl p-3">
            <p className="text-xs text-amber-700 dark:text-amber-300">{error}</p>
          </div>
        )}

        {/* Note */}
        <p className="text-[10px] text-center text-gray-400 leading-relaxed pt-1">
          <CalIcon size={11} className="inline -mt-0.5 mr-1" />
          {lang === 'en'
            ? 'Hijri dates are estimates based on astronomical calculations. Local moonsighting may vary by 1 day.'
            : 'Les dates hijri sont des estimations basées sur les calculs astronomiques. La vision locale du croissant peut varier d\'1 jour.'}
        </p>
      </div>
    </div>
  )
}

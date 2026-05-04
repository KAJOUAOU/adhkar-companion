import { useNavigate } from 'react-router-dom'
import { Flame, ChevronRight, Moon, Sun, Clock } from 'lucide-react'
import { getCurrentPeriod, getGreeting, getLast30Days, getHijriDate } from '../utils/timeUtils'
import { getAdhkarByPeriod } from '../data/adhkar'
import { loadSession } from '../services/storageService'
import { useStreak } from '../hooks/useStreak'
import CircularProgress from '../components/CircularProgress'
import IslamicPattern from '../components/IslamicPattern'
import { INSPIRATIONAL_QUOTES } from '../data/adhkar'

function getQuoteOfDay(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return INSPIRATIONAL_QUOTES[dayOfYear % INSPIRATIONAL_QUOTES.length]
}

function SessionStatusCard({
  period,
  label,
  emoji,
  color,
}: {
  period: 'morning' | 'evening'
  label: string
  emoji: string
  color: 'amber' | 'indigo'
}) {
  const navigate = useNavigate()
  const list     = getAdhkarByPeriod(period)
  const session  = loadSession(period)
  const done     = session.completed.length
  const total    = list.length
  const pct      = total > 0 ? done / total : 0
  const isAllDone = done >= total && total > 0

  const colors = {
    amber:  { bg: 'from-amber-50 to-amber-100/50',     ring: '#C9963A', text: 'text-amber-700',    badge: 'bg-amber-100 text-amber-700' },
    indigo: { bg: 'from-cream-100 to-cream-200/60',    ring: '#8B8070', text: 'text-stone-600',    badge: 'bg-cream-200 text-stone-600' },
  }
  const c = colors[color]

  return (
    <button
      onClick={() => navigate(`/session/${period}`)}
      className={`flex-1 bg-gradient-to-br ${c.bg} dark:from-night-800 dark:to-night-800 rounded-2xl p-4 flex flex-col gap-3 shadow-soft border border-white dark:border-white/10 text-left transition-transform active:scale-98`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-2xl">{emoji}</span>
          <p className={`text-xs font-bold mt-1 ${c.text} dark:text-gray-400`}>{label}</p>
        </div>
        <CircularProgress value={pct} size={52} strokeWidth={5} color={c.ring} bgColor="#E5E7EB">
          <span className="text-xs font-black tabular-nums">
            {Math.round(pct * 100)}%
          </span>
        </CircularProgress>
      </div>
      <div>
        {isAllDone ? (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.badge}`}>
            ✓ Terminé
          </span>
        ) : done === 0 ? (
          <span className="text-xs text-gray-400">Non commencé</span>
        ) : (
          <span className="text-xs text-gray-500">
            {done}/{total} invocations
          </span>
        )}
      </div>
    </button>
  )
}

export default function Dashboard() {
  const navigate      = useNavigate()
  const { streak }    = useStreak()
  const currentPeriod = getCurrentPeriod()
  const greeting      = getGreeting()
  const quote         = getQuoteOfDay()
  const hijriDate     = getHijriDate()

  const morningSession = loadSession('morning')
  const eveningSession = loadSession('evening')
  const morningList    = getAdhkarByPeriod('morning')
  const eveningList    = getAdhkarByPeriod('evening')
  const morningDone    = morningSession.completed.length >= morningList.length
  const eveningDone    = eveningSession.completed.length >= eveningList.length

  // Last 7 days for calendar preview
  const last7 = getLast30Days().slice(-7)

  return (
    <div className="min-h-screen pb-24 overflow-y-auto scrollbar-none touch-pan-y">

      {/* Hero header */}
      <div className="relative" style={{ background: 'var(--t-hero, linear-gradient(150deg,#6E5010,#8B6914))' }}>
        {/* Motif islamique — cloisonné */}
        <div className="absolute inset-0 overflow-hidden">
          <IslamicPattern className="text-white" opacity={0.10} />
        </div>

        <div className="relative z-10 px-5 pb-8" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 30px)' }}>
          <div className="flex items-center justify-between mb-1 mt-3">
            <p className="text-xs font-medium uppercase tracking-widest opacity-90" style={{ color: '#FFFFFF' }}>
              Adhkar Companion
            </p>
            {streak.currentStreak > 0 && (
              <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1 rounded-full">
                <Flame size={14} style={{ color: 'var(--t-hero-text,#2C1A06)' }} />
                <span className="text-xs font-bold opacity-80" style={{ color: 'var(--t-hero-text,#2C1A06)' }}>{streak.currentStreak} jour{streak.currentStreak > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-display font-bold leading-snug mt-3 mb-1" style={{ color: 'var(--t-hero-text,#2C1A06)' }}>
            {greeting}
          </h1>
          <div className="flex items-baseline justify-between">
            <p className="text-sm opacity-60" style={{ color: 'var(--t-hero-text,#2C1A06)' }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            {hijriDate && (
              <p className="text-xs opacity-50" style={{ color: 'var(--t-hero-text,#2C1A06)' }}>
                {hijriDate}
              </p>
            )}
          </div>
        </div>

        {/* Arc décoratif */}
        <svg viewBox="0 0 400 40" className="relative z-10 w-full -mb-px" preserveAspectRatio="none">
          <path d="M0,40 Q200,0 400,40 L400,40 L0,40 Z" fill="#FAF7F2" className="dark:fill-night-950" />
        </svg>

        {/* Logo DuoPédago — 256px, centré sur l'arc */}
        <img
          src="/logo-duopedago.png"
          alt="DuoPédago"
          className="absolute right-3 z-20 w-[100px] h-auto"
          style={{
            bottom: '-10px',
            filter: 'brightness(0) invert(1)',
            opacity: 0.72,
          }}
        />
        <img
          src="/logo-qurantime.png"
          alt="Quran Time Institut"
          className="absolute left-3 z-20 w-[100px] h-auto"
          style={{
            bottom: '0px',
            filter: 'brightness(0) invert(1)',
            opacity: 0.72,
          }}
        />
      </div>

      <div className="px-5 space-y-4 -mt-2">

        {/* Main CTA */}
        <button
          onClick={() => navigate(`/session/${currentPeriod}`)}
          className="w-full text-white rounded-2xl p-4 flex items-center justify-between shadow-medium active:scale-98 transition-transform"
          style={{ background: 'var(--t-primary-d, #5C4010)' }}
        >
          <div>
            <p className="text-white/70 text-xs uppercase tracking-wide mb-0.5">
              {currentPeriod === 'morning' ? '☀️ Adhkar du matin' : '🌙 Adhkar du soir'}
            </p>
            <p className="font-bold text-lg">
              {(currentPeriod === 'morning' ? morningDone : eveningDone)
                ? 'Reprendre la session'
                : 'Commencer mon moment de dhikr'}
            </p>
          </div>
          <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center">
            <ChevronRight size={24} />
          </div>
        </button>

        {/* Session status cards */}
        <div className="flex gap-3">
          <SessionStatusCard period="morning" label="Matin"  emoji="☀️" color="amber"  />
          <SessionStatusCard period="evening" label="Soir"   emoji="🌙" color="indigo" />
        </div>

        {/* 2 min mode */}
        <button
          onClick={() => navigate('/session/quick')}
          className="w-full glass dark:glass-dark rounded-2xl p-4 flex items-center gap-4 active:scale-98 transition-transform"
        >
          <div className="w-11 h-11 bg-gold-100 dark:bg-gold-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock size={22} className="text-gold-600" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm text-gray-900 dark:text-cream-100">Mode 2 minutes</p>
            <p className="text-xs text-gray-400">L'essentiel en un instant — pour les jours pressés</p>
          </div>
          <ChevronRight size={18} className="text-gray-300 ml-auto flex-shrink-0" />
        </button>

        {/* Streak visual */}
        {streak.currentStreak > 0 && (
          <div className="glass dark:glass-dark rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-gold-500" />
                <span className="font-bold text-sm text-gray-900 dark:text-cream-100">Constance spirituelle</span>
              </div>
              <span className="text-xs text-gray-400">{streak.currentStreak} jour{streak.currentStreak > 1 ? 's' : ''} consécutifs</span>
            </div>
            <div className="flex gap-1.5">
              {last7.map((day, i) => {
                const entry = streak.history.find(h => h.date === day)
                const isToday = i === 6
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full h-8 rounded-lg transition-colors ${
                      entry?.morningDone || entry?.eveningDone
                        ? 'bg-forest-600 dark:bg-forest-700'
                        : isToday
                          ? 'bg-cream-200 dark:bg-night-700 border-2 border-forest-300 dark:border-forest-600'
                          : 'bg-cream-200 dark:bg-night-700'
                    }`} />
                    <span className="text-[9px] text-gray-400">
                      {['L','M','M','J','V','S','D'][new Date(day).getDay()]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Inspirational quote */}
        <div className="glass-gold dark:glass-dark rounded-2xl p-5">
          <p className="text-xs font-bold text-forest-600 dark:text-forest-400 uppercase tracking-wide mb-2">
            Parole du jour
          </p>
          <p className="text-sm text-forest-900 dark:text-cream-200 leading-relaxed italic">
            {quote}
          </p>
        </div>

        {/* Sunnah de la nuit */}
        <button
          onClick={() => navigate('/sleep')}
          className="w-full bg-white dark:bg-night-800 rounded-2xl p-4 shadow-soft border border-cream-200 dark:border-white/5 flex items-center gap-4 text-left active:scale-98 transition-transform"
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
            style={{ background: 'linear-gradient(135deg, #1a1035, #2d1b5e)' }}>
            🌙
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900 dark:text-cream-100">Sunnah de la nuit</p>
            <p className="text-xs text-gray-400 mt-0.5">Avant de dormir — Al-Mulk, Ayat al-Kursi…</p>
          </div>
          <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
        </button>

        {/* Salât Ibrahimiya */}
        {(() => {
          const isFriday = new Date().getDay() === 5
          return (
            <button
              onClick={() => navigate('/dhikr/salat-ibrahimiya')}
              className="w-full bg-white dark:bg-night-800 rounded-2xl p-4 shadow-soft border border-cream-200 dark:border-white/5 flex items-center gap-4 text-left active:scale-98 transition-transform"
            >
              <div className="w-11 h-11 bg-forest-50 dark:bg-forest-900/20 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                🕌
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-gray-900 dark:text-cream-100">Salât Ibrahimiya</p>
                  {isFriday && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300">
                      Aujourd'hui
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 font-arabic">الصلاة الإبراهيمية — Chaque vendredi</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
            </button>
          )
        })()}

        {/* Quick access */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/need')}
            className="bg-white dark:bg-night-800 rounded-2xl p-4 shadow-soft border border-cream-200 dark:border-white/5 text-left active:scale-98 transition-transform"
          >
            <span className="text-2xl">🤲</span>
            <p className="font-bold text-sm text-gray-900 dark:text-cream-100 mt-2">Besoin du moment</p>
            <p className="text-xs text-gray-400 mt-0.5">Protection, pardon, apaisement…</p>
          </button>
          <button
            onClick={() => navigate('/browse')}
            className="bg-white dark:bg-night-800 rounded-2xl p-4 shadow-soft border border-cream-200 dark:border-white/5 text-left active:scale-98 transition-transform"
          >
            <span className="text-2xl">📖</span>
            <p className="font-bold text-sm text-gray-900 dark:text-cream-100 mt-2">Parcourir</p>
            <p className="text-xs text-gray-400 mt-0.5">Toutes les invocations</p>
          </button>
        </div>

        {/* Longest streak */}
        {streak.longestStreak > 0 && (
          <p className="text-center text-xs text-gray-400 pb-2">
            Record : <strong className="text-forest-600 dark:text-forest-400">{streak.longestStreak} jours</strong> consécutifs
          </p>
        )}
      </div>
    </div>
  )
}

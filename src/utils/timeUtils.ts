import type { Period, PrayerTimesData } from '../types'

/**
 * Lit les horaires de prière mis en cache aujourd'hui par usePrayerTimes
 * (clé localStorage `prayer_times_<date>_<lat>_<lng>_<method>`).
 * Renvoie null si rien de cohérent n'est trouvé pour aujourd'hui.
 */
function readCachedPrayerTimesForToday(): PrayerTimesData | null {
  try {
    const today = new Date()
    const dateKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (!k || !k.startsWith('prayer_times_')) continue
      if (!k.includes(dateKey)) continue
      const raw = localStorage.getItem(k)
      if (!raw) continue
      const data = JSON.parse(raw) as PrayerTimesData
      if (data?.timings?.fajr && data?.timings?.dhuhr) return data
    }
  } catch { /* noop */ }
  return null
}

/**
 * Détermine la période (matin/soir) :
 *   1. Si on a les horaires de prière du jour en cache → on utilise Fajr → Dhuhr
 *      comme fenêtre du matin (consensus large pour les adhkar al-sabah).
 *   2. Sinon, fallback sur les heures fixes (4h–13h = matin).
 */
export function getCurrentPeriod(): Period {
  const data = readCachedPrayerTimesForToday()
  if (data) {
    const now = new Date()
    const nowMin = now.getHours() * 60 + now.getMinutes()
    const [fH, fM] = data.timings.fajr.split(':').map(Number)
    const [dH, dM] = data.timings.dhuhr.split(':').map(Number)
    const fajr  = fH * 60 + fM
    const dhuhr = dH * 60 + dM
    return nowMin >= fajr && nowMin < dhuhr ? 'morning' : 'evening'
  }
  // Fallback : heures fixes
  const h = new Date().getHours()
  if (h >= 4 && h < 13) return 'morning'
  return 'evening'
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h >= 4 && h < 7)   return 'Bismillah, debout pour nourrir ton cœur ☀️'
  if (h >= 7 && h < 12)  return 'Un nouveau matin pour nourrir ton âme'
  if (h >= 12 && h < 14) return 'Que ton après-midi soit béni 🌿'
  if (h >= 14 && h < 18) return 'Prends un instant pour ton Seigneur'
  if (h >= 18 && h < 21) return 'Apaise ton âme avant la nuit 🌙'
  return 'Offre à ton cœur ses invocations du soir'
}

export function getPeriodLabel(period: Period): string {
  const labels = {
    morning: 'Matin',
    evening: 'Soir',
    both:    'Matin & Soir',
  }
  return labels[period]
}

export function getPeriodEmoji(period: Period): string {
  return period === 'morning' ? '☀️' : period === 'evening' ? '🌙' : '🌗'
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function isToday(dateStr: string): boolean {
  return dateStr === formatDate(new Date())
}

export function isYesterday(dateStr: string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return dateStr === formatDate(yesterday)
}

export function getDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return formatDate(d)
}

export function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) => getDaysAgo(29 - i))
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const EID_DATES: { type: 'fitr' | 'adha'; date: string }[] = [
  { type: 'fitr', date: '2025-03-30' },
  { type: 'adha', date: '2025-06-06' },
  { type: 'fitr', date: '2026-03-20' },
  { type: 'adha', date: '2026-05-27' },
  { type: 'fitr', date: '2027-03-09' },
  { type: 'adha', date: '2027-05-16' },
]

export function getEidStatus(): { type: 'fitr' | 'adha'; daysUntil: number } | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (const eid of EID_DATES) {
    const eidDate = new Date(eid.date)
    const diff = Math.round((eidDate.getTime() - today.getTime()) / 86400000)
    if (diff >= -1 && diff <= 5) return { type: eid.type, daysUntil: diff }
  }
  return null
}

export function getHijriDate(): string {
  try {
    return new Intl.DateTimeFormat('fr-FR-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date())
  } catch {
    return ''
  }
}
